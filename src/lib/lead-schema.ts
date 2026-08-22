import { z } from "zod";

/**
 * Validation for both public forms. Error messages are KEYS resolved
 * through the "forms.errors" message namespace so they localize.
 */
const base = {
  name: z.string().trim().min(2, "name").max(120, "name"),
  email: z.string().trim().email("email").max(200, "email"),
  phone: z
    .string()
    .trim()
    .max(30, "phone")
    .regex(/^[+\d][\d\s().-]{6,}$/, "phone")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(10, "message").max(4000, "message"),
  // Spam gates — not user-visible
  website: z.literal(""), // honeypot: real users never fill it
  loadedAt: z.coerce.number(),
};

export const SERVICE_VALUES = [
  "executive-search",
  "mexico-advisory",
  "leadership-solutions",
  "other",
] as const;

export const clientInquirySchema = z.object({
  ...base,
  company: z.string().trim().min(2, "company").max(200, "company"),
  service: z.enum(SERVICE_VALUES),
});

export const candidateInquirySchema = z.object({
  ...base,
  currentTitle: z
    .string()
    .trim()
    .min(2, "currentTitle")
    .max(160, "currentTitle"),
});

/**
 * The insights newsletter. Same honeypot and same minimum-time gate as the
 * inquiry forms — an email field on every article page is the most scraped
 * surface on the site, and a subscribe box with no gate becomes a list of
 * bots inside a week.
 */
export const newsletterSchema = z.object({
  email: base.email,
  website: base.website,
  loadedAt: base.loadedAt,
});

export type LeadFormState = {
  status: "idle" | "success" | "error";
  /** field name -> error message KEY under forms.errors */
  fieldErrors?: Record<string, string>;
};

/** Submissions faster than this are bots. */
export const MIN_SUBMIT_MS = 3000;
