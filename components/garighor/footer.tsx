"use client";
import React, { useEffect, useState } from "react";
import { GARI_GHOR_CONFIG, TRANSLATIONS } from "@/lib/garighor-config";
import { Phone, MapPin } from "lucide-react";

interface FooterProps {
  lang: "en" | "bn";
  config?: typeof GARI_GHOR_CONFIG;
  translations?: Record<string, string>;
}

export const Footer: React.FC<FooterProps> = ({ lang, config, translations }) => {
  const t = translations || TRANSLATIONS[lang];
  const cfg = config || GARI_GHOR_CONFIG;
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-brand-line bg-brand-bg py-12 pb-28 lg:pb-12 text-brand-muted">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange-500 font-extrabold text-white">
                G
              </span>
              <span className="text-xl font-bold tracking-tight text-brand-ink">
                {cfg.brandName}
              </span>
            </div>
            <p className="mt-2 text-sm text-brand-muted">
              {t["footer-desc"]}
            </p>
          </div>

          <div className="space-y-2 text-sm font-medium">
            <div className="flex items-center gap-2 text-brand-ink">
              <Phone className="h-4 w-4 text-brand-orange-500 shrink-0" />
              <span>
                {lang === "en" ? `Phone: ${cfg.displayPhone}` : `ফোন: ${cfg.displayPhone}`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-brand-muted">
              <MapPin className="h-4 w-4 text-brand-orange-500 shrink-0" />
              <span>{t["footer-area"] || cfg.serviceArea}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-brand-line text-xs text-brand-muted text-center md:text-left">
          <p>
            &copy; {year} {t["footer-rights"]}
          </p>
        </div>
      </div>
    </footer>
  );
};
