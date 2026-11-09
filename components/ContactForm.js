'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDict } from '@/lib/i18n';
import { createContactSchema } from '@/lib/contact-validation';
import { submitContact } from '@/app/[locale]/contact/actions';

/**
 * Contact form (course: react-hook-form + zodResolver + Server Action).
 * Client validates with Zod via RHF; the Server Action validates again and emails via Web3Forms
 * using WEB3FORMS_ACCESS_KEY (server-only - no NEXT_PUBLIC key in the browser).
 */
// `email` is passed by ContactSection from db.json `contact` (single source, Finance §32).
export default function ContactForm({ locale = 'en', email }) {
  const t = getDict(locale).form;
  const FALLBACK_ERROR = t.failed;
  const [status, setStatus] = useState('idle'); // idle | success (errors come from RHF / submitError)
  const [submitError, setSubmitError] = useState('');

  const schema = useMemo(
    () =>
      createContactSchema({
        missing: t.missing,
        badEmail: t.badEmail,
        short: t.short,
      }),
    [t.missing, t.badEmail, t.short]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', message: '', botcheck: false },
  });

  async function onSubmit(values) {
    setSubmitError('');
    const result = await submitContact(locale, values);
    if (!result?.ok) {
      setSubmitError(result?.error || FALLBACK_ERROR);
      return;
    }
    setStatus('success');
    reset({ name: '', email: '', message: '', botcheck: false });
  }

  const labelClass = 'block text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft';
  const sheetClass = 'sheet-shadow relative bg-paper-light p-7 sm:p-10';
  const fieldErrorClass = 'mt-2 text-sm text-ink-soft';

  if (status === 'success') {
    return (
      <div className={sheetClass} role="status">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">{t.sent}</p>
        <p className="display mt-4 text-4xl">
          {t.thanks[0]}
          <em>{t.thanks[1]}</em>
          {t.thanks[2]}
        </p>
        <p className="mt-4 max-w-md text-ink-soft">
          {t.reply}{' '}
          <a href={`mailto:${email}`} className="link-stitch text-ink">
            {email}
          </a>
          .
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="btn-line mt-8">
          {t.another}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={sheetClass}>
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            {t.name}
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            className="field mt-1"
            placeholder={t.namePh}
            disabled={isSubmitting}
            {...register('name')}
          />
          {errors.name ? (
            <p role="alert" className={fieldErrorClass}>
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>
            {t.email}
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            className="field mt-1"
            placeholder={t.emailPh}
            disabled={isSubmitting}
            {...register('email')}
          />
          {errors.email ? (
            <p role="alert" className={fieldErrorClass}>
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-8">
        <label htmlFor="contact-message" className={labelClass}>
          {t.message}
        </label>
        <textarea
          id="contact-message"
          rows={6}
          className="field mt-1 min-h-40 resize-y"
          placeholder={t.messagePh}
          disabled={isSubmitting}
          {...register('message')}
        />
        {errors.message ? (
          <p role="alert" className={fieldErrorClass}>
            {errors.message.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot: real visitors never tick it (course-style spam guard). */}
      <input
        type="checkbox"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register('botcheck')}
      />

      <button type="submit" disabled={isSubmitting} className="btn-ink mt-10 w-full justify-center sm:w-auto">
        {isSubmitting ? t.sending : t.send}
        <span aria-hidden="true" className="nudge inline-block">
          →
        </span>
      </button>

      {submitError ? (
        <p role="alert" className="mt-6 border-l-2 border-thread pl-4 text-sm text-ink-soft">
          {submitError}{' '}
          <a href={`mailto:${email}`} className="link-stitch text-ink">
            {email}
          </a>
        </p>
      ) : null}
    </form>
  );
}
