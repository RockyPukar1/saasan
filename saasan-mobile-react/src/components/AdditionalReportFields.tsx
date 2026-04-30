import React from "react";
import { Calendar, DollarSign, Users } from "lucide-react";
import type { ReportCreateData } from "@/types";

interface AdditionalReportFieldsProps {
  form: ReportCreateData;
  setForm: React.Dispatch<React.SetStateAction<ReportCreateData>>;
}

const AdditionalReportFields: React.FC<AdditionalReportFieldsProps> = ({
  form,
  setForm,
}) => {
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
