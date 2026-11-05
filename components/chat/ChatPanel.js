'use client';

import { AnimatePresence, motion } from 'framer-motion';
import ChatMarkdown from '../ChatMarkdown';

/** Open chat dialog: message list, rate-limit UI, and input form. */
export default function ChatPanel({
  open,
  onClose,
  panelRef,
  panelStyle,
  motionProps,
  t,
  listRef,
  messages,
  loading,
  wait,
  rateFailed,
  error,
  busy,
  send,
  request,
  input,
  setInput,
  inputRef,
  launcherRef,
}) {
  const onlyGreeting = messages.length === 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          ref={panelRef}
          key="chat"
          role="dialog"
          aria-modal="false"
          aria-labelledby="chat-title"
          style={panelStyle}
          className="fixed inset-x-0 bottom-0 z-70 flex max-h-[85vh] flex-col border-t-2 border-thread bg-ink text-paper shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-96 sm:max-h-[min(36rem,75vh)] sm:rounded-sm sm:border-t-2"
          {...motionProps}
        >
          <header className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
            <div>
              <h2 id="chat-title" className="font-display text-2xl italic leading-tight">
                {t.title}
              </h2>
              <p className="mt-1 text-xs text-paper/70">{t.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                launcherRef.current?.focus();
              }}
              className="-mr-1 rounded-sm px-2 py-1 text-xl leading-none text-paper/80 hover:text-paper focus-visible:outline-2 focus-visible:outline-chalk"
              aria-label={t.close}
            >
              ×
            </button>
          </header>

          <div
            ref={listRef}
            className="chat-scroll min-w-0 flex-1 space-y-3 overflow-x-hidden overflow-y-auto px-5 py-2"
            aria-live="polite"
            aria-busy={loading}
            data-lenis-prevent
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[88%] min-w-0 text-[0.95rem] leading-relaxed wrap-anywhere ${
                  m.role === 'user'
                    ? 'ml-auto rounded-sm bg-paper px-3 py-2 text-ink'
                    : 'border-l-2 border-thread pl-3 text-paper'
                }`}
              >
                <span className="sr-only">{m.role === 'user' ? t.you : t.assistant}</span>
                {m.role === 'user' ? (
                  <span className="whitespace-pre-wrap">{m.content}</span>
                ) : (
                  <ChatMarkdown text={m.greeting ? t.greeting : m.content} />
                )}
              </div>
            ))}
            {loading && !wait && messages.at(-1)?.role === 'user' && (
              <p className="border-l-2 border-thread pl-3 text-sm italic text-paper/70">{t.thinking}</p>
            )}
            {wait && (
              <p role="status" className="border-l-2 border-paper/40 pl-3 text-sm italic text-paper/80">
                {t.rateWait(wait.left)}
              </p>
            )}
            {rateFailed && !wait && (
              <div role="status" className="border-l-2 border-paper/40 pl-3 text-sm text-paper/80">
                <p className="italic">{t.rateFinal}</p>
                <button
                  type="button"
                  onClick={() => request(rateFailed, 0)}
                  disabled={busy}
                  className="mt-2 rounded-full border border-paper/30 px-3 py-1 text-sm text-paper hover:border-chalk hover:text-chalk disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-chalk"
                >
                  {t.retry}
                </button>
              </div>
            )}
            {error && (
              <p role="alert" className="rounded-sm bg-chalk px-3 py-2 text-sm text-ink">
                {error}
              </p>
            )}
            {onlyGreeting && (
              <ul className="flex flex-wrap gap-2 pt-1" aria-label={t.suggested}>
                {t.suggestions.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-paper/30 px-3 py-1.5 text-left text-sm text-paper hover:border-chalk hover:text-chalk focus-visible:outline-2 focus-visible:outline-chalk"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 border-t border-paper/15 px-4 py-3"
          >
            <label htmlFor="chat-input" className="sr-only">
              {t.question}
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              rows={1}
              maxLength={1000}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder={t.placeholder}
              className="max-h-28 min-h-10 flex-1 resize-none rounded-sm bg-paper px-3 py-2 text-[0.95rem] text-ink placeholder:text-ink/50 focus:outline-2 focus:outline-chalk"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="h-10 rounded-sm bg-thread px-4 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-chalk"
            >
              {t.send}
            </button>
          </form>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
