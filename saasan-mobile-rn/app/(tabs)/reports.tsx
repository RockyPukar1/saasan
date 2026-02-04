// src/screens/ReportsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Camera,
  FileText,
  AlertTriangle,
  Upload,
  MapPin,
  Eye,
  EyeOff,
  Shield,
  Clock,
  CheckCircle2,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Audio } from "expo-av";
import { useLanguage } from "~/contexts/LanguageContext";
import { PageHeader } from "~/components/PageHeader";
import { ShareableImage } from "~/components/ShareableImage";
import BottomGap from "~/components/BottomGap";
import { useReports } from "~/hooks/useReports";
import { CorruptionReport, ReportCreateData } from "~/shared-types";
import EvidencePicker from "~/components/EvidencePicker";
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
    <View className="mb-6">
      <Text className="text-lg font-bold text-gray-800 mb-3">
        Report Category
      </Text>

      <View className="flex-row flex-wrap">
        {reportCategories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;

          return (
            <Pressable
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className={`w-[48%] mb-3 mr-[2%] p-4 rounded-lg border-2 ${
                isSelected
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <View
                className={`w-10 h-10 rounded-full ${category.color} items-center justify-center mb-2`}
              >
                <Icon size={20} color="white" />
              </View>

              <Text
                className={`font-bold text-sm ${
                  isSelected ? "text-red-800" : "text-gray-800"
                }`}
              >
                {category.name}
              </Text>

              <Text
                className={`text-xs mt-1 ${
                  isSelected ? "text-red-600" : "text-gray-600"
                }`}
              >
                {category.description}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
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
        <View className="mb-6">
          <Button
            onPress={() =>
              setForm((prev) => ({ ...prev, isAnonymous: !prev.isAnonymous }))
            }
            className="flex-row items-center p-4 bg-gray-100 rounded-lg"
          >
            <View
              className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
                form.isAnonymous
                  ? "bg-red-600 border-red-600"
                  : "border-gray-400"
              }`}
            >
              {form.isAnonymous && <CheckCircle2 size={16} color="white" />}
            </View>

            <View className="flex-1">
              <Text className="font-bold text-gray-800">
                Report Anonymously
              </Text>
              <Text className="text-gray-600 text-sm">
                Your identity will be protected
              </Text>
            </View>
          {form.isAnonymous ? (
            <EyeOff className="text-red-600" size={24} />
            ) : (
              <Eye size={24} color="#4b5563" />
            )}
          </Button>
        </View>

        {/* Report Title */}
        <View className="mb-4">
          <Text className="font-bold text-gray-800 mb-2">Report Title *</Text>
          <TextInput
          placeholder="Brief title for your report"
            value={form.title}
            onChangeText={(v) => setForm((p) => ({ ...p, title: v }))}
            className="outline-none border border-gray-300 rounded-lg p-3 text-gray-800"
          />
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="font-bold text-gray-800 mb-2">
            Detailed Description *
          </Text>
          <TextInput
          placeholder="Provide detailed information about the incident..."
            value={form.description}
            onChangeText={(v) =>
              setForm((p) => ({ ...p, description: v }))
            }
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="outline-none border border-gray-300 rounded-lg p-3 text-gray-800"
          />
        </View>

        {/* TODO: Province, District, Municipality, Ward */}
        {/* <View className="mb-4">
          <Text className="font-bold text-gray-800 mb-2">Location</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg pl-3">
            <MapPin className="text-gray-500" size={20} />
            <TextInput
              placeholder="Where did this happen?"
              value={form.location}
              onChangeText={(v) => setForm((p) => ({ ...p, location: v }))}
              className="outline-none flex-1 rounded-lg px-3 p-3"
            />
          </View>
        </View> */}
        <View className="mb-6">
          <Text className="font-bold text-gray-800 mb-2">
            Evidence (Optional)
          </Text>
          <View className="flex-row space-x-2 gap-2">
            <EvidencePicker
              onPress={async () => {
                try {
                  const { status } =
                    await ImagePicker.requestCameraPermissionsAsync();
                  if (status !== "granted") {
                    Alert.alert(
                      "Permission needed",
                      "Camera permission is required to take photos"
                    );
                    return;
                  }
                  const result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 0.8,
                  });
                  if (!result.canceled) {
                    // Handle photo
                  }
                } catch (error) {
                  Alert.alert("Error", "Failed to take photo");
                }
              }}
              background="blue"
              Icon={Camera}
              text="Photo"
            />
           <EvidencePicker
              onPress={async () => {
                try {
                  const result = await DocumentPicker.getDocumentAsync({
                    type: ["application/pdf", "image/*"],
                  });
                  if ("assets" in result && result.assets && result.assets[0]) {
                    // Handle document
                    const file = result.assets[0];
                  }
                } catch (error) {
                  Alert.alert("Error", "Failed to pick document");
                }
              }}
              background="green"
              Icon={FileText}
              text="Document"
           />
            <EvidencePicker
              onPress={async () => {
                try {
                  const { status } = await Audio.requestPermissionsAsync();
                  if (status !== "granted") {
                    Alert.alert(
                      "Permission needed",
                      "Audio recording permission is required"
                    );
                    return;
                  }
                  const recording = new Audio.Recording();
                  await recording.prepareToRecordAsync();
                  await recording.startAsync();
                  // Handle recording
                } catch (error) {
                  Alert.alert("Error", "Failed to start recording");
                }
              }}
              background="purple"
              Icon={Upload}
              text="Audio"
            />
          </View>
          <Text className="text-gray-500 text-xs mt-2">
            All evidence is encrypted and stored securely
          </Text>
        </View>
        <Button onPress={onSubmit} className="bg-red-600 py-3 rounded-md">
          <Text className="text-white text-center font-medium">
            Submit Report
          </Text>
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

type MyReportsTabProps = {
  setSelectedReport: React.Dispatch<React.SetStateAction<CorruptionReport | null>>;
};

const MyReportsTab: React.FC<MyReportsTabProps> = ({
  setSelectedReport }) => {
  const { userReports: reports, fetchUserReports } = useReports();
  
  useEffect(() => {
    fetchUserReports();
  }, [])
  
  return (
    <ScrollView className="flex-1 px-4 py-4">
      {reports.map((report) => (
        <View
          key={report.id}
          // onPress={() => router.push(`/report/${report.id}`)}
        >
          <Card className="mb-4">
            <CardContent className="p-4">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-800">
                    {report.title}
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1">
                    {report.description}
                  </Text>
                  {/* <View className="flex-row items-center mt-2">
                    <MapPin className="text-gray-500" size={12} />
                    <Text className="text-gray-500 text-xs ml-1">
                      {report.location}
                    </Text>
                  </View> */}
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${getStatusColor(
                    report.status
                  )}`}
                >
                  <Text className="text-white text-xs font-bold uppercase">
                    {report.status.replace("_", " ")}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center pt-3 border-t border-gray-200">
                <View className="flex-row items-center">
                  <Clock className="text-gray-500" size={14} />
                  <Text className="text-gray-500 text-xs ml-1">
                    {report.createdAt}
                  </Text>
                </View>
                {/* <Text className="text-gray-600 text-xs">
                  {report.evidenceCount} evidence files
                </Text> */}
                {report.isAnonymous && (
                  <View className="flex-row items-center">
                    <EyeOff className="text-gray-500" size={14} />
                    <Text className="text-gray-500 text-xs ml-1">
                      Anonymous
                    </Text>
                  </View>
                )}
              </View>

              {/* Share Button */}
              <View className="mt-3 pt-3 border-t border-gray-100">
                <Button
                  onPress={() => {
                    // Show share modal
                    setSelectedReport(report);
                  }}
                  className="flex-row items-center justify-center bg-blue-500 py-2 rounded-lg"
                >
                  <Text className="text-white font-medium text-sm">
                    🚀 Share This Report
                  </Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        </View>
      ))}

      {/* Bottom padding for tab bar */}
      <BottomGap />
    </ScrollView>
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
    <ScrollView className="flex-1 px-4 py-4">
      {reports.map((report) => (
        <View
          key={report.id}
          // onPress={() => router.push(`/report/${report.id}`)}
        >
          <Card className="mb-4">
            <CardContent className="p-4">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-800">
                    {report.title}
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1">
                    {report.description}
                  </Text>
                  {/* <View className="flex-row items-center mt-2">
                    <MapPin className="text-gray-500" size={12} />
                    <Text className="text-gray-500 text-xs ml-1">
                      {report.location}
                    </Text>
                  </View> */}
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${getStatusColor(
                    report.status
                  )}`}
                >
                  <Text className="text-white text-xs font-bold uppercase">
                    {report.status.replace("_", " ")}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center pt-3 border-t border-gray-200">
                <View className="flex-row items-center">
                  <Clock className="text-gray-500" size={14} />
                  <Text className="text-gray-500 text-xs ml-1">
                    {report.createdAt}
                  </Text>
                </View>
                {/* <Text className="text-gray-600 text-xs">
                  {report.evidenceCount} evidence files
                </Text> */}
                {report.isAnonymous && (
                  <View className="flex-row items-center">
                    <EyeOff className="text-gray-500" size={14} />
                    <Text className="text-gray-500 text-xs ml-1">
                      Anonymous
                    </Text>
                  </View>
                )}
              </View>

              {/* Share Button */}
              <View className="mt-3 pt-3 border-t border-gray-100">
                <Button
                  onPress={() => {
                    // Show share modal
                    setSelectedReport(report);
                  }}
                  className="flex-row items-center justify-center bg-blue-500 py-2 rounded-lg"
                >
                  <Text className="text-white font-medium text-sm">
                    🚀 Share This Report
                  </Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        </View>
      ))}

      {/* Bottom padding for tab bar */}
      <BottomGap />
    </ScrollView>
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
const ReportsScreen = () => {
  const { t } = useLanguage();
  const { createReport } = useReports()
  
  const [activeTab, setActiveTab] = useState<"new" | "my_reports" | "all_reports">("new");
  const [selectedReport, setSelectedReport] = useState<CorruptionReport | null>(null);
  const [form, setForm] = useState<ReportCreateData>(initialReport);

  const handleSubmitReport = () => {
    if (
      !form.title ||
      !form.description ||
      !form.dateOccurred
    ) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }
    createReport(form)
    Alert.alert(
      "Report Submitted",
      "Your report has been submitted successfully. You will receive updates on its status.",
      [
        {
          text: "OK",
          onPress: () => {
            setForm(initialReport);
            setActiveTab("my_reports");
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Language Toggle */}
      <PageHeader
        title={t("reports.title")}
        subtitle={t("reports.createReport")}
        showLogout={true}
      />
      <ScrollView>


      {/* Tab Selector */}
      <View className="bg-white border-b border-gray-200">
        {/* Reports Summary */}
        <View className="px-4 py-3 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            {/* <View className="flex-row items-center">
              <FileText className="text-red-600 mr-2" size={16} />
              <Text className="text-sm font-medium text-gray-700">
                {reports?.length || 0} total reports
              </Text>
            </View> */}
            {/* <View className="flex-row items-center space-x-3">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-yellow-500 rounded-full mr-1" />
                <Text className="text-xs text-gray-600">
                  {mockReports?.filter((r) => r.status === "under_review")
                    .length || 0}{" "}
                  pending
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                <Text className="text-xs text-gray-600">
                  {mockReports?.filter((r) => r.status === "resolved").length ||
                    0}{" "}
                  resolved
                </Text>
              </View>
            </View> */}
          </View>
        </View>

        <View className="flex-row px-4 py-2">
          <Button
            onPress={() => setActiveTab("new")}
            className={`flex-1 py-3 items-center border-b-2 ${
              activeTab === "new" ? "border-red-600" : "border-transparent"
            }`}
          >
            <Text
              className={`font-bold ${
                activeTab === "new" ? "text-red-600" : "text-gray-600"
              }`}
            >
              New Report
            </Text>
          </Button>
          <Button
            onPress={() => setActiveTab("all_reports")}
            className={`flex-1 py-3 items-center border-b-2 ${
              activeTab === "all_reports"
                ? "border-red-600"
                : "border-transparent"
            }`}
          >
            <Text
              className={`font-bold ${
                activeTab === "all_reports" ? "text-red-600" : "text-gray-600"
              }`}
            >
              All Reports
            </Text>
          </Button>
          <Button
            onPress={() => setActiveTab("my_reports")}
            className={`flex-1 py-3 items-center border-b-2 ${
              activeTab === "my_reports"
                ? "border-red-600"
                : "border-transparent"
            }`}
          >
            <Text
              className={`font-bold ${
                activeTab === "my_reports" ? "text-red-600" : "text-gray-600"
              }`}
            >
              My Reports
            </Text>
          </Button>
        </View>
      </View>

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
        <View className="absolute inset-0 bg-black bg-opacity-50 justify-center p-4">
          <View className="bg-white rounded-lg max-h-[80%]">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-800">
                Share This Report
              </Text>
              <Button
                onPress={() => setSelectedReport(null)}
                className="absolute right-4 top-4"
              >
                <Text className="text-gray-500 text-xl">×</Text>
              </Button>
            </View>
            <ScrollView className="max-h-96">
              <ShareableImage
                type="corruption_report"
                data={selectedReport}
                onShare={() => setSelectedReport(null)}
              />
            </ScrollView>
          </View>
        </View>
      )}
      <BottomGap />
      </ScrollView>
      
    </View>
  );
};

export default ReportsScreen;
