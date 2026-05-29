import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEFAULT_LOCALE,
  isLocale,
  type Locale,
} from "./translations";
import {
  I18nContext,
  createTranslator,
  type I18nContextValue,
} from "./I18nContext";

const STORAGE_KEY = "emi.locale";

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && isLocale(stored)) return stored;
  const nav = window.navigator.language.slice(0, 2).toLowerCase();
  return isLocale(nav) ? nav : DEFAULT_LOCALE;
}

type Props = { children: ReactNode; initialLocale?: Locale };

export function I18nProvider({ children, initialLocale }: Props) {
  const [locale, setLocaleState] = useState<Locale>(
    () => initialLocale ?? detectInitialLocale()
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: createTranslator(locale),
    }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
