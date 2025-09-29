import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Check, Plus, X } from "lucide-react";

interface InlineCreateSelectProps {
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  onValueChange: (value: string) => void;
  onCreateNew: (name: string, name_nepali?: string) => Promise<any>;
  nepaliLabel?: string;
  nepaliPlaceholder?: string;
  className?: string;
  error?: string;
  defaultOption?: string;
}

export const InlineCreateSelect: React.FC<InlineCreateSelectProps> = ({
  label,
  placeholder,
  value,
  options,
  onValueChange,
  onCreateNew,
  nepaliLabel,
  nepaliPlaceholder,
  className = "",
  error,
  defaultOption,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemNameNepali, setNewItemNameNepali] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateNew = async () => {
    if (!newItemName.trim()) return;

    setIsLoading(true);
    try {
      const newItem = await onCreateNew(
        newItemName.trim(),
        newItemNameNepali.trim() || undefined
      );

      // Set the newly created item as the selected value
      const itemName = newItem?.name || newItem?.title || newItemName.trim();
      console.log("Setting value to:", itemName);

      // Reset form but keep dropdown open
      setNewItemName("");
      setNewItemNameNepali("");
      setIsCreating(false);

      // Keep dropdown open
      setIsOpen(true);

      // Set the value after a small delay to ensure state updates
      setTimeout(() => {
        onValueChange(itemName);
      }, 100);
    } catch (error) {
      console.error("Failed to create new item:", error);
      // Still set the value even if there's an error, since the user typed it
      const fallbackName = newItemName.trim();
      console.log("Setting fallback value to:", fallbackName);
      setNewItemName("");
      setNewItemNameNepali("");
      setIsCreating(false);
      setIsOpen(true);

      // Set the value after a small delay
      setTimeout(() => {
        onValueChange(fallbackName);
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelCreate = () => {
    setNewItemName("");
    setNewItemNameNepali("");
    setIsCreating(false);
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      e.stopPropagation(); // Prevent dropdown from closing
      handleCreateNew();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation(); // Prevent dropdown from closing
      handleCancelCreate();
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>

      <Select
        value={value}
        onValueChange={onValueChange}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger
          className={error ? "border-red-500" : ""}
          onClick={() => setIsOpen(true)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg">
          {/* Create new option - always first */}
          <div className="p-2 border-b border-gray-100">
            <div className="space-y-2">
              <div className="flex gap-1">
                <Input
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={`Create new ${label.toLowerCase()}`}
                  disabled={isLoading}
                  className="flex-1 h-8 text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCreateNew();
                  }}
                  disabled={!newItemName.trim() || isLoading}
                  className="h-8 px-2"
                >
                  {isLoading ? "..." : <Check className="h-3 w-3" />}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCancelCreate();
                  }}
                  disabled={isLoading}
                  className="h-8 px-2"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              {nepaliLabel && (
                <Input
                  value={newItemNameNepali}
                  onChange={(e) => setNewItemNameNepali(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={nepaliPlaceholder}
                  disabled={isLoading}
                  className="h-8 text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          </div>

          {/* Existing options */}
          {defaultOption && (
            <SelectItem
              value={defaultOption}
              className="bg-white hover:bg-gray-50"
            >
              {defaultOption}
            </SelectItem>
          )}
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="bg-white hover:bg-gray-50"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};
