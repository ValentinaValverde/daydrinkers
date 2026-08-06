/**
 * Minimal Resend client built on `fetch` so it runs on the Oxygen/workerd
 * runtime (no Node-only dependencies). Talks directly to the Resend REST API:
 * https://resend.com/docs/api-reference/emails/send-email
 */

export interface SendEmailParams {
  apiKey: string;
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  /** Address replies should go to — e.g. the visitor who filled out the form. */
  replyTo?: string;
}

export interface SendEmailResult {
  id: string;
}

export async function sendEmail(
  params: SendEmailParams,
): Promise<SendEmailResult> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: params.from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      reply_to: params.replyTo,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(
      `Resend request failed (${response.status} ${response.statusText}): ${detail}`,
    );
  }

  return (await response.json()) as SendEmailResult;
}

/** Escape a user-supplied string before interpolating it into email HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
