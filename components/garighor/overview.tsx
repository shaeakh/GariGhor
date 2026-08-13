"use client";
import React from "react";
import { TRANSLATIONS } from "@/lib/garighor-config";
import { CheckCircle2, XCircle, ShieldCheck, AlertCircle } from "lucide-react";

interface OverviewProps {
  lang: "en" | "bn";
  translations?: Record<string, string>;
}

export const Overview: React.FC<OverviewProps> = ({ lang, translations }) => {
  const t = translations || TRANSLATIONS[lang];

  return (
    <section className="py-16 sm:py-24 bg-brand-bg border-t border-brand-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-orange-600">
            {t["services-eyebrow"]}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-ink sm:text-4xl">
            {t["overview-title"]}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* What's Included */}
          <article className="rounded-xl border border-brand-line bg-brand-card-bg p-6 shadow-sm">
            <div className="flex items-center gap-2 text-brand-orange-600 font-bold mb-4">
              <CheckCircle2 className="h-5 w-5 text-brand-orange-500 shrink-0" />
              <h3 className="text-base text-brand-ink font-bold">{t["overview-inc-title"]}</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-brand-muted">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-500 mt-2 shrink-0" />
                <span>{t["overview-inc-1"]}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-500 mt-2 shrink-0" />
                <span>{t["overview-inc-2"]}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-500 mt-2 shrink-0" />
                <span>{t["overview-inc-3"]}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-500 mt-2 shrink-0" />
                <span>{t["overview-inc-4"]}</span>
              </li>
            </ul>
          </article>

          {/* What's Excluded */}
          <article className="rounded-xl border border-brand-line bg-brand-card-bg p-6 shadow-sm">
            <div className="flex items-center gap-2 text-brand-orange-600 font-bold mb-4">
              <XCircle className="h-5 w-5 text-brand-orange-500 shrink-0" />
              <h3 className="text-base text-brand-ink font-bold">{t["overview-exc-title"]}</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-brand-muted">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-500 mt-2 shrink-0" />
                <span>{t["overview-exc-1"]}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-500 mt-2 shrink-0" />
                <span>{t["overview-exc-2"]}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-500 mt-2 shrink-0" />
                <span>{t["overview-exc-3"]}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-500 mt-2 shrink-0" />
                <span>{t["overview-exc-4"]}</span>
              </li>
            </ul>
          </article>

          {/* What to Expect */}
          <article className="rounded-xl border border-brand-line bg-brand-card-bg p-6 shadow-sm">
            <div className="flex items-center gap-2 text-brand-orange-600 font-bold mb-4">
              <ShieldCheck className="h-5 w-5 text-brand-orange-500 shrink-0" />
              <h3 className="text-base text-brand-ink font-bold">{t["overview-exp-title"]}</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-brand-muted">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-500 mt-2 shrink-0" />
                <span>{t["overview-exp-1"]}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-500 mt-2 shrink-0" />
                <span>{t["overview-exp-2"]}</span>
              </li>
            </ul>
          </article>

          {/* Keep in Mind - Highlight Card */}
          <article className="rounded-xl border border-brand-orange-500/30 bg-brand-orange-50 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-brand-orange-700 font-bold mb-4">
              <AlertCircle className="h-5 w-5 text-brand-orange-600 shrink-0" />
              <h3 className="text-base text-brand-ink font-bold">{t["overview-keep-title"]}</h3>
            </div>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              {t["overview-keep-desc"]}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};
