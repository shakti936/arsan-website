"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import {
  submitCandidateInquiry,
  submitClientInquiry,
} from "@/app/actions/leads";
import { type LeadFormState, SERVICE_VALUES } from "@/lib/lead-schema";
import { Honeypot, SelectField, TextAreaField, TextField } from "./field";

const INITIAL: LeadFormState = { status: "idle" };

export function LeadForm({ kind }: { kind: "client" | "candidate" }) {
  const t = useTranslations("forms");
  const action =
    kind === "client" ? submitClientInquiry : submitCandidateInquiry;
  const [state, formAction, pending] = useActionState(action, INITIAL);
  // Client-side mount time — feeds the min-time-to-submit spam gate.
  const [loadedAt] = useState(() => Date.now());

  const err = (field: string) => {
    const key = state.fieldErrors?.[field];
    return key ? t(`errors.${key}`) : undefined;
  };

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="border-l-2 border-brass-500 bg-cream-50 p-8"
      >
        <p className="font-display text-display-md font-semibold text-navy-900">
          {t("success.heading")}
        </p>
        <p className="mt-3 max-w-[52ch] text-base text-navy-800">
          {t(`success.${kind}Body`)}
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      className="relative flex max-w-2xl flex-col gap-5"
    >
      <Honeypot />
      <input
        type="hidden"
        name="loadedAt"
        value={loadedAt}
        suppressHydrationWarning
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="name"
          label={t("labels.name")}
          required
          autoComplete="name"
          error={err("name")}
        />
        <TextField
          name="email"
          type="email"
          label={t("labels.email")}
          required
          autoComplete="email"
          error={err("email")}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="phone"
          type="tel"
          label={t("labels.phone")}
          autoComplete="tel"
          error={err("phone")}
        />
        {kind === "client" ? (
          <TextField
            name="company"
            label={t("labels.company")}
            required
            autoComplete="organization"
            error={err("company")}
          />
        ) : (
          <TextField
            name="currentTitle"
            label={t("labels.currentTitle")}
            required
            autoComplete="organization-title"
            error={err("currentTitle")}
          />
        )}
      </div>
      {kind === "client" && (
        <SelectField
          name="service"
          label={t("labels.service")}
          placeholder={t("selectPlaceholder")}
          required
          error={err("service")}
          options={SERVICE_VALUES.map((value) => ({
            value,
            label: t(`services.${value}`),
          }))}
        />
      )}
      <TextAreaField
        name="message"
        label={t(`labels.${kind}Message`)}
        required
        error={err("message")}
      />

      <button
        type="submit"
        disabled={pending}
        className="eyebrow mt-2 inline-flex items-center justify-center self-start bg-brass-500 px-8 py-4 text-navy-950 transition-colors hover:bg-brass-400 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
      >
        {pending ? t("submitting") : t(`submit.${kind}`)}
      </button>
      {kind === "candidate" && (
        <p className="text-sm text-navy-700">{t("confidentialNote")}</p>
      )}
    </form>
  );
}
