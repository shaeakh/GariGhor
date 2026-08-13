"use client";
import React, { useState } from "react";
import { TRANSLATIONS } from "@/lib/garighor-config";
import { Plus, Minus } from "lucide-react";

interface FAQProps {
  lang: "en" | "bn";
  translations?: Record<string, string>;
}

export const FAQ: React.FC<FAQProps> = ({ lang, translations }) => {
  const t = translations || TRANSLATIONS[lang];
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqList = [
    {
      q: t["faq-q-1"],
      a: t["faq-a-1"],
    },
    {
      q: t["faq-q-2"],
      a: t["faq-a-2"],
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 bg-brand-bg border-t border-brand-line">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-orange-600">
            {t["nav-faq"]}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-ink sm:text-4xl">
            {t["faq-title"]}
          </h2>
        </div>

        <div className="space-y-4">
          {faqList.map((item, index) => {
            const isOpen = Boolean(openItems[index]);
            return (
              <article
                key={index}
                className="overflow-hidden rounded-xl border border-brand-line bg-brand-card-bg transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="flex w-full items-center justify-between p-6 text-left font-bold text-brand-ink hover:text-brand-orange-600 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg">{item.q}</span>
                  <span className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange-50 text-brand-orange-600">
                    {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-brand-muted leading-relaxed border-t border-brand-line/50 pt-4">
                    {item.a}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
