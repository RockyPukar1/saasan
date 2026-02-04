import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import {
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  Star,
  Eye,
  Flag,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";

interface VerificationStatus {
  status:
    | "verified"
    | "under_review"
    | "pending"
    | "rejected"
    | "citizen_report";
  level: "high" | "medium" | "low";
  verifiedBy: string;
  verifiedAt: string;
  evidenceCount: number;
  communityVotes: {
    upvotes: number;
    downvotes: number;
    totalVoters: number;
  };
  credibilityScore: number;
  verificationNotes?: string;
}

interface VerificationSystemProps {
  itemId: string;
  itemType: "report" | "poll" | "politician";
  currentStatus: VerificationStatus;
  onVerify?: (status: string, notes?: string) => void;
  onVote?: (vote: "up" | "down") => void;
  onReport?: () => void;
}

export const VerificationSystem: React.FC<VerificationSystemProps> = ({
  itemId,
  itemType,
  currentStatus,
  onVerify,
  onVote,
  onReport,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 border-green-300 text-green-800";
      case "under_review":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "pending":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "rejected":
        return "bg-red-100 border-red-300 text-red-800";
      case "citizen_report":
        return "bg-purple-100 border-purple-300 text-purple-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return "✅";
      case "under_review":
        return "🔍";
      case "pending":
        return "⏳";
      case "rejected":
        return "❌";
      case "citizen_report":
        return "👥";
      default:
        return "📋";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "verified":
        return "Verified by Documents";
      case "under_review":
        return "Under Review";
      case "pending":
        return "Pending Verification";
      case "rejected":
        return "Rejected";
      case "citizen_report":
        return "Citizen Report";
      default:
        return "Unknown Status";
    }
  };

  const getCredibilityLevel = (score: number) => {
    if (score >= 90)
      return { level: "Very High", color: "text-green-600", icon: "🟢" };
    if (score >= 75)
      return { level: "High", color: "text-blue-600", icon: "🔵" };
    if (score >= 60)
      return { level: "Medium", color: "text-yellow-600", icon: "🟡" };
    if (score >= 40)
      return { level: "Low", color: "text-orange-600", icon: "🟠" };
    return { level: "Very Low", color: "text-red-600", icon: "🔴" };
  };

  const handleVote = (vote: "up" | "down") => {
    if (userVote === vote) {
      setUserVote(null);
    } else {
      setUserVote(vote);
    }
    onVote?.(vote);
  };

  const handleReport = () => {
    Alert.alert(
      "Report Content",
      "Are you sure you want to report this content?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Report", style: "destructive", onPress: () => onReport?.() },
      ]
    );
  };

  const credibility = getCredibilityLevel(currentStatus.credibilityScore);
  const approvalRate =
    currentStatus.communityVotes.totalVoters > 0
      ? (currentStatus.communityVotes.upvotes /
          currentStatus.communityVotes.totalVoters) *
        100
      : 0;

  return (
    <div className="space-y-4">
      {/* Verification Status Card */}
      <Card className={getStatusColor(currentStatus.status)}>
        <CardContent className="p-4">
          <div className="flex-row items-center justify-between">
            <div className="flex-row items-center">
              <p className="text-2xl mr-2">
                {getStatusIcon(currentStatus.status)}
              </p>
              <div>
                <p className="font-bold text-lg">
                  {getStatusText(currentStatus.status)}
                </p>
                <p className="text-sm opacity-80">
                  Level: {currentStatus.level.toUpperCase()}
                </p>
              </div>
            </div>
            <Button
              onPress={() => setShowDetails(!showDetails)}
              className="bg-white bg-opacity-50 px-3 py-1 rounded-full"
            >
              <p className="text-sm font-medium">
                {showDetails ? "Hide" : "Show"} Details
              </p>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="flex-row items-center justify-between mt-3">
            <div className="flex-row items-center">
              <FileText className="mr-1" size={16} />
              <p className="text-sm">
                {currentStatus.evidenceCount} evidence files
              </p>
            </div>
            <div className="flex-row items-center">
              <Users className="mr-1" size={16} />
              <p className="text-sm">
                {currentStatus.communityVotes.totalVoters} community votes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credibility Score */}
      <Card>
        <CardContent className="p-4">
          <p className="text-lg font-bold text-gray-800 mb-3">
            📊 Credibility Score
          </p>

          <div className="flex-row items-center justify-between mb-3">
            <div className="flex-row items-center">
              <p className="text-3xl mr-2">{credibility.icon}</p>
              <div>
                <p className="text-2xl font-bold">
                  {currentStatus.credibilityScore}/100
                </p>
                <p className={`font-medium ${credibility.color}`}>
                  {credibility.level} Credibility
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-200 rounded-full h-3 mb-3">
            <div
              className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full"
              style={{ width: `${currentStatus.credibilityScore}%` }}
            />
          </div>

          <p className="text-sm text-gray-600">
            Based on evidence quality, community verification, and source
            reliability
          </p>
        </CardContent>
      </Card>

      {/* Community Verification */}
      <Card>
        <CardContent className="p-4">
          <p className="text-lg font-bold text-gray-800 mb-3">
            👥 Community Verification
          </p>

          <div className="flex-row items-center justify-between mb-3">
            <div className="items-center">
              <p className="text-2xl font-bold text-green-600">
                {currentStatus.communityVotes.upvotes}
              </p>
              <p className="text-sm text-gray-600">Upvotes</p>
            </div>
            <div className="items-center">
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(approvalRate)}%
              </p>
              <p className="text-sm text-gray-600">Approval Rate</p>
            </div>
            <div className="items-center">
              <p className="text-2xl font-bold text-red-600">
                {currentStatus.communityVotes.downvotes}
              </p>
              <p className="text-sm text-gray-600">Downvotes</p>
            </div>
          </div>

          {/* Vote Buttons */}
          <div className="flex-row space-x-2">
            <Button
              onPress={() => handleVote("up")}
              className={`flex-1 py-3 rounded-lg ${
                userVote === "up" ? "bg-green-500" : "bg-green-100"
              }`}
            >
              <div className="flex-row items-center justify-center">
                <ThumbsUp
                  className={
                    userVote === "up" ? "text-white" : "text-green-600"
                  }
                  size={20}
                />
                <p
                  className={`ml-2 font-medium ${
                    userVote === "up" ? "text-white" : "text-green-600"
                  }`}
                >
                  Trust This
                </p>
              </div>
            </Button>

            <Button
              onPress={() => handleVote("down")}
              className={`flex-1 py-3 rounded-lg ${
                userVote === "down" ? "bg-red-500" : "bg-red-100"
              }`}
            >
              <div className="flex-row items-center justify-center">
                <ThumbsDown
                  className={
                    userVote === "down" ? "text-white" : "text-red-600"
                  }
                  size={20}
                />
                <p
                  className={`ml-2 font-medium ${
                    userVote === "down" ? "text-white" : "text-red-600"
                  }`}
                >
                  Question This
                </p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      {showDetails && (
        <Card>
          <CardContent className="p-4">
            <p className="text-lg font-bold text-gray-800 mb-3">
              🔍 Verification Details
            </p>

            <div className="space-y-3">
              <div className="flex-row justify-between">
                <p className="font-medium text-gray-700">Verified By:</p>
                <p className="text-gray-600">
                  {currentStatus.verifiedBy}
                </p>
              </div>

              <div className="flex-row justify-between">
                <p className="font-medium text-gray-700">Verified At:</p>
                <p className="text-gray-600">
                  {new Date(currentStatus.verifiedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex-row justify-between">
                <p className="font-medium text-gray-700">
                  Evidence Files:
                </p>
                <p className="text-gray-600">
                  {currentStatus.evidenceCount}
                </p>
              </div>

              <div className="flex-row justify-between">
                <p className="font-medium text-gray-700">
                  Community Votes:
                </p>
                <p className="text-gray-600">
                  {currentStatus.communityVotes.totalVoters} total
                </p>
              </div>

              {currentStatus.verificationNotes && (
                <div>
                  <p className="font-medium text-gray-700 mb-1">Notes:</p>
                  <p className="text-gray-600">
                    {currentStatus.verificationNotes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Guidelines */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <p className="text-lg font-bold text-gray-800 mb-3">
            📋 Verification Guidelines
          </p>

          <div className="space-y-2">
            <div className="flex-row items-start">
              <p className="text-green-600 mr-2">✅</p>
              <p className="text-sm text-gray-700 flex-1">
                <p className="font-medium">Verified:</p> Supported by
                official documents and multiple sources
              </p>
            </div>

            <div className="flex-row items-start">
              <p className="text-yellow-600 mr-2">🔍</p>
              <p className="text-sm text-gray-700 flex-1">
                <p className="font-medium">Under Review:</p> Being
                investigated by our verification team
              </p>
            </div>

            <div className="flex-row items-start">
              <p className="text-purple-600 mr-2">👥</p>
              <p className="text-sm text-gray-700 flex-1">
                <p className="font-medium">Citizen Report:</p> Submitted
                by community member, pending verification
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Button */}
      <Button onPress={handleReport} className="bg-red-500 py-3 rounded-lg">
        <div className="flex-row items-center justify-center">
          <Flag className="text-white mr-2" size={20} />
          <p className="text-white font-medium">Report This Content</p>
        </div>
      </Button>
    </div>
  );
};
