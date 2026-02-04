import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "./ui/button";

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex-row bg-gray-100 rounded-full p-1">
      <Button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 rounded-full ${
          language === "en" ? "bg-white shadow-sm" : "bg-gray-100"
        }`}
      >
        <p
          className={`text-xs font-medium ${
            language === "en" ? "text-blue-600" : "text-gray-600"
          }`}
        >
          En
        </p>
      </Button>
      <Button
        onClick={() => setLanguage("ne")}
        className={`px-3 py-1 rounded-full ${
          language === "ne" ? "bg-white shadow-sm" : "bg-gray-100"
        }`}
      >
        <p
          className={`text-xs font-medium ${
            language === "ne" ? "text-blue-600" : "text-gray-600"
          }`}
        >
          Nep
        </p>
      </Button>
    </div>
  );
}
