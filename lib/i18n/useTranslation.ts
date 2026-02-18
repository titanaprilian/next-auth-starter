"use client";

import { useI18n } from "@/app/providers/I18nProvider";

export function useTranslations() {
  const { messages } = useI18n();

  return function t(key: string, options?: Record<string, unknown>) {
    const keys = key.split(".");
    let value: unknown = messages;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    if (typeof value !== "string") {
      return key;
    }

    if (options) {
      return value.replace(/\{(\w+)\}/g, (_, k) => String(options[k] ?? `{${k}}`));
    }

    return value;
  };
}

export function useLocale() {
  const { locale } = useI18n();
  return locale;
}
