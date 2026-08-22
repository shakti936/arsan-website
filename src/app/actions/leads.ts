"use server";

import type { z } from "zod";
import {
  candidateInquirySchema,
  clientInquirySchema,
  type LeadFormState,
  MIN_SUBMIT_MS,
  newsletterSchema,
} from "@/lib/lead-schema";

/**
 * UI-first build (SOP D-036): validation, spam gates, and states are
 * production-final; delivery is stubbed until Drew + Marianna approve
 * the forms. The approved GHL design (upsert -> additive tags -> fields
 * -> note; n8n failure webhook) plugs in at deliverLead() only.
 *
 * The newsletter goes through the same door on purpose. A second delivery
 * path would be a second thing to wire, a second thing to fail quietly, and
 * a second place a subscriber could land outside the CRM.
 */
type LeadKind = "client" | "candidate" | "newsletter";

async function deliverLead(
  kind: LeadKind,
  _data: Record<string, unknown>,
): Promise<void> {
  // GHL wiring lands here. Metadata-only log until then (no PII).
  console.info(`[lead] validated ${kind} inquiry (delivery stubbed, D-036)`);
}

function spamChecks(loadedAt: number): boolean {
  const elapsed = Date.now() - loadedAt;
  return Number.isFinite(elapsed) && elapsed >= MIN_SUBMIT_MS;
}

async function handle<S extends z.ZodType>(
  schema: S,
  kind: LeadKind,
  formData: FormData,
): Promise<LeadFormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      // Honeypot failures return a fake success — bots learn nothing.
      if (field === "website") return { status: "success" };
      fieldErrors[field] ??= issue.message;
    }
    return { status: "error", fieldErrors };
  }

  const data = parsed.data as { loadedAt: number } & Record<string, unknown>;
  if (!spamChecks(data.loadedAt)) return { status: "success" };

  const { website: _hp, loadedAt: _ts, ...lead } = data;
  await deliverLead(kind, lead);
  return { status: "success" };
}

export async function submitClientInquiry(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  return handle(clientInquirySchema, "client", formData);
}

export async function submitCandidateInquiry(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  return handle(candidateInquirySchema, "candidate", formData);
}

export async function subscribeToInsights(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  return handle(newsletterSchema, "newsletter", formData);
}
