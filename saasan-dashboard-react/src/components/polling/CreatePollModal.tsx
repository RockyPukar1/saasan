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
import { Textarea } from "../ui/textarea";
import type { CreatePollData } from "../../../../shared/types/polling";

import {
  PollStatus,
  PollType,
  PollCategory,
} from "../../../../shared/types/polling";
import { X, Plus, Trash2 } from "lucide-react";

interface CreatePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePollData) => void;
  categories: PollCategory[];
  statuses: PollStatus[];
}

export const CreatePollModal: React.FC<CreatePollModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  statuses,
}) => {
  const [formData, setFormData] = useState<CreatePollData>({
    title: "",
    title_nepali: "",
    description: "",
    description_nepali: "",
    status: PollStatus.ACTIVE,
    status_nepali: "",
    type: PollType.SINGLE_CHOICE,
    type_nepali: "",
    options: ["Option 1", "Option 2"],
    options_nepali: ["विकल्प १", "विकल्प २"],
    category: PollCategory.GENERAL,
    category_nepali: "",
    end_date: "",
    is_anonymous: false,
    requires_verification: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    field: keyof CreatePollData,
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
      const newOptionsNepali = [...(formData.options_nepali || [])];
      newOptionsNepali[index] = value;
      setFormData((prev) => ({
        ...prev,
        options_nepali: newOptionsNepali,
      }));
    } else {
      const newOptions = [...formData.options];
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
      options: [...prev.options, "Option " + (prev.options.length + 1)],
      options_nepali: [
        ...(prev.options_nepali || []),
        "विकल्प " + (prev.options.length + 1),
      ],
    }));
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
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

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
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

    const validOptions = formData.options.filter((option) => option.trim());
    if (validOptions.length < 2) {
      newErrors.options = "At least 2 options are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const validOptions = formData.options.filter((option) => option.trim());
      onSubmit({
        ...formData,
        options: validOptions,
      });

      // Reset form
      setFormData({
        title: "",
        title_nepali: "",
        description: "",
        description_nepali: "",
        status: PollStatus.ACTIVE,
        status_nepali: "",
        type: PollType.SINGLE_CHOICE,
        type_nepali: "",
        options: ["Option 1", "Option 2"],
        options_nepali: ["विकल्प १", "विकल्प २"],
        category: PollCategory.GENERAL,
        category_nepali: "",
        end_date: "",
        is_anonymous: false,
        requires_verification: false,
      });
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Poll
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
                value={formData.title}
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
                value={formData.title_nepali}
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
                value={formData.description}
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
                value={formData.description_nepali}
                onChange={(e) =>
                  handleInputChange("description_nepali", e.target.value)
                }
                placeholder="विवरण नेपालीमा लेख्नुहोस्"
                rows={3}
              />
            </div>
          </div>

          {/* Type and Category */}
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
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
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
                  value={formData.status_nepali}
                  onChange={(e) =>
                    handleInputChange("status_nepali", e.target.value)
                  }
                  placeholder="स्थिति नेपालीमा लेख्नुहोस्"
                />
              </div>
              <div>
                <Label htmlFor="category_nepali">Category (Nepali)</Label>
                <Input
                  id="category_nepali"
                  value={formData.category_nepali}
                  onChange={(e) =>
                    handleInputChange("category_nepali", e.target.value)
                  }
                  placeholder="श्रेणी नेपालीमा लेख्नुहोस्"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Poll Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    handleInputChange("type", value as PollType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PollType.SINGLE_CHOICE}>
                      Single Choice
                    </SelectItem>
                    <SelectItem value={PollType.MULTIPLE_CHOICE}>
                      Multiple Choice
                    </SelectItem>
                    <SelectItem value={PollType.RATING}>Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type_nepali">Poll Type (Nepali)</Label>
                <Input
                  id="type_nepali"
                  value={formData.type_nepali}
                  onChange={(e) =>
                    handleInputChange("type_nepali", e.target.value)
                  }
                  placeholder="प्रकार नेपालीमा लेख्नुहोस्"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger
                    className={errors.category ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <Label htmlFor="category_nepali">Category (Nepali)</Label>
                <Input
                  id="category_nepali"
                  value={formData.category_nepali}
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
              value={formData.end_date}
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
              {formData.options.map((option, index) => (
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
                  {formData.options.length > 2 && (
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
                checked={formData.is_anonymous}
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
                checked={formData.requires_verification}
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
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Poll</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
