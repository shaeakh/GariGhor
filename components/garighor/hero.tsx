"use client";
import React from "react";
import { TRANSLATIONS, getImageUrl } from "@/lib/garighor-config";
import { Sparkles, ArrowDownRight } from "lucide-react";

interface HeroProps {
  lang: "en" | "bn";
  translations?: Record<string, string>;
}

export const Hero: React.FC<HeroProps> = ({ lang, translations }) => {
  const t = translations || TRANSLATIONS[lang];
  const heroBg = getImageUrl("/assets/images/backgrounds/hero_bg.png");

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-cover bg-center py-20 lg:py-28"
      style={{ backgroundImage: `url('${heroBg}')` }}
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-hero-overlay-start via-brand-hero-overlay-mid to-brand-hero-overlay-end" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-line bg-brand-orange-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-orange-600 shadow-sm sm:text-sm">
            <Sparkles className="h-4 w-4 text-brand-orange-500" />
            <span>{t["hero-eyebrow"]}</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-brand-ink sm:text-5xl sm:leading-tight">
            {t["hero-title"]}
          </h1>

          <p className="mt-4 text-lg text-brand-muted sm:text-xl">
            {t["hero-copy"]}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-orange-500 px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-brand-orange-600 hover:shadow-lg"
            >
              <span>{t["hero-btn"]}</span>
              <ArrowDownRight className="h-5 w-5" />
            </a>
          </div>

          <div className="mt-8 pt-4 border-t border-brand-line">
            <p className="text-sm font-medium text-brand-muted">
              {t["hero-note"]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
