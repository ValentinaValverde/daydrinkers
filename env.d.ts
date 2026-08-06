/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  interface Env {
    SEASONAL_COLLECTION_HANDLE?: string;
    /** Resend API key for transactional email (contact form). */
    RESEND_API_KEY?: string;
    /** Verified Resend sender, e.g. "Daydrinkers <hello@daydrinkers.com>". */
    CONTACT_FROM_EMAIL?: string;
    /** Inbox that receives contact-form submissions. */
    CONTACT_TO_EMAIL?: string;
  }
}
