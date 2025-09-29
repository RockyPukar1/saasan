import React, { useState, useEffect } from "react";
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
import { Textarea } from "../ui/textarea";
import type {
  Poll,
  CreatePollData,
  UpdatePollData,
} from "../../../../shared/types/polling";
import { X, Plus, Trash2 } from "lucide-react";
import { InlineCreateSelect } from "./InlineCreateSelect";

interface PollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePollData | UpdatePollData) => void;
  poll?: Poll | null; // If provided, it's edit mode
  categories: string[];
  statuses: string[];
  types: string[];
  createCategory: (name: string, name_nepali?: string) => Promise<string>;
  createType: (name: string, name_nepali?: string) => Promise<string>;
  onBackToView?: () => void; // Only for edit mode
}

export const PollModal: React.FC<PollModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  poll,
  categories,
  statuses,
  types,
  createCategory,
  createType,
  onBackToView,
}) => {
  const isEditMode = !!poll;

  const [formData, setFormData] = useState<CreatePollData | UpdatePollData>({
    title: "",
    title_nepali: "",
    description: "",
    description_nepali: "",
    status: "ACTIVE",
    status_nepali: "",
    type: "SINGLE_CHOICE",
    type_nepali: "",
    options: ["Option 1", "Option 2"],
    options_nepali: ["विकल्प १", "विकल्प २"],
    category: "GENERAL",
    category_nepali: "",
    end_date: "",
    is_anonymous: false,
    requires_verification: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data based on mode
  useEffect(() => {
    if (isEditMode && poll) {
      setFormData({
        title: poll.title,
        title_nepali: poll.title_nepali || "",
        description: poll.description,
        description_nepali: poll.description_nepali || "",
        status: poll.status,
        status_nepali: poll.status_nepali || "",
        type: poll.type,
        type_nepali: poll.type_nepali || "",
        category: poll.category,
        category_nepali: poll.category_nepali || "",
        end_date: poll.end_date || "",
        is_anonymous: poll.is_anonymous,
        requires_verification: poll.requires_verification,
        // Include options in edit mode - convert from PollOption[] to string[]
        options: poll.options?.map((option) => option.text) || [],
        options_nepali:
          poll.options?.map((option) => option.text_nepali || "") || [],
      });
    } else {
      // Reset to default values for create mode
      setFormData({
        title: "",
        title_nepali: "",
        description: "",
        description_nepali: "",
        status: "ACTIVE",
        status_nepali: "",
        type: "SINGLE_CHOICE",
        type_nepali: "",
        options: ["Option 1", "Option 2"],
        options_nepali: ["विकल्प १", "विकल्प २"],
        category: "GENERAL",
        category_nepali: "",
        end_date: "",
        is_anonymous: false,
        requires_verification: false,
      });
    }
  }, [isEditMode, poll]);

  const handleInputChange = (
    field: keyof (CreatePollData | UpdatePollData),
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleOptionChange = (
    index: number,
    value: string,
    isNepali = false
  ) => {
    if (isNepali) {
      const newOptionsNepali = [...(formData.options_nepali || [])] as string[];
      newOptionsNepali[index] = value;
      setFormData((prev) => ({
        ...prev,
        options_nepali: newOptionsNepali,
      }));
    } else {
      const newOptions = [...(formData.options || [])] as string[];
      newOptions[index] = value;
      setFormData((prev) => ({
        ...prev,
        options: newOptions,
      }));
    }
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [
        ...(prev.options || []),
        "Option " + ((prev.options?.length || 0) + 1),
      ],
      options_nepali: [
        ...(prev.options_nepali || []),
        "विकल्प " + ((prev.options?.length || 0) + 1),
      ],
    }));
  };

  const removeOption = (index: number) => {
    if ((formData.options?.length || 0) > 2) {
      const newOptions = (formData.options || []).filter((_, i) => i !== index);
      const newOptionsNepali = (formData.options_nepali || []).filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({
        ...prev,
        options: newOptions,
        options_nepali: newOptionsNepali,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    } else {
      const endDate = new Date(formData.end_date);
      const now = new Date();
      if (endDate <= now) {
        newErrors.end_date = "End date must be in the future";
      }
    }

    const validOptions = (formData.options || []).filter((option) =>
      option.trim()
    );
    if (validOptions.length < 2) {
      newErrors.options = "At least 2 options are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const validOptions = (formData.options || []).filter((option) =>
        option.trim()
      );
      const submitData = {
        ...formData,
        options: validOptions,
      };

      onSubmit(submitData);

      // Reset form only in create mode
      if (!isEditMode) {
        setFormData({
          title: "",
          title_nepali: "",
          description: "",
          description_nepali: "",
          status: "ACTIVE",
          status_nepali: "",
          type: "SINGLE_CHOICE",
          type_nepali: "",
          options: ["Option 1", "Option 2"],
          options_nepali: ["विकल्प १", "विकल्प २"],
          category: "GENERAL",
          category_nepali: "",
          end_date: "",
          is_anonymous: false,
          requires_verification: false,
        });
        setErrors({});
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? `Edit Poll: ${poll?.title}` : "Create New Poll"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Poll Title *</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter poll title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            <div>
              <Label htmlFor="title_nepali">Poll Title (Nepali)</Label>
              <Input
                id="title_nepali"
                value={formData.title_nepali || ""}
                onChange={(e) =>
                  handleInputChange("title_nepali", e.target.value)
                }
                placeholder="शीर्षक नेपालीमा लेख्नुहोस्"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter poll description"
                rows={3}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="description_nepali">Description (Nepali)</Label>
              <Textarea
                id="description_nepali"
                value={formData.description_nepali || ""}
                onChange={(e) =>
                  handleInputChange("description_nepali", e.target.value)
                }
                placeholder="विवरण नेपालीमा लेख्नुहोस्"
                rows={3}
              />
            </div>
          </div>

          {/* Status, Type, and Category */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger
                    className={errors.status ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    {statuses.map((status) => (
                      <SelectItem
                        value={status}
                        className="bg-white hover:bg-gray-50"
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                )}
              </div>

              <div>
                <Label htmlFor="status_nepali">Status (Nepali)</Label>
                <Input
                  id="status_nepali"
                  value={formData.status_nepali || ""}
                  onChange={(e) =>
                    handleInputChange("status_nepali", e.target.value)
                  }
                  placeholder="स्थिति नेपालीमा लेख्नुहोस्"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InlineCreateSelect
                label="Poll Type *"
                placeholder="Select poll type"
                value={formData.type || ""}
                options={types || []}
                onValueChange={(value) => handleInputChange("type", value)}
                onCreateNew={createType}
                nepaliLabel="Poll Type (Nepali)"
                nepaliPlaceholder="प्रकार नेपालीमा लेख्नुहोस्"
                error={errors.type}
              />

              <div>
                <Label htmlFor="type_nepali">Poll Type (Nepali)</Label>
                <Input
                  id="type_nepali"
                  value={formData.type_nepali || ""}
                  onChange={(e) =>
                    handleInputChange("type_nepali", e.target.value)
                  }
                  placeholder="प्रकार नेपालीमा लेख्नुहोस्"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InlineCreateSelect
                label="Category *"
                placeholder="Select category"
                value={formData.category || ""}
                options={categories}
                onValueChange={(value) => handleInputChange("category", value)}
                onCreateNew={createCategory}
                nepaliLabel="Category (Nepali)"
                nepaliPlaceholder="श्रेणी नेपालीमा लेख्नुहोस्"
                error={errors.category}
                defaultOption={
                  categories.includes("General") ? undefined : "General"
                }
              />

              <div>
                <Label htmlFor="category_nepali">Category (Nepali)</Label>
                <Input
                  id="category_nepali"
                  value={formData.category_nepali || ""}
                  onChange={(e) =>
                    handleInputChange("category_nepali", e.target.value)
                  }
                  placeholder="श्रेणी नेपालीमा लेख्नुहोस्"
                />
              </div>
            </div>
          </div>

          {/* End Date */}
          <div>
            <Label htmlFor="end_date">End Date *</Label>
            <Input
              id="end_date"
              type="datetime-local"
              value={formData.end_date || ""}
              onChange={(e) => handleInputChange("end_date", e.target.value)}
              className={errors.end_date ? "border-red-500" : ""}
            />
            {errors.end_date && (
              <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
            )}
          </div>

          {/* Options */}
          <div>
            <Label>Poll Options *</Label>
            <div className="space-y-3 mt-2">
              {(formData.options || []).map((option, index) => (
                <div key={index} className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value, false)
                      }
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    <Input
                      value={formData.options_nepali?.[index] || ""}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value, true)
                      }
                      placeholder={`विकल्प ${index + 1}`}
                      className="flex-1"
                    />
                  </div>
                  {(formData.options?.length || 0) > 2 && (
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
            {errors.options && (
              <p className="text-red-500 text-sm mt-1">{errors.options}</p>
            )}
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Poll Settings</h4>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_anonymous"
                checked={formData.is_anonymous || false}
                onChange={(e) =>
                  handleInputChange("is_anonymous", e.target.checked as boolean)
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="is_anonymous" className="text-sm">
                Anonymous voting
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requires_verification"
                checked={formData.requires_verification || false}
                onChange={(e) =>
                  handleInputChange(
                    "requires_verification",
                    e.target.checked as boolean
                  )
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="requires_verification" className="text-sm">
                Require verification to vote
              </Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            {isEditMode && onBackToView ? (
              <Button type="button" variant="ghost" onClick={onBackToView}>
                ← Back to View
              </Button>
            ) : (
              <div />
            )}
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? "Update Poll" : "Create Poll"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
