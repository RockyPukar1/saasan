// Bilingual utility functions for React Native

export type Language = "en" | "ne";

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
  language: Language = "en"
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
 * Get localized array with fallback to English
 */
export function getLocalizedArray(
  englishArray: string[] | null | undefined,
  nepaliArray: string[] | null | undefined,
  language: Language = "en"
): string[] {
  if (language === "ne" && nepaliArray && nepaliArray.length > 0) {
    return nepaliArray;
  }
  return englishArray || [];
}

/**
 * Get localized object with fallback to English
 */
export function getLocalizedObject<T extends BilingualObject>(
  englishObject: T | null | undefined,
  nepaliObject: T | null | undefined,
  language: Language = "en"
): T {
  if (language === "ne" && nepaliObject) {
    return nepaliObject;
  }
  return englishObject || ({} as T);
}

/**
 * Format bilingual data for display based on current language
 */
export function formatBilingualData<T>(data: T, language: Language): T {
  if (!data || typeof data !== "object") {
    return data;
  }

  const result = {} as T;

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        (result as any)[key] = value.map((item) =>
          typeof item === "object" ? formatBilingualData(item, language) : item
        );
      } else {
        (result as any)[key] = formatBilingualData(value, language);
      }
    } else if (typeof value === "string") {
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
export function extractLocalizedFields<T>(data: T, language: Language): T {
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
export function detectLanguage(text: string): Language | "mixed" {
  if (!text) return "en";

  const isNepali = isDevanagariText(text);
  const isEnglish = /[a-zA-Z]/.test(text);

  if (isNepali && isEnglish) return "mixed";
  if (isNepali) return "ne";
  return "en";
}

/**
 * Get localized politician data
 */
export function getLocalizedPolitician(politician: any, language: Language) {
  if (!politician) return politician;

  return {
    ...politician,
    fullName: getLocalizedText(
      politician.fullName,
      politician.fullNameNepali,
      language
    ),
    education: getLocalizedText(
      politician.education,
      politician.educationNepali,
      language
    ),
    previousPositions: getLocalizedText(
      politician.previousPositions,
      politician.previousPositionsNepali,
      language
    ),
    achievements: getLocalizedText(
      politician.achievements,
      politician.achievementsNepali,
      language
    ),
    promises: getLocalizedArray(
      politician.promises,
      politician.promisesNepali,
      language
    ),
    partyName: getLocalizedText(
      politician.partyName,
      politician.partyNameNepali,
      language
    ),
    constituencyName: getLocalizedText(
      politician.constituencyName,
      politician.constituencyNameNepali,
      language
    ),
  };
}

/**
 * Get localized corruption report data
 */
export function getLocalizedCorruptionReport(report: any, language: Language) {
  if (!report) return report;

  return {
    ...report,
    title: getLocalizedText(report.title, report.titleNepali, language),
    description: getLocalizedText(
      report.description,
      report.descriptionNepali,
      language
    ),
    evidence: getLocalizedArray(
      report.evidence,
      report.evidenceNepali,
      language
    ),
    involvedOfficials: getLocalizedArray(
      report.involvedOfficials,
      report.involvedOfficialsNepali,
      language
    ),
    impact: getLocalizedText(report.impact, report.impactNepali, language),
    districtName: getLocalizedText(
      report.districtName,
      report.districtNameNepali,
      language
    ),
  };
}

/**
 * Get localized poll data
 */
export function getLocalizedPoll(poll: any, language: Language) {
  if (!poll) return poll;

  return {
    ...poll,
    title: getLocalizedText(poll.title, poll.titleNepali, language),
    description: getLocalizedText(
      poll.description,
      poll.descriptionNepali,
      language
    ),
    category: getLocalizedText(poll.category, poll.categoryNepali, language),
    options:
      poll.options?.map((option: any) => ({
        ...option,
        text: getLocalizedText(option.text, option.textNepali, language),
      })) || [],
  };
}

/**
 * Get localized province data
 */
export function getLocalizedProvince(province: any, language: Language) {
  if (!province) return province;

  return {
    ...province,
    name: getLocalizedText(province.name, province.nameNepali, language),
    capital: getLocalizedText(
      province.capital,
      province.capitalNepali,
      language
    ),
  };
}

/**
 * Get localized district data
 */
export function getLocalizedDistrict(district: any, language: Language) {
  if (!district) return district;

  return {
    ...district,
    name: getLocalizedText(district.name, district.nameNepali, language),
    provinceName: getLocalizedText(
      district.provinceName,
      district.provinceNameNepali,
      language
    ),
  };
}

/**
 * Get localized political party data
 */
export function getLocalizedPoliticalParty(party: any, language: Language) {
  if (!party) return party;

  return {
    ...party,
    name: getLocalizedText(party.name, party.nameNepali, language),
    description: getLocalizedText(
      party.description,
      party.descriptionNepali,
      language
    ),
  };
}

/**
 * Format API response for bilingual display
 */
export function formatApiResponse<T>(response: T, language: Language): T {
  if (!response || typeof response !== "object") {
    return response;
  }

  // Handle array responses
  if (Array.isArray(response)) {
    return response.map((item) => formatApiResponse(item, language)) as T;
  }

  // Handle object responses
  const result = {} as T;

  for (const [key, value] of Object.entries(response)) {
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        (result as any)[key] = value.map((item) =>
          formatApiResponse(item, language)
        );
      } else {
        (result as any)[key] = formatApiResponse(value, language);
      }
    } else {
      (result as any)[key] = value;
    }
  }

  return result;
}

/**
 * Get language-specific API headers
 */
export function getApiHeaders(language: Language) {
  return {
    "Accept-Language": language,
    "Content-Language": language,
  };
}

/**
 * Get language-specific query parameters
 */
export function getApiQuery(language: Language) {
  return {
    lang: language,
  };
}

/**
 * Get language display name
 */
export function getLanguageName(lang: Language): string {
  return lang === "en" ? "English" : "नेपाली (Nepali)";
}

/**
 * Get language flag emoji
 */
export function getLanguageFlag(lang: Language): string {
  return lang === "en" ? "🇺🇸" : "🇳🇵";
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
