'use client';

import { useState } from 'react';

/**
 * Concept: Client Component with useState for form UI + fetch to Route Handler.
 * Posts to /api/contact (server keeps Web3Forms key private).
 * Blueprint fields: tall inputs, mono labels, 1px borders, blue focus.
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

  const fieldClass =
    'w-full border border-border bg-transparent px-4 py-3.5 text-[15px] leading-normal text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/50 focus:border-primary focus:shadow-[0_0_0_1px_var(--primary)] disabled:opacity-60';

  if (status === 'success') {
    return (
      <div className="border border-border p-8 sm:p-10">
        <p className="mono-caps text-primary">Message sent</p>
        <p className="mt-4 text-xl font-semibold tracking-tight text-foreground">
          Thank you — I got your note.
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          I will get back to you soon. You can also reach me anytime at{' '}
          <a
            href="mailto:erzaaduraku15@gmail.com"
            className="text-primary hover:underline"
          >
            erzaaduraku15@gmail.com
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-8 border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border border-border bg-card/30 p-6 sm:p-8"
      noValidate={false}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <label
            htmlFor="contact-name"
            className="mono-caps block text-muted-foreground"
          >
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
            className={fieldClass}
            placeholder="Your name"
            disabled={status === 'loading'}
          />
        </div>

        <div className="space-y-2.5">
          <label
            htmlFor="contact-email"
            className="mono-caps block text-muted-foreground"
          >
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
            className={fieldClass}
            placeholder="you@example.com"
            disabled={status === 'loading'}
          />
        </div>
      </div>

      <div className="mt-6 space-y-2.5">
        <label
          htmlFor="contact-message"
          className="mono-caps block text-muted-foreground"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${fieldClass} min-h-[10rem] resize-y`}
          placeholder="What would you like to build or talk about?"
          disabled={status === 'loading'}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-8 w-full bg-primary py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:brightness-110 disabled:opacity-60"
      >
        {status === 'loading' ? 'Sending…' : 'Send message'}
      </button>

      {status === 'error' ? (
        <p className="mt-4 border border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          {error}{' '}
          <a
            href="mailto:erzaaduraku15@gmail.com"
            className="text-primary hover:underline"
          >
            erzaaduraku15@gmail.com
          </a>
        </p>
      ) : null}
    </form>
  );
}