"use client";
import React from "react";
import Image from "next/image";
import { SERVICES_DATA, TRANSLATIONS, ServiceItem } from "@/lib/garighor-config";
import { Button } from "@/components/ui/button";
import { Check, ShoppingBag, Car } from "lucide-react";

interface ServicesProps {
  lang: "en" | "bn";
  selectedIndex: number | null;
  onSelectService: (index: number) => void;
  onPlaceOrder: () => void;
  services?: ServiceItem[];
  translations?: Record<string, string>;
}

export const Services: React.FC<ServicesProps> = ({
  lang,
  selectedIndex,
  onSelectService,
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
    <section id="services" className="py-16 sm:py-24 bg-brand-bg">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-12 max-w-2xl">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-orange-600">
            {t["services-eyebrow"]}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-ink sm:text-4xl">
            {t["services-title"]}
          </h2>
          <p className="mt-3 text-base text-brand-muted sm:text-lg">
            {t["services-copy"]}
          </p>
        </div>

        {/* Layout Grid: Services + Desktop Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Services Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {servicesList.map((service, index) => {
              const isSelected = selectedIndex === index;
              return (
                <article
                  key={service.id || index}
                  onClick={() => onSelectService(index)}
                  className={`group relative flex flex-col overflow-hidden rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-brand-orange-500 bg-brand-card-bg ring-2 ring-brand-orange-500 shadow-md"
                      : "border-brand-line bg-brand-card-bg hover:border-brand-orange-500/50 hover:shadow-md"
                  }`}
                >
                  <div className="relative h-48 w-full overflow-hidden bg-brand-orange-100/30">
                    <Image
                      src={service.image}
                      alt={service.altText || service.titles[lang]}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold text-brand-ink">
                          {service.titles[lang]}
                        </h3>
                        <span className="shrink-0 rounded-md bg-brand-orange-100 px-2.5 py-1 text-sm font-bold text-brand-orange-700">
                          {service.price}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-brand-muted leading-relaxed">
                        {service.examples[lang]}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between pt-3 border-t border-brand-line">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-green">
                          <Check className="h-4 w-4" />
                          {t["label-selected"]}
                        </span>
                      ) : (
                        <span className="text-xs text-brand-muted">
                          {t["services-eyebrow"]}
                        </span>
                      )}

                      <Button
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectService(index);
                        }}
                        className={
                          isSelected
                            ? "bg-brand-orange-500 text-white hover:bg-brand-orange-600 font-semibold"
                            : "border-brand-line bg-brand-card-bg text-brand-ink hover:bg-brand-orange-50 hover:text-brand-orange-600 font-medium"
                        }
                      >
                        {isSelected ? t["btn-added"] : t["btn-add"]}
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Desktop Order Summary Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 rounded-xl border border-brand-line bg-brand-card-bg p-6 shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange-600">
              {t["summary-eyebrow"]}
            </p>
            <h3 className="mt-1 text-xl font-bold text-brand-ink">
              {selectedService ? t["summary-title-selected"] : t["summary-title-ready"]}
            </h3>

            <div className="mt-6 rounded-lg border border-brand-line bg-brand-bg p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange-100 text-brand-orange-600">
                  <Car className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-ink">
                    {selectedService ? selectedService.titles[lang] : t["summary-no-selection"]}
                  </p>
                  <p className="text-xs font-medium text-brand-orange-600">
                    {selectedService ? selectedService.price : t["summary-select-wash"]}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={onPlaceOrder}
              disabled={!selectedService}
              size="lg"
              className="mt-6 w-full bg-brand-orange-500 text-white font-bold hover:bg-brand-orange-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              <span>{t["summary-place-order"]}</span>
            </Button>
          </aside>
        </div>
      </div>
    </section>
  );
};
