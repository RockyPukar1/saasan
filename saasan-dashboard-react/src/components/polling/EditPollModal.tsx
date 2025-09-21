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
import type { Poll, UpdatePollData } from "../../types/polling";
import { PollType, PollStatus } from "../../types/polling";
import { X } from "lucide-react";

interface EditPollModalProps {
  poll: Poll;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdatePollData) => void;
  onBackToView: () => void;
  categories: string[];
}

export const EditPollModal: React.FC<EditPollModalProps> = ({
  poll,
  isOpen,
  onClose,
  onSubmit,
  onBackToView,
  categories,
}) => {
  const [formData, setFormData] = useState<UpdatePollData>({
    title: poll.title,
    description: poll.description,
    status: poll.status,
    end_date: poll.end_date,
    is_anonymous: poll.is_anonymous,
    requires_verification: poll.requires_verification,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (poll) {
      setFormData({
        title: poll.title,
        description: poll.description,
        status: poll.status,
        end_date: poll.end_date,
        is_anonymous: poll.is_anonymous,
        requires_verification: poll.requires_verification,
      });
    }
  }, [poll]);

  const handleInputChange = (
    field: keyof UpdatePollData,
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.title && !formData.title.trim()) {
      newErrors.title = "Title cannot be empty";
    }

    if (formData.description && !formData.description.trim()) {
      newErrors.description = "Description cannot be empty";
    }

    if (formData.end_date) {
      const endDate = new Date(formData.end_date);
      const now = new Date();
      if (endDate <= now) {
        newErrors.end_date = "End date must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(poll.id, formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Poll: {poll.title}
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
          <div>
            <Label htmlFor="title">Poll Title</Label>
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

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter poll description"
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                handleInputChange("status", value as PollStatus)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PollStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={PollStatus.ENDED}>Ended</SelectItem>
                <SelectItem value={PollStatus.DRAFT}>Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* End Date */}
          <div>
            <Label htmlFor="end_date">End Date</Label>
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

          {/* Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Poll Settings</h4>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_anonymous"
                checked={formData.is_anonymous || false}
                onChange={(e) =>
                  handleInputChange("is_anonymous", e.target.checked)
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
                  handleInputChange("requires_verification", e.target.checked)
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
            <Button type="button" variant="ghost" onClick={onBackToView}>
              ← Back to View
            </Button>
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Update Poll</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
