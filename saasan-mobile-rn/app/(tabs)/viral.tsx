// src/screens/DashboardScreen.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";

import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useDashboard } from "~/hooks/useDashboard";
import Loading from "~/components/Loading";
import Error from "~/components/Error";
import { useLanguage } from "~/contexts/LanguageContext";
import { PageHeader } from "~/components/PageHeader";
import { BadgeSystem } from "~/components/BadgeSystem";
import { Leaderboard } from "~/components/Leaderboard";
import { TrendingPolls } from "~/components/TrendingPolls";
import { TransparencyFeed } from "~/components/TransparencyFeed";
import { InviteChallenge } from "~/components/InviteChallenge";
import { StreaksSystem } from "~/components/StreaksSystem";
import { CommentSystem } from "~/components/CommentSystem";
import { VerificationSystem } from "~/components/VerificationSystem";
import { ElectionMode } from "~/components/ElectionMode";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ViralScreen = () => {
  const { t } = useLanguage();
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

  const { dashboardStats, error, loading, refresh } = useDashboard();

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
        // contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
      >
        {/* Viral Features Section */}
        <Card className="overflow-hidden bg-gradient-to-r from-purple-50 to-pink-50">
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
                  <Button
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
                  </Button>
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
        {/* Bottom padding for tab bar */}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
};

export default ViralScreen;
