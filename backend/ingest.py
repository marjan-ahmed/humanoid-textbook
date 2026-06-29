from __future__ import annotations

import os
import re
import uuid
from pathlib import Path
from typing import Iterable

from cohere import ClientV2
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels

ROOT_DIR = Path(__file__).resolve().parent.parent
DOCS_DIR = ROOT_DIR / "book_content" / "docs"
BACKEND_DIR = Path(__file__).resolve().parent
COLLECTION_NAME = os.getenv("QDRANT_COLLECTION", "humanoid-textbook-content")
EMBED_MODEL = os.getenv("COHERE_EMBED_MODEL", "embed-english-v3.0")
VECTOR_SIZE: int | None = None

load_dotenv(ROOT_DIR / ".env")
load_dotenv(BACKEND_DIR / ".env")


def load_clients() -> tuple[ClientV2, QdrantClient]:
    cohere_api_key = os.environ.get("COHERE_API_KEY")
    qdrant_url = os.environ.get("QDRANT_URL")
    qdrant_api_key = os.environ.get("QDRANT_API_KEY")

    if not cohere_api_key:
        raise RuntimeError("COHERE_API_KEY is required")
    if not qdrant_url:
        raise RuntimeError("QDRANT_URL is required")
    if not qdrant_api_key:
        raise RuntimeError("QDRANT_API_KEY is required")

    return ClientV2(api_key=cohere_api_key), QdrantClient(url=qdrant_url, api_key=qdrant_api_key)


def strip_frontmatter(text: str) -> str:
    if text.startswith("---"):
        match = re.match(r"(?s)^---\s*\n.*?\n---\s*\n?", text)
        if match:
            return text[match.end() :]
    return text


def normalize_whitespace(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def split_sections(text: str) -> list[tuple[str, str]]:
    cleaned = normalize_whitespace(strip_frontmatter(text))
    heading_matches = list(re.finditer(r"(?m)^##\s+(.+)$", cleaned))
    if not heading_matches:
        return [("Overview", cleaned)] if cleaned else []

    sections: list[tuple[str, str]] = []
    first_heading = heading_matches[0]
    intro = cleaned[: first_heading.start()].strip()
    if intro:
        sections.append(("Overview", intro))

    for index, match in enumerate(heading_matches):
        title = match.group(1).strip()
        start = match.start()
        end = heading_matches[index + 1].start() if index + 1 < len(heading_matches) else len(cleaned)
        section_text = cleaned[start:end].strip()
        sections.append((title, section_text))

    return sections


def iter_mdx_files() -> Iterable[Path]:
    return sorted(DOCS_DIR.rglob("*.mdx"))


def build_chunk_payload(path: Path, section_index: int, section_title: str, chunk_text: str) -> dict[str, str]:
    relative_path = path.relative_to(DOCS_DIR).with_suffix("")
    chapter = relative_path.as_posix()
    module = relative_path.parts[0] if len(relative_path.parts) > 1 else relative_path.stem
    return {
        "chapter": chapter,
        "section": section_title,
        "module": module,
        "section_index": str(section_index),
        "source_path": relative_path.with_suffix(".mdx").as_posix(),
        "content": chunk_text,
    }


def ensure_collection(client: QdrantClient, vector_size: int) -> None:
    existing = None
    try:
        existing = client.get_collection(COLLECTION_NAME)
    except Exception:
        existing = None

    vectors = getattr(getattr(getattr(existing, "config", None), "params", None), "vectors", None) if existing else None
    current_size = getattr(vectors, "size", None)
    point_count = getattr(existing, "points_count", 0) if existing else 0

    if current_size == vector_size:
        return

    if existing and point_count > 0:
        raise RuntimeError(
            f"Qdrant collection {COLLECTION_NAME!r} exists with vector size {current_size} and {point_count} points. "
            f"Delete or recreate it with size {vector_size} to continue."
        )

    client.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=qmodels.VectorParams(size=vector_size, distance=qmodels.Distance.COSINE),
    )


def embed_texts(client: ClientV2, texts: list[str], input_type: str) -> list[list[float]]:
    if not texts:
        return []
    response = client.embed(
        model=EMBED_MODEL,
        texts=texts,
        input_type=input_type,
        embedding_types=["float"],
    )
    return response.embeddings.float


def ingest() -> dict[str, int]:
    cohere_client, qdrant_client = load_clients()

    total_files = 0
    total_chunks = 0
    upserts = 0
    points: list[qmodels.PointStruct] = []
    collection_size: int | None = None

    for mdx_path in iter_mdx_files():
        total_files += 1
        raw_text = mdx_path.read_text(encoding="utf-8")
        sections = split_sections(raw_text)
        if not sections:
            continue

        section_texts = [text for _, text in sections]
        embeddings = embed_texts(cohere_client, section_texts, input_type="search_document")
        if collection_size is None and embeddings:
            collection_size = len(embeddings[0])
            ensure_collection(qdrant_client, collection_size)

        for section_index, ((section_title, section_text), embedding) in enumerate(zip(sections, embeddings, strict=True), start=1):
            payload = build_chunk_payload(mdx_path, section_index, section_title, section_text)
            point_id = str(uuid.uuid5(uuid.NAMESPACE_URL, f"{payload['source_path']}::{section_index}"))
            points.append(qmodels.PointStruct(id=point_id, vector=embedding, payload=payload))
            total_chunks += 1

    if collection_size is None:
        raise RuntimeError("No embeddings were produced from the MDX corpus")

    if points:
        qdrant_client.upsert(collection_name=COLLECTION_NAME, points=points)
        upserts = len(points)

    return {"files": total_files, "chunks": total_chunks, "upserts": upserts}


def main() -> int:
    result = ingest()
    print(
        f"Ingested {result['files']} files, created {result['chunks']} chunks, upserted {result['upserts']} points into {COLLECTION_NAME}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

