"use client";
import React from "react";
import { TRANSLATIONS } from "@/lib/garighor-config";
import { ShieldCheck, Check } from "lucide-react";

interface HygieneProps {
  lang: "en" | "bn";
  translations?: Record<string, string>;
}

export const Hygiene: React.FC<HygieneProps> = ({ lang, translations }) => {
  const t = translations || TRANSLATIONS[lang];

  return (
    <section className="py-16 sm:py-24 bg-brand-bg border-t border-brand-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-brand-line bg-[url('/assets/images/backgrounds/hygiene_bg.png')] bg-cover bg-center shadow-lg">
          <div className="bg-gradient-to-br from-brand-hygiene-overlay-start to-brand-hygiene-overlay-end p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-line bg-brand-orange-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-orange-600">
                  <ShieldCheck className="h-4 w-4 text-brand-orange-500" />
                  <span>{t["hygiene-eyebrow"]}</span>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight text-brand-ink sm:text-4xl">
                  {t["hygiene-title"]}
                </h2>
                <p className="mt-4 text-base text-brand-muted leading-relaxed">
                  {t["hygiene-desc"]}
                </p>
              </div>

              <div className="lg:col-span-6">
                <ul className="space-y-3">
                  {["hygiene-item-1", "hygiene-item-2", "hygiene-item-3", "hygiene-item-4"].map(
                    (itemKey) => (
                      <li
                        key={itemKey}
                        className="flex items-center gap-3.5 rounded-xl border border-brand-hygiene-list-border bg-brand-hygiene-list-bg p-4 backdrop-blur-md shadow-sm"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-orange-500 text-white font-bold">
                          <Check className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-semibold text-brand-ink">
                          {(t as Record<string, string>)[itemKey] || itemKey}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
