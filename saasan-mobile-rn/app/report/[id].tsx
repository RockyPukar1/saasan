import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  MapPin,
  Clock,
  EyeOff,
  ChevronLeft,
  FileText,
  Camera,
  Upload,
  ThumbsUp,
  ThumbsDown,
  Share2,
} from "lucide-react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useReports } from "~/hooks/useReports";
import { CorruptionReport, Evidence } from "../../../../shared/types/reports";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Audio } from "expo-av";
import * as Clipboard from "expo-clipboard";

const ReportDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getReport, voteOnReport, uploadEvidence } = useReports();
  const [report, setReport] = useState<CorruptionReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    try {
      const data = await getReport(id as string);
      setReport(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load report details");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (isUpvote: boolean) => {
    try {
      await voteOnReport(id as string, isUpvote);
      loadReport(); // Reload report to get updated vote counts
    } catch (error) {
      Alert.alert("Error", "Failed to register vote");
    }
  };

  const handleShare = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: report?.title || "Corruption Report",
          text: `Check out this corruption report: ${report?.description}`,
          url: `https://saasan.app/report/${id}`,
        });
      } else {
        Alert.alert("Share", "Copy this link to share:", [
          {
            text: "Copy",
            onPress: async () => {
              await Clipboard.setStringAsync(`https://saasan.app/report/${id}`);
              Alert.alert("Success", "Link copied to clipboard!");
            },
          },
          { text: "Cancel", style: "cancel" },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to share report");
    }
  };

  const handleUploadEvidence = async (type: "photo" | "document" | "audio") => {
    try {
      let file;
      switch (type) {
        case "photo":
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
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
          if (!result.canceled && result.assets[0]) {
            file = result.assets[0];
          }
          break;

        case "document":
          const docResult = await DocumentPicker.getDocumentAsync({
            type: ["application/pdf", "image/*"],
          });
          if (
            "assets" in docResult &&
            docResult.assets &&
            docResult.assets[0]
          ) {
            file = docResult.assets[0];
          }
          break;

        case "audio":
          const audioStatus = await Audio.requestPermissionsAsync();
          if (audioStatus.status !== "granted") {
            Alert.alert(
              "Permission needed",
              "Audio recording permission is required"
            );
            return;
          }
          const recording = new Audio.Recording();
          await recording.prepareToRecordAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
          );
          await recording.startAsync();
          // Show recording UI and handle stop recording
          Alert.alert("Recording", "Recording started. Press OK to stop.", [
            {
              text: "OK",
              onPress: async () => {
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                if (uri) {
                  file = { uri, type: "audio/m4a", name: "recording.m4a" };
                  await uploadEvidence(id as string, file);
                  loadReport();
                }
              },
            },
          ]);
          return;
      }

      if (file) {
        await uploadEvidence(id as string, file);
        loadReport();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload evidence");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Report not found</Text>
      </View>
    );
  }

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

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-14 pb-4 px-5 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center mb-4"
        >
          <ChevronLeft className="text-gray-800" size={24} />
          <Text className="text-gray-800 ml-1">Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">{report.title}</Text>
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <MapPin className="text-gray-500" size={14} />
            <Text className="text-gray-500 text-sm ml-1">
              {report.location}
            </Text>
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
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Description Card */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Text className="text-gray-800">{report.description}</Text>
            <View className="flex-row items-center mt-4 pt-4 border-t border-gray-200">
              <Clock className="text-gray-500" size={14} />
              <Text className="text-gray-500 text-sm ml-1">
                {new Date(report.created_at).toLocaleDateString()}
              </Text>
              {report.is_anonymous && (
                <View className="flex-row items-center ml-4">
                  <EyeOff className="text-gray-500" size={14} />
                  <Text className="text-gray-500 text-sm ml-1">Anonymous</Text>
                </View>
              )}
            </View>
          </CardContent>
        </Card>

        {/* Evidence Section */}
        <View className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">Evidence</Text>
          <View className="flex-row space-x-2 mb-4">
            <Button
              onPress={() => handleUploadEvidence("photo")}
              className="flex-1 bg-blue-600 flex-row items-center justify-center"
            >
              <Camera className="text-white mr-2" size={16} />
              <Text className="text-white">Photo</Text>
            </Button>
            <Button
              onPress={() => handleUploadEvidence("document")}
              className="flex-1 bg-green-600 flex-row items-center justify-center"
            >
              <FileText className="text-white mr-2" size={16} />
              <Text className="text-white">Document</Text>
            </Button>
            <Button
              onPress={() => handleUploadEvidence("audio")}
              className="flex-1 bg-purple-600 flex-row items-center justify-center"
            >
              <Upload className="text-white mr-2" size={16} />
              <Text className="text-white">Audio</Text>
            </Button>
          </View>

          {report.evidence && report.evidence.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {report.evidence.map((item: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  className="mr-3 bg-white rounded-lg overflow-hidden border border-gray-200"
                >
                  <Image
                    source={{ uri: item.url }}
                    className="w-24 h-24"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text className="text-gray-500 text-center">
              No evidence uploaded yet
            </Text>
          )}
        </View>

        {/* Actions */}
        <View className="flex-row justify-between items-center bg-white p-4 rounded-lg mb-4">
          <TouchableOpacity
            onPress={() => handleVote(true)}
            className="flex-row items-center"
          >
            <ThumbsUp
              className={
                report.user_vote === "up" ? "text-green-600" : "text-gray-500"
              }
              size={20}
            />
            <Text className="ml-2 text-gray-800">{report.upvotes_count}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleVote(false)}
            className="flex-row items-center"
          >
            <ThumbsDown
              className={
                report.user_vote === "down" ? "text-red-600" : "text-gray-500"
              }
              size={20}
            />
            <Text className="ml-2 text-gray-800">{report.downvotes_count}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShare}
            className="flex-row items-center"
          >
            <Share2 className="text-gray-500" size={20} />
            <Text className="ml-2 text-gray-800">{report.shares_count}</Text>
          </TouchableOpacity>
        </View>

        {/* Status Updates */}
        <View>
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Status Updates
          </Text>
          {report.status_updates && report.status_updates.length > 0 ? (
            report.status_updates.map((update: any, index: number) => (
              <Card key={index} className="mb-3">
                <CardContent className="p-4">
                  <Text className="font-bold text-gray-800">
                    {update.status}
                  </Text>
                  <Text className="text-gray-600 mt-1">{update.comment}</Text>
                  <Text className="text-gray-500 text-sm mt-2">
                    {new Date(update.created_at).toLocaleDateString()}
                  </Text>
                </CardContent>
              </Card>
            ))
          ) : (
            <Text className="text-gray-500 text-center">
              No status updates yet
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ReportDetailScreen;
