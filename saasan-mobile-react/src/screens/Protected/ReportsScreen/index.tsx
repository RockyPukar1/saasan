import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Camera,
  FileText,
  AlertTriangle,
  Upload,
  Eye,
  EyeOff,
  Shield,
  Clock,
  CheckCircle2,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { useReports } from "@/hooks/useReports";
import type { ReportCreateData } from "@/types";
import EvidencePicker from "@/components/EvidencePicker";
import LocationPicker from "@/components/LocationPicker";
import AdditionalReportFields from "@/components/AdditionalReportFields";
import { Input } from "@/components/ui/input";
import TabSelector from "@/components/common/TabSelector";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { IReport } from "@/types/reports";

interface ReportCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
}

type ReportTab = "new" | "my_reports" | "all_reports";

const isReportTab = (value: string | null): value is ReportTab => {
  return value === "new" || value === "my_reports" || value === "all_reports";
};

type CategorySelectorProps = {
  reportCategories: ReportCategory[];
  selectedCategory: string | null;
  setSelectedCategory: (id: string) => void;
};

const reportCategories: ReportCategory[] = [
  {
    id: "corruption",
    name: "Financial Corruption",
    icon: FileText,
    color: "bg-red-500",
    description: "Misuse of public funds, embezzlement",
  },
  {
    id: "bribery",
    name: "Bribery",
    icon: AlertTriangle,
    color: "bg-orange-500",
    description: "Demanding/offering bribes for services",
  },
  {
    id: "abuse",
    name: "Abuse of Power",
    icon: Shield,
    color: "bg-purple-500",
    description: "Misusing official position for personal gain",
  },
  {
    id: "nepotism",
    name: "Nepotism",
    icon: Eye,
    color: "bg-blue-500",
    description: "Favoritism in appointments or contracts",
  },
];

const getVoteCardTone = (userVote?: IReport["userVote"]) => {
  if (userVote === "up") {
    return "border-green-200 bg-green-50/60";
  }

  if (userVote === "down") {
    return "border-red-200 bg-red-50/60";
  }

  return "border-gray-200 bg-white";
};

const VoteBadge: React.FC<{ report: Pick<IReport, "userVote" | "hasVoted"> }> = ({
  report,
}) => {
  if (!report.hasVoted || !report.userVote) {
    return null;
  }

  const isUpvote = report.userVote === "up";
  const Icon = isUpvote ? ThumbsUp : ThumbsDown;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isUpvote
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {isUpvote ? "Upvoted" : "Downvoted"}
    </span>
  );
};

const CategorySelector: React.FC<CategorySelectorProps> = ({
  reportCategories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="mb-6">
      <p className="text-lg font-bold text-gray-800 mb-3">Report Category</p>

      <div className="grid grid-cols-2 gap-3">
        {reportCategories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;

          return (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`min-h-36 p-3 rounded-lg border-2 cursor-pointer transition-colors sm:p-4 ${
                isSelected
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center mb-2`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>

              <p
                className={`font-bold text-sm leading-snug ${
                  isSelected ? "text-red-800" : "text-gray-800"
                }`}
              >
                {category.name}
              </p>

              <p
                className={`text-xs mt-1 leading-snug ${
                  isSelected ? "text-red-600" : "text-gray-600"
                }`}
              >
                {category.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

type NewReportFormProps = {
  form: ReportCreateData;
  setForm: React.Dispatch<React.SetStateAction<ReportCreateData>>;
  reportCategories: ReportCategory[];
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onSubmit: () => void;
};

const NewReportForm: React.FC<NewReportFormProps> = ({
  form,
  setForm,
  reportCategories,
  selectedFiles,
  setSelectedFiles,
  onSubmit,
}) => {
  const handleFileSelect = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => file.size <= 10 * 1024 * 1024);
    if (validFiles.length !== newFiles.length) {
      toast.error("Some files exceed 10MB limit and were skipped");
    }
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 px-4 py-4">
      <CategorySelector
        reportCategories={reportCategories}
        selectedCategory={form.category}
        setSelectedCategory={(id) =>
          setForm((prev) => ({ ...prev, category: id, type: id }))
        }
      />

      {/* Anonymous Toggle */}
      <div className="mb-6">
        <div
          onClick={() =>
            setForm((prev) => ({ ...prev, isAnonymous: !prev.isAnonymous }))
          }
          className="flex items-center p-4 bg-gray-100 rounded-lg cursor-pointer transition-colors hover:bg-gray-200"
        >
          <div
            className={`w-6 h-6 rounded border-2 mr-3 flex items-center justify-center ${
              form.isAnonymous ? "bg-red-600 border-red-600" : "border-gray-400"
            }`}
          >
            {form.isAnonymous && (
              <CheckCircle2 className="w-4 h-4 text-white" />
            )}
          </div>

          <div className="flex-1">
            <p className="font-bold text-gray-800">Report Anonymously</p>
            <p className="text-gray-600 text-sm">
              Your identity will be protected
            </p>
          </div>
          {form.isAnonymous ? (
            <EyeOff className="text-red-600 w-6 h-6" />
          ) : (
            <Eye className="text-gray-600 w-6 h-6" />
          )}
        </div>
      </div>

      {/* Report Title */}
      <div className="mb-4">
        <p className="font-bold text-gray-800 mb-2">Report Title *</p>
        <Input
          placeholder="Brief title for your report"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          className="outline-none border border-gray-300 rounded-lg p-3 text-gray-800"
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="font-bold text-gray-800 mb-2">Detailed Description *</p>
        <Input
          placeholder="Provide detailed information about the incident..."
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          className="outline-none border border-gray-300 rounded-lg p-3 text-gray-800"
        />
      </div>

      {/* Location Information */}
      <LocationPicker form={form} setForm={setForm} />

      {/* Additional Report Fields */}
      <AdditionalReportFields form={form} setForm={setForm} />

      <div className="mb-6">
        <p className="font-bold text-gray-800 mb-2">Evidence (Optional)</p>
        <div className="flex flex-wrap gap-2">
          <EvidencePicker
            onFileSelect={handleFileSelect}
            background="blue"
            text="Photo"
            Icon={Camera}
            accept="image/*"
            multiple={true}
          />
          <EvidencePicker
            onFileSelect={handleFileSelect}
            background="green"
            text="Document"
            Icon={FileText}
            accept="application/pdf,.doc,.docx"
            multiple={true}
          />
          <EvidencePicker
            onFileSelect={handleFileSelect}
            background="purple"
            text="Audio"
            Icon={Upload}
            accept="audio/*"
            multiple={true}
          />
        </div>
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Selected Files:</p>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-700 truncate max-w-xs">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    onClick={() => removeFile(index)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent text-red-500 hover:text-red-700"
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-gray-500 text-xs mt-2">
          All evidence is encrypted and stored securely
        </p>
      </div>
      <Button
        onClick={onSubmit}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium"
      >
        Submit Report
      </Button>
    </div>
  );
};

const MyReportsTab: React.FC = () => {
  const { userReports: reports } = useReports();

  const navigate = useNavigate();

  return (
    <div className="flex-1 px-4 py-4">
      {reports.map((report: IReport) => (
        <div
          key={report.id}
          onClick={() => navigate(`/reports/${report.id}?from=my_reports`)}
        >
          <Card
            className={`mb-4 cursor-pointer border transition-colors ${getVoteCardTone(
              report.userVote,
            )}`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-800">
                    {report.title}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {report.description}
                  </p>
                </div>
                <VoteBadge report={report} />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <div className="flex items-center">
                  <Clock className="text-gray-500 w-3.5 h-3.5" />
                  <p className="text-gray-500 text-xs ml-1">
                    {report.createdAt}
                  </p>
                </div>
                {/* <p className="text-gray-600 text-xs">
                  {report.evidenceCount} evidence files
                </p> */}
                {report.isAnonymous && (
                  <div className="flex items-center">
                    <EyeOff className="text-gray-500 w-3.5 h-3.5" />
                    <p className="text-gray-500 text-xs ml-1">Anonymous</p>
                  </div>
                )}
              </div>

              {/* Share Button */}
              {/* <div className="mt-3 pt-3 border-t border-gray-100">
                <Button
                  onClick={() => {
                    // Show share modal
                    // setSelectedReport(report);
                  }}
                  className="flex items-center justify-center bg-blue-500 py-2 rounded-lg"
                >
                  <p className="text-white font-medium text-sm">
                    🚀 Share This Report
                  </p>
                </Button>
              </div> */}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

const AllReportsTab: React.FC = () => {
  const { allReports: reports } = useReports();
  const navigate = useNavigate();

  return (
    <div className="flex-1 px-4 py-4">
      {reports.map((report: IReport) => (
        <div
          key={report.id}
          onClick={() => navigate(`/reports/${report.id}?from=all_reports`)}
        >
          <Card
            className={`mb-4 cursor-pointer border transition-colors ${getVoteCardTone(
              report.userVote,
            )}`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-800">
                    {report.title}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {report.description}
                  </p>
                </div>
                <VoteBadge report={report} />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <div className="flex items-center">
                  <Clock className="text-gray-500 w-3.5 h-3.5" />
                  <p className="text-gray-500 text-xs ml-1">
                    {report.createdAt}
                  </p>
                </div>
                {/* <p className="text-gray-600 text-xs">
                  {report.evidenceCount} evidence files
                </p> */}
                {report.isAnonymous && (
                  <div className="flex items-center">
                    <EyeOff className="text-gray-500 w-3.5 h-3.5" />
                    <p className="text-gray-500 text-xs ml-1">Anonymous</p>
                  </div>
                )}
              </div>

              {/* Share Button */}
              {/* <div className="mt-3 pt-3 border-t border-gray-100">
                <Button
                  onClick={() => {
                    // Show share modal
                    // setSelectedReport(report);
                  }}
                  className="flex items-center justify-center bg-blue-500 py-2 rounded-lg"
                >
                  <p className="text-white font-medium text-sm">
                    🚀 Share This Report
                  </p>
                </Button>
              </div> */}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

const initialReport: ReportCreateData = {
  title: "",
  description: "",
  category: "",
  amountInvolved: 0,
  isAnonymous: false,
  provinceId: "",
  districtId: "",
  constituencyId: "",
  municipalityId: "",
  wardId: "",
  dateOccurred: new Date().toISOString(),
  peopleAffectedCount: 0,
  locationDescription: "",
  latitude: undefined,
  longitude: undefined,
  priority: "medium",
  visibility: "public",
  type: "corruption",
  tags: [],
};
export default function ReportsScreen() {
  const { createReport } = useReports();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");
  const activeTab: ReportTab = isReportTab(tabParam) ? tabParam : "new";
  const [form, setForm] = useState<ReportCreateData>(initialReport);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const setActiveTab: React.Dispatch<React.SetStateAction<ReportTab>> = (
    nextTab,
  ) => {
    const tab = typeof nextTab === "function" ? nextTab(activeTab) : nextTab;
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("tab", tab);
    setSearchParams(nextSearchParams, { replace: true });
  };

  const handleSubmitReport = async () => {
    if (!form.title || !form.description || !form.dateOccurred) {
      toast.error("Please fill all required fields");
      return;
    }

    await createReport(form, selectedFiles);

    setForm(initialReport);
    setSelectedFiles([]);
    setActiveTab("my_reports");
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div>
        {/* Tab Selector */}
        <div className="bg-white border-b border-gray-200">
          {/* Reports Summary */}
          {/* <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="text-red-600 mr-2 w-4 h-4" />
              <p className="text-sm font-medium text-gray-700">
                {reports?.length || 0} total reports
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1" />
                <p className="text-xs text-gray-600">
                  {mockReports?.filter((r) => r.status === "under_review")
                    .length || 0}{" "}
                  pending
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                <p className="text-xs text-gray-600">
                  {mockReports?.filter((r) => r.status === "resolved").length ||
                    0}{" "}
                  resolved
                </p>
              </div>
            </div>
          </div>
        </div> */}
          <TabSelector
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={[
              {
                label: "New Report",
                value: "new",
              },
              {
                label: "All Reports",
                value: "all_reports",
              },
              {
                label: "My Reports",
                value: "my_reports",
              },
            ]}
          />
        </div>

        {/* Content */}
        {activeTab === "new" ? (
          <NewReportForm
            form={form}
            setForm={setForm}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            reportCategories={reportCategories}
            onSubmit={handleSubmitReport}
          />
        ) : activeTab === "my_reports" ? (
          <MyReportsTab />
        ) : (
          <AllReportsTab />
        )}
      </div>
    </div>
  );
}
