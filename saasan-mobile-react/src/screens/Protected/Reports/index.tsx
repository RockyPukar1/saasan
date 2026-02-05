import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { ShareableImage } from "@/components/ShareableImage";
import { useReports } from "@/hooks/useReports";
import type { CorruptionReport, ReportCreateData } from "@/types";
import EvidencePicker from "@/components/EvidencePicker";
import { Input } from "@/components/ui/input";
import TabSelector from "@/components/common/TabSelector";
interface ReportCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
}

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "submitted":
      return "bg-gray-500";
    case "under_review":
      return "bg-yellow-500";
    case "verified":
      return "bg-blue-500";
    case "resolved":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const CategorySelector: React.FC<CategorySelectorProps> = ({
  reportCategories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="mb-6">
      <p className="text-lg font-bold text-gray-800 mb-3">
        Report Category
      </p>

      <div className="flex flex-wrap">
        {reportCategories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;

          return (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-[48%] mb-3 mr-[2%] p-4 rounded-lg border-2 cursor-pointer transition-colors ${
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
                className={`font-bold text-sm ${
                  isSelected ? "text-red-800" : "text-gray-800"
                }`}
              >
                {category.name}
              </p>

              <p
                className={`text-xs mt-1 ${
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
  onSubmit: () => void;
};

const NewReportForm: React.FC<NewReportFormProps> = ({
  form,
  setForm,
  reportCategories,
  onSubmit,
}) => {
  return (
      <div
        className="flex-1 px-4 py-4"
      >
        <CategorySelector
          reportCategories={reportCategories}
          selectedCategory={form.category}
          setSelectedCategory={(id) =>
            setForm((prev) => ({ ...prev, category: id }))
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
                form.isAnonymous
                  ? "bg-red-600 border-red-600"
                  : "border-gray-400"
              }`}
            >
              {form.isAnonymous && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>

            <div className="flex-1">
              <p className="font-bold text-gray-800">
                Report Anonymously
              </p>
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
          <p className="font-bold text-gray-800 mb-2">
            Detailed Description *
          </p>
          <Input
          placeholder="Provide detailed information about the incident..."
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            className="outline-none border border-gray-300 rounded-lg p-3 text-gray-800"
          />
        </div>

        {/* TODO: Province, District, Municipality, Ward */}
        {/* <div className="mb-4">
          <p className="font-bold text-gray-800 mb-2">Location</p>
          <div className="flex-row items-center border border-gray-300 rounded-lg pl-3">
            <MapPin className="text-gray-500" size={20} />
            <Input
              placeholder="Where did this happen?"
              value={form.location}
              onChange={(v) => setForm((p) => ({ ...p, location: v }))}
              className="outline-none flex-1 rounded-lg px-3 p-3"
            />
          </div>
        </div> */}
        <div className="mb-6">
          <p className="font-bold text-gray-800 mb-2">
            Evidence (Optional)
          </p>
          <div className="flex space-x-2 gap-2">
            <EvidencePicker
              onClick={async () => {
                // try {
                //   const { status } =
                //     await ImagePicker.requestCameraPermissionsAsync();
                //   if (status !== "granted") {
                //     Alert.alert(
                //       "Permission needed",
                //       "Camera permission is required to take photos"
                //     );
                //     return;
                //   }
                //   const result = await ImagePicker.launchCameraAsync({
                //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
                //     quality: 0.8,
                //   });
                //   if (!result.canceled) {
                //     // Handle photo
                //   }
                // } catch (error) {
                //   Alert.alert("Error", "Failed to take photo");
                // }
              }}
              background="blue"
              Icon={Camera}
              text="Photo"
            />
           <EvidencePicker
              onClick={async () => {
                // try {
                //   const result = await DocumentPicker.getDocumentAsync({
                //     type: ["application/pdf", "image/*"],
                //   });
                //   if ("assets" in result && result.assets && result.assets[0]) {
                //     // Handle document
                //     const file = result.assets[0];
                //   }
                // } catch (error) {
                //   Alert.alert("Error", "Failed to pick document");
                // }
              }}
              background="green"
              Icon={FileText}
              text="Document"
           />
            <EvidencePicker
              onClick={async () => {
                // try {
                //   const { status } = await Audio.requestPermissionsAsync();
                //   if (status !== "granted") {
                //     Alert.alert(
                //       "Permission needed",
                //       "Audio recording permission is required"
                //     );
                //     return;
                //   }
                //   const recording = new Audio.Recording();
                //   await recording.prepareToRecordAsync();
                //   await recording.startAsync();
                //   // Handle recording
                // } catch (error) {
                //   Alert.alert("Error", "Failed to start recording");
                // }
              }}
              background="purple"
              Icon={Upload}
              text="Audio"
            />
          </div>
          <p className="text-gray-500 text-xs mt-2">
            All evidence is encrypted and stored securely
          </p>
        </div>
        <Button onClick={onSubmit} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium">
          Submit Report
        </Button>
      </div>
  );
};

type MyReportsTabProps = {
  setSelectedReport: React.Dispatch<React.SetStateAction<CorruptionReport | null>>;
};

const MyReportsTab: React.FC<MyReportsTabProps> = ({
  setSelectedReport }) => {
  const { userReports: reports, fetchUserReports } = useReports();
  
  console.log(reports)
  
  useEffect(() => {
    fetchUserReports();
  }, [])
  
  return (
    <div className="flex-1 px-4 py-4">
      {reports.map((report: CorruptionReport) => (
        <div
          key={report.id}
          // onPress={() => router.push(`/report/${report.id}`)}
        >
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-800">
                    {report.title}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {report.description}
                  </p>
                  {/* <div className="flex items-center mt-2">
                    <MapPin className="text-gray-500 w-3 h-3" />
                    <p className="text-gray-500 text-xs ml-1">
                      {report.location}
                    </p>
                  </div> */}
                </div>
                <div
                  className={`px-3 py-1 rounded-full ${getStatusColor(
                    report.status
                  )}`}
                >
                  <p className="text-white text-xs font-bold uppercase">
                    {report.status.replace("_", " ")}
                  </p>
                </div>
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
                    <p className="text-gray-500 text-xs ml-1">
                      Anonymous
                    </p>
                  </div>
                )}
              </div>

              {/* Share Button */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <Button
                  onClick={() => {
                    // Show share modal
                    setSelectedReport(report);
                  }}
                  className="flex items-center justify-center bg-blue-500 py-2 rounded-lg"
                >
                  <p className="text-white font-medium text-sm">
                    🚀 Share This Report
                  </p>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

type AllReportsTabProps = {
  setSelectedReport: React.Dispatch<React.SetStateAction<CorruptionReport | null>>;
}

const AllReportsTab: React.FC<AllReportsTabProps> = ({ setSelectedReport }) => {
  const { allReports: reports, fetchAllReports } = useReports();
  
  useEffect(() => {
    fetchAllReports();
  }, [])
  
  return (
    <div className="flex-1 px-4 py-4">
      {reports.map((report: CorruptionReport) => (
        <div
          key={report.id}
          // onPress={() => router.push(`/report/${report.id}`)}
        >
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-800">
                    {report.title}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {report.description}
                  </p>
                  {/* <div className="flex items-center mt-2">
                    <MapPin className="text-gray-500 w-3 h-3" />
                    <p className="text-gray-500 text-xs ml-1">
                      {report.location}
                    </p>
                  </div> */}
                </div>
                <div
                  className={`px-3 py-1 rounded-full ${getStatusColor(
                    report.status
                  )}`}
                >
                  <p className="text-white text-xs font-bold uppercase">
                    {report.status.replace("_", " ")}
                  </p>
                </div>
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
                    <p className="text-gray-500 text-xs ml-1">
                      Anonymous
                    </p>
                  </div>
                )}
              </div>

              {/* Share Button */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <Button
                  onClick={() => {
                    // Show share modal
                    setSelectedReport(report);
                  }}
                  className="flex items-center justify-center bg-blue-500 py-2 rounded-lg"
                >
                  <p className="text-white font-medium text-sm">
                    🚀 Share This Report
                  </p>
                </Button>
              </div>
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
  peopleAffectedCount: 0
};
export default function ReportsScreen() {
  const { createReport } = useReports()
  
  const [activeTab, setActiveTab] = useState<"new" | "my_reports" | "all_reports">("new");
  const [selectedReport, setSelectedReport] = useState<CorruptionReport | null>(null);
  const [form, setForm] = useState<ReportCreateData>(initialReport);

  const handleSubmitReport = () => {
    // if (
    //   !form.title ||
    //   !form.description ||
    //   !form.dateOccurred
    // ) {
    //   Alert.alert("Error", "Please fill all required fields");
    //   return;
    // }
    createReport(form)
    // Alert.alert(
    //   "Report Submitted",
    //   "Your report has been submitted successfully. You will receive updates on its status.",
    //   [
    //     {
    //       text: "OK",
    //       onPress: () => {
    //         setForm(initialReport);
    //         setActiveTab("my_reports");
    //       },
    //     },
    //   ]
    // );
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
                value: "new"
              },
              {
                label: "All Reports",
                value: "all_reports"
              },
              {
                label: "My Reports",
                value: "my_reports"
              }
            ]}
          />
      </div>

      {/* Content */}
      {activeTab === "new" ? (
        <NewReportForm
          form={form}
          setForm={setForm}
          reportCategories={reportCategories}
          onSubmit={handleSubmitReport}
        />
      ) : activeTab === "my_reports" ? (
        <MyReportsTab setSelectedReport={setSelectedReport} />
      ) : (
        <AllReportsTab setSelectedReport={setSelectedReport} />
      )}

      {/* Share Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-h-[80%] max-w-md w-full">
            <div className="p-4 border-b border-gray-200 relative">
              <p className="text-lg font-bold text-gray-800">
                Share This Report
              </p>
              <Button
                onClick={() => setSelectedReport(null)}
                className="absolute right-4 top-4 p-1"
              >
                <p className="text-gray-500 text-xl leading-none">×</p>
              </Button>
            </div>
            <div className="max-h-96">
              <ShareableImage
                type="corruption_report"
                data={selectedReport}
                onShare={() => setSelectedReport(null)}
              />
            </div>
          </div>
        </div>
      )}
      </div>
      
    </div>
  );
};
