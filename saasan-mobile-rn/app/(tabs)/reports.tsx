// src/screens/ReportsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
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

interface Report {
  id: string;
  title: string;
  description: string;
  category: "corruption" | "abuse" | "bribery" | "nepotism" | "other";
  location: string;
  status: "submitted" | "under_review" | "verified" | "resolved";
  dateSubmitted: string;
  evidenceCount: number;
  isAnonymous: boolean;
}

interface ReportCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
}

const ReportsScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"new" | "my_reports">("new");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [location, setLocation] = useState("");

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

  const mockReports: Report[] = [
    {
      id: "1",
      title: "Bribes for Citizenship",
      description: "Officials demanding money for citizenship certificates",
      category: "bribery",
      location: "Kathmandu, Ward 16",
      status: "under_review",
      dateSubmitted: "2024-01-15",
      evidenceCount: 3,
      isAnonymous: true,
    },
    {
      id: "2",
      title: "Contract Irregularities",
      description: "Suspicious road construction contract award",
      category: "corruption",
      location: "Pokhara Municipality",
      status: "verified",
      dateSubmitted: "2024-01-10",
      evidenceCount: 7,
      isAnonymous: false,
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

  const handleSubmitReport = () => {
    if (!selectedCategory || !reportTitle || !reportDescription) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    Alert.alert(
      "Report Submitted",
      "Your report has been submitted successfully. You will receive updates on its status.",
      [
        {
          text: "OK",
          onPress: () => {
            setReportTitle("");
            setReportDescription("");
            setLocation("");
            setSelectedCategory("");
            setActiveTab("my_reports");
          },
        },
      ]
    );
  };

  const CategorySelector = () => (
    <View className="mb-6">
      <Text className="text-lg font-bold text-gray-800 mb-3">
        Report Category
      </Text>
      <View className="flex-row flex-wrap">
        {reportCategories.map((category) => {
          const Icon = category.icon;
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className={`w-[48%] mb-3 mr-[2%] p-4 rounded-lg border-2 ${
                selectedCategory === category.id
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <View
                className={`w-10 h-10 rounded-full ${category.color} items-center justify-center mb-2`}
              >
                <Icon className="text-white" size={20} />
              </View>
              <Text
                className={`font-bold text-sm ${
                  selectedCategory === category.id
                    ? "text-red-800"
                    : "text-gray-800"
                }`}
              >
                {category.name}
              </Text>
              <Text
                className={`text-xs mt-1 ${
                  selectedCategory === category.id
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {category.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const NewReportForm = () => (
    <ScrollView className="flex-1 px-4 py-4">
      <CategorySelector />

      {/* Anonymous Toggle */}
      <View className="mb-6">
        <TouchableOpacity
          onPress={() => setIsAnonymous(!isAnonymous)}
          className="flex-row items-center p-4 bg-gray-100 rounded-lg"
        >
          <View
            className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
              isAnonymous ? "bg-red-600 border-red-600" : "border-gray-400"
            }`}
          >
            {isAnonymous && <CheckCircle2 className="text-white" size={16} />}
          </View>
          <View className="flex-1">
            <Text className="font-bold text-gray-800">Report Anonymously</Text>
            <Text className="text-gray-600 text-sm">
              Your identity will be protected
            </Text>
          </View>
          {isAnonymous ? (
            <EyeOff className="text-red-600" size={24} />
          ) : (
            <Eye className="text-gray-600" size={24} />
          )}
        </TouchableOpacity>
      </View>

      {/* Report Title */}
      <View className="mb-4">
        <Text className="font-bold text-gray-800 mb-2">Report Title *</Text>
        <TextInput
          placeholder="Brief title for your report"
          value={reportTitle}
          onChangeText={setReportTitle}
          className="border border-gray-300 rounded-lg p-3 text-gray-800"
        />
      </View>

      {/* Location */}
      <View className="mb-4">
        <Text className="font-bold text-gray-800 mb-2">Location</Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg p-3">
          <MapPin className="text-gray-500" size={20} />
          <TextInput
            placeholder="Where did this happen?"
            value={location}
            onChangeText={setLocation}
            className="flex-1 ml-2 text-gray-800"
          />
        </View>
      </View>

      {/* Description */}
      <View className="mb-4">
        <Text className="font-bold text-gray-800 mb-2">
          Detailed Description *
        </Text>
        <TextInput
          placeholder="Provide detailed information about the incident..."
          value={reportDescription}
          onChangeText={setReportDescription}
          multiline
          numberOfLines={4}
          className="border border-gray-300 rounded-lg p-3 text-gray-800"
          style={{ textAlignVertical: "top" }}
        />
      </View>

      {/* Evidence Upload */}
      <View className="mb-6">
        <Text className="font-bold text-gray-800 mb-2">
          Evidence (Optional)
        </Text>
        <View className="flex-row space-x-2">
          <Button
            className="flex-1 bg-blue-600 flex-row items-center justify-center"
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
          >
            <Camera className="text-white mr-2" size={16} />
            <Text className="text-white">Photo</Text>
          </Button>
          <Button
            className="flex-1 bg-green-600 flex-row items-center justify-center"
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
          >
            <FileText className="text-white mr-2" size={16} />
            <Text className="text-white">Document</Text>
          </Button>
          <Button
            className="flex-1 bg-purple-600 flex-row items-center justify-center"
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
          >
            <Upload className="text-white mr-2" size={16} />
            <Text className="text-white">Audio</Text>
          </Button>
        </View>
        <Text className="text-gray-500 text-xs mt-2">
          All evidence is encrypted and stored securely
        </Text>
      </View>

      {/* Submit Button */}
      <Button onPress={handleSubmitReport} className="bg-red-600 py-4 mb-8">
        <Text className="text-white font-bold text-lg">Submit Report</Text>
      </Button>
    </ScrollView>
  );

  const MyReportsTab = () => (
    <ScrollView className="flex-1 px-4 py-4">
      {mockReports.map((report) => (
        <TouchableOpacity
          key={report.id}
          onPress={() => router.push(`/report/${report.id}`)}
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
                  <View className="flex-row items-center mt-2">
                    <MapPin className="text-gray-500" size={12} />
                    <Text className="text-gray-500 text-xs ml-1">
                      {report.location}
                    </Text>
                  </View>
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
                    {report.dateSubmitted}
                  </Text>
                </View>
                <Text className="text-gray-600 text-xs">
                  {report.evidenceCount} evidence files
                </Text>
                {report.isAnonymous && (
                  <View className="flex-row items-center">
                    <EyeOff className="text-gray-500" size={14} />
                    <Text className="text-gray-500 text-xs ml-1">
                      Anonymous
                    </Text>
                  </View>
                )}
              </View>
            </CardContent>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-14 pb-4 px-5 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">
          Report Corruption
        </Text>
        <Text className="text-gray-600 text-sm mt-1">
          Help fight corruption in Nepal
        </Text>
      </View>

      {/* Tab Selector */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row px-4 py-2">
          <TouchableOpacity
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
          </TouchableOpacity>
          <TouchableOpacity
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
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {activeTab === "new" ? <NewReportForm /> : <MyReportsTab />}
    </View>
  );
};

export default ReportsScreen;
