import { z } from 'zod';

/**
 * Contact form validation (course: Zod schemas + Server Actions / RHF).
 * Same rules as before: name/email/message required, email shape, message min length 10.
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_MESSAGE_LEN = 10;

/** English defaults (same wording the old /api/contact route used). */
export const CONTACT_ERRORS_EN = {
  missing: 'Please fill in name, email, and message.',
  badEmail: 'Please enter a valid email address.',
  short: 'Message is a bit short - please write a little more.',
};

/**
 * Build a Zod object schema with localized (or English) messages.
 * @param {{ missing: string, badEmail: string, short: string }} messages
 */
export function createContactSchema(messages = CONTACT_ERRORS_EN) {
  return z.object({
    name: z.string().trim().min(1, messages.missing),
    email: z
      .string()
      .trim()
      .min(1, messages.missing)
      .regex(EMAIL_RE, messages.badEmail),
    message: z
      .string()
      .trim()
      .min(1, messages.missing)
      .min(MIN_MESSAGE_LEN, messages.short),
    // Honeypot: real visitors leave this unchecked (false).
    botcheck: z.boolean().optional().default(false),
  });
}
