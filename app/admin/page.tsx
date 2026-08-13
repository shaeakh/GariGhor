"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Car,
  Languages,
  Code2,
  LogOut,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  GitBranch,
  Key,
} from "lucide-react";
import defaultSettings from "@/data/settings.json";
import { fetchFileFromGitHub, commitFileToGitHub, GitHubConfig } from "@/lib/github-api";

interface ServiceItem {
  id: string;
  image: string;
  price: string;
  titles: {
    en: string;
    bn: string;
  };
  examples: {
    en: string;
    bn: string;
  };
  altText: string;
}

interface ConfigItem {
  whatsappNumber: string;
  displayPhone: string;
  serviceArea: string;
  brandName: string;
  defaultLanguage: string;
  whatsappTemplateEn: string;
  whatsappTemplateBn: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "services" | "translations" | "github" | "json">("general");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // GitHub Config State
  const [ghConfig, setGhConfig] = useState<GitHubConfig>({
    owner: "shaeakh",
    repo: "GariGhor",
    token: "",
    branch: "main",
  });
  const [ghSha, setGhSha] = useState<string | undefined>(undefined);
  const [testingGh, setTestingGh] = useState(false);

  const [config, setConfig] = useState<ConfigItem>(defaultSettings.config as ConfigItem);
  const [services, setServices] = useState<ServiceItem[]>(defaultSettings.services as ServiceItem[]);
  const [translations, setTranslations] = useState<{ en: Record<string, string>; bn: Record<string, string> }>(
    defaultSettings.translations as any
  );

  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Load auth status & settings on mount
  useEffect(() => {
    async function checkAuthAndLoad() {
      const isSessionAuthed = sessionStorage.getItem("garighor_admin_session") === "authenticated";
      
      let isApiAuthed = false;
      try {
        const authRes = await fetch("/api/auth");
        const authData = await authRes.json();
        isApiAuthed = Boolean(authData.authenticated);
      } catch (e) {
        // static export
      }

      if (!isSessionAuthed && !isApiAuthed) {
        router.push("/admin/login");
        return;
      }

      // Load saved GitHub API credentials from localStorage if present
      try {
        const savedGh = localStorage.getItem("garighor_github_config");
        if (savedGh) {
          const parsedGh = JSON.parse(savedGh);
          setGhConfig((prev) => ({
            ...prev,
            ...parsedGh,
          }));
        }
      } catch (e) {}

      // Try reading settings from raw GitHub or local API route
      try {
        const settingsRes = await fetch("/api/settings");
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData.config) setConfig(settingsData.config);
          if (settingsData.services) setServices(settingsData.services);
          if (settingsData.translations) setTranslations(settingsData.translations);
        } else {
          throw new Error("No local API");
        }
      } catch (e) {
        // Fallback for static GitHub Pages export: fetch latest raw settings.json
        const rawUrl = `https://raw.githubusercontent.com/shaeakh/GariGhor/main/data/settings.json?t=${Date.now()}`;
        fetch(rawUrl)
          .then((res) => res.json())
          .then((data) => {
            if (data.config) setConfig(data.config);
            if (data.services) setServices(data.services);
            if (data.translations) setTranslations(data.translations);
          })
          .catch(() => {});
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndLoad();
  }, [router]);

  useEffect(() => {
    setJsonText(JSON.stringify({ config, services, translations }, null, 2));
  }, [config, services, translations]);

  const handleLogout = async () => {
    sessionStorage.removeItem("garighor_admin_session");
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } catch (err) {}
    router.push("/admin/login");
  };

  const handleSaveGithubConfig = () => {
    try {
      localStorage.setItem("garighor_github_config", JSON.stringify(ghConfig));
      setMessage({ type: "success", text: "GitHub credentials saved locally in browser!" });
    } catch (e) {
      setMessage({ type: "error", text: "Failed to save GitHub credentials to browser storage." });
    }
  };

  const handleTestGithub = async () => {
    if (!ghConfig.owner || !ghConfig.repo || !ghConfig.token) {
      setMessage({ type: "error", text: "Please enter GitHub Owner, Repo, and Personal Access Token (PAT)." });
      return;
    }

    setTestingGh(true);
    setMessage(null);

    try {
      const res = await fetchFileFromGitHub(ghConfig, "data/settings.json");
      setGhSha(res.sha);
      setMessage({
        type: "success",
        text: `Connected to GitHub! Successfully read settings.json (SHA: ${res.sha.slice(0, 7)})`,
      });
    } catch (err: any) {
      setMessage({ type: "error", text: `GitHub Connection Error: ${err.message}` });
    } finally {
      setTestingGh(false);
    }
  };

  const handleSaveSettings = async (overrideData?: { config: ConfigItem; services: ServiceItem[]; translations: any }) => {
    setSaving(true);
    setMessage(null);

    const payloadConfig = overrideData?.config || config;
    const payloadServices = overrideData?.services || services;
    const payloadTranslations = overrideData?.translations || translations;

    const fullPayload = {
      auth: defaultSettings.auth || { username: "admin", password: "password" },
      config: payloadConfig,
      services: payloadServices,
      translations: payloadTranslations,
    };

    let committedToGithub = false;
    let savedToLocalApi = false;

    // 1. Commit to GitHub API if GitHub PAT is configured
    if (ghConfig.token && ghConfig.owner && ghConfig.repo) {
      try {
        await commitFileToGitHub(
          ghConfig,
          "data/settings.json",
          fullPayload,
          ghSha,
          `Update website content via GariGhor Admin Dashboard`
        );
        committedToGithub = true;
      } catch (err: any) {
        setMessage({
          type: "error",
          text: `GitHub API Commit Error: ${err.message}. Please verify your GitHub PAT token in the 'GitHub Sync' tab.`,
        });
        setSaving(false);
        return;
      }
    }

    // 2. Save via local API if running in Node environment
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullPayload),
      });

      if (res.ok) {
        savedToLocalApi = true;
      }
    } catch (err) {
      // Ignore if static export
    }

    setConfig(payloadConfig);
    setServices(payloadServices);
    setTranslations(payloadTranslations);
    setJsonText(JSON.stringify({ config: payloadConfig, services: payloadServices, translations: payloadTranslations }, null, 2));

    if (committedToGithub) {
      setMessage({
        type: "success",
        text: "Committed changes directly to GitHub repository! Your website updates will reflect live immediately.",
      });
    } else if (savedToLocalApi) {
      setMessage({
        type: "success",
        text: "Settings saved successfully to project/data/settings.json!",
      });
    } else {
      setMessage({
        type: "error",
        text: "Please configure your GitHub Personal Access Token in the 'GitHub Sync' tab to enable live website updates on github.io!",
      });
    }

    setSaving(false);
  };

  const handleRawJsonSave = () => {
    setJsonError(null);
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.config || !parsed.services || !parsed.translations) {
        setJsonError("JSON must contain 'config', 'services', and 'translations' root keys.");
        return;
      }
      handleSaveSettings(parsed);
    } catch (e: any) {
      setJsonError(`Invalid JSON syntax: ${e.message}`);
    }
  };

  const handleAddService = () => {
    const newService: ServiceItem = {
      id: `service_${Date.now()}`,
      image: "/assets/images/services/sedan.png",
      price: "৳1000",
      titles: { en: "New Service", bn: "নতুন সার্ভিস" },
      examples: { en: "Example models", bn: "মডেলের উদাহরণ" },
      altText: "Car exterior detailing",
    };
    setServices([...services, newService]);
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg text-brand-ink">
        <RefreshCw className="h-8 w-8 animate-spin text-brand-orange-500" />
        <p className="mt-4 text-sm font-semibold text-brand-muted">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-ink">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-50 border-b border-brand-line bg-brand-header-bg px-4 py-3.5 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange-500 font-extrabold text-white text-lg shadow-sm">
              G
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-brand-ink">
                GariGhor Admin Dashboard
              </h1>
              <p className="text-xs text-brand-muted">Manage settings.json & live site content</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-brand-line bg-brand-card-bg px-3 py-1.5 text-xs font-semibold text-brand-ink hover:bg-brand-orange-50"
            >
              <span>View Live Site</span>
              <ExternalLink className="h-3.5 w-3.5 text-brand-orange-500" />
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-1.5 border-brand-line bg-brand-card-bg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
        {/* Banner Alert */}
        {message && (
          <div
            className={`mb-6 flex items-center justify-between rounded-xl border p-4 shadow-sm text-sm font-semibold ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300"
                : "border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {message.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-xs underline opacity-80 hover:opacity-100">
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-line pb-4 mb-8">
          <nav className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                activeTab === "general"
                  ? "bg-brand-orange-500 text-white shadow-sm"
                  : "bg-brand-card-bg text-brand-muted hover:text-brand-ink hover:bg-brand-orange-50"
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>General Config</span>
            </button>

            <button
              onClick={() => setActiveTab("services")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                activeTab === "services"
                  ? "bg-brand-orange-500 text-white shadow-sm"
                  : "bg-brand-card-bg text-brand-muted hover:text-brand-ink hover:bg-brand-orange-50"
              }`}
            >
              <Car className="h-4 w-4" />
              <span>Services Manager ({services.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("translations")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                activeTab === "translations"
                  ? "bg-brand-orange-500 text-white shadow-sm"
                  : "bg-brand-card-bg text-brand-muted hover:text-brand-ink hover:bg-brand-orange-50"
              }`}
            >
              <Languages className="h-4 w-4" />
              <span>Translations Editor</span>
            </button>

            <button
              onClick={() => setActiveTab("github")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                activeTab === "github"
                  ? "bg-brand-orange-500 text-white shadow-sm"
                  : "bg-brand-card-bg text-brand-muted hover:text-brand-ink hover:bg-brand-orange-50"
              }`}
            >
              <GitBranch className="h-4 w-4" />
              <span>GitHub Sync</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("json");
                setJsonText(JSON.stringify({ config, services, translations }, null, 2));
              }}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                activeTab === "json"
                  ? "bg-brand-orange-500 text-white shadow-sm"
                  : "bg-brand-card-bg text-brand-muted hover:text-brand-ink hover:bg-brand-orange-50"
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>Raw JSON Editor</span>
            </button>
          </nav>

          {activeTab !== "json" && (
            <Button
              onClick={() => handleSaveSettings()}
              disabled={saving}
              className="bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold shadow-md"
            >
              <Save className="mr-2 h-4 w-4" />
              <span>{saving ? "Saving..." : "Save All Changes"}</span>
            </Button>
          )}
        </div>

        {/* Tab 1: General Config */}
        {activeTab === "general" && (
          <div className="space-y-6 max-w-4xl">
            <div className="rounded-xl border border-brand-line bg-brand-card-bg p-6 shadow-sm">
              <h2 className="text-lg font-bold text-brand-ink mb-4">Site Information & Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-muted mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={config.brandName}
                    onChange={(e) => setConfig({ ...config, brandName: e.target.value })}
                    className="w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-2 text-sm text-brand-ink outline-none focus:border-brand-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-muted mb-1">
                    Display Phone
                  </label>
                  <input
                    type="text"
                    value={config.displayPhone}
                    onChange={(e) => setConfig({ ...config, displayPhone: e.target.value })}
                    className="w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-2 text-sm text-brand-ink outline-none focus:border-brand-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-muted mb-1">
                    WhatsApp Number (Sanitized)
                  </label>
                  <input
                    type="text"
                    value={config.whatsappNumber}
                    onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                    className="w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-2 text-sm text-brand-ink outline-none focus:border-brand-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-muted mb-1">
                    Service Area Description
                  </label>
                  <input
                    type="text"
                    value={config.serviceArea}
                    onChange={(e) => setConfig({ ...config, serviceArea: e.target.value })}
                    className="w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-2 text-sm text-brand-ink outline-none focus:border-brand-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-brand-line bg-brand-card-bg p-6 shadow-sm">
              <h2 className="text-lg font-bold text-brand-ink mb-4">WhatsApp Order Message Templates</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-muted mb-1">
                    English Template ({`use {service} and {price}`})
                  </label>
                  <textarea
                    rows={2}
                    value={config.whatsappTemplateEn}
                    onChange={(e) => setConfig({ ...config, whatsappTemplateEn: e.target.value })}
                    className="w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-2 text-sm text-brand-ink outline-none focus:border-brand-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-muted mb-1">
                    Bangla Template ({`use {service} and {price}`})
                  </label>
                  <textarea
                    rows={2}
                    value={config.whatsappTemplateBn}
                    onChange={(e) => setConfig({ ...config, whatsappTemplateBn: e.target.value })}
                    className="w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-2 text-sm text-brand-ink outline-none focus:border-brand-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Services Manager */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-ink">Car Wash Service Packages</h2>
              <Button onClick={handleAddService} size="sm" className="bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold">
                <Plus className="mr-1.5 h-4 w-4" />
                <span>Add Package</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((item, index) => (
                <div key={index} className="rounded-xl border border-brand-line bg-brand-card-bg p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-brand-line pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-orange-600">
                      Package #{index + 1} ({item.id})
                    </span>
                    <button
                      onClick={() => handleRemoveService(index)}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-brand-muted mb-1">
                        Price
                      </label>
                      <input
                        type="text"
                        value={item.price}
                        onChange={(e) => {
                          const updated = [...services];
                          updated[index].price = e.target.value;
                          setServices(updated);
                        }}
                        className="w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-1.5 text-sm text-brand-ink outline-none focus:border-brand-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-brand-muted mb-1">
                        Image URL
                      </label>
                      <input
                        type="text"
                        value={item.image}
                        onChange={(e) => {
                          const updated = [...services];
                          updated[index].image = e.target.value;
                          setServices(updated);
                        }}
                        className="w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-1.5 text-sm text-brand-ink outline-none focus:border-brand-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-brand-muted mb-1">
                        Title (EN)
                      </label>
                      <input
                        type="text"
                        value={item.titles.en}
                        onChange={(e) => {
                          const updated = [...services];
                          updated[index].titles.en = e.target.value;
                          setServices(updated);
                        }}
                        className="w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-1.5 text-sm text-brand-ink outline-none focus:border-brand-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-brand-muted mb-1">
                        Title (BN)
                      </label>
                      <input
                        type="text"
                        value={item.titles.bn}
                        onChange={(e) => {
                          const updated = [...services];
                          updated[index].titles.bn = e.target.value;
                          setServices(updated);
                        }}
                        className="w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-1.5 text-sm text-brand-ink outline-none focus:border-brand-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-brand-muted mb-1">
                        Examples / Models (EN)
                      </label>
                      <input
                        type="text"
                        value={item.examples.en}
                        onChange={(e) => {
                          const updated = [...services];
                          updated[index].examples.en = e.target.value;
                          setServices(updated);
                        }}
                        className="w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-1.5 text-sm text-brand-ink outline-none focus:border-brand-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-brand-muted mb-1">
                        Examples / Models (BN)
                      </label>
                      <input
                        type="text"
                        value={item.examples.bn}
                        onChange={(e) => {
                          const updated = [...services];
                          updated[index].examples.bn = e.target.value;
                          setServices(updated);
                        }}
                        className="w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-1.5 text-sm text-brand-ink outline-none focus:border-brand-orange-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Translations Editor */}
        {activeTab === "translations" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-brand-ink">Website Copy Translations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* EN Dictionary */}
              <div className="rounded-xl border border-brand-line bg-brand-card-bg p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-brand-orange-600 uppercase tracking-wider">
                  English Copy
                </h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {Object.keys(translations.en || {}).map((key) => (
                    <div key={key}>
                      <label className="block text-xs font-mono text-brand-muted mb-0.5">{key}</label>
                      <input
                        type="text"
                        value={translations.en[key]}
                        onChange={(e) => {
                          setTranslations({
                            ...translations,
                            en: { ...translations.en, [key]: e.target.value },
                          });
                        }}
                        className="w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-1.5 text-sm text-brand-ink outline-none focus:border-brand-orange-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* BN Dictionary */}
              <div className="rounded-xl border border-brand-line bg-brand-card-bg p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-brand-orange-600 uppercase tracking-wider">
                  Bangla Copy
                </h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {Object.keys(translations.bn || {}).map((key) => (
                    <div key={key}>
                      <label className="block text-xs font-mono text-brand-muted mb-0.5">{key}</label>
                      <input
                        type="text"
                        value={translations.bn[key]}
                        onChange={(e) => {
                          setTranslations({
                            ...translations,
                            bn: { ...translations.bn, [key]: e.target.value },
                          });
                        }}
                        className="w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-1.5 text-sm text-brand-ink outline-none focus:border-brand-orange-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: GitHub Sync */}
        {activeTab === "github" && (
          <div className="space-y-6 max-w-4xl">
            <div className="rounded-xl border border-brand-line bg-brand-card-bg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-brand-ink font-bold">
                <Key className="h-5 w-5 text-brand-orange-500 shrink-0" />
                <h2 className="text-lg">GitHub REST API Integration (for github.io)</h2>
              </div>
              <p className="text-xs text-brand-muted mb-6 leading-relaxed">
                Provide your GitHub <strong>Personal Access Token (PAT)</strong> below. When configured, clicking <strong>"Save All Changes"</strong> will commit updated <code className="bg-brand-orange-50 px-1 py-0.5 rounded text-brand-orange-600">data/settings.json</code> directly to your GitHub repository, updating your live website immediately!
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-brand-muted mb-1">
                      GitHub Username / Owner
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. shaeakh"
                      value={ghConfig.owner}
                      onChange={(e) => setGhConfig({ ...ghConfig, owner: e.target.value })}
                      className="w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-2 text-sm text-brand-ink outline-none focus:border-brand-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-brand-muted mb-1">
                      Repository Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. GariGhor"
                      value={ghConfig.repo}
                      onChange={(e) => setGhConfig({ ...ghConfig, repo: e.target.value })}
                      className="w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-2 text-sm text-brand-ink outline-none focus:border-brand-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-brand-muted mb-1">
                      Personal Access Token (PAT)
                    </label>
                    <input
                      type="password"
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      value={ghConfig.token}
                      onChange={(e) => setGhConfig({ ...ghConfig, token: e.target.value })}
                      className="w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-2 text-sm text-brand-ink outline-none focus:border-brand-orange-500"
                    />
                    <p className="mt-1 text-[11px] text-brand-muted">
                      Generate at GitHub: Settings $\rightarrow$ Developer settings $\rightarrow$ Personal access tokens $\rightarrow$ Tokens (classic) with <strong>repo</strong> scope.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-brand-muted mb-1">
                      Branch Name
                    </label>
                    <input
                      type="text"
                      placeholder="main"
                      value={ghConfig.branch || "main"}
                      onChange={(e) => setGhConfig({ ...ghConfig, branch: e.target.value })}
                      className="w-full rounded-lg border border-brand-line bg-brand-bg px-3 py-2 text-sm text-brand-ink outline-none focus:border-brand-orange-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-brand-line">
                  <Button
                    onClick={handleSaveGithubConfig}
                    className="bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold"
                  >
                    <span>Save Credentials to Browser</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleTestGithub}
                    disabled={testingGh}
                    className="border-brand-line bg-brand-card-bg text-brand-ink hover:bg-brand-orange-50"
                  >
                    <RefreshCw className={`mr-1.5 h-4 w-4 ${testingGh ? "animate-spin" : ""}`} />
                    <span>{testingGh ? "Testing..." : "Test Connection"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Raw JSON Editor (VSCode Style) */}
        {activeTab === "json" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-brand-ink">Interactive settings.json Code Editor</h2>
                <p className="text-xs text-brand-muted">
                  Directly edit the raw JSON configuration (VSCode style)
                </p>
              </div>
              <Button
                onClick={handleRawJsonSave}
                disabled={saving}
                className="bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold shadow-md"
              >
                <Save className="mr-2 h-4 w-4" />
                <span>{saving ? "Saving JSON..." : "Save Raw JSON"}</span>
              </Button>
            </div>

            {jsonError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                <span>{jsonError}</span>
              </div>
            )}

            <div className="relative rounded-xl border border-brand-line bg-slate-950 p-4 shadow-xl">
              <textarea
                rows={24}
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  setJsonError(null);
                }}
                className="w-full bg-transparent font-mono text-xs sm:text-sm text-emerald-400 outline-none leading-relaxed resize-y"
                spellCheck={false}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
