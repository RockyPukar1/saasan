import React, { useState } from "react";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Label } from "./label";
import { Button } from "./button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Languages, Globe, FileText } from "lucide-react";

interface BilingualInputProps {
  label: string;
  value: {
    en: string;
    ne: string;
  };
  onChange: (value: { en: string; ne: string }) => void;
  placeholder?: {
    en: string;
    ne: string;
  };
  multiline?: boolean;
  required?: boolean;
  className?: string;
  showLanguageTabs?: boolean;
}

export function BilingualInput({
  label,
  value,
  onChange,
  placeholder = { en: "", ne: "" },
  multiline = false,
  required = false,
  className = "",
  showLanguageTabs = true,
}: BilingualInputProps) {
  const [activeTab, setActiveTab] = useState<"en" | "ne">("en");

  const handleChange = (lang: "en" | "ne", newValue: string) => {
    onChange({
      ...value,
      [lang]: newValue,
    });
  };

  const InputComponent = multiline ? Textarea : Input;

  if (!showLanguageTabs) {
    // Simple side-by-side layout
    return (
      <div className={`space-y-4 ${className}`}>
        <Label className="text-sm font-medium flex items-center gap-2">
          <Languages className="h-4 w-4" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-gray-600 flex items-center gap-1">
              <Globe className="h-3 w-3" />
              English
            </Label>
            <InputComponent
              value={value.en}
              onChange={(e) => handleChange("en", e.target.value)}
              placeholder={placeholder.en}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-600 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              नेपाली (Nepali)
            </Label>
            <InputComponent
              value={value.ne}
              onChange={(e) => handleChange("ne", e.target.value)}
              placeholder={placeholder.ne}
              className="w-full"
            />
          </div>
        </div>
      </div>
    );
  }

  // Tabbed layout
  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-sm font-medium flex items-center gap-2">
        <Languages className="h-4 w-4" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "en" | "ne")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="en" className="flex items-center gap-2">
            <Globe className="h-3 w-3" />
            English
          </TabsTrigger>
          <TabsTrigger value="ne" className="flex items-center gap-2">
            <FileText className="h-3 w-3" />
            नेपाली
          </TabsTrigger>
        </TabsList>

        <TabsContent value="en" className="space-y-2">
          <InputComponent
            value={value.en}
            onChange={(e) => handleChange("en", e.target.value)}
            placeholder={placeholder.en}
            className="w-full"
          />
          {value.ne && (
            <p className="text-xs text-gray-500">
              Nepali translation available
            </p>
          )}
        </TabsContent>

        <TabsContent value="ne" className="space-y-2">
          <InputComponent
            value={value.ne}
            onChange={(e) => handleChange("ne", e.target.value)}
            placeholder={placeholder.ne}
            className="w-full"
          />
          {!value.ne && value.en && (
            <p className="text-xs text-orange-500">
              Nepali translation missing - will show English as fallback
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface BilingualArrayInputProps {
  label: string;
  value: {
    en: string[];
    ne: string[];
  };
  onChange: (value: { en: string[]; ne: string[] }) => void;
  placeholder?: {
    en: string;
    ne: string;
  };
  required?: boolean;
  className?: string;
}

export function BilingualArrayInput({
  label,
  value,
  onChange,
  placeholder = { en: "", ne: "" },
  required = false,
  className = "",
}: BilingualArrayInputProps) {
  const [activeTab, setActiveTab] = useState<"en" | "ne">("en");

  const handleAddItem = (lang: "en" | "ne") => {
    const newValue = [...value[lang], ""];
    onChange({
      ...value,
      [lang]: newValue,
    });
  };

  const handleRemoveItem = (lang: "en" | "ne", index: number) => {
    const newValue = value[lang].filter((_, i) => i !== index);
    onChange({
      ...value,
      [lang]: newValue,
    });
  };

  const handleItemChange = (
    lang: "en" | "ne",
    index: number,
    newValue: string
  ) => {
    const newArray = [...value[lang]];
    newArray[index] = newValue;
    onChange({
      ...value,
      [lang]: newArray,
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-sm font-medium flex items-center gap-2">
        <Languages className="h-4 w-4" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "en" | "ne")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="en" className="flex items-center gap-2">
            <Globe className="h-3 w-3" />
            English
          </TabsTrigger>
          <TabsTrigger value="ne" className="flex items-center gap-2">
            <FileText className="h-3 w-3" />
            नेपाली
          </TabsTrigger>
        </TabsList>

        <TabsContent value="en" className="space-y-2">
          <div className="space-y-2">
            {value.en.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) =>
                    handleItemChange("en", index, e.target.value)
                  }
                  placeholder={`${placeholder.en} ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveItem("en", index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddItem("en")}
              className="w-full"
            >
              Add English Item
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="ne" className="space-y-2">
          <div className="space-y-2">
            {value.ne.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) =>
                    handleItemChange("ne", index, e.target.value)
                  }
                  placeholder={`${placeholder.ne} ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveItem("ne", index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddItem("ne")}
              className="w-full"
            >
              Add Nepali Item
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface BilingualFormProps {
  children: React.ReactNode;
  onSubmit: (data: unknown) => void;
  className?: string;
}

export function BilingualForm({
  children,
  onSubmit,
  className = "",
}: BilingualFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {children}
    </form>
  );
}
