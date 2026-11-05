'use client';

import { useEffect, useRef, useState } from 'react';
import { GREETING, MAX_RETRIES } from './constants';

/** Chat messages + streaming fetch to /api/chat (rate-limit retries included). */
export default function useChatApi({ locale, t, inputRef, listRef }) {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wait, setWait] = useState(null); // { history, attempt, left } while counting down to a resend
  const [rateFailed, setRateFailed] = useState(null); // history to resend by hand after MAX_RETRIES
  const busy = loading || Boolean(wait);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, listRef]);

  async function send(text) {
    const question = text.trim().slice(0, 1000);
    if (!question || busy) return;
    const history = [...messages.filter((m) => m !== GREETING), { role: 'user', content: question }];
    setMessages([GREETING, ...history]);
    setInput('');
    request(history, 0);
  }

  // Sends the conversation. A rate limit (429 "rate_limited") waits retryAfter seconds and resends
  // the same history (the question is shown once), up to MAX_RETRIES times.
  async function request(history, attempt) {
    setError('');
    setRateFailed(null);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, locale }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429 && data.error === 'rate_limited') {
          if (attempt < MAX_RETRIES) {
            const seconds = Math.min(60, Math.max(1, Math.ceil(Number(data.retryAfter) || 20)));
            setWait({ history, attempt: attempt + 1, left: seconds });
          } else {
            setRateFailed(history);
          }
          return;
        }
        throw new Error(data.error || t.genericError);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = '';
      setMessages((m) => [...m, { role: 'assistant', content: '' }]);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages((m) => [...m.slice(0, -1), { role: 'assistant', content: reply }]);
      }
      if (!reply) throw new Error(t.empty);
    } catch (err) {
      setMessages((m) => (m.at(-1)?.role === 'assistant' && !m.at(-1).content ? m.slice(0, -1) : m));
      setError(err.message);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  // Live countdown; at zero the same question is sent again.
  useEffect(() => {
    if (!wait) return undefined;
    const id = setTimeout(() => {
      if (wait.left <= 1) {
        setWait(null);
        request(wait.history, wait.attempt);
      } else {
        setWait({ ...wait, left: wait.left - 1 });
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [wait]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    messages,
    input,
    setInput,
    loading,
    error,
    wait,
    rateFailed,
    busy,
    send,
    request,
  };
}
