import { useState, useEffect } from "react";
import {
  getLocalizedText,
  getLocalizedArray,
  getLocalizedObject,
  type Language,
} from "~/lib/bilingual";

export function useBilingual() {
  const [language, setLanguage] = useState<Language>("en");

  const getText = (english: string, nepali?: string) => {
    return getLocalizedText(english, nepali, language);
  };

  const getArray = (english: string[], nepali?: string[]) => {
    return getLocalizedArray(english, nepali, language);
  };

  const getObject = <T extends Record<string, any>>(english: T, nepali?: T) => {
    return getLocalizedObject(english, nepali, language);
  };

  const getLanguageName = (lang: Language) => {
    return lang === "en" ? "English" : "नेपाली (Nepali)";
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ne" : "en"));
  };

  return {
    language,
    setLanguage,
    getText,
    getArray,
    getObject,
    getLanguageName,
    toggleLanguage,
  };
}
