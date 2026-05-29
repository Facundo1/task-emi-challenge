import { createContext } from "react";
import { DEFAULT_LOCALE, TRANSLATIONS, type Locale, type TranslationKey } from "./translations";

export type TranslateParams = Record<string, string | number>;

export type TFunction = (key: TranslationKey, params?: TranslateParams) => string;

export type I18nContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: TFunction;
};

export function interpolate(template: string, params?: TranslateParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : String(value);
  });
}

export function createTranslator(locale: Locale): TFunction {
  const dict = TRANSLATIONS[locale];
  return (key, params) => interpolate(dict[key], params);
}

const DEFAULT_VALUE: I18nContextValue = {
  locale: DEFAULT_LOCALE,
  setLocale: () => undefined,
  t: createTranslator(DEFAULT_LOCALE),
};

export const I18nContext = createContext<I18nContextValue>(DEFAULT_VALUE);
