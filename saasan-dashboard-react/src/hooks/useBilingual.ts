import { useState, useEffect, useCallback } from "react";

export type Language = "en" | "ne";

interface BilingualText {
  en: string;
  ne: string;
}

interface BilingualArray {
  en: string[];
  ne: string[];
}

interface BilingualObject {
  [key: string]: BilingualText | BilingualArray | string | string[];
}

export function useBilingual() {
  const [language, setLanguage] = useState<Language>("en");

  // Get language from localStorage or browser preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem("saasan-language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ne")) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.includes("ne") || browserLang.includes("nepali")) {
        setLanguage("ne");
      }
    }
  }, []);

  // Save language preference
  const changeLanguage = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("saasan-language", newLanguage);
  }, []);

  // Get localized text with fallback
  const getText = useCallback(
    (text: BilingualText | string, fallbackText?: string): string => {
      if (typeof text === "string") {
        return text || fallbackText || "";
      }

      if (language === "ne" && text.ne && text.ne.trim() !== "") {
        return text.ne;
      }

      return text.en || fallbackText || "";
    },
    [language]
  );

  // Get localized array with fallback
  const getArray = useCallback(
    (array: BilingualArray | string[], fallbackArray?: string[]): string[] => {
      if (Array.isArray(array)) {
        return array;
      }

      if (language === "ne" && array.ne && array.ne.length > 0) {
        return array.ne;
      }

      return array.en || fallbackArray || [];
    },
    [language]
  );

  // Get localized object with fallback
  const getObject = useCallback(
    (obj: BilingualObject, fallbackObj?: any): any => {
      if (language === "ne" && obj.ne) {
        return obj.ne;
      }

      return obj.en || fallbackObj || {};
    },
    [language]
  );

  // Format bilingual data for display
  const formatBilingualData = useCallback(
    (data: any): any => {
      if (!data || typeof data !== "object") {
        return data;
      }

      const result: any = {};

      for (const [key, value] of Object.entries(data)) {
        if (typeof value === "object" && value !== null) {
          if (Array.isArray(value)) {
            result[key] = value.map((item) =>
              typeof item === "object" ? formatBilingualData(item) : item
            );
          } else if (key.endsWith("_nepali") || key.endsWith("_ne")) {
            // Skip Nepali-only fields in English mode
            if (language === "en") {
              continue;
            }
            // Use Nepali field as primary field
            const englishKey = key.replace(/_nepali$|_ne$/, "");
            result[englishKey] = value;
          } else {
            result[key] = formatBilingualData(value);
          }
        } else {
          result[key] = value;
        }
      }

      return result;
    },
    [language]
  );

  // Create bilingual text object
  const createBilingualText = useCallback(
    (english: string, nepali?: string): BilingualText => {
      return {
        en: english,
        ne: nepali || english,
      };
    },
    []
  );

  // Create bilingual array object
  const createBilingualArray = useCallback(
    (english: string[], nepali?: string[]): BilingualArray => {
      return {
        en: english,
        ne: nepali || english,
      };
    },
    []
  );

  // Merge bilingual data for API requests
  const mergeBilingualData = useCallback(
    (englishData: any, nepaliData: any): any => {
      const result = { ...englishData };

      for (const [key, value] of Object.entries(nepaliData)) {
        if (value !== undefined && value !== null) {
          result[`${key}_nepali`] = value;
        }
      }

      return result;
    },
    []
  );

  // Get language-specific API headers
  const getApiHeaders = useCallback(() => {
    return {
      "Accept-Language": language,
      "Content-Language": language,
    };
  }, [language]);

  // Get language-specific query parameters
  const getApiQuery = useCallback(() => {
    return {
      lang: language,
    };
  }, [language]);

  // Check if text contains Devanagari script
  const isDevanagariText = useCallback((text: string): boolean => {
    if (!text) return false;
    const devanagariRegex = /[\u0900-\u097F]/;
    return devanagariRegex.test(text);
  }, []);

  // Auto-detect language of text
  const detectLanguage = useCallback(
    (text: string): Language | "mixed" => {
      if (!text) return "en";

      const isNepali = isDevanagariText(text);
      const isEnglish = /[a-zA-Z]/.test(text);

      if (isNepali && isEnglish) return "mixed";
      if (isNepali) return "ne";
      return "en";
    },
    [isDevanagariText]
  );

  // Get RTL support (Nepali uses LTR, but useful for future languages)
  const isRTL = useCallback((): boolean => {
    return false; // Nepali is LTR
  }, []);

  // Get language display name
  const getLanguageName = useCallback((lang: Language): string => {
    return lang === "en" ? "English" : "नेपाली (Nepali)";
  }, []);

  // Get language flag emoji
  const getLanguageFlag = useCallback((lang: Language): string => {
    return lang === "en" ? "🇺🇸" : "🇳🇵";
  }, []);

  return {
    language,
    changeLanguage,
    getText,
    getArray,
    getObject,
    formatBilingualData,
    createBilingualText,
    createBilingualArray,
    mergeBilingualData,
    getApiHeaders,
    getApiQuery,
    isDevanagariText,
    detectLanguage,
    isRTL,
    getLanguageName,
    getLanguageFlag,
  };
}

// Hook for bilingual form handling
export function useBilingualForm<T extends Record<string, any>>(
  initialData: T
) {
  const [formData, setFormData] = useState<T>(initialData);
  const { language, mergeBilingualData } = useBilingual();

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const updateBilingualField = useCallback(
    (field: keyof T, englishValue: any, nepaliValue: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: mergeBilingualData(
          { [field]: englishValue },
          { [field]: nepaliValue }
        ),
      }));
    },
    [mergeBilingualData]
  );

  const getFormDataForApi = useCallback(() => {
    return mergeBilingualData(formData, formData);
  }, [formData, mergeBilingualData]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
  }, [initialData]);

  return {
    formData,
    updateField,
    updateBilingualField,
    getFormDataForApi,
    resetForm,
    language,
  };
}

// Hook for bilingual API calls
export function useBilingualApi() {
  const { getApiHeaders, getApiQuery, language } = useBilingual();

  const makeApiCall = useCallback(
    async (
      url: string,
      options: RequestInit = {},
      includeLanguageParams: boolean = true
    ) => {
      const headers = {
        "Content-Type": "application/json",
        ...getApiHeaders(),
        ...options.headers,
      };

      let finalUrl = url;
      if (includeLanguageParams) {
        const queryParams = new URLSearchParams(getApiQuery());
        finalUrl = `${url}${
          url.includes("?") ? "&" : "?"
        }${queryParams.toString()}`;
      }

      return fetch(finalUrl, {
        ...options,
        headers,
      });
    },
    [getApiHeaders, getApiQuery]
  );

  return {
    makeApiCall,
    language,
    getApiHeaders,
    getApiQuery,
  };
}
