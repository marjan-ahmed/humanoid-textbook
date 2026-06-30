import {ChatKit, useChatKit} from '@openai/chatkit-react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useEffect, useRef, useState} from 'react';

import styles from './styles.module.css';

const THREAD_STORAGE_KEY = 'physical-ai-chatkit-thread';
const PANEL_STORAGE_KEY = 'physical-ai-chatkit-open';
const MAX_SELECTED_TEXT_LENGTH = 1200;
const DEFAULT_SELECTION_PROMPT = 'Explain this selected text using the textbook only and cite the most relevant sections.';

type SelectedScope = {
  text: string;
};

type PendingSelectionRequest = {
  id: number;
  prompt: string;
};

function resolveApiUrl(configuredApiUrl?: string) {
  if (typeof window === 'undefined') {
    return 'http://localhost:8000/chatkit';
  }

  const {hostname, origin} = window.location;
  if (configuredApiUrl && configuredApiUrl.trim()) {
    return configuredApiUrl.trim();
  }
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000/chatkit';
  }

  return `${origin}/chatkit`;
}

function resolveDomainKey(configuredDomainKey?: string) {
  if (typeof window === 'undefined') {
    return 'local-dev';
  }

  if (configuredDomainKey && configuredDomainKey.trim()) {
    return configuredDomainKey.trim();
  }

  const {hostname} = window.location;
  return hostname === 'localhost' || hostname === '127.0.0.1' ? 'local-dev' : hostname;
}

function normalizeSelectedText(value: string) {
  return value.replace(/\s+/g, ' ').trim().slice(0, MAX_SELECTED_TEXT_LENGTH);
}



function ChatAssistantPanel({
  initialThread,
  configuredApiUrl,
  configuredDomainKey,
  selectedText,
  pendingSelectionRequest,
  onSelectionRequestSent,
  instanceKey,
  onError,
}: {
  initialThread: string | null;
  configuredApiUrl?: string;
  configuredDomainKey?: string;
  selectedText?: string | null;
  pendingSelectionRequest?: PendingSelectionRequest | null;
  onSelectionRequestSent: (requestId: number) => void;
  instanceKey: number;
  onError: (message: string) => void;
}) {
  const {control, ref} = useChatKit({
    api: {
      url: resolveApiUrl(configuredApiUrl),
      domainKey: resolveDomainKey(configuredDomainKey),
      fetch: (input, init) => {
        const headers = new Headers(init?.headers ?? undefined);
        if (selectedText && selectedText.trim()) {
          headers.set('x-selected-text', selectedText.trim());
        }
        return fetch(input, {...init, headers});
      },
    },
    initialThread,
    theme: {
      colorScheme: 'dark',
      radius: 'round',
      color: {
        grayscale: {hue: 34, tint: 8, shade: -2},
        accent: {primary: '#b9772f', level: 2},
      },
    },
    startScreen: {
      greeting: 'Ask the course assistant for grounded answers from the textbook.',
      prompts: [
        {
          label: 'ROS 2 module',
          prompt: 'Summarize the ROS 2 control layer in this textbook and cite the relevant sections.',
        },
        {
          label: 'Simulation stack',
          prompt: 'Explain how this book approaches Gazebo, Unity, and digital twins.',
        },
        {
          label: 'Capstone path',
          prompt: 'What does the autonomous humanoid capstone require according to the textbook?',
        },
      ],
    },
    composer: {
      placeholder: selectedText
        ? 'Ask about the selected textbook passage...'
        : 'Ask about ROS 2, simulation, Isaac, VLA, or the capstone...',
    },
    onThreadChange: ({threadId}) => {
      if (threadId) {
        window.localStorage.setItem(THREAD_STORAGE_KEY, threadId);
      }
    },
    onError: ({error}) => {
      const message = error instanceof Error ? error.message : String(error);
      console.error('ChatKit error:', error);
      onError(message);
    },
  });

  useEffect(() => {
    if (!pendingSelectionRequest) {
      return;
    }

    let cancelled = false;
    let retryTimer: ReturnType<typeof window.setTimeout> | null = null;
    let retryCount = 0;

    const submitSelectionPrompt = async () => {
      if (!ref.current) {
        retryTimer = window.setTimeout(() => {
          void submitSelectionPrompt();
        }, 80);
        return;
      }

      try {
        await ref.current.sendUserMessage({text: pendingSelectionRequest.prompt});
        if (!cancelled) {
          onSelectionRequestSent(pendingSelectionRequest.id);
        }
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : String(error);
          if (message.includes('thread is loading') && retryCount < 10) {
            retryCount++;
            retryTimer = window.setTimeout(() => {
              void submitSelectionPrompt();
            }, 200);
            return;
          }
          onError(message);
        }
      }
    };

    retryTimer = window.setTimeout(() => {
      void submitSelectionPrompt();
    }, 300);

    return () => {
      cancelled = true;
      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }
    };
  }, [pendingSelectionRequest, ref, onSelectionRequestSent, onError]);

  return <ChatKit key={instanceKey} control={control} className={styles.chatkit} aria-label="Course assistant chat" />;
}

export default function ChatAssistant() {
  const {siteConfig} = useDocusaurusContext();
  const configuredApiUrl = String(siteConfig.customFields?.chatkitApiUrl ?? '');
  const configuredDomainKey = String(siteConfig.customFields?.chatkitDomainKey ?? '');
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [initialThread, setInitialThread] = useState<string | null>(null);
  const [instanceKey, setInstanceKey] = useState(0);
  const [scriptReady, setScriptReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedScope, setSelectedScope] = useState<SelectedScope | null>(null);
  const [pendingSelectionRequest, setPendingSelectionRequest] = useState<PendingSelectionRequest | null>(null);

  useEffect(() => {
    const savedThread = window.localStorage.getItem(THREAD_STORAGE_KEY);
    const savedOpenState = window.localStorage.getItem(PANEL_STORAGE_KEY);

    setInitialThread(savedThread);
    setIsOpen(savedOpenState === 'true');
    setIsReady(true);

    if (window.customElements.get('openai-chatkit')) {
      setScriptReady(true);
      return;
    }

    let cancelled = false;
    window.customElements
      .whenDefined('openai-chatkit')
      .then(() => {
        if (!cancelled) {
          setScriptReady(true);
        }
      })
      .catch((error) => {
        console.error('ChatKit script did not initialize:', error);
        setErrorMessage('The ChatKit web component did not initialize.');
      });

    return () => {
      cancelled = true;
    };
  }, [instanceKey]);

  useEffect(() => {
    if (isReady) {
      window.localStorage.setItem(PANEL_STORAGE_KEY, String(isOpen));
    }
  }, [isOpen, isReady]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const updateSelectedText = () => {
      const selection = window.getSelection();
      const rawText = selection?.toString() ?? '';
      const normalized = normalizeSelectedText(rawText);

      if (!selection || !normalized || selection.rangeCount === 0) {
        setSelectedScope(null);
        return;
      }

      const anchorNode = selection.anchorNode;
      const anchorElement = anchorNode instanceof Element ? anchorNode : anchorNode?.parentElement;
      if (anchorElement && shellRef.current?.contains(anchorElement)) {
        return;
      }

      const rect = selection.getRangeAt(0).getBoundingClientRect();
      if (!rect.width && !rect.height) {
        setSelectedScope(null);
        return;
      }

      setSelectedScope({text: normalized});
    };

    document.addEventListener('selectionchange', updateSelectedText);
    window.addEventListener('scroll', updateSelectedText, true);
    window.addEventListener('resize', updateSelectedText);

    return () => {
      document.removeEventListener('selectionchange', updateSelectedText);
      window.removeEventListener('scroll', updateSelectedText, true);
      window.removeEventListener('resize', updateSelectedText);
    };
  }, []);

  if (!isReady) {
    return null;
  }

  const handleSelectionAsk = () => {
    if (!selectedScope?.text) {
      return;
    }

    setErrorMessage(null);
    setIsOpen(true);
    setPendingSelectionRequest({
      id: Date.now(),
      prompt: DEFAULT_SELECTION_PROMPT,
    });
  };

  const clearSelectionScope = () => {
    setSelectedScope(null);
    setPendingSelectionRequest(null);
    if (typeof window !== 'undefined') {
      window.getSelection()?.removeAllRanges();
    }
  };

  const selectedPreview = selectedScope?.text && selectedScope.text.length > 180
    ? `${selectedScope.text.slice(0, 180)}...`
    : selectedScope?.text;

  return (
    <div ref={shellRef} className={styles.shell} data-open={isOpen ? 'true' : 'false'}>
      {selectedScope?.text && (
        <button
          className={styles.selectionTrigger}
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleSelectionAsk}
          aria-label="Ask about selected text">
          Ask about selected text
        </button>
      )}

      {!isOpen && (
        <button
          className={styles.trigger}
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open textbook assistant">
          <span className={styles.triggerPulse} aria-hidden="true" />
          <span className={styles.triggerGlyph} aria-hidden="true">[]</span>
        </button>
      )}

      {isOpen && (
        <>
          <button
            className={styles.backdrop}
            type="button"
            aria-label="Close textbook assistant"
            onClick={() => setIsOpen(false)}
          />
          <section className={styles.panel} aria-label="Physical AI textbook assistant">
            <header className={styles.panelHeader}>
              <div>
                <p>Grounded assistant</p>
                <h2>Textbook copilot</h2>
              </div>
              <div className={styles.panelActions}>
                <button type="button" className={styles.closeIcon} onClick={() => setIsOpen(false)} aria-label="Close assistant">
                  <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </header>
            {selectedPreview && (
              <div className={styles.selectionBanner}>
                <div>
                  <strong>Selected text scope</strong>
                  <p>{selectedPreview}</p>
                </div>
                <button type="button" onClick={clearSelectionScope}>Clear</button>
              </div>
            )}
            {errorMessage && (
              <div style={{background:'rgba(120,41,28,0.34)',borderBottom:'1px solid rgba(233,149,124,0.24)',color:'#f7f1e7',padding:'0.85rem 1rem'}}>
                <strong style={{display:'block',fontSize:'0.82rem',letterSpacing:'0.06em',marginBottom:'0.25rem',textTransform:'uppercase'}}>Chat unavailable</strong>
                <p style={{margin:0,color:'rgba(247,241,231,0.84)'}}>{errorMessage}</p>
              </div>
            )}
            <div className={styles.chatFrame}>
              {scriptReady ? (
                <ChatAssistantPanel
                  initialThread={initialThread}
                  configuredApiUrl={configuredApiUrl}
                  configuredDomainKey={configuredDomainKey}
                  selectedText={selectedScope?.text ?? null}
                  pendingSelectionRequest={pendingSelectionRequest}
                  onSelectionRequestSent={(requestId) => {
                    setPendingSelectionRequest((current) => (current?.id === requestId ? null : current));
                  }}
                  instanceKey={instanceKey}
                  onError={(message) => {
                    setErrorMessage(message || 'ChatKit failed to initialize.');
                  }}
                />
              ) : (
                <div className={styles.loadingState}>
                  <strong>Loading assistant</strong>
                  <p>The chat surface is initializing.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}