import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Language = "en" | "ne";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// Translation data
const translations = {
  en: {
    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.retry": "Retry",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.close": "Close",
    "common.yes": "Yes",
    "common.no": "No",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.clear": "Clear",
    "common.submit": "Submit",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.done": "Done",
    "common.success": "Success",
    "common.failed": "Failed",
    "common.required": "Required",
    "common.optional": "Optional",

    // Navigation
    "nav.home": "Home",
    "nav.politicians": "Leaders",
    "nav.reports": "Reports",
    "nav.polling": "Polling",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.logout": "Logout",

    // Auth
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.fullName": "Full Name",
    "auth.phone": "Phone",
    "auth.district": "District",
    "auth.municipality": "Municipality",
    "auth.ward": "Ward",
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.forgotPassword": "Forgot Password?",
    "auth.dontHaveAccount": "Don't have an account?",
    "auth.alreadyHaveAccount": "Already have an account?",
    "auth.loginSuccess": "Login successful",
    "auth.registerSuccess": "Registration successful",
    "auth.loginFailed": "Login failed",
    "auth.registerFailed": "Registration failed",
    "auth.invalidCredentials": "Invalid credentials",
    "auth.emailRequired": "Email is required",
    "auth.passwordRequired": "Password is required",
    "auth.passwordTooShort": "Password must be at least 6 characters",
    "auth.emailInvalid": "Please enter a valid email",

    // Polling
    "polling.title": "Public Opinion Polls",
    "polling.createPoll": "Create Poll",
    "polling.activePolls": "Active Polls",
    "polling.myPolls": "My Polls",
    "polling.vote": "Vote",
    "polling.votes": "votes",
    "polling.totalVotes": "Total Votes",
    "polling.pollType": "Poll Type",
    "polling.singleChoice": "Single Choice",
    "polling.multipleChoice": "Multiple Choice",
    "polling.pollStatus": "Status",
    "polling.active": "Active",
    "polling.ended": "Ended",
    "polling.draft": "Draft",
    "polling.category": "Category",
    "polling.anonymous": "Anonymous",
    "polling.requiresVerification": "Requires Verification",
    "polling.endDate": "End Date",
    "polling.createdBy": "Created By",
    "polling.voteSuccess": "Your vote has been recorded",
    "polling.voteFailed": "Failed to submit vote",
    "polling.authRequired": "Authentication Required",
    "polling.loginToVote": "Please log in to vote on polls",
    "polling.noPolls": "No polls available",
    "polling.loadingPolls": "Loading polls...",
    "polling.refreshPolls": "Refresh polls",

    // Politicians
    "politicians.title": "Political Leaders",
    "politicians.searchLeaders": "Search Leaders",
    "politicians.filterByLevel": "Filter by Level",
    "politicians.federal": "Federal",
    "politicians.provincial": "Provincial",
    "politicians.local": "Local",
    "politicians.party": "Party",
    "politicians.position": "Position",
    "politicians.term": "Term",
    "politicians.contact": "Contact",
    "politicians.bio": "Biography",
    "politicians.achievements": "Achievements",
    "politicians.controversies": "Controversies",
    "politicians.rating": "Rating",
    "politicians.reviews": "Reviews",
    "politicians.noLeaders": "No leaders found",
    "politicians.loadingLeaders": "Loading leaders...",

    // Reports
    "reports.title": "Corruption Reports",
    "reports.createReport": "Create Report",
    "reports.myReports": "My Reports",
    "reports.allReports": "All Reports",
    "reports.pending": "Pending",
    "reports.underReview": "Under Review",
    "reports.resolved": "Resolved",
    "reports.rejected": "Rejected",
    "reports.reportType": "Report Type",
    "reports.corruption": "Corruption",
    "reports.misconduct": "Misconduct",
    "reports.waste": "Waste of Resources",
    "reports.other": "Other",
    "reports.priority": "Priority",
    "reports.high": "High",
    "reports.medium": "Medium",
    "reports.low": "Low",
    "reports.amountInvolved": "Amount Involved",
    "reports.peopleAffected": "People Affected",
    "reports.dateOccurred": "Date Occurred",
    "reports.location": "Location",
    "reports.description": "Description",
    "reports.evidence": "Evidence",
    "reports.attachments": "Attachments",
    "reports.noReports": "No reports found",
    "reports.loadingReports": "Loading reports...",

    // Dashboard
    "dashboard.welcome": "Welcome to Saasan",
    "dashboard.overview": "Overview",
    "dashboard.statistics": "Statistics",
    "dashboard.recentActivity": "Recent Activity",
    "dashboard.trending": "Trending",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.viewAll": "View All",

    // Language
    "language.english": "English",
    "language.nepali": "नेपाली",
    "language.select": "Select Language",
  },
  ne: {
    // Common
    "common.loading": "लोड हुँदै...",
    "common.error": "त्रुटि",
    "common.retry": "पुनः प्रयास",
    "common.cancel": "रद्द गर्नुहोस्",
    "common.save": "बचत गर्नुहोस्",
    "common.delete": "मेटाउनुहोस्",
    "common.edit": "सम्पादन गर्नुहोस्",
    "common.close": "बन्द गर्नुहोस्",
    "common.yes": "हो",
    "common.no": "होइन",
    "common.search": "खोज्नुहोस्",
    "common.filter": "फिल्टर",
    "common.clear": "सफा गर्नुहोस्",
    "common.submit": "पेश गर्नुहोस्",
    "common.back": "फिर्ता",
    "common.next": "अगाडि",
    "common.previous": "अघिल्लो",
    "common.done": "सकियो",
    "common.success": "सफल",
    "common.failed": "असफल",
    "common.required": "आवश्यक",
    "common.optional": "वैकल्पिक",

    // Navigation
    "nav.home": "गृह",
    "nav.politicians": "नेताहरू",
    "nav.reports": "रिपोर्टहरू",
    "nav.polling": "मतदान",
    "nav.profile": "प्रोफाइल",
    "nav.settings": "सेटिङहरू",
    "nav.login": "लगइन",
    "nav.register": "दर्ता",
    "nav.logout": "लगआउट",

    // Auth
    "auth.email": "इमेल",
    "auth.password": "पासवर्ड",
    "auth.fullName": "पूरा नाम",
    "auth.phone": "फोन",
    "auth.district": "जिल्ला",
    "auth.municipality": "नगरपालिका",
    "auth.ward": "वडा",
    "auth.login": "लगइन",
    "auth.register": "दर्ता",
    "auth.forgotPassword": "पासवर्ड बिर्सनुभयो?",
    "auth.dontHaveAccount": "खाता छैन?",
    "auth.alreadyHaveAccount": "पहिले नै खाता छ?",
    "auth.loginSuccess": "लगइन सफल",
    "auth.registerSuccess": "दर्ता सफल",
    "auth.loginFailed": "लगइन असफल",
    "auth.registerFailed": "दर्ता असफल",
    "auth.invalidCredentials": "अमान्य प्रमाणीकरण",
    "auth.emailRequired": "इमेल आवश्यक छ",
    "auth.passwordRequired": "पासवर्ड आवश्यक छ",
    "auth.passwordTooShort": "पासवर्ड कम्तिमा ६ अक्षर हुनुपर्छ",
    "auth.emailInvalid": "कृपया मान्य इमेल प्रविष्ट गर्नुहोस्",

    // Polling
    "polling.title": "जनमत सर्वेक्षण",
    "polling.createPoll": "सर्वेक्षण सिर्जना गर्नुहोस्",
    "polling.activePolls": "सक्रिय सर्वेक्षणहरू",
    "polling.myPolls": "मेरा सर्वेक्षणहरू",
    "polling.vote": "मत",
    "polling.votes": "मतहरू",
    "polling.totalVotes": "कुल मत",
    "polling.pollType": "सर्वेक्षण प्रकार",
    "polling.singleChoice": "एकल छनोट",
    "polling.multipleChoice": "बहु छनोट",
    "polling.pollStatus": "स्थिति",
    "polling.active": "सक्रिय",
    "polling.ended": "समाप्त",
    "polling.draft": "मस्यौदा",
    "polling.category": "श्रेणी",
    "polling.anonymous": "अज्ञात",
    "polling.requiresVerification": "प्रमाणीकरण आवश्यक",
    "polling.endDate": "समाप्ति मिति",
    "polling.createdBy": "सिर्जनाकर्ता",
    "polling.voteSuccess": "तपाईंको मत रेकर्ड भयो",
    "polling.voteFailed": "मत पेश गर्न असफल",
    "polling.authRequired": "प्रमाणीकरण आवश्यक",
    "polling.loginToVote": "कृपया सर्वेक्षणमा मत दिन लगइन गर्नुहोस्",
    "polling.noPolls": "कुनै सर्वेक्षण उपलब्ध छैन",
    "polling.loadingPolls": "सर्वेक्षणहरू लोड हुँदै...",
    "polling.refreshPolls": "सर्वेक्षणहरू ताजा गर्नुहोस्",

    // Politicians
    "politicians.title": "राजनीतिक नेताहरू",
    "politicians.searchLeaders": "नेताहरू खोज्नुहोस्",
    "politicians.filterByLevel": "तह अनुसार फिल्टर",
    "politicians.federal": "संघीय",
    "politicians.provincial": "प्रदेश",
    "politicians.local": "स्थानीय",
    "politicians.party": "दल",
    "politicians.position": "पद",
    "politicians.term": "अवधि",
    "politicians.contact": "सम्पर्क",
    "politicians.bio": "जीवनी",
    "politicians.achievements": "उपलब्धिहरू",
    "politicians.controversies": "विवादहरू",
    "politicians.rating": "मूल्याङ्कन",
    "politicians.reviews": "समीक्षाहरू",
    "politicians.noLeaders": "कुनै नेता फेला परेन",
    "politicians.loadingLeaders": "नेताहरू लोड हुँदै...",

    // Reports
    "reports.title": "भ्रष्टाचार रिपोर्टहरू",
    "reports.createReport": "रिपोर्ट सिर्जना गर्नुहोस्",
    "reports.myReports": "मेरा रिपोर्टहरू",
    "reports.allReports": "सबै रिपोर्टहरू",
    "reports.pending": "बाँकी",
    "reports.underReview": "समीक्षामा",
    "reports.resolved": "समाधान भयो",
    "reports.rejected": "अस्वीकृत",
    "reports.reportType": "रिपोर्ट प्रकार",
    "reports.corruption": "भ्रष्टाचार",
    "reports.misconduct": "दुर्व्यवहार",
    "reports.waste": "स्रोतको अपव्यय",
    "reports.other": "अन्य",
    "reports.priority": "प्राथमिकता",
    "reports.high": "उच्च",
    "reports.medium": "मध्यम",
    "reports.low": "निम्न",
    "reports.amountInvolved": "समावेश रकम",
    "reports.peopleAffected": "प्रभावित व्यक्तिहरू",
    "reports.dateOccurred": "घटना मिति",
    "reports.location": "स्थान",
    "reports.description": "विवरण",
    "reports.evidence": "प्रमाण",
    "reports.attachments": "अनुलग्नकहरू",
    "reports.noReports": "कुनै रिपोर्ट फेला परेन",
    "reports.loadingReports": "रिपोर्टहरू लोड हुँदै...",

    // Dashboard
    "dashboard.welcome": "सासनमा स्वागत छ",
    "dashboard.overview": "अवलोकन",
    "dashboard.statistics": "तथ्याङ्क",
    "dashboard.recentActivity": "हालको गतिविधि",
    "dashboard.trending": "ट्रेन्डिङ",
    "dashboard.quickActions": "छिटो कार्यहरू",
    "dashboard.viewAll": "सबै हेर्नुहोस्",

    // Language
    "language.english": "English",
    "language.nepali": "नेपाली",
    "language.select": "भाषा छनोट गर्नुहोस्",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isRTL, setIsRTL] = useState(false);

  // Load saved language preference
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("app_language");
        if (
          savedLanguage &&
          (savedLanguage === "en" || savedLanguage === "ne")
        ) {
          setLanguageState(savedLanguage as Language);
        }
      } catch (error) {
        console.error("Failed to load language preference:", error);
      }
    };
    loadLanguage();
  }, []);

  // Update RTL based on language
  useEffect(() => {
    setIsRTL(language === "ne");
  }, [language]);

  const setLanguage = async (lang: Language) => {
    try {
      setLanguageState(lang);
      await AsyncStorage.setItem("app_language", lang);
    } catch (error) {
      console.error("Failed to save language preference:", error);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation =
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key;

    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{{${paramKey}}}`, String(value));
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
