// Bilingual utility functions for handling English/Nepali content

export interface BilingualText {
  en: string;
  ne: string;
}

export interface BilingualArray {
  en: string[];
  ne: string[];
}

export interface BilingualObject {
  [key: string]: BilingualText | BilingualArray | string | string[];
}

/**
 * Get unified bilingual text - returns both English and Nepali together
 */
export function getLocalizedText(
  englishText: string | null | undefined,
  nepaliText: string | null | undefined,
  language: "en" | "ne" = "en"
): string {
  const en = englishText || "";
  const ne = nepaliText || "";

  // If both exist and are different, show both
  if (en && ne && en !== ne) {
    return language === "ne" ? `${ne} (${en})` : `${en} (${ne})`;
  }

  // Return the available text
  return language === "ne" && ne ? ne : en;
}

/**
 * Get unified bilingual array - combines English and Nepali arrays
 */
export function getLocalizedArray(
  englishArray: string[] | null | undefined,
  nepaliArray: string[] | null | undefined,
  language: "en" | "ne" = "en"
): string[] {
  const en = englishArray || [];
  const ne = nepaliArray || [];

  // If both arrays exist, combine them
  if (en.length > 0 && ne.length > 0) {
    return en.map((item, index) => {
      const nepaliItem = ne[index] || "";
      if (nepaliItem && item !== nepaliItem) {
        return language === "ne"
          ? `${nepaliItem} (${item})`
          : `${item} (${nepaliItem})`;
      }
      return language === "ne" && nepaliItem ? nepaliItem : item;
    });
  }

  // Return the available array
  return language === "ne" && ne.length > 0 ? ne : en;
}

/**
 * Get localized object with fallback to English
 */
export function getLocalizedObject<T extends BilingualObject>(
  englishObject: T | null | undefined,
  nepaliObject: T | null | undefined,
  language: "en" | "ne" = "en"
): T {
  if (language === "ne" && nepaliObject) {
    return nepaliObject;
  }
  return englishObject || ({} as T);
}

/**
 * Create bilingual text object
 */
export function createBilingualText(
  english: string,
  nepali?: string
): BilingualText {
  return {
    en: english,
    ne: nepali || english, // Fallback to English if Nepali not provided
  };
}

/**
 * Create bilingual array object
 */
export function createBilingualArray(
  english: string[],
  nepali?: string[]
): BilingualArray {
  return {
    en: english,
    ne: nepali || english, // Fallback to English if Nepali not provided
  };
}

/**
 * Format bilingual data for API response
 */
export function formatBilingualResponse<T>(
  data: T,
  language: "en" | "ne" = "en"
): T {
  if (typeof data !== "object" || data === null) {
    return data;
  }

  const result = {} as T;

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "object" && value !== null) {
      // Handle nested objects
      if (Array.isArray(value)) {
        // Handle arrays
        (result as any)[key] = value.map((item) =>
          typeof item === "object"
            ? formatBilingualResponse(item, language)
            : item
        );
      } else {
        // Handle objects
        (result as any)[key] = formatBilingualResponse(value, language);
      }
    } else if (typeof value === "string") {
      // Handle string values
      (result as any)[key] = value;
    } else {
      (result as any)[key] = value;
    }
  }

  return result;
}

/**
 * Extract localized fields from bilingual data
 */
export function extractLocalizedFields<T>(
  data: T,
  language: "en" | "ne" = "en"
): T {
  if (typeof data !== "object" || data === null) {
    return data;
  }

  const result = {} as T;

  for (const [key, value] of Object.entries(data)) {
    if (key.endsWith("_nepali") || key.endsWith("_ne")) {
      // Skip Nepali-only fields in English mode
      if (language === "en") {
        continue;
      }
      // Use Nepali field as primary field
      const englishKey = key.replace(/_nepali$|_ne$/, "");
      (result as any)[englishKey] = value;
    } else if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        (result as any)[key] = value.map((item) =>
          typeof item === "object"
            ? extractLocalizedFields(item, language)
            : item
        );
      } else {
        (result as any)[key] = extractLocalizedFields(value, language);
      }
    } else {
      (result as any)[key] = value;
    }
  }

  return result;
}

/**
 * Merge bilingual data for creation/update operations
 */
export function mergeBilingualData<T>(
  englishData: Partial<T>,
  nepaliData: Partial<T>
): T {
  const result = {} as T;

  // Start with English data
  for (const [key, value] of Object.entries(englishData)) {
    if (value !== undefined && value !== null) {
      (result as any)[key] = value;
    }
  }

  // Overlay with Nepali data
  for (const [key, value] of Object.entries(nepaliData)) {
    if (value !== undefined && value !== null) {
      (result as any)[`${key}_nepali`] = value;
    }
  }

  return result;
}

/**
 * Validate bilingual data completeness
 */
export function validateBilingualData(
  englishData: Record<string, any>,
  nepaliData: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!englishData[field] || englishData[field].toString().trim() === "") {
      missingFields.push(`${field} (English)`);
    }
    if (!nepaliData[field] || nepaliData[field].toString().trim() === "") {
      missingFields.push(`${field} (Nepali)`);
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Get language from request headers or query params
 */
export function getLanguageFromRequest(
  headers: Record<string, string | string[] | undefined>,
  query: Record<string, string | string[] | undefined>
): "en" | "ne" {
  // Check query parameter first
  const queryLang = query.lang || query.language;
  if (queryLang && (queryLang === "ne" || queryLang === "nepali")) {
    return "ne";
  }

  // Check Accept-Language header
  const acceptLanguage = headers["accept-language"];
  if (acceptLanguage && typeof acceptLanguage === "string") {
    if (acceptLanguage.includes("ne") || acceptLanguage.includes("nepali")) {
      return "ne";
    }
  }

  // Default to English
  return "en";
}

/**
 * Create bilingual API response wrapper
 */
export function createBilingualResponse<T>(
  data: T,
  language: "en" | "ne" = "en",
  message?: string
): {
  success: boolean;
  data: T;
  language: "en" | "ne";
  message?: string;
  timestamp: string;
} {
  return {
    success: true,
    data: formatBilingualResponse(data, language),
    language,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Sanitize bilingual text input
 */
export function sanitizeBilingualText(text: string): string {
  if (!text) return "";

  return text
    .trim()
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

/**
 * Check if text contains Devanagari script (Nepali)
 */
export function isDevanagariText(text: string): boolean {
  if (!text) return false;

  // Devanagari Unicode range: U+0900 to U+097F
  const devanagariRegex = /[\u0900-\u097F]/;
  return devanagariRegex.test(text);
}

/**
 * Auto-detect language of text
 */
export function detectLanguage(text: string): "en" | "ne" | "mixed" {
  if (!text) return "en";

  const isNepali = isDevanagariText(text);
  const isEnglish = /[a-zA-Z]/.test(text);

  if (isNepali && isEnglish) return "mixed";
  if (isNepali) return "ne";
  return "en";
}
