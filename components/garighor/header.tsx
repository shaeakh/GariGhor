"use client";
import React from "react";
import { TRANSLATIONS, GARI_GHOR_CONFIG } from "@/lib/garighor-config";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Globe } from "lucide-react";

interface HeaderProps {
  lang: "en" | "bn";
  theme: "light" | "dark";
  onToggleLang: () => void;
  onToggleTheme: () => void;
  translations?: Record<string, string>;
  brandName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  theme,
  onToggleLang,
  onToggleTheme,
  translations,
  brandName,
}) => {
  const t = translations || TRANSLATIONS[lang];
  const brand = brandName || GARI_GHOR_CONFIG.brandName;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-brand-line bg-brand-header-bg px-4 py-3.5 backdrop-blur-md sm:px-8 lg:px-12">
      <a
        href="#top"
        className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-brand-ink transition-opacity hover:opacity-90"
        aria-label="GariGhor home"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange-500 font-extrabold text-white shadow-sm">
          G
        </span>
        <span className="text-xl font-bold tracking-tight">{brand}</span>
      </a>

      <div className="flex items-center gap-6">
        <nav className="hidden items-center gap-6 md:flex" aria-label="Site sections">
          <a
            href="#services"
            className="text-sm font-medium text-brand-muted transition-colors hover:text-brand-orange-500"
          >
            {t["nav-services"]}
          </a>
          <a
            href="#order"
            className="text-sm font-medium text-brand-muted transition-colors hover:text-brand-orange-500"
          >
            {t["nav-order"]}
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-brand-muted transition-colors hover:text-brand-orange-500"
          >
            {t["nav-faq"]}
          </a>
        </nav>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 border-brand-line bg-brand-card-bg text-brand-ink hover:bg-brand-orange-50"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <>
                <Moon className="h-4 w-4 text-brand-orange-600" />
                <span className="hidden sm:inline">{t["theme-toggle-dark"]}</span>
              </>
            ) : (
              <>
                <Sun className="h-4 w-4 text-brand-orange-500" />
                <span className="hidden sm:inline">{t["theme-toggle-light"]}</span>
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleLang}
            className="flex items-center gap-1.5 border border-brand-line bg-brand-orange-100 font-semibold text-brand-orange-700 hover:bg-brand-orange-50"
            aria-label="Switch language"
          >
            <Globe className="h-4 w-4" />
            <span>{lang === "en" ? "BN" : "EN"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
