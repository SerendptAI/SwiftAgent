import { Loader2 } from "lucide-react";
import { useState } from "react";

import { useScrapeWebsite } from "@/hooks/use-company";
import { useOnboardingStore } from "@/store/onboarding-store";

import { FormInput, NextButton } from "./ui-elements";

export function WebsiteIntroStep({ onDone }: { onDone: () => void }) {
  const [website, setWebsite] = useState("");
  const scrapeWebsite = useScrapeWebsite();
  const setWebsiteUrl = useOnboardingStore((state) => state.setWebsiteUrl);
  const setScrapedData = useOnboardingStore((state) => state.setScrapedData);
  const isAnalyzing = scrapeWebsite.isPending;

  const normalizedUrl = () => {
    // FormInput uppercases as the user types; URLs are case-insensitive hosts.
    const raw = website.trim().toLowerCase();
    if (!raw) return "";
    return raw.startsWith("http") ? raw : `https://${raw}`;
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = normalizedUrl();
    if (!url || isAnalyzing) return;
    setWebsiteUrl(url);
    try {
      setScrapedData(await scrapeWebsite.mutateAsync(url));
    } catch {
      // Prefill is best-effort — continue to manual entry with the URL kept.
    }
    onDone();
  };

  const handleSkip = () => {
    setWebsiteUrl(normalizedUrl());
    onDone();
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center pt-6 pb-10 text-center sm:pt-10">
      <h2 className="font-greed-narrow text-3xl leading-[1.1] font-semibold tracking-[-2%] text-black uppercase sm:text-[40px]">
        Let&apos;s set up your company
      </h2>
      <p className="font-dm-mono mt-4 text-sm leading-[1.96] tracking-[0.14em] text-gray-500 uppercase">
        Enter your website and we&apos;ll prefill your details for you
      </p>

      <form onSubmit={handleAnalyze} className="mt-8 w-full max-w-md">
        <FormInput
          placeholder="https://yourcompany.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          disabled={isAnalyzing}
        />
        <NextButton
          type="submit"
          className="mt-6"
          disabled={!website.trim() || isAnalyzing}
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing your website…
            </span>
          ) : (
            "ANALYZE MY SITE"
          )}
        </NextButton>
      </form>

      <button
        type="button"
        onClick={handleSkip}
        disabled={isAnalyzing}
        className="font-dm-mono mt-6 cursor-pointer text-xs tracking-[0.12em] text-gray-400 uppercase underline underline-offset-4 transition-colors hover:text-gray-600 disabled:opacity-50"
      >
        Skip, I&apos;ll fill it manually
      </button>
    </div>
  );
}
