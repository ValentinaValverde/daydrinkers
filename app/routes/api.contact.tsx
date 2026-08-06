import {data, type ActionFunctionArgs} from 'react-router';
import {sendEmail, escapeHtml} from '~/lib/resend';

export interface ContactActionData {
  ok: boolean;
  errors?: {
    name?: string;
    email?: string;
    message?: string;
    form?: string;
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_TO = 'hellodaydrinkers@gmail.com';

/** Resource route: POST /api/contact. Sends the submission to the business
 * inbox and an auto-reply confirmation to the visitor via Resend. */
export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return data<ContactActionData>({ok: false}, {status: 405});
  }

  const form = await request.formData();
  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const phone = String(form.get('phone') ?? '').trim();
  const message = String(form.get('message') ?? '').trim();
  // Honeypot — real users never fill this hidden field.
  const honeypot = String(form.get('company') ?? '').trim();

  // Silently accept bot submissions without sending anything.
  if (honeypot) {
    return data<ContactActionData>({ok: true});
  }

  const errors: NonNullable<ContactActionData['errors']> = {};
  if (!email) {
    errors.email = 'Please enter your email so we can reply.';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'That email address doesn’t look right.';
  }
  if (!message) {
    errors.message = 'Let us know what’s on your mind.';
  }
  if (Object.keys(errors).length > 0) {
    return data<ContactActionData>({ok: false, errors}, {status: 400});
  }

  const env = context.env;
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = env.CONTACT_FROM_EMAIL;
  const toEmail = env.CONTACT_TO_EMAIL || DEFAULT_TO;

  if (!apiKey || !fromEmail) {
    console.error(
      'Contact form: missing RESEND_API_KEY or CONTACT_FROM_EMAIL env var.',
    );
    return data<ContactActionData>(
      {
        ok: false,
        errors: {
          form: 'Sorry — our messaging is temporarily unavailable. Please email us directly.',
        },
      },
      {status: 500},
    );
  }

  const safeName = name ? escapeHtml(name) : '';
  const safeEmail = escapeHtml(email);
  const safePhone = phone ? escapeHtml(phone) : '';
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
  const displayName = name || email;

  const notificationHtml = `
    <h2>New contact form message</h2>
    <p><strong>Name:</strong> ${safeName || '—'}</p>
    <p><strong>Email:</strong> ${safeEmail}</p>
    <p><strong>Phone:</strong> ${safePhone || '—'}</p>
    <p><strong>Message:</strong></p>
    <p>${safeMessage}</p>
  `;
  const notificationText = [
    'New contact form message',
    `Name: ${name || '—'}`,
    `Email: ${email}`,
    `Phone: ${phone || '—'}`,
    '',
    message,
  ].join('\n');

  const autoReplyHtml = `
    <p>Hi ${safeName || 'there'},</p>
    <p>Thanks for reaching out to Daydrinkers — we got your message and someone
    from our crew will get back to you soon.</p>
    <p>In the meantime, come find your usual. ☕</p>
    <p>— The Daydrinkers team</p>
  `;
  const autoReplyText = [
    `Hi ${name || 'there'},`,
    '',
    'Thanks for reaching out to Daydrinkers — we got your message and someone from our crew will get back to you soon.',
    '',
    'In the meantime, come find your usual.',
    '',
    '— The Daydrinkers team',
  ].join('\n');

  try {
    // The business notification is the critical send.
    await sendEmail({
      apiKey,
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New message from ${displayName}`,
      html: notificationHtml,
      text: notificationText,
    });
  } catch (error) {
    console.error('Contact form: failed to send notification email.', error);
    return data<ContactActionData>(
      {
        ok: false,
        errors: {
          form: 'Something went wrong sending your message. Please try again in a moment.',
        },
      },
      {status: 502},
    );
  }

  // Auto-reply to the visitor is best-effort — never fail the request over it.
  try {
    await sendEmail({
      apiKey,
      from: fromEmail,
      to: email,
      subject: 'Thanks for reaching out to Daydrinkers!',
      html: autoReplyHtml,
      text: autoReplyText,
    });
  } catch (error) {
    console.error('Contact form: failed to send auto-reply email.', error);
  }

  return data<ContactActionData>({ok: true});
}
