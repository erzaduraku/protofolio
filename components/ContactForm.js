'use client';

import { useState } from 'react';

/**
 * Concept: Client Component with useState for form UI + fetch to Route Handler.
 * Posts to /api/contact (server keeps the Web3Forms key private).
 * Styled as a lifted paper sheet with simple underlined fields.
 */
export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setStatus('error');
        setError(
          data.error ||
            'Could not send your message. Please try again or email me directly.'
        );
        return;
      }

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
      setError(
        'Could not send your message. Please try again or email me directly.'
      );
    }
  }

  const labelClass = 'block text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft';
  const sheetClass = 'sheet-shadow relative bg-paper-light p-7 sm:p-10';

  if (status === 'success') {
    return (
      <div className={sheetClass} role="status">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">Message sent</p>
        <p className="display mt-4 text-4xl">
          Thank you — I got your <em>note</em>.
        </p>
        <p className="mt-4 max-w-md text-ink-soft">
          I will get back to you soon. You can also reach me anytime at{' '}
          <a href="mailto:erzaaduraku15@gmail.com" className="link-stitch text-ink">
            erzaaduraku15@gmail.com
          </a>
          .
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="btn-line mt-8">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={sheetClass} noValidate={false}>
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field mt-1"
            placeholder="Your name"
            disabled={status === 'loading'}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field mt-1"
            placeholder="you@example.com"
            disabled={status === 'loading'}
          />
        </div>
      </div>

      <div className="mt-8">
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="field mt-1 min-h-40 resize-y"
          placeholder="What would you like to build or talk about?"
          disabled={status === 'loading'}
        />
      </div>

      <button type="submit" disabled={status === 'loading'} className="btn-ink mt-10 w-full justify-center sm:w-auto">
        {status === 'loading' ? 'Sending…' : 'Send message'}
        <span aria-hidden="true" className="nudge inline-block">→</span>
      </button>

      {status === 'error' ? (
        <p role="alert" className="mt-6 border-l-2 border-thread pl-4 text-sm text-ink-soft">
          {error}{' '}
          <a href="mailto:erzaaduraku15@gmail.com" className="link-stitch text-ink">
            erzaaduraku15@gmail.com
          </a>
        </p>
      ) : null}
    </form>
  );
}
