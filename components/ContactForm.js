'use client';

import { useState } from 'react';

/**
 * Concept: Client Component with form state.
 * Submits straight from the browser to Web3Forms: its Cloudflare protection
 * blocks server-side requests (403 challenge), and access keys are public by design.
 * Falls back to the /api/contact Route Handler if no public key is set.
 */
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
const FALLBACK_ERROR = 'Could not send your message. Please try again or email me directly.';

function validate(name, email, message) {
  if (!name || !email || !message) return 'Please fill in name, email, and message.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
  if (message.length < 10) return 'Message is a bit short, please write a little more.';
  return '';
}

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [botcheck, setBotcheck] = useState(false); // honeypot: real visitors never tick it

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setError('');

    const fields = { name: name.trim(), email: email.trim(), message: message.trim() };
    const invalid = validate(fields.name, fields.email, fields.message);
    if (invalid) {
      setStatus('error');
      setError(invalid);
      return;
    }

    try {
      let ok;
      let data;
      if (ACCESS_KEY) {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: ACCESS_KEY,
            subject: `Portfolio contact from ${fields.name}`,
            from_name: fields.name,
            ...fields,
            botcheck,
          }),
        });
        data = await res.json().catch(() => ({}));
        ok = res.ok && data.success !== false;
      } else {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fields),
        });
        data = await res.json().catch(() => ({}));
        ok = res.ok && data.ok;
        data.message = data.error;
      }

      if (!ok) {
        setStatus('error');
        setError(data.message || FALLBACK_ERROR);
        return;
      }

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
      setError(FALLBACK_ERROR);
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

      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        checked={botcheck}
        onChange={(e) => setBotcheck(e.target.checked)}
      />

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
