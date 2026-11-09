'use server';

import { createContactSchema, CONTACT_ERRORS_EN } from '@/lib/contact-validation';
import { getDict, isLocale } from '@/lib/i18n';

/**
 * Server Action for the contact form (course: "use server" + Zod on the server).
 * Validates again on the server, then posts to Web3Forms with the server-only key.
 * @param {string} locale
 * @param {{ name: string, email: string, message: string, botcheck?: boolean }} raw
 */
export async function submitContact(locale, raw) {
  const lang = isLocale(locale) ? locale : 'en';
  const form = getDict(lang).form;
  const schema = createContactSchema({
    missing: form.missing,
    badEmail: form.badEmail,
    short: form.short,
  });

  const parsed = schema.safeParse({
    name: raw?.name ?? '',
    email: raw?.email ?? '',
    message: raw?.message ?? '',
    botcheck: Boolean(raw?.botcheck),
  });

  if (!parsed.success) {
    const first = parsed.error.issues?.[0]?.message || CONTACT_ERRORS_EN.missing;
    return { ok: false, error: first };
  }

  const { name, email, message, botcheck } = parsed.data;

  // Honeypot tripped: pretend success so bots get nothing useful.
  if (botcheck) {
    return { ok: true };
  }

  // Never show raw/developer errors to visitors (Finance §41): one translated message, details go to the server log
  const failed = form.failed || 'Could not send your message right now. Please try again or email me directly.';

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    console.error('[submitContact] WEB3FORMS_ACCESS_KEY is missing (add it to .env.local / Vercel env).');
    return { ok: false, error: failed };
  }

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Portfolio contact from ${name}`,
        from_name: name,
        email,
        message,
        to: 'erzaaduraku15@gmail.com',
      }),
    });

    const text = await res.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      // Web3Forms Cloudflare may answer server-side calls with an HTML challenge (403).
    }

    if (!res.ok || data.success === false) {
      console.error(
        `[submitContact] Web3Forms ${res.status} (${res.headers.get('content-type')}): ${(data.message || text).slice(0, 200)}`
      );
      // data.message stays in the log above, the visitor only gets the generic text
      return { ok: false, error: failed };
    }

    return { ok: true };
  } catch (err) {
    console.error('[submitContact] failed:', err?.message);
    return { ok: false, error: failed };
  }
}
