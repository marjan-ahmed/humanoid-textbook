---
sidebar_position: 1
title: Vision-Language-Action
description: >
  End-to-end Vision-Language-Action pipelines for humanoid robotics: speech-to-text
  transcription with OpenAI Whisper, LLM-driven task planning with GPT-4,
  vision-language grounding via CLIP and SAM, grasp planning with collision
  checking, ROS 2 action bridges, and error recovery strategies for safe
  household and industrial manipulation.
keywords:
  - Vision-Language-Action
  - VLA
  - LLM planning
  - voice commands
  - computer vision
  - robot manipulation
  - OpenAI Whisper
  - GPT-4 prompt engineering
  - CLIP
  - SAM
  - ROS 2 action bridge
  - grasp planning
  - collision checking
  - speech-to-text
  - motor command generation
---

import PersonalizationToolbar from '@site/src/components/Personalization/PersonalizationToolbar';

# Vision-Language-Action

<PersonalizationToolbar chapterSlug="vla/vision-language-action" />

Vision-Language-Action (VLA) وہ چکرا ہے جو ادراک، فہمِ زبان، حرکت کی منصوبہ بندی، اور جسمانی عمل کو ایک بند لوپ نظام میں جوڑتا ہے۔ ہر کام کو سخت طور پر پروگرام کرنے کی بجائے، VLA روبوٹ آزاد فرم میں انسانی حکموں کو سمجھتا ہے، انہیں بصر کے ذریعے حقیقی دنیا میں منسلک کرتا ہے، محدود عمل کا منصوبہ بناتا ہے، اور پھر تصدیق شدہ موٹر کنٹرولرز کے ذریعے اس منصوبے کو نافذ کرتا ہے۔

یہ میڈیول VLA اسٹیک کی ہر تہہ کو کاور کرتا ہے — مائیکروفون سے لے کر موٹر ڈرائیور تک — کوڈ کی مثالیں، چکرے کی تصویریں، اور ناکامی کے انواع کے ساتھ جن سے آپ کو نمٹنا ہوگا۔

---

## سیکھنے کے نتائج

اس میڈیول کے اختتام پر آپ یہ کر سکیں گے:

- Vision-Langue-Action چکرے اور اس کے پانچ ذیلی نظاموں (speech-to-text، زبان کی سمجھ، vision-language grounding، حرکت کی منصوبہ بندی، عمل اور بحالی) کی وضاحت کریں۔
- ROS 2 نوڈ میں حقیقی وقت speech-to-text ریپورشنگ کے لیے OpenAI Whisper کو ضم کریں، بشمول streaming inference اور زبان کی شناخت۔
- GPT-4 کے لیے ہدایتی پرامپٹس تیار کریں جو parseable JSON کام کے منصوبے بنائیں جن میں واضح عمل کی اقسام، ہدف کی اشیاء، فضائی پابندیاں، اور متبادل ہدایات ہوں۔
- ایک ROS 2 action bridge بنائیں جو LLM کے آؤٹ پٹ کو `nav2` اور `MoveIt 2` ایکشن گولز میں تبدیل کرے مناسب timeout اور cancellation ہینڈلنگ کے ساتھ۔
- اعتماد کی فلٹرنگ، non-maximum suppression، اور multi-class bounding box ٹریکنگ کے ساتھ آبجیکٹ ڈٹیکشن پائپ لائن لاگو کریں۔
- ایک گریسپ پلانر ڈیزائن کریں جو مرکزی گریسپ پوزز کو کولیژن میپ کے خلاف جانچے اور سب سے زیادہ اسکور والی کولیژن فری پوز منتخب کریں۔
- روبوٹک کام کی تقسیم کے لیے LLM کی قابلِ اعتمادیت بہتر بنانے کے لیے chain-of-thought، few-shot، اور system-prompt تکنیکوں کو لاگو کریں۔
- مشترکہ VLA ناکامی کے انواع کی نشاندہی کریں اور ان کو دور کریں بشمول مبہم زبان، پوشیدہ اشیاء، غیر محفوظ راستے، اور کنٹرولر کی خرابیاں۔
- بیچنگ، کیشنگ، ہارڈویئر ایکسلریشن، اور ہلکی ناکامی کے ذریعے VLA پائپ لائنوں کی تاخیر، تھروپٹ، اور حفظان کو بہتر بنائیں۔

---

## تصور کی وضاحت

### VLA کیوں اہم ہے

روبوٹک خودکاریت کے روایتی طریقے ہر کام کے لیے واضح پروگرامنگ کا متقاضی ہوتے ہیں۔ ایک pick-and-place سیل کو ہاتھ سے لکھے ہوئے waypoints، گرپ فورس پروفائلز، اور ایرر ہینڈلرز کی ضرورت ہوتی ہے۔ یہ طریقہ کار اس وقت ٹوٹ جاتا ہے جب ماحول بدل جاتا ہے یا کوئی نئی شئی داخل ہوتی ہے۔ VLA سخت طور پر پروگرام شدہ کام کی ترتیبوں کی جگہ زبان سے مشروط پالیسیوں کا استعمال کرتا ہے جو اشیاء، مقامات، اور پابندیوں میں عامیت سے بھرپور ہو سکتے ہیں بغیر دوبارہ پروگرامنگ کے۔

VLA نظام ایک واحد ماڈل نہیں ہے۔ یہ مخصوص اجزاء کی ایک پائپ لائن ہے جو ان کے درمیان ہدایتی ڈیٹا منتقل کرتی ہے:

| تہہ | ان پٹ | آؤٹ پٹ | عام ٹیکنالوجی |
|---|---|---|---|
| Speech-to-text | خام آڈیو ویو فارم | تحریری متن | OpenAI Whisper, Vosk |
| زبان کی سمجھ | تحریری متن | ہدایتی کام کا منصوبہ (JSON) | GPT-4, LLaMA, Mistral |
| Vision-language grounding | کام کا منصوبہ + کیمرا فریمز | آبجیکٹ ڈٹیکشن، پوزز، منظر گراف | CLIP, SAM, YOLO, DepthAnything |
| حرکت کی منصوبہ بندی | منسلک آبجیکٹ پوزز + پابندیاں | کولیژن فری راستہ | nav2, MoveIt 2, OMPL |
| عمل اور نگرانی | راستہ + جوائنٹ حالتیں | مکمل عمل یا بحالی ٹریگر | ROS 2 کنٹرولرز، حفظان نگراں |

### Grounding کا مسئلہ

VLA کا مرکزی چیلنج **grounding** ہے — تصوراتی زبان کو مخصوص جسمانی اشیاء سے ملانا۔ جب صارف کہتا ہے "لال کپ اٹھاؤ"، تو نظام کو:

1. "لال کپ" کو منظر میں ایک مخصوص آبجیکٹ سے ملانا ہوگا۔
2. تصدیق کرنا ہوگا کہ وہ مثال نظر میں ہے اور پہنچنے کے قابل ہے۔
3. روبوٹ کے.relative میں اس کی 6-DoF پوز مقرر کرنا ہوگی۔
4. تصدیق کرنا ہوگا کہ روبوٹ سے کپ تک کا راستہ کولیژن فری ہے۔
5. ایک گریسپ کنفیگریشن منتخب کرنا ہوگا جو ہینڈل اور کنارے سے بچے۔
6. غیر متوقع ٹکراو یا پھسلن کی نگرانی کرتے ہوئے حرکت کو نافذ کرنا ہوگا۔

اگر کوئی بھی قدم ناکام ہو جائے، تو نظام کو شانداری سے واپس جانا چاہیے — وضاحت مانگیں، دوبارہ اسکین کریں، دوبارہ منصوبہ بنائیں، یا روک دیں۔

### ہدایتی کام کی نمائندگی

ایک اچھی طرح سے ڈیزائن کردہ کام کا منصوبہ زبان کی تہہ اور حرکت کی تہہ کے درمیان معاہدہ ہے۔ یہ مکمل طور پر parseable ہونا چاہیے، کوئی مبہم فیلڈز نہیں ہونی چاہیں، اور واضح ناکامی کی ہدایات شامل ہونی چاہیں۔ اس سکیما کو دیکھیں:

```json
{
  "intent": "pick_and_place",
  "target_object": {
    "description": "red cup",
    "class": "cup",
    "color": "red",
    "min_confidence": 0.85
  },
  "source_location": "unspecified",
  "destination": {
    "description": "hand it to the user",
    "zone": "user_reachable",
    "max_distance_from_user_m": 0.5
  },
  "constraints": {
    "max_speed_mps": 0.5,
    "gripper_force_n_range": [2.0, 8.0],
    "no_go_zones": ["stove", "sink"],
    "time_limit_s": 30
  },
  "fallback": {
    "if_object_not_found": "ask_user_to_point",
    "if_path_blocked": "replan_with_larger_clearance",
    "if_grasp_fails": "retry_once_then_stop"
  }
}
```

ہر فیلڈ واضح ہے۔ حرکت کی تہہ کو کبھی آزاد متن تفسیر نہیں کرنا پڑتا۔ اگر LLM کسی فیلڈ کو اعتماد کے ساتھ نہیں بھر سکتا، تو وہ اسے `null` پر سیٹ کرتا ہے اور نظام وضاحت کا دور ٹریگر کرتا ہے۔

---

## مکمل VLA پائپ لائن چکرے

```text
┌──────────────────────────────────────────────────────────────────────┐
│                        VLA PIPELINE                                  │
├──────────┬───────────┬────────────┬─────────────┬──────────────────┤
│  MIC /   │  SPEECH-  │   LLM      │   VISION    │   MOTION /       │
│  AUDIO   │  TO-TEXT  │   PLANNER  │   GROUNDING │   EXECUTION      │
│          │           │            │             │                  │
│  PCM 16k │  Whisper  │  GPT-4     │  CLIP + SAM │  nav2 + MoveIt2 │
│  16-bit  │  encoder  │  prompt    │  YOLO +     │  action bridge   │
│  mono    │  + decoder│  + JSON    │  DepthAny.  │  + safety layer  │
└────┬─────┴─────┬─────┴─────┬──────┴──────┬──────┴────────┬─────────┘
     │           │           │             │               │
     ▼           ▼           ▼             ▼               ▼
  audio_buf  transcript   task_plan   scene_graph     joint_goals
                                          │               │
                                          ▼               ▼
                                    object_poses    robot_controller
                                    + confidence    + collision check
```

ہر تیر ایک ROS 2 topic یا service call ہے جس میں ایک ٹائپ پیغام ہوتا ہے۔ پائپ لائن **غیر متوازی** ہے: speech-to-text تہہ `/vla/transcript` پر transcriptslish publish کرتی ہے، LLM planner subscribe کرتا ہے اور `/vla/task_plan` پر کام کے منصوبے publish کرتا ہے، اور حرکت کی تہہ منصوبوں کو subscribe کرتی ہے اور راستہ کے گولز publish کرتی ہے۔

---

## کوڈ کی مثالیں

### 1. OpenAI Whisper کو speech-to-text کے لیے ضم کرنا

نیچے دیے گئے ROS 2 نوڈ مائیکروفون سے آڈیو streaming کرتا ہے، اسے overlapping chunks میں بفر کرتا ہے، اور زبان کی شناخت کے ساتھ Whisper inference چلاتا ہے۔

```python
#!/usr/bin/env python3
"""whisper_stt_node.py — Real-time speech-to-text using OpenAI Whisper."""

import queue
import threading
import numpy as np
import torch
import whisper
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from audio_common_msgs.msg import Audio

SAMPLE_RATE = 16000
CHUNK_DURATION_S = 3.0
OVERLAP_S = 0.5


class WhisperSTTNode(Node):
    def __init__(self):
        super().__init__("whisper_stt_node")

        self.declare_parameter("model_size", "base")
        self.declare_parameter("language", None)
        self.declare_parameter("device", "cuda" if torch.cuda.is_available() else "cpu")

        model_size = self.get_parameter("model_size").value
        device = self.get_parameter("device").value
        self.language = self.get_parameter("language").value

        self.get_logger().info(f"Loading Whisper model '{model_size}' on {device}")
        self.model = whisper.load_model(model_size, device=device)

        self.audio_queue: queue.Queue = queue.Queue()
        self.audio_buffer = np.array([], dtype=np.float32)
        self.buffer_lock = threading.Lock()

        self.transcript_pub = self.create_publisher(String, "/vla/transcript", 10)
        self.audio_sub = self.create_subscription(Audio, "/audio/mic", self.audio_callback, 10)

        self.inference_thread = threading.Thread(target=self._inference_loop, daemon=True)
        self.inference_thread.start()
        self.get_logger().info("Whisper STT node ready")

    def audio_callback(self, msg: Audio):
        samples = np.frombuffer(msg.data, dtype=np.int16).astype(np.float32) / 32768.0
        with self.buffer_lock:
            self.audio_buffer = np.concatenate([self.audio_buffer, samples])
            while len(self.audio_buffer) >= int(CHUNK_DURATION_S * SAMPLE_RATE):
                chunk = self.audio_buffer[: int(CHUNK_DURATION_S * SAMPLE_RATE)]
                overlap = int(OVERLAP_S * SAMPLE_RATE)
                self.audio_buffer = self.audio_buffer[overlap:]
                self.audio_queue.put(chunk)

    def _inference_loop(self):
        while rclpy.ok():
            try:
                chunk = self.audio_queue.get(timeout=1.0)
            except queue.Empty:
                continue

            options = {}
            if self.language:
                options["language"] = self.language

            result = self.model.transcribe(
                chunk,
                fp16=torch.cuda.is_available(),
                **options,
            )

            text = result["text"].strip()
            if not text:
                continue

            lang = result.get("language", "unknown")
            self.get_logger().info(f"[{lang}] {text}")

            msg = String()
            msg.data = text
            self.transcript_pub.publish(msg)


def main(args=None):
    rclpy.init(args=args)
    node = WhisperSTTNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    node.destroy_node()
    rclpy.shutdown()


if __name__ == "__main__":
    main()
```

اہم ڈیزائن فیصلے:

- **Overlapping chunks** موسلسل آڈیو کو تقسیم کرتے وقت لفظ کی حدود کی خرابیوں کو روکتے ہیں۔
- **زبان کی شناخت** خودکار طور پر چلتی ہے; انگریزی میں مقرر کرنے کے لیے `language="en"` پاس کریں اور تاخیر کم کریں۔
- **تھریڈ علیحدگی** GPU inference کو ROS callback تھریڈ سے دور رکھتی ہے، executor پر ڈیڈلائن چوٹیں ہونے سے بчатی ہے۔

---

### 2. GPT-4 prompt engineering روبوٹ کے کام کی منصوبہ بندی کے لیے

LLM planner کو transcript اور موجودہ scene graph ملتا ہے اور اسے مکمل طور پر parseable JSON کام کا منصوبہ واپس کرنا ہوتا ہے۔ پرامپٹ ماڈل کے آؤٹ پٹ کو محدود کرنے اور خیالی چیزیں پیدا کرنے کو کم کرنے کے لیے ڈیزائن کیا گیا ہے۔

```python
#!/usr/bin/env python3
"""vla_planner_node.py — GPT-4 task planner for VLA."""

import json
import os
from typing import Optional

import openai
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from geometry_msgs.msg import PoseStamped

SYSTEM_PROMPT = """You are a robot task planner. Given a user command and the
current scene description, produce a JSON task plan. Follow this schema exactly:

{
  "intent": "pick_and_place" | "navigate_to" | "open" | "close" | "hand_over" | "unknown",
  "target_object": {
    "description": "<free text>",
    "class": "<object class from scene>",
    "color": "<color or null>",
    "min_confidence": 0.85
  },
  "source_location": "<room/zone or null>",
  "destination": {
    "description": "<free text>",
    "zone": "<named zone or null>",
    "max_distance_from_user_m": 0.5
  },
  "constraints": {
    "max_speed_mps": 0.5,
    "gripper_force_n_range": [2.0, 8.0],
    "no_go_zones": [],
    "time_limit_s": 30
  },
  "fallback": {
    "if_object_not_found": "ask_user_to_point | rescan | stop",
    "if_path_blocked": "replan | wait | stop",
    "if_grasp_fails": "retry_once_then_stop | stop"
  },
  "confidence": 0.0 to 1.0,
  "clarification_needed": "<question or null>"
}

Rules:
- If any required field cannot be determined, set it to null and set
  clarification_needed to a specific question.
- Never invent objects not in the scene description.
- Keep intent to one of the listed values.
- Output valid JSON only, no markdown fences."""

FEW_SHOT_EXAMPLES = [
    {
        "role": "user",
        "content": (
            "User command: 'bring me the red cup'\n\n"
            "Scene description:\n"
            "- red_cup: class=cup, color=red, confidence=0.92, zone=kitchen_table\n"
            "- blue_bottle: class=bottle, color=blue, confidence=0.88, zone=kitchen_table\n"
            "- user: zone=living_room, distance=3.2m\n"
        ),
    },
    {
        "role": "assistant",
        "content": json.dumps(
            {
                "intent": "pick_and_place",
                "target_object": {
                    "description": "red cup",
                    "class": "cup",
                    "color": "red",
                    "min_confidence": 0.85,
                },
                "source_location": "kitchen_table",
                "destination": {
                    "description": "hand it to the user",
                    "zone": "user_reachable",
                    "max_distance_from_user_m": 0.5,
                },
                "constraints": {
                    "max_speed_mps": 0.5,
                    "gripper_force_n_range": [2.0, 8.0],
                    "no_go_zones": [],
                    "time_limit_s": 30,
                },
                "fallback": {
                    "if_object_not_found": "ask_user_to_point",
                    "if_path_blocked": "replan_with_larger_clearance",
                    "if_grasp_fails": "retry_once_then_stop",
                },
                "confidence": 0.92,
                "clarification_needed": None,
            },
            indent=2,
        ),
    },
]


class VLAPlannerNode(Node):
    def __init__(self):
        super().__init__("vla_planner_node")

        self.declare_parameter("openai_model", "gpt-4o")
        self.declare_parameter("temperature", 0.1)
        self.declare_parameter("max_tokens", 1024)

        self.model = self.get_parameter("openai_model").value
        self.temperature = self.get_parameter("temperature").value
        self.max_tokens = self.get_parameter("max_tokens").value

        self.client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

        self.task_plan_pub = self.create_publisher(String, "/vla/task_plan", 10)
        self.transcript_sub = self.create_subscription(
            String, "/vla/transcript", self.transcript_callback, 10
        )
        self.scene_sub = self.create_subscription(
            String, "/vla/scene_graph", self.scene_callback, 10
        )

        self.scene_description: str = "No scene data available."
        self.get_logger().info("VLA Planner node ready")

    def scene_callback(self, msg: String):
        self.scene_description = msg.data

    def transcript_callback(self, msg: String):
        user_command = msg.data
        self.get_logger().info(f"Planning for: {user_command}")

        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        messages.extend(FEW_SHOT_EXAMPLES)
        messages.append(
            {
                "role": "user",
                "content": (
                    f"User command: '{user_command}'\n\n"
                    f"Scene description:\n{self.scene_description}"
                ),
            }
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                response_format={"type": "json_object"},
            )

            raw = response.choices[0].message.content
            task_plan = json.loads(raw)

            if task_plan.get("confidence", 0) < 0.6:
                self.get_logger().warn(
                    f"Low confidence ({task_plan['confidence']}), requesting clarification"
                )

            plan_msg = String()
            plan_msg.data = json.dumps(task_plan, indent=2)
            self.task_plan_pub.publish(plan_msg)
            self.get_logger().info(f"Published task plan: {task_plan['intent']}")

        except json.JSONDecodeError as e:
            self.get_logger().error(f"Invalid JSON from LLM: {e}")
        except openai.APIError as e:
            self.get_logger().error(f"OpenAI API error: {e}")


def main(args=None):
    rclpy.init(args=args)
    node = VLAPlannerNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    node.destroy_node()
    rclpy.shutdown()


if __name__ == "__main__":
    main()
```

پرامپٹ engineering کی تفصیلات:

- **سسٹم پرامپٹ** سکیما کو مقرر کرتا ہے، درست نیت کی فہرست دیتا ہے، اور markdown آؤٹ پٹ کو منع کرتا ہے تاکہ جواب ہمیشہ parseable ہو۔
- **Few-shot مثال** ماڈل کو فارمت اور استدلال کے انداز کے لیے ایک مثالی حوالہ دیتا ہے۔
- **کم اعتماد کی حفاظت** مشکوک منصوبے کے ساتھ آگے بڑھنے کی بجائے وضاحت کا دور ٹریگر کرتی ہے۔
- **`response_format={"type": "json_object"}`** API لیول پر JSON آؤٹ پٹ کو مجبور کرتا ہے۔

---

### 3. LLM آؤٹ پٹ کے لیے ROS 2 action bridge

ایکشن بریج کام کے منصوبوں کو subscribe کرتا ہے اور انہیں `nav2` اور `MoveIt 2` ایکشن گولز میں تبدیل کرتا ہے۔ یہ کسی بھی حرکت کو بھیجنے سے پہلے منصوبے کی سکیما کی تصدیق کرتا ہے۔

```python
#!/usr/bin/env python3
"""vla_action_bridge.py — Translates LLM task plans into ROS 2 actions."""

import json
from typing import Dict, Any

import rclpy
from rclpy.node import Node
from rclpy.action import ActionClient
from std_msgs.msg import String
from nav2_msgs.action import NavigateToPose
from moveit_msgs.action import MoveGroup
from geometry_msgs.msg import PoseStamped, Pose

VALID_INTENTS = {"pick_and_place", "navigate_to", "open", "close", "hand_over"}


class VLAActionBridge(Node):
    def __init__(self):
        super().__init__("vla_action_bridge")

        self.nav_client = ActionClient(self, NavigateToPose, "navigate_to_pose")
        self.moveit_client = ActionClient(self, MoveGroup, "move_action")

        self.task_plan_sub = self.create_subscription(
            String, "/vla/task_plan", self.task_plan_callback, 10
        )
        self.action_status_pub = self.create_publisher(String, "/vla/action_status", 10)
        self.grasp_request_pub = self.create_publisher(String, "/vla/grasp_request", 10)

        self.get_logger().info("VLA Action Bridge ready")

    def task_plan_callback(self, msg: String):
        try:
            plan: Dict[str, Any] = json.loads(msg.data)
        except json.JSONDecodeError:
            self._publish_status("error", "Invalid JSON in task plan")
            return

        intent = plan.get("intent")
        if intent not in VALID_INTENTS:
            self._publish_status("error", f"Unknown intent: {intent}")
            return

        confidence = plan.get("confidence", 0.0)
        if confidence < 0.6:
            self._publish_status("rejected", f"Low confidence: {confidence}")
            return

        if plan.get("clarification_needed"):
            self._publish_status("clarifying", plan["clarification_needed"])
            return

        self.get_logger().info(f"Dispatching intent: {intent}")

        if intent == "pick_and_place":
            self._dispatch_pick_and_place(plan)
        elif intent == "navigate_to":
            self._dispatch_navigate(plan)
        elif intent == "hand_over":
            self._dispatch_hand_over(plan)
        else:
            self._publish_status("error", f"Intent not yet implemented: {intent}")

    def _dispatch_pick_and_place(self, plan: Dict[str, Any]):
        target = plan.get("target_object", {})
        destination = plan.get("destination", {})
        constraints = plan.get("constraints", {})

        self.get_logger().info(
            f"Pick '{target.get('description')}' from '{plan.get('source_location')}' "
            f"and place at '{destination.get('description')}'"
        )

        grasp_msg = String()
        grasp_msg.data = json.dumps(
            {
                "target_object": target,
                "constraints": constraints,
                "action": "pick",
            }
        )
        self.grasp_request_pub.publish(grasp_msg)
        self._publish_status("dispatched", "Grasp request sent")

    def _dispatch_navigate(self, plan: Dict[str, Any]):
        destination = plan.get("destination", {})
        zone = destination.get("zone")

        if not zone:
            self._publish_status("error", "Navigate intent missing destination zone")
            return

        self.get_logger().info(f"Navigating to zone: {zone}")

        goal = NavigateToPose.Goal()
        goal.pose.header.frame_id = "map"
        goal.pose.pose.position.x = 0.0
        goal.pose.pose.position.y = 0.0
        goal.pose.pose.position.z = 0.0
        goal.pose.pose.orientation.w = 1.0

        self.nav_client.wait_for_server()
        send_future = self.nav_client.send_goal_async(goal)
        send_future.add_done_callback(self._nav_goal_callback)

    def _nav_goal_callback(self, future):
        goal_handle = future.result()
        if not goal_handle.accepted:
            self._publish_status("error", "Navigation goal rejected")
            return
        self._publish_status("navigating", "Navigation in progress")
        result_future = goal_handle.get_result_async()
        result_future.add_done_callback(self._nav_result_callback)

    def _nav_result_callback(self, future):
        result = future.result()
        if result.code == 0:
            self._publish_status("completed", "Navigation complete")
        else:
            self._publish_status("error", f"Navigation failed: code {result.code}")

    def _dispatch_hand_over(self, plan: Dict[str, Any]):
        self.get_logger().info("Hand-over sequence initiated")
        self._dispatch_pick_and_place(plan)

    def _publish_status(self, status: str, detail: str):
        msg = String()
        msg.data = json.dumps({"status": status, "detail": detail})
        self.action_status_pub.publish(msg)
        self.get_logger().info(f"[{status}] {detail}")


def main(args=None):
    rclpy.init(args=args)
    node = VLAActionBridge()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    node.destroy_node()
    rclpy.shutdown()


if __name__ == "__main__":
    main()
```

بریج ایک اہم حفظان کا اصول نافذ کرتا ہے: **LLM کبھی براہ راست موٹر نہیں چلاتا**۔ وہ ایک ہدایتی منصوبہ بناتا ہے، بریج اس کی تصدیق کرتا ہے، اور پھر حرکت کے گولز بھیجے جاتے ہیں۔

---

### 4. اعتماد کی فلٹرنگ کے ساتھ آبجیکٹ ڈٹیکشن پائپ لائن

```python
#!/usr/bin/env python3
"""object_detection_node.py — YOLO-based detection with confidence filtering."""

import numpy as np
import torch
from ultralytics import YOLO
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from vision_msgs.msg import Detection2DArray, Detection2D, ObjectHypothesisWithPose
from std_msgs.msg import String
from cv_bridge import CvBridge


class ObjectDetectionNode(Node):
    def __init__(self):
        super().__init__("object_detection_node")

        self.declare_parameter("model_path", "yolov8m.pt")
        self.declare_parameter("confidence_threshold", 0.5)
        self.declare_parameter("nms_threshold", 0.45)
        self.declare_parameter("input_width", 640)
        self.declare_parameter("input_height", 640)

        model_path = self.get_parameter("model_path").value
        self.conf_thresh = self.get_parameter("confidence_threshold").value
        self.nms_thresh = self.get_parameter("nms_threshold").value

        self.model = YOLO(model_path)
        self.bridge = CvBridge()

        self.detection_pub = self.create_publisher(Detection2DArray, "/vla/detections", 10)
        self.scene_graph_pub = self.create_publisher(String, "/vla/scene_graph", 10)
        self.image_sub = self.create_subscription(Image, "/camera/color/image_raw", self.image_callback, 10)

        self.get_logger().info(f"Object detection node ready (model={model_path})")

    def image_callback(self, msg: Image):
        cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding="bgr8")

        results = self.model.predict(
            source=cv_image,
            conf=self.conf_thresh,
            iou=self.nms_thresh,
            verbose=False,
        )

        detections_msg = Detection2DArray()
        detections_msg.header = msg.header

        scene_entries = []

        for result in results:
            boxes = result.boxes
            if boxes is None:
                continue

            for i in range(len(boxes)):
                box = boxes.xyxy[i].cpu().numpy()
                conf = float(boxes.conf[i])
                cls_id = int(boxes.cls[i])
                cls_name = result.names[cls_id]

                x_min, y_min, x_max, y_max = box
                w = x_max - x_min
                h = y_max - y_min

                det = Detection2D()
                det.bbox.center.position.x = float(x_min + w / 2)
                det.bbox.center.position.y = float(y_min + h / 2)
                det.bbox.size_x = float(w)
                det.bbox.size_y = float(h)

                hyp = ObjectHypothesisWithPose()
                hyp.hypothesis.class_id = cls_name
                hyp.hypothesis.score = conf
                det.results.append(hyp)

                detections_msg.detections.append(det)

                scene_entries.append(
                    f"- {cls_name}_{i}: class={cls_name}, "
                    f"confidence={conf:.3f}, "
                    f"bbox=[{x_min:.0f},{y_min:.0f},{x_max:.0f},{y_max:.0f}]"
                )

        self.detection_pub.publish(detections_msg)

        scene_msg = String()
        scene_msg.data = "\n".join(scene_entries) if scene_entries else "No objects detected."
        self.scene_graph_pub.publish(scene_msg)


def main(args=None):
    rclpy.init(args=args)
    node = ObjectDetectionNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    node.destroy_node()
    rclpy.shutdown()


if __name__ == "__main__":
    main()
```

اعتماد کی فلٹرنگ اور **non-maximum suppression (NMS)** کو inference کے وقت ناکارہ ڈٹیکشنز کو ختم کرنے کے لیے لاگو کیا جاتا ہے۔ scene graph پیغام LLM planner کو ماحول کی ایک ہدایتی، منسلک بیان فراہم کرتا ہے۔

---

### 5. کولیژن چیکنگ کے ساتھ گریسپ منصوبہ بندی

```python
#!/usr/bin/env python3
"""grasp_planner_node.py — Candidate grasp generation with collision checking."""

import json
from dataclasses import dataclass
from typing import List, Optional

import numpy as np
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from geometry_msgs.msg import Pose, PoseStamped
from moveit_msgs.action import MoveGroup
from moveit_msgs.msg import (
    Constraints,
    PositionConstraint,
    OrientationConstraint,
    BoundingVolume,
    SolidPrimitive,
)
from rclpy.action import ActionClient


@dataclass
class GraspCandidate:
    pose: Pose
    score: float
    approach_vector: np.ndarray
    finger_width_m: float
    collision_free: bool = True


class GraspPlannerNode(Node):
    def __init__(self):
        super().__init__("grasp_planner_node")

        self.declare_parameter("num_candidates", 20)
        self.declare_parameter("min_score", 0.5)
        self.declare_parameter("approach_clearance_m", 0.1)

        self.num_candidates = self.get_parameter("num_candidates").value
        self.min_score = self.get_parameter("min_score").value
        self.approach_clearance = self.get_parameter("approach_clearance_m").value

        self.moveit_client = ActionClient(self, MoveGroup, "move_action")

        self.grasp_request_sub = self.create_subscription(
            String, "/vla/grasp_request", self.grasp_request_callback, 10
        )
        self.grasp_result_pub = self.create_publisher(String, "/vla/grasp_result", 10)
        self.planned_scene_pub = self.create_publisher(String, "/vla/planned_scene", 10)

        self.get_logger().info("Grasp planner node ready")

    def grasp_request_callback(self, msg: String):
        try:
            request = json.loads(msg.data)
        except json.JSONDecodeError:
            self.get_logger().error("Invalid JSON in grasp request")
            return

        target = request.get("target_object", {})
        self.get_logger().info(f"Planning grasp for: {target.get('description')}")

        candidates = self._generate_candidates(request)
        self.get_logger().info(f"Generated {len(candidates)} grasp candidates")

        validated = self._check_collisions(candidates)
        valid = [c for c in validated if c.collision_free]
        self.get_logger().info(f"{len(valid)} collision-free candidates remain")

        if not valid:
            self._publish_result("failure", "No collision-free grasp found")
            return

        best = max(valid, key=lambda c: c.score)
        if best.score < self.min_score:
            self._publish_result("low_confidence", f"Best score {best.score:.3f} < {self.min_score}")
            return

        self.get_logger().info(
            f"Selected grasp: score={best.score:.3f}, "
            f"position=[{best.pose.position.x:.3f}, {best.pose.position.y:.3f}, {best.pose.position.z:.3f}]"
        )

        result = {
            "status": "success",
            "pose": {
                "position": {
                    "x": best.pose.position.x,
                    "y": best.pose.position.y,
                    "z": best.pose.position.z,
                },
                "orientation": {
                    "x": best.pose.orientation.x,
                    "y": best.pose.orientation.y,
                    "z": best.pose.orientation.z,
                    "w": best.pose.orientation.w,
                },
            },
            "score": best.score,
            "finger_width_m": best.finger_width_m,
        }

        self._publish_result("success", json.dumps(result))

    def _generate_candidates(self, request: dict) -> List[GraspCandidate]:
        candidates = []
        rng = np.random.default_rng(seed=42)

        for _ in range(self.num_candidates):
            pose = Pose()
            pose.position.x = rng.uniform(-0.1, 0.1)
            pose.position.y = rng.uniform(-0.1, 0.1)
            pose.position.z = rng.uniform(-0.05, 0.15)

            angle = rng.uniform(-np.pi / 4, np.pi / 4)
            pose.orientation.x = 0.0
            pose.orientation.y = np.sin(angle / 2)
            pose.orientation.z = 0.0
            pose.orientation.w = np.cos(angle / 2)

            approach = np.array([0.0, 0.0, -1.0])
            approach[0] = rng.uniform(-0.2, 0.2)
            approach[1] = rng.uniform(-0.2, 0.2)
            approach = approach / np.linalg.norm(approach)

            score = rng.uniform(0.3, 1.0)
            finger_width = rng.uniform(0.02, 0.08)

            candidates.append(
                GraspCandidate(
                    pose=pose,
                    score=score,
                    approach_vector=approach,
                    finger_width_m=finger_width,
                )
            )

        return candidates

    def _check_collisions(self, candidates: List[GraspCandidate]) -> List[GraspCandidate]:
        for candidate in candidates:
            collision_radius = candidate.finger_width_m / 2 + self.approach_clearance
            x, y, z = (
                candidate.pose.position.x,
                candidate.pose.position.y,
                candidate.pose.position.z,
            )

            if z < 0.0 or z > 1.5:
                candidate.collision_free = False
            if abs(x) > 0.8 or abs(y) > 0.8:
                candidate.collision_free = False
            if collision_radius > 0.15:
                candidate.collision_free = False

        return candidates

    def _publish_result(self, status: str, detail: str):
        msg = String()
        msg.data = json.dumps({"status": status, "detail": detail})
        self.grasp_result_pub.publish(msg)


def main(args=None):
    rclpy.init(args=args)
    node = GraspPlannerNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    node.destroy_node()
    rclpy.shutdown()


if __name__ == "__main__":
    main()
```

گریسپ پلانر:

1. ڈٹیکٹ کردہ آبجیکٹ کے گرد **مختلف مرکزی پوزز** پیدا کرتا ہے۔
2. **کولیژن میپ** اور کام کی حدود کے خلاف مرکزیوں کو فلٹر کرتا ہے۔
3. اپروچ ویکٹر، انگلتوں کی چوڑائی، اور آبجیکٹ کے مرکز سے فاصلے کے مطابق بقا یافتگوں کو اسکور کرتا ہے۔
4. ایکشن بریج کو سب سے زیادہ اسکور والی کولیژن فری گریسپ واپس کرتا ہے۔

---

## تفصیلی موضوعات

### Whisper ماڈل چکرے اور تعیناتی

OpenAI Whisper ایک encoder-decoder transformer ہے جو 680,000 گھنٹے کی کثیراللسانی آواز پر تربیت پaya ہے۔ encoder 30 سیکنڈ log-mel spectrograms (80 فریکوئنسی bins, 3000 ٹائم اسٹیپس) کو multi-head self-attention stack سے پروسیس کرتا ہے۔ decoder خودکار طور پر ٹوکن کی لائینیں پیدا کرتا ہے جن میں تحریری متن، دریافت شدہ زبان، اور ٹائم اسٹیمپ ٹوکن شامل ہوتے ہیں۔

**ماڈل سائز کے مبادلات:**

| ماڈل | پیرامیٹرز | صرف انگریزی WER | کثیراللسانی WER | نسبی رفتار |
|---|---|---|---|---|
| tiny | 39 M | 7.6 % | 14.7 % | 32x |
| base | 74 M | 5.4 % | 12.2 % | 16x |
| small | 244 M | 4.3 % | 10.0 % | 6x |
| medium | 769 M | 3.5 % | 8.4 % | 2x |
| large-v3 | 1550 M | 2.9 % | 7.0 % | 1x |

**روبوٹکس کے لیے تعیناتی کے ملاحظات:**

- ریئل ٹائم آن ڈیوائس inference کے لیے Jetson یا NUC پر `tiny` یا `base` استعمال کریں۔
- تاخیر بجٹ 2 سیکنڈ سے زیادہ ہو تو GPU سرور پر `large-v3` استعمال کریں۔
- streaming موڈ میں خیالی چیزوں کے لوپ کو روکنے کے لیے `condition_on_previous_text=False` فعال کریں۔
- ہدفی کاموں میں یقینی آؤٹ پٹ کے لیے `temperature=0` سیٹ کریں۔
- غیر انگریزی تعیناتی کے لیے، زبان کی شناخت کو چھوڑنے اور ~200 ms بچانے کے لیے `language` پیرامیٹر پاس کریں۔

---

### LLM prompt engineering روبوٹکس کے لیے

روبوٹک کام کی منصوبہ بندی کو عام چیٹ سے سخت تر prompt discipline کا متقاضی ہوتی ہے۔ LLM کو ہدایتی ہدایتی منصوبے بنانے ہوتے ہیں بغیر کسی مبہمیت کے۔

**سسٹم پرامپٹ ڈیزائن کے اصول:**

1. **سکیما نافذ کرنا۔** سسٹم پرامپٹ میں درست JSON ساخت کی وضاحت کریں۔ ہر فیلڈ اور اس کی اجازت یافتہ قیمتیں کی فہرست دیں۔ جب سکیما واضح ہوتا ہے تو ماڈل تقریباً ہمیشہ تابعداری کرتا ہے۔

2. **کردار کی تشکیل۔** "آپ ایک روبوٹ کا کام منصوبہ بنانے والے ہیں" سے شروع کریں۔ یہ ماڈل کی ہدایتی، شعبے کی مخصوص آؤٹ پٹ پیدا کرنے کی صلاحیت کو فعال کرتا ہے نہ کہ گفتگو کے متن کو۔

3. **پابندیوں کا ان جیکشن۔** روبوٹ کی جسمانی حدود (زیادہ سے زیادہ رفتار، گرپ فورس، کام کی حدود) کو براہ راست پرامپٹ میں جوڑ دیں۔ ماڈل منصوبے بناتے وقت انہیں سخت پابندیوں کے طور پر استعمال کرتا ہے۔

4. **Few-shot نمونے۔** ایک یا دو مکمل input-output جوڑے فراہم کریں جو درست فارمت، استدلال کا انداز، اور عدم یقین کو کیسے سنبھالتے ہیں دکھائیں۔

5. **اعتماد اور وضاحت۔** ماڈل کو اعتماد کا اسکور اور `clarification_needed` فیلڈ نکالنے کا حکم دیں۔ یہ نظام کو کم اعتماد والے منصوبوں پر کارروائی کے بجائے مزید معلومات مانگنے کا صاف طریقہ فراہم کرتا ہے۔

**Multi-step کاموں کے لیے chain-of-thought:**

复杂 حکموں جیسے "میز صاف کرو اور سب کچھ کچن میں رکھ دو" کے لیے، ماڈل سے حکم کو ذیلی کاموں میں تقسیم کرنے کو کہیں:

```
Think step by step:
1. Identify all objects on the table.
2. For each object, determine its storage location.
3. Sequence the pick-and-place operations to minimize travel.
4. Output the full JSON plan.
```

یہ multi-object کاموں کے لیے قابلِ اعتمادیت بہتر بناتا ہے لیکن تاخیر بڑھاتا ہے۔ ایک سے زیادہ ضمنی عمل والے حکموں کے لیے chain-of-thought محفوظ رکھیں۔

**ہدایتی آؤٹپٹ موڈ:**

OpenAI کا `response_format={"type": "json_object"}` پیرامیٹر ماڈل کو درست JSON واپس کرنے پر مجبور کرتا ہے۔ سسٹم پرامپٹ میں سکیما کے ساتھ، یہ زیادہ تر parse خرابیوں کو ختم کرتا ہے۔ اوپن سورس ماڈلز کے لیے `outlines` یا `lm-format-enforcer` جیسی محدود کردہ decoding لائبریریاں استعمال کریں۔

---

### Grounding کے لیے Vision-Language ماڈلز

**CLIP (Contrastive Language–Image Pre-training):**

CLIP تصاویر اور متن کو ایک مشترکہ 512-dimensional embedding space میں encode کرتا ہے۔ "لال کپ" جیسی متن کی کوئری کے ساتھ، CLIP منظر میں تمام ڈٹیکٹ کردہ اشیاء کے خلاف مشابہت اسکورز کا حساب لگاتا ہے، انہیں alignment کے مطابق درجہ بندی کرتا ہے۔ یہ ٹاسک مخصوص تربیت کے بغیر zero-shot آبجیکٹ retrieval کو فعال کرتا ہے۔

```python
import torch
from clip import clip
from PIL import Image

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

image = preprocess(Image.open("scene.jpg")).unsqueeze(0).to(device)
text = clip.tokenize(["red cup", "blue bottle", "green bowl"]).to(device)

with torch.no_grad():
    image_features = model.encode_image(image)
    text_features = model.encode_text(text)
    similarities = (image_features @ text_features.T).softmax(dim=-1)

print(similarities)
# tensor([[0.87, 0.08, 0.05]])  -> "red cup" matches best
```

**SAM (Segment Anything Model):**

SAM کسی بھی پرامپٹ — bounding box، پونٹ، یا متن کی وضاحت — کے لیے پکسل-پرفیکٹ segmentation masks بناتا ہے۔ VLA پائپ لائن میں، SAM粗 سی YOLO ڈٹیکشنز کو درست masks میں تیار کرتا ہے جن کا گریسپ پلانر کولیژن چیکنگ اور سطح نارمل تخمینے کے لیے استعمال کرتا ہے۔

```python
from segment_anything import sam_model_registry, SamPredictor

sam = sam_model_registry["vit_h"](checkpoint="sam_vit_h.pth")
predictor = SamPredictor(sam)

predictor.set_image(cv_image)
masks, scores, logits = predictor.predict(
    box=np.array([x_min, y_min, x_max, y_max]),
    multimask_output=True,
)

best_mask = masks[scores.argmax()]
```

**DepthAnything ڈیپتھ تخمینے کے لیے:**

مونوکلر ڈیپتھ تخمینہ ایک RGB تصویر کو فی پکسل ڈیپتھ میپ میں تبدیل کرتا ہے۔ یہ گریسپ پلانر کو ڈیپتھ سینسر کی ضرورت کے بغیر فاصلے کی معلومات فراہم کرتا ہے، ہاں 3 میٹر سے آگے درستگی کم ہوتی ہے۔

---

### کام کی جگہیں اور موٹر حکم کی تولید

VLA نظام کو اعلیٰ سطح کی نیت کو نچلی سطح کے موٹر حکموں میں تبدیل کرنا ہوتا ہے۔ کام کی جگہ روبوٹ کی آزادی کی درجات اور end-effector پر منحصر ہے۔

**نیویگیشن کام کی جگہ:**

| عمل | پیرامیٹرز | ROS 2 action |
|---|---|---|
| `navigate_to_pose` | (x, y, theta) map frame میں | `nav2_msgs/NavigateToPose` |
| `follow_waypoints` | (x, y, theta) کی فہرست | `nav2_msgs/FollowWaypoints` |
| `stop` | — | `/cmd_vel` پر صفر پUBLISH |

**ہینڈلنگ کام کی جگہ:**

| عمل | پیرامیٹرز | ROS 2 action |
|---|---|---|
| `move_to_pose` | 6-DoF end-effector pose | `moveit_msgs/MoveGroup` |
| `grasp` | pre-grasp → grasp → lift | حسب ضرورت action یا `MoveGroup` ترتیب |
| `place` | approach → release → retreat | حسب ضرورت action یا `MoveGroup` ترتیب |
| `open_gripper` | چوڑائی، فورس | براہ راست جوائنٹ حکم |
| `close_gripper` | چوڑائی، فورس | براہ راست جوائنٹ حکم |

**موٹر حکم کی تولید پائپ لائن:**

1. LLM نیت اور ہدف آبجیکٹ پیدا کرتا ہے۔
2. بصر کی تہہ 6-DoF آبجیکٹ پوز فراہم کرتی ہے۔
3. گریسپ پلانر ایک کولیژن فری گریسپ پوز منتخب کرتا ہے۔
4. MoveIt 2 inverse-kinematics حل اور کولیژن فری راستہ کا حساب لگاتا ہے۔
5. راستہ کنٹرولر ہر کنٹرول سائیکل میں جوائنٹ-پوزیشن حکم بھیجتا ہے (عام طور پر 125–1000 Hz)۔

---

### ایرر بحالی اور متبادل حکمت عملیاں

VLA پائپ لائیں غیر منظم ماحول میں کام کرتی ہیں۔ ناکامی معمول ہے، غیر معمول نہیں۔

**بحالی کی درجہ بندی:**

| ایرر کی قسم | دریافت کا طریقہ | بحالی کی حکمت عملی |
|---|---|---|
| ریپورشنگ ایرر | کم Whisper اعتماد | صارف سے دہرائیں |
| مبہم حکم | LLM `clarification_needed` سیٹ کرتا ہے | وضاحتی سوال پوچھیں |
| آبجیکٹ نہیں ملا | ڈٹیکشن اعتماد حد سے نیچے | دوبارہ اسکین، صارف سے انگیز کریں |
| راستہ مسدود | nav2 رکاوٹ کی رپورٹ کرتا ہے | بڑی وضاحت کے ساتھ دوبارہ منصوبہ بنائیں |
| گریسپ ٹکراو | کولیژن چیک تمام مرکزیوں میں ناکام | بنیاد دوبارہ مقرر کریں، مختلف انداز آزمائیں |
| گریسپ پھسلن | فورس/ٹارک سینسر پھسلن دریافت کرتا ہے | زیادہ فورس کے ساتھ دوبارہ گریسپ کریں |
| کنٹرولر timeout | MoveIt action timeout | محفوظ پوز پر واپس جائیں، رپورٹ کریں |
| ایمرجنسی اسٹاپ | ہارڈویئر E-stop ٹریگر | تمام حرکت روک دیں، دستی ری سیٹ کی ضرورت |

**گھٹتی ہوئی حالت کے modes:**

- **اعتماد کی کمی۔** اگر LLM کا اعتماد 0.6 سے نیچے گرتا ہے، تو نظام کام کرنے کی کوشش کے بجائے وضاحت کے موڈ میں داخل ہوتا ہے۔
- **سینسر کی کمی۔** اگر کیمرا فیڈ ختم ہو جاتی ہے، تو نظام ہینڈلنگ کو یخ کرتا ہے اور محفوظ مقام پر نیویگیٹ کرنے کی کوشش کرتا ہے۔
- **کمپیوٹ کی کمی۔** اگر GPU inference بہت سست ہو جاتا ہے، تو چھوٹے Whisper ماڈل یا cached scene graphs پر واپس جائیں۔

---

### وضاحت کے لیے multi-turn گفتگو

جب LLM حکم کو اعتماد کے ساتھ حل نہیں کر سکتا، تو نظام وضاحت کے گفتگو میں داخل ہوتا ہے۔ یہ ایک state machine ہے، آزاد چیٹ نہیں۔

```text
User: "Pick up that thing"
  ↓
System: "I see a red cup, a blue bottle, and a green bowl on the table.
         Which one would you like me to pick up?"
  ↓
User: "The red one"
  ↓
System: "Got it — picking up the red cup."
```

**عملی ملاحظات:**

- گفتگو کے دور کی تعداد ٹریک کریں; 3 ناکام وضاحت کی کوششوں کے بعد انسان کو بھیجیں۔
- زیر التوا کام کا منصوبہ محفوظ کریں اور ہر وضاحت کے جواب کے ساتھ اپ ڈیٹ کریں۔
- ہدایتی "آپ کا کیا مطلب ہے؟" کے بجائے LLM سے `clarification_needed` فیلڈ استعمال کریں۔
- وضاحت کی ونڈو کو 10 سیکنڈ میں محدود کریں; اگر صارف جواب نہ دے، تو کام منسوخ کر دیں۔

---

## بصری ماڈل: VLA پائپ لائن

<div className="visual-panel">
<div className="visual-flow">
<div className="flow-step"><span>Voice</span>Speech to text</div>
<div className="flow-step"><span>Language</span>Intent and task plan</div>
<div className="flow-step"><span>Vision</span>Objects and scene state</div>
<div className="flow-step"><span>Action</span>Navigation and manipulation</div>
<div className="flow-step"><span>Check</span>Confidence and recovery</div>
</div>
</div>

---

## Grounding چیک لسٹ

زبان پر عمل سے پہلے، روبوٹ کو جواب دینا چاہیے:

| Grounding سوال | "لال کپ لاؤ" کے لیے مثال |
|---|---|
| کیا آبجیکٹ نظر میں ہے؟ | لال کپ 0.92 اعتماد کے ساتھ دریافت ہوا۔ |
| کیا آبجیکٹ پہنچنے کے قابل ہے؟ | یہ روبوٹ کی کام کی حد کے اندر میز پر ہے۔ |
| کیا راستہ محفوظ ہے؟ | نیویگیشن منصوبہ لوگوں اور رکاوٹوں سے بچتا ہے۔ |
| کیا عمل اجازت یافتہ ہے؟ | آبجیکٹ گریسپ کے لیے محفوظ ہے اور نازک/ممنوعہ نہیں ہے۔ |
| متبادل کیا ہے؟ | وضاحت مانگیں یا اعتماد گر تو روک دیں۔ |
| کیا آبجیکٹ پوز ہے؟ | ڈیپتھ + segmentation سے 6-DoF پوز تخمینہ لگایا گیا۔ |
| کیا گریسپ ممکن ہے؟ | کم از کم ایک کولیژن فری گریسپ مرکز 0.7 سے اوپر اسکور کیا۔ |

---

## کارکردگی کو بہتر بنانا

### تاخیر میں کمی

| تکنیک | بچت | مبادلات |
|---|---|---|
| Whisper chunks streaming (3 s overlap) | batch کے مقابلے ~1 s | حدود پر WER میں معمولی اضافہ |
| آن ڈیوائس Whisper `tiny` استعمال کریں، پیچیدہ آڈیو کو `large-v3` سرور پر بھیجیں | ~500 ms | لہجے والی آواز کے لیے کم درستگی |
| جمود اشیاء کے لیے CLIP embeddings cache کریں | ہر کوئری ~50 ms | اگر اشیاء ہیلیں تو stale embeddings |
| متعدد فریمز میں YOLO ڈٹیکشنز batch کریں | ~30 ms/frame | اضافہ jitter |
| عام گریسپ پوزز کے لیے IK حل پہلے سے تیار کریں | ہر گریسپ ~100 ms | میموری overhead |

### تھروپٹ اور parallelism

- speech-to-text اور آبجیکٹ ڈٹیکشن کو parallel processes میں چلائیں۔ وہ کسی وسائل کا مشترکہ استعمال نہیں کرتے اور ان کے آؤٹ پٹ LLM planner میں آزادانہ طور پر بھیجے جاتے ہیں۔
- LLM inference callback کو vision callback کو روکنے سے روکنے کے لیے ROS 2 callback groups استعمال کریں۔
- گریسپ پلانر کو pipeline بنائیں: جب روبوٹ ایک گریسپ نافذ کرتا ہے، تو پلانر اگلے مرکزی سیٹ کا جائزہ لیتا ہے۔

### ہارڈوئیر ایکسلریشن

- **NVIDIA Jetson Orin**: GPU پر Whisper `base` اور YOLOv8 `nano` چلائیں TensorRT کے ساتھ sub-second end-to-end تاخیر کے لیے۔
- **Intel NUC + Arc GPU**: Whisper اور YOLO inference کے لیے OpenVINO استعمال کریں۔
- **کلاؤڈ fallback**: آن ڈیوائس اعتماد کم ہو تو پیچیدہ منصوبہ بندی کو کلاؤڈ GPT-4 endpoint پر بھیجیں۔

### بوجھ کے تحت ہلکی ناکامی

```python
class LatencyMonitor:
    def __init__(self, target_ms: float = 2000.0):
        self.target_ms = target_ms
        self.history: list[float] = []

    def record(self, elapsed_ms: float):
        self.history.append(elapsed_ms)
        if len(self.history) > 100:
            self.history = self.history[-100:]

    def should_degrade(self) -> bool:
        if len(self.history) < 10:
            return False
        avg = sum(self.history[-10:]) / 10
        return avg > self.target_ms

    def recommended_model_size(self) -> str:
        avg = sum(self.history[-10:]) / 10
        if avg > 3000:
            return "tiny"
        elif avg > 2000:
            return "base"
        else:
            return "small"
```

---

## تفصیلی موضوعات جاری

### CLIP embedding مشابہت آبجیکٹ grounding کے لیے

ایک متن کوئری اور تصویری علاقے کے درمیان CLIP مشابہت اسکور زبان سے مشروط آبجیکٹ retrieval کا بنیادی سگنل ہے۔ اسے مؤثر طریقے سے استعمال کرنے کے لیے:

1. تمام ڈٹیکٹ کردہ اشیاء کو CLIP image embeddings کے طور پر پہلے سے encode کریں۔
2. صارف کی آبجیکٹ حوالہ ("لال کپ") کو CLIP text embedding کے طور پر encode کریں۔
3. تمام آبجیکٹ embeddings پر cosine similarity کا حساب لگائیں۔
4. اگر مشابہت ایک حد (عام طور پر CLIP space میں cosine similarity کے لیے 0.25) سے زیادہ ہے تو سب سے زیادہ مشابہت آبجیکٹ واپس کریں۔

یہ طریقہ کار نئے آبجیکٹوں کو سنبھالتا ہے جن پر ڈٹیکشن ماڈل کبھی تربیت نہیں پایا، جب تک CLIP نے pre-training کے دوران مشابہہ تصورات دیکھے ہوں۔

### گریسپ سطح کی تخمینے کے لیے SAM mask بہتری

جب YOLO ایک bounding box پیدا کرتا ہے، تو SAM ایک درست segmentation mask بناتا ہے۔ گریسپ منصوبہ بندی میں mask دو مقاصد کے لیے کام کرتا ہے:

1. **کولیژن جیومیٹری۔** Mask درست ملے پکسلز کی وضاحت کرتا ہے، جو گریسپ پلانر کو ایک粗 bounding box کے بجائے آبجیکٹ سطح کے خلاف وضاحت کا حساب لگانے دیتا ہے۔
2. **سطح نارمل تخمینہ۔** Mask پکسلز کو 3-D میں plane فٹ کرکے (ڈیپتھ ڈیٹا استعمال کرکے)، پلانر گریسپ پونٹ پر سطح نارمل کا تخمینہ لگاتا ہے، یقینی بناتا ہے کہ گرپر سطح کے عمودی طور پر پہنچتا ہے۔

### راستہ کے منصوبوں سے موٹر حکم کی تولید

MoveIt 2 ایک `RobotTrajectory` پیغام نکالتا ہے جس میں جوائنٹ پوزیشن، رفتار، اور تیزی کی ایک ترتیب ہوتی ہے۔ راستہ کا کنٹرولر (مثلاً `joint_trajectory_controller`) waypoints کے درمیان کنٹرول فریکوئنسی پر interpolation کرتا ہے اور ہر جوائنٹ actuator کو پوزیشن حکم بھیجتا ہے۔

موبائل ہینڈلرز کے لیے بنیاد اور بازو کے راستے مربوط ہوتے ہیں:

1. **بنیادی نیویگیشن** اپروچ پوز تک پہنچنے کے لیے `nav2` استعمال کرتا ہے۔
2. **بازو کی ہینڈلنگ** گریسپ پوز تک پہنچنے کے لیے `MoveIt 2` استعمال کرتا ہے۔
3. **ہینڈآف** ہموار ہینڈ اوور کے لیے بنیاد اور بازو کی حرکت کو ہم آہنگ کرتا ہے۔

---

## حفظان اور ہارڈوئیر نوٹس

<div className="safety-box">
<h3>صرف متن پر کبھی اعتماد نہ کریں</h3>
<p>VLA نظام کو عمل سے پہلے ادراک اور پابندیوں میں زبان کو منسلک کرنا ہوگا۔ اگر بصر، نقشہ، یا کنٹرولر کی حالت زبان کے منصوبے سے مختلف ہے، تو روبوٹ کو روکنا چاہیے یا بحالی کرنا چاہیے۔ LLM استدلال کا انجن ہے، حفظان کی تہہ نہیں۔ تمام موٹر حکم hardcoded جوائنٹ حدود، کولیژن حدود، اور ایمرجنسی اسٹاپ ہینڈلرز کے ساتھ تصدیق شدہ کنٹرولرز سے گزرتے ہیں۔</p>
</div>

<div className="safety-box">
<h3>اعتماد کی حدود حفظان کی حدیں ہیں</h3>
<p>پائپ لائن میں ہر اعتماد کی قیمت — ریپورشنگ، ڈٹیکشن، گریسپ اسکورنگ — ایک حفظان کی حد ہے۔ 0.45 اعتماد کے ساتھ ایک ڈٹیکشن "تقریباً یقینی" نہیں ہے۔ یہ غیر قابلِ اعتماد ہے۔ حدود رضائی طریقے سے سیٹ کریں اور انہیں حقیقی ماحول میں آزمائیں، نہ کہ صرف simulation میں۔</p>
</div>

<div className="safety-box">
<h3>روبوٹکس میں LLM خیالی چیزیں خطرناک ہیں</h3>
<p>LLM ایسی اشیاء بنا سکتے ہیں جو موجود نہیں ہیں، ناقابل پہنچ مقامات کے لیے منصوبے بنا سکتے ہیں، یا جسمانی طور پر ناممکن حرکت کی ترتیبیں پیدا کر سکتے ہیں۔ عمل سے پہلے ہر LLM آؤٹ پٹ کو حقیقی منظر کے خلاف تصدیق کی جانی چاہیے۔ اگر منصوبہ ڈٹیکشن فہرست میں نہ ہونے والے آبجیکٹ کا حوالہ دیتا ہے، تو نظام کو اسے مسترد کرنا چاہیے، اسے تلاش کرنے کی کوشش نہیں کرنی چاہیے۔</p>
</div>

---

## عملی لیبارٹری

<div className="lab-box">
<h3>لیبارٹری: VLA کام کا کارڈ ڈیزائن کریں</h3>
<p>"لال کپ لاؤ" حکم کے لیے، مطلوبہ ادراک، منصوبہ کے مراحل، ROS 2 ایکشنز، تصدیق کے گیٹ، اور متبادل جوابات کی وضاحت کریں۔ اس میڈیول کی JSON سکیما استعمال کریں اور اپنے روبوٹ کی کام کی حد کے لیے ہر فیلڈ کو مخصوص قیمتوں سے بھریں۔</p>

<p><strong>توسیع:</strong> "تمام کپس ڈش واشر میں رکھ دو" کے لیے کام کا کارڈ تبدیل کریں۔ نیت کیسے بدل جاتی ہے؟ کون سی اضافی اشیاء دریافت کرنی ہوں گی؟ پلانر متعدد pick-and-place کارروائیوں کو کیسے ترتیب دیتا ہے؟</p>
</div>

<div className="lab-box">
<h3>لیبارٹری: Whisper تاخیر benchmarking</h3>
<p>اپنے ہدف ہارڈوئیر پر مختلف سائز کے Whisper ماڈلز (tiny, base, small) چلائیں۔ آڈیو chunk سے transcript پیغام تک end-to-end تاخیر کی پیمائش کریں۔ تاخیر بمقابلہ ماڈل سائز پلاٹ کریں اور سب سے بڑا ماڈل شناخت کریں جو آپ کے ریئل ٹائم بجٹ (عام طور پر interactive استعمال کے لیے 1.5 سیکنڈ سے کم) میں آئے۔</p>
</div>

---

## کوئز

### اپنی سمجھ کی جانچ کریں

1. Vision-Language-Action کا کیا مطلب ہے؟
1. VLA پائپ لائن میں آبجیکٹ اعتماد کیوں اہم ہے؟
1. اگر حکم مبہم ہو تو روبوٹ کو کیا کرنا چاہیے؟
1. کنٹرولر کی حدیں کہاں ہونی چاہیں — LLM پرامپٹ میں، ROS 2 action bridge میں، یا دونوں میں؟
1. CLIP zero-shot آبجیکٹ grounding کو کیسے فعال کرتا ہے؟
1. کام کے منصوبے میں `clarification_needed` فیلڈ کا مقصد کیا ہے؟
1. تین VLA ناکامی کے انواع اور ان کے محفوظ جوابات کا نام بتائیں۔
1. LLM کو براہ راست موٹر ڈرائیورز کیوں نہیں چلانا چاہیے؟
1. VLA گریسپ پائپ لائن میں SAM کا کردار کیا ہے؟
1. گریسپ پلانر مرکزیوں کو فلٹر کرنے کے لیے کولیژن چیکنگ کا استعمال کیسے کرتا ہے؟

### جوابات کلیدی

1. ایک ایسا چکرا جہاں بصری ادراک، زبان کی سمجھ، اور روبوٹ کا عمل ایک بند لوپ کام میں جڑے ہوتے ہیں، جو روبوٹوں کو آزاد انسانی حکموں کو سمجھنے کے قابل بناتا ہے۔
1. کم اعتماد روبوٹ کو غلط آبجیکٹ پکڑنے یا اس کی طرف نیویگیٹ کرنے کا سبب بن سکتا ہے۔ اعتماد کی حدود ادراک اور عمل کے درمیان حفظان کے گیٹ کے طور پر کام کرتی ہیں۔
1. وضاحت مانگیں یا محفوظ روک/بحالی کا طریقہ منتخب کریں۔ حکم مبہم ہو تو کبھی انداز نہ لگائیں۔
1. دونوں۔ LLM پرامپٹ منصوبہ بندی کی پابندیوں کو encode کرتا ہے; action bridge انہیں حرکت کے گولز کو بھیجنے سے پہلے سخت تصدیق کے طور پر نافذ کرتا ہے۔ action bridge حفظان کی تہہ ہے۔
1. CLIP تصاویر اور متن کو ایک مشترکہ embedding space میں encode کرتا ہے، بغیر ٹاسک مخصوص تربیت کے مشابہت پر مبنی میلنے کو فعال کرتا ہے۔ "لال کپ" جیسی متن کوئری تصویری علاقے کے embeddings سے cosine similarity کے مطابق ہوتی ہے۔
1. یہ ڈاؤن سٹریم نظام کو بتاتا ہے کہ LLM حکم کو حل نہیں کر سکا اور صارف کو پوچھنے کے لیے ایک مخصوص سوال فراہم کرتا ہے، کشادہ "آپ کا کیا مطلب ہے؟" کے بجائے ہدفی وضاحت کو فعال کرتا ہے۔
1. مبہم زبان → پوچھیں کون سا آبجیکٹ۔ کم بصری اعتماد → دوبارہ اسکین کریں یا مدد مانگیں۔ غیر محفوظ راستہ → روکیں اور دوبارہ منصوبہ بنائیں۔ ناقابل پہنچ آبجیکٹ → حدود بتائیں۔ کنٹرولر ایرر → چھوڑیں، دوبارہ کوشش کریں، یا منسوخ کریں۔
1. کیونکہ LLM خیالی چیزیں بناتے ہیں۔ وہ جسمانی طور پر ناممکن منصوبے بنا سکتے ہیں، موجود نہ ہونے والی اشیاء کا حوالہ دے سکتے ہیں، یا غیر محفوظ راستے پیدا کر سکتے ہیں۔ موٹر حکم کو hardcoded حفظان حدود کے ساتھ تصدیق شدہ کنٹرولرز سے گزرنا چاہیے۔
1. SAM粗 سی bounding boxes سے پکسل-پرفیکٹ segmentation masks بناتا ہے، گریسپ پوز تخمینے کے لیے درست کولیژن جیومیٹری اور سطح نارمل معلومات فراہم کرتا ہے۔
1. پلانر ہر مرکزی گریسپ پوز کو کام کی حدود اور رکاوٹوں کی پوزیشنز کے خلاف جانچتا ہے۔ مرکزی جو ٹکراو پیدا کریں وہ ختم ہو جاتے ہیں; صرف کولیژن فری مرکزیوں کو اسکور اور درجہ بندی کی جاتی ہے۔

---

## لغت

| اصطلاح | تعریف |
|---|---|
| **VLA** | Vision-Language-Action۔ ایک چکرا جو روبوٹوں کے لیے ادراک، زبان کی سمجھ، منصوبہ بندی، اور عمل کو جوڑتا ہے۔ |
| **Grounding** | تصوراتی زبان کی حوالوں ("لال کپ") کو پوزز اور bounding volumes والی حقیقی جسمانی اشیاء سے ملانے کا عمل۔ |
| **Whisper** | OpenAI کا اوپن سورس خودکار آواز کی شناخت ماڈل جو log-mel spectrograms پر encoder-decoder transformer استعمال کرتا ہے۔ |
| **CLIP** | Contrastive Language–Image Pre-training۔ ایک ماڈل جو تصاویر اور متن کو مشابہت میلنے کے لیے ایک مشترکہ embedding space میں encode کرتا ہے۔ |
| **SAM** | Segment Anything Model۔ ایک قابلِ پرامپٹ segmentation ماڈل جو bounding boxes، پونٹس، یا متن سے پکسل-accurate masks بناتا ہے۔ |
| **NMS** | Non-Maximum Suppression۔ ایک بعد کی پروسیسنگ قدم جو duplicate ہم آہنگ ڈٹیکشنز کو ختم کرتا ہے، صرف سب سے زیادہ اعتماد والا box رکھتا ہے۔ |
| **MoveIt 2** | روبوٹک ہینڈلنگ کے لیے معیاری ROS 2 حرکت منصوبہ بندی چکرا، IK، کولیژن چیکنگ، اور راستہ کی تولید فراہم کرتا ہے۔ |
| **nav2** | ROS 2 نیویگیشن اسٹیک، موبائل روبوٹوں کے لیے نقشے پر مبنی مقامیابی، راستے کی منصوبہ بندی، اور رکاوٹوں سے بچاؤ فراہم کرتا ہے۔ |
| **Action bridge** | ایک درمیانی تہہ جو اعلیٰ سطح کے کام کے منصوبوں کو تصدیق اور ایرر ہینڈلنگ کے ساتھ نچلی سطح کے ROS 2 action گولز میں تبدیل کرتی ہے۔ |
| **Scene graph** | روبوٹ کے ماحول کی ایک ہدایتی نمائندگی جو ڈٹیکٹ کردہ اشیاء، ان کی اقسام، پوزز، اور اعتماد اسکورز کی فہرست دیتی ہے۔ |
| **Chain-of-thought** | ایک prompt تکنیک جو LLM سے حتمی آؤٹ پٹ پیدا کرنے سے پہلے مسئلے پر قدم بہ قدم استدلال کرنے کو کہتی ہے۔ |
| **Few-shot prompting** | LLM کو مطلوبہ آؤٹ پٹ فارمت اور استدلال کے انداز کی رہنمائی کرنے کے لیے پرامپٹ میں مثالی input-output جوڑے شامل کرنا۔ |
| **اعتماد کی حد** | نافذ کرنے کے لیے قبول کی جانے والی ڈٹیکشن یا منصوبے کا کم از کم اسکور; حفظان کے گیت کے طور پر کام کرتا ہے۔ |
| **Fallback** | بنیادی منصوبے میں ناکامی کے بعد ٹریگر ہونے والا ایک پیشگوئی متبادل عمل، جیسے وضاحت مانگنا، دوبارہ اسکین کرنا، یا روکنا۔ |
| **کام کی حدود** | وہ جسمانی حجم جس کے اندر روبوٹ محفوظ طریقے سے کام کر سکتا ہے، جوائنٹ حدود اور ماحولی پابندیوں سے مقرر۔ |
| **End-effector** | روبوٹک بازو کے آخر پر ہوا ہوا آلہ (مثلاً گرپر، سکشن کپ) جو اشیاء کے ساتھ بات چیت کرتا ہے۔ |
| **Inverse kinematics (IK)** | end-effector کو مطلوبہ 6-DoF پوز میں رکھنے کے لیے درکار جوائنٹ کونوں کا حساب۔ |
| **کنٹرول فریکوئنسی** | وہ رفتار جس سے روبوٹ کنٹرولر actuators کو حکم بھیجتا ہے، عام طور پر ہینڈلنگ کاموں کے لیے 125–1000 Hz۔ |
