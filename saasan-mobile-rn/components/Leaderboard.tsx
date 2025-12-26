import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  MapPin,
  Users,
  AlertTriangle,
  BarChart3,
} from "lucide-react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "./ui/button";

interface LeaderboardEntry {
  rank: number;
  name: string;
  location: string;
  score: number;
  metric: string;
  change?: "up" | "down" | "same";
  badge?: "champion" | "rising" | "consistent";
}

interface LeaderboardProps {
  type: "reports" | "participation" | "corruption_fighters";
  period: "week" | "month" | "all_time";
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ type, period }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  const getLeaderboardData = (): LeaderboardEntry[] => {
    // Mock data - in real app, this would come from API
    switch (type) {
      case "reports":
        return [
          {
            rank: 1,
            name: "Kathmandu",
            location: "Bagmati Province",
            score: 247,
            metric: "reports",
            change: "up",
            badge: "champion",
          },
          {
            rank: 2,
            name: "Pokhara",
            location: "Gandaki Province",
            score: 189,
            metric: "reports",
            change: "up",
            badge: "rising",
          },
          {
            rank: 3,
            name: "Lalitpur",
            location: "Bagmati Province",
            score: 156,
            metric: "reports",
            change: "same",
          },
          {
            rank: 4,
            name: "Bharatpur",
            location: "Bagmati Province",
            score: 134,
            metric: "reports",
            change: "down",
          },
          {
            rank: 5,
            name: "Biratnagar",
            location: "Province 1",
            score: 98,
            metric: "reports",
            change: "up",
          },
        ];

      case "participation":
        return [
          {
            rank: 1,
            name: "Pokhara",
            location: "Gandaki Province",
            score: 1247,
            metric: "active users",
            change: "up",
            badge: "champion",
          },
          {
            rank: 2,
            name: "Kathmandu",
            location: "Bagmati Province",
            score: 1156,
            metric: "active users",
            change: "same",
          },
          {
            rank: 3,
            name: "Chitwan",
            location: "Bagmati Province",
            score: 892,
            metric: "active users",
            change: "up",
            badge: "rising",
          },
          {
            rank: 4,
            name: "Lalitpur",
            location: "Bagmati Province",
            score: 745,
            metric: "active users",
            change: "down",
          },
          {
            rank: 5,
            name: "Bharatpur",
            location: "Bagmati Province",
            score: 634,
            metric: "active users",
            change: "up",
          },
        ];

      case "corruption_fighters":
        return [
          {
            rank: 1,
            name: "Kathmandu Ward 15",
            location: "Kathmandu",
            score: 89,
            metric: "verified reports",
            change: "up",
            badge: "champion",
          },
          {
            rank: 2,
            name: "Pokhara Ward 8",
            location: "Pokhara",
            score: 67,
            metric: "verified reports",
            change: "up",
            badge: "rising",
          },
          {
            rank: 3,
            name: "Lalitpur Ward 22",
            location: "Lalitpur",
            score: 54,
            metric: "verified reports",
            change: "same",
          },
          {
            rank: 4,
            name: "Bharatpur Ward 12",
            location: "Bharatpur",
            score: 43,
            metric: "verified reports",
            change: "down",
          },
          {
            rank: 5,
            name: "Biratnagar Ward 5",
            location: "Biratnagar",
            score: 38,
            metric: "verified reports",
            change: "up",
          },
        ];

      default:
        return [];
    }
  };

  const leaderboardData = getLeaderboardData();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-orange-500" size={24} />;
      default:
        return <Text className="text-lg font-bold text-gray-600">#{rank}</Text>;
    }
  };

  const getChangeIcon = (change?: string) => {
    switch (change) {
      case "up":
        return <TrendingUp className="text-green-500" size={16} />;
      case "down":
        return <TrendingUp className="text-red-500 rotate-180" size={16} />;
      default:
        return <View className="w-4 h-4 rounded-full bg-gray-300" />;
    }
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case "champion":
        return "bg-yellow-100 border-yellow-300";
      case "rising":
        return "bg-green-100 border-green-300";
      case "consistent":
        return "bg-blue-100 border-blue-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const getLeaderboardTitle = () => {
    switch (type) {
      case "reports":
        return "🚨 Corruption Reports Leaderboard";
      case "participation":
        return "👥 Active Citizens Leaderboard";
      case "corruption_fighters":
        return "🛡️ Corruption Fighters Leaderboard";
      default:
        return "🏆 Leaderboard";
    }
  };

  const getViralMessage = () => {
    const topEntry = leaderboardData[0];
    switch (type) {
      case "reports":
        return `🔥 ${topEntry.name} citizens submitted ${topEntry.score} corruption reports this ${selectedPeriod}! Will your city be next?`;
      case "participation":
        return `⚡ ${topEntry.score} active citizens in ${topEntry.name} are fighting corruption! Join the movement!`;
      case "corruption_fighters":
        return `🛡️ ${topEntry.name} leads with ${topEntry.score} verified reports! Every ward can make a difference!`;
      default:
        return `🏆 ${topEntry.name} is leading the fight against corruption!`;
    }
  };

  return (
    <View className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50">
        <CardContent className="p-4">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            {getLeaderboardTitle()}
          </Text>
          <Text className="text-sm text-gray-700">{getViralMessage()}</Text>
        </CardContent>
      </Card>

      {/* Period Selector */}
      <View className="flex-row space-x-2">
        {["week", "month", "all_time"].map((period) => (
          <Button
            key={period}
            onPress={() => setSelectedPeriod(period as any)}
            className={`flex-1 py-2 px-4 rounded-lg border ${
              selectedPeriod === period
                ? "bg-blue-500 border-blue-500"
                : "bg-white border-gray-300"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                selectedPeriod === period ? "text-white" : "text-gray-700"
              }`}
            >
              {period === "week"
                ? "This Week"
                : period === "month"
                ? "This Month"
                : "All Time"}
            </Text>
          </Button>
        ))}
      </View>

      {/* Leaderboard */}
      <View className="space-y-2">
        {leaderboardData.map((entry, index) => (
          <Card
            key={entry.rank}
            className={entry.badge ? getBadgeColor(entry.badge) : ""}
          >
            <CardContent className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="mr-3">{getRankIcon(entry.rank)}</View>

                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="font-bold text-gray-800 text-lg">
                        {entry.name}
                      </Text>
                      {entry.badge && (
                        <View className="ml-2 px-2 py-1 rounded-full bg-white border">
                          <Text className="text-xs font-medium text-gray-700">
                            {entry.badge === "champion"
                              ? "👑"
                              : entry.badge === "rising"
                              ? "📈"
                              : "🏆"}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View className="flex-row items-center mt-1">
                      <MapPin className="text-gray-400 mr-1" size={12} />
                      <Text className="text-sm text-gray-600">
                        {entry.location}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="items-end">
                  <Text className="text-lg font-bold text-gray-800">
                    {entry.score.toLocaleString()}
                  </Text>
                  <Text className="text-xs text-gray-500">{entry.metric}</Text>
                  {entry.change && (
                    <View className="flex-row items-center mt-1">
                      {getChangeIcon(entry.change)}
                    </View>
                  )}
                </View>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600">
        <CardContent className="p-4">
          <Text className="text-white font-bold text-center mb-2">
            🚀 Want to see your city on top?
          </Text>
          <Text className="text-white text-center text-sm">
            Submit corruption reports and participate in polls to help your city
            climb the leaderboard!
          </Text>
        </CardContent>
      </Card>

      {/* Share Button */}
      <Button className="bg-red-500 py-3 rounded-lg">
        <View className="flex-row items-center justify-center">
          <BarChart3 className="text-white mr-2" size={20} />
          <Text className="text-white font-bold">Share Leaderboard</Text>
        </View>
      </Button>
    </View>
  );
};
