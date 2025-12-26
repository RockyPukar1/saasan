// src/screens/DashboardScreen.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { format, differenceInDays, parseISO } from "date-fns";
import {
  AlertTriangle,
  Users,
  CheckCircle,
  FileText,
  Share,
  Gavel,
  Zap,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react-native";

// Import your UI components from React Native Reusables
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useDashboard } from "~/hooks/useDashboard";
import Loading from "~/components/Loading";
import Error from "~/components/Error";
import { useRouter } from "expo-router";
import { useLanguage } from "~/contexts/LanguageContext";
import { PageHeader } from "~/components/PageHeader";
import { ShareableImage } from "~/components/ShareableImage";
import { BadgeSystem } from "~/components/BadgeSystem";
import { Leaderboard } from "~/components/Leaderboard";
import { TrendingPolls } from "~/components/TrendingPolls";
import { TransparencyFeed } from "~/components/TransparencyFeed";
import { InviteChallenge } from "~/components/InviteChallenge";
import { StreaksSystem } from "~/components/StreaksSystem";
import { CommentSystem } from "~/components/CommentSystem";
import { VerificationSystem } from "~/components/VerificationSystem";
import { ElectionMode } from "~/components/ElectionMode";

interface CorruptionCase {
  id: string;
  title: string;
  daysSince: number;
  status: "unsolved" | "ongoing" | "solved";
  category: "murder" | "financial" | "abuse_of_power";
  description: string;
}

interface LiveStats {
  totalCorruptionCases: number;
  activeCases: number;
  solvedThisMonth: number;
  citizenReports: number;
}

interface HistoricalEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  year: number;
}

interface LiveElectricityStats {
  electricityOnlineWards: number;
  electricityOfflineWards: number;
}

const DashboardScreen = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [currentDate] = useState(new Date());
  const insets = useSafeAreaInsets();
  const [activeViralTab, setActiveViralTab] = useState<
    | "feed"
    | "polls"
    | "leaderboard"
    | "badges"
    | "invite"
    | "streaks"
    | "comments"
    | "verification"
    | "election"
  >("feed");

  const {
    dashboardStats,
    error,
    loading,
    majorCases,
    historicalEvents,
    refresh,
    serviceStatus,
  } = useDashboard();

  // Mock user stats for viral features
  const userStats = {
    reportsSubmitted: 5,
    pollsVoted: 12,
    daysActive: 15,
    friendsInvited: 3,
    reportsUpvoted: 25,
    verifiedReports: 2,
    friendsJoined: 2,
    currentStreak: 7,
    totalRewards: 1,
  };

  // Calculate electricity status from service data
  const electricityStats = useMemo(() => {
    const electricityServices = serviceStatus.filter(
      (s) => s.serviceType === "electricity"
    );
    const online = electricityServices.filter(
      (s) => s.status === "online"
    ).length;
    const offline = electricityServices.filter(
      (s) => s.status === "offline"
    ).length;

    return { online, offline, total: online + offline };
  }, [serviceStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unsolved":
        return "bg-red-500";
      case "ongoing":
        return "bg-yellow-500";
      case "solved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "murder":
        return <AlertTriangle className="text-red-600" size={20} />;
      case "financial":
        return <FileText className="text-yellow-600" size={20} />;
      case "abuse_of_power":
        return <Gavel className="text-purple-600" size={20} />;
      default:
        return <AlertTriangle className="text-gray-600" size={20} />;
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateDaysSince = (dateString: string): number => {
    return differenceInDays(new Date(), parseISO(dateString));
  };

  if (loading && !dashboardStats) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} refresh={refresh} />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Language Toggle */}
      <PageHeader
        title={t("dashboard.welcome")}
        subtitle={t("dashboard.overview")}
        showLogout={true}
      />

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      >
        {/* Live Stats Cards */}
        {dashboardStats?.overview && (
          <View className="px-4 mb-6" style={{ paddingTop: insets.top + 16 }}>
            {/* Red Banner */}
            <View className="bg-red-600 rounded-lg p-4 mb-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-white text-lg font-bold mb-1">
                    Saasan Dashboard
                  </Text>
                  <Text className="text-red-100 text-sm">
                    Monitor corruption cases, track politicians, and stay
                    informed
                  </Text>
                </View>
                <View className="bg-red-500 rounded-full p-2">
                  <Gavel className="text-white" size={24} />
                </View>
              </View>
            </View>

            {/* Quick Status */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                System Status
              </Text>
              <View className="flex-row items-center space-x-4">
                <View className="flex-row items-center">
                  <View className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                  <Text className="text-sm text-gray-600">
                    All systems operational
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Clock className="text-gray-500 mr-1" size={16} />
                  <Text className="text-sm text-gray-600">
                    {format(currentDate, "MMM dd, yyyy")}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row flex-wrap justify-between">
              <Card className="w-[48%] mb-3 border-l-3 border-red-500">
                <CardContent className="p-3">
                  <View className="flex-row justify-between items-center">
                    <Gavel className="text-red-600" size={20} />
                    <Text className="text-xl font-bold text-red-600">
                      {dashboardStats.overview.totalReports}
                    </Text>
                  </View>
                  <Text className="text-gray-600 text-xs mt-1">
                    Total Reports
                  </Text>
                  <Text className="text-red-500 text-xs">
                    {dashboardStats.overview.resolutionRate}% resolved
                  </Text>
                </CardContent>
              </Card>

              <Card className="w-[48%] mb-3 border-l-3 border-yellow-500">
                <CardContent className="p-3">
                  <View className="flex-row justify-between items-center">
                    <Clock className="text-yellow-600" size={20} />
                    <Text className="text-xl font-bold text-yellow-600">
                      {dashboardStats.overview.totalReports -
                        dashboardStats.overview.resolvedReports}
                    </Text>
                  </View>
                  <Text className="text-gray-600 text-xs mt-1">
                    Pending Cases
                  </Text>
                </CardContent>
              </Card>

              <Card className="w-[48%] mb-3 border-l-3 border-green-500">
                <CardContent className="p-3">
                  <View className="flex-row justify-between items-center">
                    <CheckCircle className="text-green-600" size={20} />
                    <Text className="text-xl font-bold text-green-600">
                      {dashboardStats.overview.resolvedReports}
                    </Text>
                  </View>
                  <Text className="text-gray-600 text-xs mt-1">
                    Cases Resolved
                  </Text>
                </CardContent>
              </Card>

              <Card className="w-[48%] mb-3 border-l-3 border-blue-500">
                <CardContent className="p-3">
                  <View className="flex-row justify-between items-center">
                    <Users className="text-blue-600" size={20} />
                    <Text className="text-xl font-bold text-blue-600">
                      {dashboardStats.overview.activePoliticians}
                    </Text>
                  </View>
                  <Text className="text-gray-600 text-xs mt-1">
                    Active Politicians
                  </Text>
                  <Text className="text-blue-500 text-xs">
                    of {dashboardStats.overview.totalPoliticians} total
                  </Text>
                </CardContent>
              </Card>
            </View>
          </View>
        )}
        {/* Electricity Status Card */}
        {electricityStats.total > 0 && (
          <View className="px-4 mb-6">
            <Card className="border-l-4 border-yellow-500">
              <CardContent className="p-4">
                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center">
                    <Zap className="text-yellow-600 mr-2" size={20} />
                    <Text className="text-lg font-bold text-gray-800">
                      Electricity Status
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                    <Text className="text-green-600 text-xs font-bold">
                      LIVE
                    </Text>
                  </View>
                </View>

                <View className="mb-3">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-green-600 text-sm font-medium">
                      Online: {electricityStats.online}
                    </Text>
                    <Text className="text-red-600 text-sm font-medium">
                      Offline: {electricityStats.offline}
                    </Text>
                  </View>

                  <View className="bg-red-200 h-6 rounded-full overflow-hidden">
                    <View
                      className="bg-green-500 h-6 rounded-full transition-all duration-1000"
                      style={{
                        width: `${
                          (electricityStats.online / electricityStats.total) *
                          100
                        }%`,
                      }}
                    />
                  </View>

                  <View className="flex-row justify-between mt-1">
                    <Text className="text-xs text-gray-500">0%</Text>
                    <Text className="text-xs text-gray-500">
                      {Math.round(
                        (electricityStats.online / electricityStats.total) * 100
                      )}
                      % Online
                    </Text>
                    <Text className="text-xs text-gray-500">100%</Text>
                  </View>
                </View>

                <Text className="text-xs text-gray-600 text-center">
                  Total Areas: {electricityStats.total}
                </Text>
              </CardContent>
            </Card>
          </View>
        )}

        {/* Major Cases Tracker */}
        <View className="px-4 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Major Cases Tracker
          </Text>
          {majorCases.length === 0 ? (
            <Card>
              <CardContent className="p-4">
                <Text className="text-gray-500 text-center">
                  No major cases to display
                </Text>
              </CardContent>
            </Card>
          ) : (
            majorCases.map((caseItem) => (
              <TouchableOpacity
                key={caseItem.id}
                onPress={() => router.push(`/report/${caseItem.id}`)}
                activeOpacity={0.7}
              >
                <Card className="mb-3">
                  <CardContent className="p-3">
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-1 mr-2">
                        <Text
                          className="text-base font-bold text-gray-800 mb-1"
                          numberOfLines={1}
                        >
                          {caseItem.title}
                        </Text>
                        <Text
                          className="text-gray-600 text-xs mb-2"
                          numberOfLines={2}
                        >
                          {caseItem.description}
                        </Text>
                        {caseItem.amountInvolved &&
                          caseItem.amountInvolved > 0 && (
                            <View className="flex-row items-center mb-1">
                              <DollarSign
                                className="text-red-500 mr-1"
                                size={12}
                              />
                              <Text className="text-red-600 text-xs font-bold">
                                {formatCurrency(caseItem.amountInvolved)}
                              </Text>
                            </View>
                          )}
                      </View>
                      <View
                        className={`px-2 py-1 rounded ${getStatusColor(
                          caseItem.status
                        )}`}
                      >
                        <Text className="text-white text-xs font-bold uppercase">
                          {caseItem.status.replace("_", " ")}
                        </Text>
                      </View>
                    </View>

                    {/* Compact Days Counter */}
                    <View className="bg-gray-100 p-2 rounded mb-2">
                      <Text className="text-lg font-bold text-red-600 text-center">
                        {caseItem.createdAt
                          ? calculateDaysSince(caseItem.createdAt)
                          : 0}{" "}
                        DAYS
                      </Text>
                      <Text className="text-gray-600 text-center text-xs">
                        since reported
                      </Text>
                    </View>

                    {/* Compact Engagement Stats */}
                    <View className="flex-row justify-between items-center pt-2 border-t border-gray-200">
                      <View className="flex-row items-center">
                        <TrendingUp className="text-green-600 mr-1" size={12} />
                        <Text className="text-green-600 text-xs font-bold">
                          {caseItem.upvotesCount || 0}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <FileText className="text-blue-600 mr-1" size={12} />
                        <Text className="text-blue-600 text-xs">
                          {caseItem.referenceNumber}
                        </Text>
                      </View>
                      <Text
                        className={`text-xs font-bold ${getPriorityColor(
                          caseItem.priority
                        )}`}
                      >
                        {caseItem.priority?.toUpperCase() || "MEDIUM"}
                      </Text>
                    </View>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Historical Events */}
        <View className="px-4 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Historical Events - On This Day
          </Text>
          {historicalEvents?.length === 0 ? (
            <Card>
              <CardContent className="p-4">
                <Text className="text-gray-500 text-center">
                  No historical events to display
                </Text>
              </CardContent>
            </Card>
          ) : (
            <>
              {historicalEvents.map((event) => (
                <Card key={event.id} className="mb-4">
                  <CardContent className="p-4">
                    <Text className="text-red-600 font-bold text-sm mb-1">
                      {event.date}
                    </Text>
                    <Text className="text-lg font-bold text-gray-800 mb-2">
                      {event.title}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      {event.description}
                    </Text>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </View>
        {/* Quick Actions */}
        <View className="px-4 mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Take Action
          </Text>
          <View className="flex-row justify-around">
            <TouchableOpacity
              className="items-center p-4"
              onPress={() => router.push("/(tabs)/reports")}
            >
              <View className="bg-red-100 p-3 rounded-full mb-2">
                <AlertTriangle className="text-red-600" size={24} />
              </View>
              <Text className="text-gray-700 text-sm font-medium">
                Report Issue
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center p-4"
              onPress={() => router.push("/(tabs)/politicians")}
            >
              <View className="bg-blue-100 p-3 rounded-full mb-2">
                <Users className="text-blue-600" size={24} />
              </View>
              <Text className="text-gray-700 text-sm font-medium">Rate MP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center p-4"
              onPress={() => {
                if (typeof navigator !== "undefined" && navigator.share) {
                  navigator.share({
                    title: "Saasan App",
                    text: "Help fight corruption in Nepal with Saasan App",
                    url: "https://saasan.app",
                  });
                } else {
                  Alert.alert("Share", "Share app functionality coming soon!");
                }
              }}
            >
              <View className="bg-green-100 p-3 rounded-full mb-2">
                <Share className="text-green-600" size={24} />
              </View>
              <Text className="text-gray-700 text-sm font-medium">
                Share App
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Viral Features Section */}
        <View className="px-4 mb-6">
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-4">
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-lg font-bold text-gray-800">
                    🚀 Viral Features
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Make Saasan go viral and fight corruption together
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                  <Text className="text-xs text-green-600 font-bold">LIVE</Text>
                </View>
              </View>

              {/* Viral Tab Navigation */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row bg-white rounded-lg p-1 mb-4">
                  {[
                    { id: "feed", label: "📰 Feed", icon: "📰" },
                    { id: "polls", label: "🔥 Polls", icon: "🔥" },
                    { id: "leaderboard", label: "🏆 Leaderboard", icon: "🏆" },
                    { id: "badges", label: "⭐ Badges", icon: "⭐" },
                    { id: "invite", label: "🚀 Invite", icon: "🚀" },
                    { id: "streaks", label: "🔥 Streaks", icon: "🔥" },
                    { id: "comments", label: "💬 Comments", icon: "💬" },
                    { id: "verification", label: "✅ Verify", icon: "✅" },
                    { id: "election", label: "🗳️ Election", icon: "🗳️" },
                  ].map((tab) => (
                    <TouchableOpacity
                      key={tab.id}
                      onPress={() => setActiveViralTab(tab.id as any)}
                      className={`py-2 px-3 rounded-md mx-1 ${
                        activeViralTab === tab.id
                          ? "bg-blue-500"
                          : "bg-transparent"
                      }`}
                    >
                      <Text
                        className={`text-xs text-center font-medium ${
                          activeViralTab === tab.id
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {tab.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Viral Content */}
              <View className="min-h-80 max-h-96">
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="flex-1"
                >
                  {activeViralTab === "feed" && <TransparencyFeed />}
                  {activeViralTab === "polls" && <TrendingPolls />}
                  {activeViralTab === "leaderboard" && (
                    <Leaderboard type="reports" period="week" />
                  )}
                  {activeViralTab === "badges" && (
                    <BadgeSystem userStats={userStats} />
                  )}
                  {activeViralTab === "invite" && (
                    <InviteChallenge userStats={userStats} />
                  )}
                  {activeViralTab === "streaks" && (
                    <StreaksSystem userStats={userStats} />
                  )}
                  {activeViralTab === "comments" && (
                    <CommentSystem
                      itemId="dashboard"
                      itemType="report"
                      onComment={(comment) =>
                        console.log("New comment:", comment)
                      }
                    />
                  )}
                  {activeViralTab === "verification" && (
                    <VerificationSystem
                      itemId="dashboard"
                      itemType="report"
                      currentStatus={{
                        status: "verified",
                        level: "high",
                        verifiedBy: "Community Verification Team",
                        verifiedAt: "2024-01-15T10:00:00Z",
                        evidenceCount: 5,
                        communityVotes: {
                          upvotes: 1250,
                          downvotes: 45,
                          totalVoters: 1295,
                        },
                        credibilityScore: 87,
                        verificationNotes:
                          "Verified through multiple sources and official documents.",
                      }}
                      onVerify={(status, notes) =>
                        console.log("Verification:", status, notes)
                      }
                      onVote={(vote) => console.log("Vote:", vote)}
                    />
                  )}
                  {activeViralTab === "election" && (
                    <ElectionMode
                      onVote={(candidateId) =>
                        console.log("Vote for:", candidateId)
                      }
                      onShare={(candidate) =>
                        console.log("Share candidate:", candidate)
                      }
                      onCompare={(candidates) =>
                        console.log("Compare:", candidates)
                      }
                    />
                  )}
                </ScrollView>
              </View>
            </CardContent>
          </Card>
        </View>
        {/* Daily Reminder Banner */}
        <View className="px-4 mb-6">
          <Card className="bg-red-500 border-red-500">
            <CardContent className="p-4">
              <View className="items-center">
                <Text className="text-white font-bold text-center mb-2">
                  📢 Daily Reminder
                </Text>
                <Text className="text-white text-sm text-center mb-3">
                  Call your local MP today and ask: "What have you done for our
                  constituency this week?"
                </Text>
                <TouchableOpacity
                  className="bg-white px-6 py-3 rounded-lg"
                  onPress={() => router.push("/(tabs)/politicians")}
                >
                  <Text className="text-red-600 font-bold text-center">
                    Find My MP
                  </Text>
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>
        </View>
        {/* Last Updated Info */}
        <View className="px-4 pb-6">
          <Text className="text-center text-gray-500 text-xs">
            Last updated: {format(currentDate, "PPpp")}
          </Text>
        </View>
        {/* Bottom padding for tab bar */}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
