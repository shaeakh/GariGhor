"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/garighor/header";
import { Hero } from "@/components/garighor/hero";
import { Services } from "@/components/garighor/services";
import { Overview } from "@/components/garighor/overview";
import { Steps } from "@/components/garighor/steps";
import { Hygiene } from "@/components/garighor/hygiene";
import { FAQ } from "@/components/garighor/faq";
import { MobileOrderBar } from "@/components/garighor/mobile-order-bar";
import { Footer } from "@/components/garighor/footer";
import { ServiceItem } from "@/lib/garighor-config";
import defaultSettings from "@/data/settings.json";

export default function Home() {
  const [lang, setLang] = useState<"en" | "bn">("en");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const [config, setConfig] = useState(defaultSettings.config);
  const [services, setServices] = useState<ServiceItem[]>(defaultSettings.services as ServiceItem[]);
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>(
    defaultSettings.translations as any
  );

  useEffect(() => {
    setMounted(true);
    try {
      const savedLang = localStorage.getItem("garighor-lang") as "en" | "bn" | null;
      if (savedLang === "en" || savedLang === "bn") {
        setLang(savedLang);
      }

      const savedTheme = localStorage.getItem("garighor-theme") as "light" | "dark" | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
      }

      const savedService = localStorage.getItem("garighor-selected-service");
      if (savedService !== null && savedService !== undefined && savedService !== "") {
        const idx = Number(savedService);
        if (idx >= 0 && idx < services.length) {
          setSelectedServiceIndex(idx);
        }
      }
    } catch (e) {
      // Ignore storage errors
    }

    // Try fetching dynamic settings from API route (local) or Raw GitHub URL (github.io)
    fetch("/api/settings")
      .then((res) => {
        if (!res.ok) throw new Error("No local API route");
        return res.json();
      })
      .then((data) => {
        if (data.config) setConfig(data.config);
        if (data.services) setServices(data.services);
        if (data.translations) setTranslations(data.translations);
      })
      .catch(() => {
        // Fallback for static GitHub Pages export: fetch latest raw settings.json directly from GitHub repository
        const rawUrl = `https://raw.githubusercontent.com/shaeakh/GariGhor/main/data/settings.json?t=${Date.now()}`;
        fetch(rawUrl)
          .then((res) => res.json())
          .then((data) => {
            if (data.config) setConfig(data.config);
            if (data.services) setServices(data.services);
            if (data.translations) setTranslations(data.translations);
          })
          .catch(() => {
            // Bundle fallback
          });
      });
  }, [services.length]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("garighor-lang", lang);
    } catch (e) {}
    document.documentElement.setAttribute("lang", lang);
  }, [lang, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("garighor-theme", theme);
    } catch (e) {}

    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, mounted]);

  const handleSelectService = (index: number) => {
    setSelectedServiceIndex(index);
    try {
      localStorage.setItem("garighor-selected-service", String(index));
    } catch (e) {}
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === "en" ? "bn" : "en"));
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handlePlaceOrder = () => {
    if (selectedServiceIndex === null || selectedServiceIndex >= services.length) return;
    const service = services[selectedServiceIndex];
    const serviceName = service.titles[lang];
    const price = service.price;
    const template =
      lang === "en"
        ? config.whatsappTemplateEn
        : config.whatsappTemplateBn;
    const message = template
      .replace("{service}", serviceName)
      .replace("{price}", price);
    const sanitizedPhone = config.whatsappNumber.replace(/[^\d]/g, "");

    window.open(
      `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const activeTranslations = translations[lang] || defaultSettings.translations[lang];

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-ink">
      <Header
        lang={lang}
        theme={theme}
        onToggleLang={handleToggleLang}
        onToggleTheme={handleToggleTheme}
        translations={activeTranslations}
        brandName={config.brandName}
      />
      <main className="flex-1">
        <Hero lang={lang} translations={activeTranslations} />
        <Services
          lang={lang}
          selectedIndex={selectedServiceIndex}
          onSelectService={handleSelectService}
          onPlaceOrder={handlePlaceOrder}
          services={services}
          translations={activeTranslations}
        />
        <Overview lang={lang} translations={activeTranslations} />
        <Steps lang={lang} translations={activeTranslations} />
        <Hygiene lang={lang} translations={activeTranslations} />
        <FAQ lang={lang} translations={activeTranslations} />
      </main>
      <MobileOrderBar
        lang={lang}
        selectedIndex={selectedServiceIndex}
        onPlaceOrder={handlePlaceOrder}
        services={services}
        translations={activeTranslations}
      />
      <Footer lang={lang} config={config} translations={activeTranslations} />
    </div>
  );
}
