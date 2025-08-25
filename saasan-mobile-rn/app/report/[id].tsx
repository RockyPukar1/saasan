// src/screens/report/[id].tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Eye,
  EyeOff,
  FileText,
  Camera,
  Mic,
  Download,
  Share,
  Flag,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Shield,
  User,
  Calendar,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
} from "lucide-react-native";

interface Evidence {
  id: string;
  type: "photo" | "document" | "audio";
  name: string;
  size: string;
  uploadDate: string;
}

interface Update {
  id: string;
  status: "submitted" | "under_review" | "verified" | "resolved" | "dismissed";
  message: string;
  date: string;
  officerName?: string;
}

interface Report {
  id: string;
  title: string;
  description: string;
  category: "corruption" | "abuse" | "bribery" | "nepotism" | "other";
  location: string;
  status: "submitted" | "under_review" | "verified" | "resolved" | "dismissed";
  dateSubmitted: string;
  lastUpdated: string;
  evidenceCount: number;
  isAnonymous: boolean;
  reporterName?: string;
  reporterContact?: string;
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  evidence: Evidence[];
  updates: Update[];
  upvotes: number;
  downvotes: number;
  views: number;
  referenceNumber: string;
}

const ReportDetailScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "details" | "evidence" | "updates"
  >("details");
  const [comment, setComment] = useState("");

  // Mock data - in real app, this would come from API based on [id]
  const report: Report = {
    id: "1",
    title: "Bribes for Citizenship Certificates",
    description:
      "Officials at the District Administration Office are demanding Rs. 5,000-10,000 as bribes for citizenship certificates that should be issued free of charge. This has been happening for several months and affects many citizens who cannot afford the illegal fees. The officials claim it's for 'expedited processing' but citizens report long delays even after paying.",
    category: "bribery",
    location: "District Administration Office, Kathmandu, Ward 16",
    status: "under_review",
    dateSubmitted: "2024-01-15",
    lastUpdated: "2024-01-18",
    evidenceCount: 3,
    isAnonymous: true,
    priority: "high",
    assignedTo: "Investigation Officer Sharma",
    referenceNumber: "RPT-2024-001547",
    upvotes: 23,
    downvotes: 2,
    views: 156,
    evidence: [
      {
        id: "1",
        type: "photo",
        name: "Receipt_Screenshot.jpg",
        size: "2.3 MB",
        uploadDate: "2024-01-15",
      },
      {
        id: "2",
        type: "audio",
        name: "Conversation_Recording.mp3",
        size: "5.7 MB",
        uploadDate: "2024-01-15",
      },
      {
        id: "3",
        type: "document",
        name: "Application_Form.pdf",
        size: "1.2 MB",
        uploadDate: "2024-01-15",
      },
    ],
    updates: [
      {
        id: "1",
        status: "submitted",
        message:
          "Your report has been received and assigned reference number RPT-2024-001547",
        date: "2024-01-15",
      },
      {
        id: "2",
        status: "under_review",
        message:
          "Investigation team has been assigned. Initial verification in progress.",
        date: "2024-01-16",
        officerName: "Officer Sharma",
      },
      {
        id: "3",
        status: "under_review",
        message:
          "Evidence reviewed and found credible. Field investigation scheduled.",
        date: "2024-01-18",
        officerName: "Investigation Team Lead",
      },
    ],
  };

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
      case "dismissed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-600";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "corruption":
        return <FileText className="text-red-600" size={20} />;
      case "bribery":
        return <AlertTriangle className="text-orange-600" size={20} />;
      case "abuse":
        return <Shield className="text-purple-600" size={20} />;
      case "nepotism":
        return <Eye className="text-blue-600" size={20} />;
      default:
        return <Flag className="text-gray-600" size={20} />;
    }
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case "photo":
        return <Camera className="text-blue-600" size={16} />;
      case "document":
        return <FileText className="text-green-600" size={16} />;
      case "audio":
        return <Mic className="text-purple-600" size={16} />;
      default:
        return <Paperclip className="text-gray-600" size={16} />;
    }
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;

    Alert.alert("Comment Added", "Your comment has been added to the report.", [
      { text: "OK", onPress: () => setComment("") },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-14 pb-4 px-5 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 p-2 -ml-2"
          >
            <ArrowLeft className="text-gray-600" size={24} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">
              Report Details
            </Text>
            <Text className="text-gray-600 text-sm">
              #{report.referenceNumber}
            </Text>
          </View>
          <TouchableOpacity className="p-2">
            <Share className="text-gray-600" size={20} />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <MoreVertical className="text-gray-600" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Status Banner */}
        <View className="px-4 py-4">
          <Card className="border-l-4 border-yellow-500">
            <CardContent className="p-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <View
                      className={`px-3 py-1 rounded-full ${getStatusColor(
                        report.status
                      )} mr-3`}
                    >
                      <Text className="text-white text-xs font-bold uppercase">
                        {report.status.replace("_", " ")}
                      </Text>
                    </View>
                    <View
                      className={`px-2 py-1 rounded-full ${getPriorityColor(
                        report.priority
                      )}`}
                    >
                      <Text className="text-white text-xs font-bold uppercase">
                        {report.priority}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-600 text-sm">
                    Last updated:{" "}
                    {new Date(report.lastUpdated).toLocaleDateString()}
                  </Text>
                  {report.assignedTo && (
                    <Text className="text-gray-600 text-sm">
                      Assigned to: {report.assignedTo}
                    </Text>
                  )}
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-gray-800">
                    {report.views}
                  </Text>
                  <Text className="text-gray-600 text-xs">views</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Report Overview */}
        <View className="px-4 mb-4">
          <Card>
            <CardContent className="p-4">
              <View className="flex-row items-start mb-3">
                {getCategoryIcon(report.category)}
                <Text className="text-xl font-bold text-gray-800 ml-2 flex-1">
                  {report.title}
                </Text>
              </View>

              <View className="flex-row items-center mb-3">
                <MapPin className="text-gray-500" size={16} />
                <Text className="text-gray-600 ml-2 flex-1">
                  {report.location}
                </Text>
              </View>

              <View className="flex-row items-center mb-3">
                <Calendar className="text-gray-500" size={16} />
                <Text className="text-gray-600 ml-2">
                  Submitted on{" "}
                  {new Date(report.dateSubmitted).toLocaleDateString()}
                </Text>
              </View>

              <View className="flex-row items-center mb-4">
                {report.isAnonymous ? (
                  <>
                    <EyeOff className="text-gray-500" size={16} />
                    <Text className="text-gray-600 ml-2">Anonymous Report</Text>
                  </>
                ) : (
                  <>
                    <User className="text-gray-500" size={16} />
                    <Text className="text-gray-600 ml-2">Public Report</Text>
                  </>
                )}
              </View>

              {/* Community Feedback */}
              <View className="flex-row justify-between items-center pt-4 border-t border-gray-200">
                <View className="flex-row items-center">
                  <TouchableOpacity className="flex-row items-center mr-4">
                    <ThumbsUp className="text-green-600" size={16} />
                    <Text className="text-green-600 ml-1 font-bold">
                      {report.upvotes}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center">
                    <ThumbsDown className="text-red-600" size={16} />
                    <Text className="text-red-600 ml-1 font-bold">
                      {report.downvotes}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text className="text-gray-500 text-sm">
                  {report.evidenceCount} evidence files
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Tab Navigation */}
        <View className="bg-white border-b border-gray-200">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-2"
          >
            <View className="flex-row py-2">
              {[
                { id: "details", name: "Details" },
                { id: "evidence", name: `Evidence (${report.evidenceCount})` },
                { id: "updates", name: `Updates (${report.updates.length})` },
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id as any)}
                  className={`mx-1 px-4 py-2 rounded-lg ${
                    activeTab === tab.id
                      ? "bg-red-100 border-b-2 border-red-600"
                      : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      activeTab === tab.id ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {tab.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Tab Content */}
        <View className="px-4 py-4">
          {activeTab === "details" && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Text className="text-gray-700 leading-6">
                  {report.description}
                </Text>
              </CardContent>
            </Card>
          )}

          {activeTab === "evidence" && (
            <View>
              {report.evidence.map((item) => (
                <Card key={item.id} className="mb-3">
                  <CardContent className="p-4">
                    <View className="flex-row items-center">
                      {getEvidenceIcon(item.type)}
                      <View className="flex-1 ml-3">
                        <Text className="font-medium text-gray-800">
                          {item.name}
                        </Text>
                        <Text className="text-gray-600 text-sm">
                          {item.size} •{" "}
                          {new Date(item.uploadDate).toLocaleDateString()}
                        </Text>
                      </View>
                      <TouchableOpacity className="p-2">
                        <Download className="text-blue-600" size={20} />
                      </TouchableOpacity>
                    </View>
                  </CardContent>
                </Card>
              ))}

              {report.evidence.length === 0 && (
                <Card>
                  <CardContent className="p-8 items-center">
                    <Paperclip className="text-gray-400" size={48} />
                    <Text className="text-gray-600 text-center mt-4">
                      No evidence files attached
                    </Text>
                  </CardContent>
                </Card>
              )}
            </View>
          )}

          {activeTab === "updates" && (
            <View>
              {report.updates.map((update, index) => (
                <Card key={update.id} className="mb-4">
                  <CardContent className="p-4">
                    <View className="flex-row items-start">
                      <View
                        className={`w-10 h-10 rounded-full ${getStatusColor(
                          update.status
                        )} items-center justify-center mr-3`}
                      >
                        <CheckCircle2 className="text-white" size={20} />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row justify-between items-center mb-2">
                          <Text className="font-bold text-gray-800 capitalize">
                            {update.status.replace("_", " ")}
                          </Text>
                          <Text className="text-gray-500 text-xs">
                            {new Date(update.date).toLocaleDateString()}
                          </Text>
                        </View>
                        <Text className="text-gray-700 mb-2">
                          {update.message}
                        </Text>
                        {update.officerName && (
                          <Text className="text-gray-500 text-sm">
                            By: {update.officerName}
                          </Text>
                        )}
                      </View>
                    </View>
                    {index < report.updates.length - 1 && (
                      <View className="ml-5 mt-4 border-l-2 border-gray-200 h-4" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </View>
          )}
        </View>

        {/* Comment Section */}
        <View className="px-4 pb-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Comment</CardTitle>
            </CardHeader>
            <CardContent>
              <TextInput
                placeholder="Add your comment or additional information..."
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={3}
                className="border border-gray-300 rounded-lg p-3 text-gray-800 mb-4"
                style={{ textAlignVertical: "top" }}
              />
              <Button onPress={handleAddComment} className="bg-blue-600">
                <View className="flex-row items-center justify-center">
                  <MessageCircle className="text-white mr-2" size={16} />
                  <Text className="text-white font-medium">Add Comment</Text>
                </View>
              </Button>
            </CardContent>
          </Card>
        </View>
      </ScrollView>

      {/* Quick Actions */}
      <View className="bg-white border-t border-gray-200 px-4 py-3">
        <View className="flex-row space-x-3">
          <TouchableOpacity className="flex-1 bg-green-600 py-3 rounded-lg items-center">
            <View className="flex-row items-center">
              <ThumbsUp className="text-white mr-2" size={16} />
              <Text className="text-white font-medium">Support</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-blue-600 py-3 rounded-lg items-center">
            <View className="flex-row items-center">
              <Share className="text-white mr-2" size={16} />
              <Text className="text-white font-medium">Share</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-red-600 py-3 rounded-lg items-center">
            <View className="flex-row items-center">
              <Flag className="text-white mr-2" size={16} />
              <Text className="text-white font-medium">Flag</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ReportDetailScreen;
