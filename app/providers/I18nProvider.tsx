"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import enMessages from "../../messages/en.json";
import esMessages from "../../messages/es.json";
import idMessages from "../../messages/id.json";

const messages = {
  en: enMessages,
  es: esMessages,
  id: idMessages,
};

type Locale = "en" | "es" | "id";

const supportedLocales: Locale[] = ["en", "es", "id"];

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: typeof messages.en;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("locale="))
      ?.split("=")[1] as Locale;

    if (cookieLocale && supportedLocales.includes(cookieLocale)) {
      setLocaleState(cookieLocale);
    } else {
      const browserLang = navigator.language.split("-")[0];
      const supportedLang = supportedLocales.includes(browserLang as Locale)
        ? browserLang
        : "en";
      setLocaleState(supportedLang as Locale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
  };

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, messages: messages[locale] }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
