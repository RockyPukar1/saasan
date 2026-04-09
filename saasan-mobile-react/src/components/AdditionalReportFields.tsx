import React from "react";
import { Calendar, DollarSign, Users, AlertTriangle, Flag } from "lucide-react";
import type { ReportCreateData } from "@/types";

interface AdditionalReportFieldsProps {
  form: ReportCreateData;
  setForm: React.Dispatch<React.SetStateAction<ReportCreateData>>;
}

const AdditionalReportFields: React.FC<AdditionalReportFieldsProps> = ({
  form,
  setForm,
}) => {
  const priorities = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
  ];

  const visibilityOptions = [
    {
      value: "public",
      label: "Public",
      description: "Anyone can view this report",
    },
    {
      value: "private",
      label: "Private",
      description: "Only authorized officials can view",
    },
    {
      value: "anonymous",
      label: "Anonymous",
      description: "Hidden from public view",
    },
  ];

  const reportTypes = [
    { value: "corruption", label: "Corruption" },
    { value: "bribery", label: "Bribery" },
    { value: "misuse", label: "Misuse of Power" },
    { value: "fraud", label: "Fraud" },
    { value: "embezzlement", label: "Embezzlement" },
    { value: "nepotism", label: "Nepotism" },
    { value: "other", label: "Other" },
  ];

  const today = new Date().toISOString().split("T")[0];
  const maxDate = today; // Can't report future dates

  return (
    <div className="mb-6 space-y-6">
      {/* Date of Incident */}
      <div>
        <p className="font-bold text-gray-800 mb-2 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Date of Incident *
        </p>
        <input
          type="date"
          value={form.dateOccurred}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, dateOccurred: e.target.value }))
          }
          max={maxDate}
          required
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      {/* Amount Involved */}
      <div>
        <p className="font-bold text-gray-800 mb-2 flex items-center">
          <DollarSign className="w-4 h-4 mr-2" />
          Amount Involved (Optional)
        </p>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            NPR
          </span>
          <input
            type="number"
            value={form.amountInvolved || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                amountInvolved: e.target.value
                  ? parseFloat(e.target.value)
                  : undefined,
              }))
            }
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full p-3 pl-12 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* People Affected */}
      <div>
        <p className="font-bold text-gray-800 mb-2 flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Number of People Affected (Optional)
        </p>
        <input
          type="number"
          value={form.peopleAffectedCount || ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              peopleAffectedCount: e.target.value
                ? parseInt(e.target.value)
                : undefined,
            }))
          }
          placeholder="Estimated number of people affected"
          min="1"
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      {/* Report Type */}
      <div>
        <p className="font-bold text-gray-800 mb-2 flex items-center">
          <Flag className="w-4 h-4 mr-2" />
          Report Type *
        </p>
        <select
          value={form.type || ""}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, type: e.target.value }))
          }
          required
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option value="">Select report type</option>
          {reportTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Priority Level */}
      <div>
        <p className="font-bold text-gray-800 mb-2 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Priority Level (Optional)
        </p>
        <div className="grid grid-cols-2 gap-2">
          {priorities.map((priority) => (
            <button
              key={priority.value}
              type="button"
              onClick={() =>
                setForm((prev) => ({ ...prev, priority: priority.value }))
              }
              className={`p-3 rounded-lg border-2 transition-all ${
                form.priority === priority.value
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${priority.color}`}
              >
                {priority.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Visibility */}
      <div>
        <p className="font-bold text-gray-800 mb-2">Report Visibility</p>
        <div className="space-y-2">
          {visibilityOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="visibility"
                value={option.value}
                checked={form.visibility === option.value}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, visibility: e.target.value }))
                }
                className="mr-3"
              />
              <div>
                <p className="font-medium text-gray-800">{option.label}</p>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <p className="font-bold text-gray-800 mb-2">Tags (Optional)</p>
        <input
          type="text"
          value={form.tags?.join(", ") || ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              tags: e.target.value
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0),
            }))
          }
          placeholder="Enter tags separated by commas (e.g., government, education, health)"
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate multiple tags with commas
        </p>
      </div>
    </div>
  );
};

export default AdditionalReportFields;
