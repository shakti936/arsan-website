"use client";

import { useTranslations } from "next-intl";
import { useActionState, useId, useState } from "react";
import { subscribeToInsights } from "@/app/actions/leads";
import { Honeypot } from "@/components/forms/field";
import { type LeadFormState, MIN_SUBMIT_MS } from "@/lib/lead-schema";

const INITIAL: LeadFormState = { status: "idle" };

/**
 * "Stay informed" band from refs/dirA-article-*.png — copy on the left, one
 * email field and a brass button on the right.
 *
 * Same server action as the inquiry forms, so a subscriber lands in the same
 * place through the same validation and the same spam gates. Delivery is
 * stubbed with the rest of them until GHL is wired (SOP D-036); what is
 * production-final here is the validation, the honeypot, the timing gate and
 * every state the visitor can see.
 *
 * The success message replaces the form rather than sitting beside it. A
 * cleared input next to "thanks" reads as a form waiting to be filled again.
 */
export function NewsletterBand() {
  const t = useTranslations("newsletter");
  const [state, formAction, pending] = useActionState(
    subscribeToInsights,
    INITIAL,
  );
  const [loadedAt] = useState(() => Date.now());
  const emailId = useId();
  const errorId = useId();
  const errorKey = state.fieldErrors?.email;

  return (
    <section className="border-y border-cream-100 bg-white-warm py-14">
      <div className="mx-auto grid w-full max-w-page gap-8 px-6 sm:px-10 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div>
          <h2 className="font-display text-display-md font-semibold text-navy-900">
            {t("heading")}
          </h2>
          <div aria-hidden="true" className="mt-3 h-0.5 w-10 bg-brass-500" />
          <p className="mt-5 max-w-[46ch] text-base text-navy-800">
            {t("body")}
          </p>
        </div>

        {state.status === "success" ? (
          <p
            role="status"
            className="border-l-2 border-brass-500 bg-cream-50 p-6 text-base text-navy-900"
          >
            {t("success")}
          </p>
        ) : (
          <form action={formAction} noValidate className="flex flex-col gap-3">
            <Honeypot />
            <input type="hidden" name="loadedAt" value={loadedAt} />
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor={emailId} className="sr-only">
                {t("label")}
              </label>
              <input
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={t("placeholder")}
                aria-invalid={errorKey ? true : undefined}
                aria-describedby={errorKey ? errorId : undefined}
                className="min-h-12 flex-1 border border-cream-100 bg-cream-50 px-4 text-base text-navy-900 placeholder:text-navy-700/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brass-500 aria-invalid:border-red-800"
              />
              <button
                type="submit"
                disabled={pending}
                className="eyebrow min-h-12 whitespace-nowrap bg-brass-500 px-7 text-navy-950 transition-colors hover:bg-brass-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300 disabled:opacity-70"
              >
                {pending ? t("pending") : t("cta")}
              </button>
            </div>
            {errorKey && (
              <p id={errorId} className="text-sm text-red-800">
                {t(`errors.${errorKey}`)}
              </p>
            )}
            <p className="text-sm text-navy-700/80">{t("privacy")}</p>
          </form>
        )}
      </div>
      {/* the timing gate needs a floor the server can trust; this only
          documents it next to the field it protects */}
      <span hidden data-min-submit-ms={MIN_SUBMIT_MS} />
    </section>
  );
}
