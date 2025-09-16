import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import {
  Flame,
  Calendar,
  Target,
  Trophy,
  Clock,
  Zap,
  Star,
  Award,
} from "lucide-react-native";
import { Card, CardContent } from "~/components/ui/card";

interface StreakData {
  dailyStreak: number;
  weeklyStreak: number;
  monthlyStreak: number;
  longestDailyStreak: number;
  longestWeeklyStreak: number;
  totalDaysActive: number;
  lastActivityDate: string;
  streakHistory: Array<{
    date: string;
    activities: string[];
    points: number;
  }>;
}

interface StreaksSystemProps {
  userStats: {
    reportsSubmitted: number;
    pollsVoted: number;
    daysActive: number;
    friendsInvited: number;
    reportsUpvoted: number;
    verifiedReports: number;
  };
}

export const StreaksSystem: React.FC<StreaksSystemProps> = ({ userStats }) => {
  const [streakData, setStreakData] = useState<StreakData>({
    dailyStreak: 7,
    weeklyStreak: 3,
    monthlyStreak: 1,
    longestDailyStreak: 15,
    longestWeeklyStreak: 8,
    totalDaysActive: 45,
    lastActivityDate: new Date().toISOString(),
    streakHistory: [
      {
        date: "2024-01-15",
        activities: ["voted", "shared_report"],
        points: 25,
      },
      {
        date: "2024-01-14",
        activities: ["submitted_report", "voted"],
        points: 30,
      },
      {
        date: "2024-01-13",
        activities: ["voted", "invited_friend"],
        points: 20,
      },
      {
        date: "2024-01-12",
        activities: ["shared_report", "voted"],
        points: 15,
      },
      {
        date: "2024-01-11",
        activities: ["submitted_report"],
        points: 10,
      },
      {
        date: "2024-01-10",
        activities: ["voted", "shared_report"],
        points: 25,
      },
      {
        date: "2024-01-09",
        activities: ["voted"],
        points: 5,
      },
    ],
  });

  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");

  const getStreakMessage = () => {
    const { dailyStreak, weeklyStreak, monthlyStreak } = streakData;

    if (dailyStreak >= 30) {
      return "🔥 LEGENDARY! You're on fire with a 30+ day streak!";
    } else if (dailyStreak >= 14) {
      return "⚡ AMAZING! You're building incredible momentum!";
    } else if (dailyStreak >= 7) {
      return "🚀 GREAT! You're in the zone with a solid streak!";
    } else if (dailyStreak >= 3) {
      return "💪 GOOD! Keep the momentum going!";
    } else if (dailyStreak >= 1) {
      return "🌟 NICE! You're getting started!";
    } else {
      return "📅 Start your streak today!";
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-red-600";
    if (streak >= 14) return "text-orange-600";
    if (streak >= 7) return "text-yellow-600";
    if (streak >= 3) return "text-blue-600";
    if (streak >= 1) return "text-green-600";
    return "text-gray-600";
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return "🔥";
    if (streak >= 14) return "⚡";
    if (streak >= 7) return "🚀";
    if (streak >= 3) return "💪";
    if (streak >= 1) return "🌟";
    return "📅";
  };

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case "submitted_report":
        return "📝";
      case "voted":
        return "🗳️";
      case "shared_report":
        return "📤";
      case "invited_friend":
        return "👥";
      case "upvoted_report":
        return "👍";
      case "commented":
        return "💬";
      default:
        return "⭐";
    }
  };

  const getActivityPoints = (activity: string) => {
    switch (activity) {
      case "submitted_report":
        return 15;
      case "voted":
        return 5;
      case "shared_report":
        return 10;
      case "invited_friend":
        return 20;
      case "upvoted_report":
        return 3;
      case "commented":
        return 7;
      default:
        return 5;
    }
  };

  const getStreakRewards = () => {
    return [
      {
        streak: 3,
        reward: "Unlock 'Streak Starter' badge",
        icon: "🌟",
        unlocked: streakData.dailyStreak >= 3,
      },
      {
        streak: 7,
        reward: "Unlock 'Week Warrior' badge + 2x points",
        icon: "🚀",
        unlocked: streakData.dailyStreak >= 7,
      },
      {
        streak: 14,
        reward: "Unlock 'Streak Master' badge + 3x points",
        icon: "⚡",
        unlocked: streakData.dailyStreak >= 14,
      },
      {
        streak: 30,
        reward: "Unlock 'Legendary Streak' badge + 5x points",
        icon: "🔥",
        unlocked: streakData.dailyStreak >= 30,
      },
      {
        streak: 100,
        reward: "Unlock 'Immortal Streak' badge + VIP status",
        icon: "👑",
        unlocked: streakData.dailyStreak >= 100,
      },
    ];
  };

  const getTodayActivities = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayData = streakData.streakHistory.find(
      (day) => day.date === today
    );

    if (todayData) {
      return todayData.activities;
    }

    // Mock today's activities based on user stats
    const activities = [];
    if (userStats.reportsSubmitted > 0) activities.push("submitted_report");
    if (userStats.pollsVoted > 0) activities.push("voted");
    if (userStats.reportsUpvoted > 0) activities.push("upvoted_report");
    if (userStats.friendsInvited > 0) activities.push("invited_friend");

    return activities.length > 0 ? activities : [];
  };

  const getStreakProgress = () => {
    const todayActivities = getTodayActivities();
    const requiredActivities = 2; // Need at least 2 activities to maintain streak
    const progress = (todayActivities.length / requiredActivities) * 100;

    return {
      progress: Math.min(progress, 100),
      activities: todayActivities,
      required: requiredActivities,
    };
  };

  const streakProgress = getStreakProgress();
  const streakRewards = getStreakRewards();

  return (
    <View className="space-y-4">
      {/* Streak Header */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50">
        <CardContent className="p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-gray-800">
                🔥 Your Streak
              </Text>
              <Text className="text-sm text-gray-600">
                {getStreakMessage()}
              </Text>
            </View>
            <View className="items-center">
              <Text
                className={`text-3xl font-bold ${getStreakColor(
                  streakData.dailyStreak
                )}`}
              >
                {streakData.dailyStreak}
              </Text>
              <Text className="text-xs text-gray-500">Days</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Streak Stats */}
      <View className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 items-center">
            <Text className="text-2xl font-bold text-blue-600">
              {streakData.dailyStreak}
            </Text>
            <Text className="text-xs text-gray-600 text-center">
              Daily Streak
            </Text>
            <Text className="text-lg">
              {getStreakIcon(streakData.dailyStreak)}
            </Text>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 items-center">
            <Text className="text-2xl font-bold text-purple-600">
              {streakData.weeklyStreak}
            </Text>
            <Text className="text-xs text-gray-600 text-center">
              Weekly Streak
            </Text>
            <Text className="text-lg">📅</Text>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 items-center">
            <Text className="text-2xl font-bold text-green-600">
              {streakData.totalDaysActive}
            </Text>
            <Text className="text-xs text-gray-600 text-center">
              Total Active
            </Text>
            <Text className="text-lg">⭐</Text>
          </CardContent>
        </Card>
      </View>

      {/* Today's Progress */}
      <Card>
        <CardContent className="p-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            📅 Today's Progress
          </Text>

          <View className="mb-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm font-medium text-gray-700">
                Activities: {streakProgress.activities.length}/
                {streakProgress.required}
              </Text>
              <Text className="text-sm text-gray-600">
                {Math.round(streakProgress.progress)}%
              </Text>
            </View>
            <View className="bg-gray-200 rounded-full h-3">
              <View
                className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full"
                style={{ width: `${streakProgress.progress}%` }}
              />
            </View>
          </View>

          {/* Today's Activities */}
          <View className="space-y-2">
            {streakProgress.activities.map((activity, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between bg-green-50 p-2 rounded-lg"
              >
                <View className="flex-row items-center">
                  <Text className="text-lg mr-2">
                    {getActivityIcon(activity)}
                  </Text>
                  <Text className="text-sm font-medium text-gray-800">
                    {activity.replace("_", " ").toUpperCase()}
                  </Text>
                </View>
                <Text className="text-sm font-bold text-green-600">
                  +{getActivityPoints(activity)} pts
                </Text>
              </View>
            ))}

            {streakProgress.activities.length === 0 && (
              <View className="bg-gray-50 p-3 rounded-lg">
                <Text className="text-center text-gray-600">
                  Complete activities today to maintain your streak!
                </Text>
              </View>
            )}
          </View>
        </CardContent>
      </Card>

      {/* Streak Rewards */}
      <Card>
        <CardContent className="p-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            🏆 Streak Rewards
          </Text>

          <View className="space-y-3">
            {streakRewards.map((reward, index) => (
              <View
                key={index}
                className={`flex-row items-center p-3 rounded-lg border ${
                  reward.unlocked
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <Text className="text-2xl mr-3">{reward.icon}</Text>
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">
                    {reward.streak} Day Streak
                  </Text>
                  <Text className="text-sm text-gray-600">{reward.reward}</Text>
                </View>
                {reward.unlocked && (
                  <View className="bg-green-500 rounded-full w-6 h-6 items-center justify-center">
                    <Text className="text-white text-xs font-bold">✓</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </CardContent>
      </Card>

      {/* Streak History */}
      <Card>
        <CardContent className="p-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            📊 Recent Activity
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="space-y-2">
              {streakData.streakHistory.slice(0, 7).map((day, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <View className="flex-row items-center">
                    <Text className="text-sm font-medium text-gray-800 mr-2">
                      {new Date(day.date).toLocaleDateString()}
                    </Text>
                    <View className="flex-row">
                      {day.activities.map((activity, actIndex) => (
                        <Text key={actIndex} className="text-sm mr-1">
                          {getActivityIcon(activity)}
                        </Text>
                      ))}
                    </View>
                  </View>
                  <Text className="text-sm font-bold text-blue-600">
                    +{day.points} pts
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600">
        <CardContent className="p-4">
          <Text className="text-white font-bold text-center mb-2">
            🔥 Keep Your Streak Alive!
          </Text>
          <Text className="text-white text-center text-sm">
            Every day you participate, you're building a stronger
            anti-corruption movement in Nepal!
          </Text>
        </CardContent>
      </Card>
    </View>
  );
};
