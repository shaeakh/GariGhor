"use client";
import React from "react";
import { TRANSLATIONS } from "@/lib/garighor-config";

interface StepsProps {
  lang: "en" | "bn";
  translations?: Record<string, string>;
}

export const Steps: React.FC<StepsProps> = ({ lang, translations }) => {
  const t = translations || TRANSLATIONS[lang];

  return (
    <section id="order" className="py-16 sm:py-24 bg-brand-bg border-t border-brand-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-orange-600">
            {t["steps-eyebrow"]}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-ink sm:text-4xl">
            {t["steps-title"]}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <article className="relative flex flex-col rounded-xl border border-brand-line bg-brand-card-bg p-8 shadow-sm transition-all hover:shadow-md">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-500 text-xl font-extrabold text-white shadow-sm">
              1
            </span>
            <h3 className="text-lg font-bold text-brand-ink">
              {t["order-step1-title"]}
            </h3>
            <p className="mt-2 text-sm text-brand-muted leading-relaxed">
              {t["order-step1-desc"]}
            </p>
          </article>

          {/* Step 2 */}
          <article className="relative flex flex-col rounded-xl border border-brand-line bg-brand-card-bg p-8 shadow-sm transition-all hover:shadow-md">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-500 text-xl font-extrabold text-white shadow-sm">
              2
            </span>
            <h3 className="text-lg font-bold text-brand-ink">
              {t["order-step2-title"]}
            </h3>
            <p className="mt-2 text-sm text-brand-muted leading-relaxed">
              {t["order-step2-desc"]}
            </p>
          </article>

          {/* Step 3 */}
          <article className="relative flex flex-col rounded-xl border border-brand-line bg-brand-card-bg p-8 shadow-sm transition-all hover:shadow-md">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-500 text-xl font-extrabold text-white shadow-sm">
              3
            </span>
            <h3 className="text-lg font-bold text-brand-ink">
              {t["order-step3-title"]}
            </h3>
            <p className="mt-2 text-sm text-brand-muted leading-relaxed">
              {t["order-step3-desc"]}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};
