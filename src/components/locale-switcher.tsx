"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { localeCookieName } from "@/lib/i18n";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function updateLocale(nextLocale: string) {
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-white px-2 py-1 text-xs font-medium text-muted">
      <button
        type="button"
        disabled={isPending || locale === "en"}
        onClick={() => updateLocale("en")}
        className={`rounded-full px-3 py-1 ${locale === "en" ? "bg-brand text-white" : ""}`}
      >
        EN
      </button>
      <button
        type="button"
        disabled={isPending || locale === "ur"}
        onClick={() => updateLocale("ur")}
        className={`rounded-full px-3 py-1 ${locale === "ur" ? "bg-brand text-white" : ""}`}
      >
        UR
      </button>
    </div>
  );
}
