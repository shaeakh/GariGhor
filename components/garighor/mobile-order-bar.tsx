"use client";
import React from "react";
import { SERVICES_DATA, TRANSLATIONS, ServiceItem } from "@/lib/garighor-config";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

interface MobileOrderBarProps {
  lang: "en" | "bn";
  selectedIndex: number | null;
  onPlaceOrder: () => void;
  services?: ServiceItem[];
  translations?: Record<string, string>;
}

export const MobileOrderBar: React.FC<MobileOrderBarProps> = ({
  lang,
  selectedIndex,
  onPlaceOrder,
  services,
  translations,
}) => {
  const t = translations || TRANSLATIONS[lang];
  const servicesList = services || SERVICES_DATA;
  const selectedService: ServiceItem | null =
    selectedIndex !== null && selectedIndex < servicesList.length
      ? servicesList[selectedIndex]
      : null;

  return (
    <aside
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-brand-line bg-brand-mobile-bar-bg px-4 py-3 shadow-lg backdrop-blur-lg lg:hidden"
      aria-label="Mobile order summary"
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange-600">
            {t["mobile-selected-service"]}
          </p>
          <p className="truncate text-sm font-bold text-brand-ink">
            {selectedService ? selectedService.titles[lang] : t["summary-no-selection"]}
          </p>
          <p className="text-xs font-semibold text-brand-orange-600">
            {selectedService ? selectedService.price : t["summary-select-wash"]}
          </p>
        </div>

        <Button
          onClick={onPlaceOrder}
          disabled={!selectedService}
          size="default"
          className="shrink-0 bg-brand-orange-500 text-white font-bold hover:bg-brand-orange-600 disabled:opacity-50 shadow-sm"
        >
          <ShoppingBag className="mr-1.5 h-4 w-4" />
          <span>{t["summary-place-order"]}</span>
        </Button>
      </div>
    </aside>
  );
};
