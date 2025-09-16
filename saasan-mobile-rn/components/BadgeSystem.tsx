import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import {
  Trophy,
  Star,
  Shield,
  Target,
  Users,
  Award,
  Zap,
  Heart,
} from "lucide-react-native";
import { Card, CardContent } from "~/components/ui/card";
import { viralApi, Badge } from "~/services/viralApi";

interface BadgeDisplay extends Badge {
  icon: React.ReactNode;
  color: string;
}

interface BadgeSystemProps {
  userStats: {
    reportsSubmitted: number;
    pollsVoted: number;
    daysActive: number;
    friendsInvited: number;
    reportsUpvoted: number;
    verifiedReports: number;
  };
}

export const BadgeSystem: React.FC<BadgeSystemProps> = ({ userStats }) => {
  const [badges, setBadges] = useState<BadgeDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      setLoading(true);
      const apiBadges = await viralApi.getUserBadges();
      const badgesWithDisplay = apiBadges.map((badge) => ({
        ...badge,
        icon: getBadgeIcon(badge),
        color: getBadgeColor(badge),
      }));
      setBadges(badgesWithDisplay);
    } catch (error) {
      console.error("Error loading badges:", error);
      // Fallback to mock badges
      setBadges(getMockBadges());
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (badge: Badge): React.ReactNode => {
    switch (badge.id) {
      case "first_report":
        return <Shield className="text-blue-600" size={24} />;
      case "veteran_reporter":
        return <Target className="text-red-600" size={24} />;
      case "top_reporter":
        return <Trophy className="text-yellow-600" size={24} />;
      case "verified_reporter":
        return <Star className="text-green-600" size={24} />;
      case "first_vote":
        return <Zap className="text-purple-600" size={24} />;
      case "active_voter":
        return <Users className="text-indigo-600" size={24} />;
      case "supporter":
        return <Heart className="text-pink-600" size={24} />;
      case "influencer":
        return <Award className="text-orange-600" size={24} />;
      case "loyal_citizen":
        return <Star className="text-gold-600" size={24} />;
      default:
        return <Star className="text-gray-600" size={24} />;
    }
  };

  const getBadgeColor = (badge: Badge): string => {
    switch (badge.category) {
      case "reporter":
        return "bg-red-100";
      case "voter":
        return "bg-blue-100";
      case "community":
        return "bg-green-100";
      case "special":
        return "bg-purple-100";
      default:
        return "bg-gray-100";
    }
  };

  const getMockBadges = (): BadgeDisplay[] => [
    // Reporter Badges
    {
      id: "first_report",
      name: "Whistleblower",
      description: "Submitted your first corruption report",
      icon: <Shield className="text-blue-600" size={24} />,
      color: "bg-blue-100",
      category: "reporter",
      unlocked: userStats.reportsSubmitted >= 1,
      rarity: "common",
    },
    {
      id: "veteran_reporter",
      name: "Corruption Hunter",
      description: "Submitted 10 corruption reports",
      icon: <Target className="text-red-600" size={24} />,
      color: "bg-red-100",
      category: "reporter",
      unlocked: userStats.reportsSubmitted >= 10,
      progress: userStats.reportsSubmitted,
      maxProgress: 10,
      rarity: "rare",
    },
    {
      id: "top_reporter",
      name: "Justice Warrior",
      description: "Submitted 50 corruption reports",
      icon: <Trophy className="text-yellow-600" size={24} />,
      color: "bg-yellow-100",
      category: "reporter",
      unlocked: userStats.reportsSubmitted >= 50,
      progress: userStats.reportsSubmitted,
      maxProgress: 50,
      rarity: "epic",
    },
    {
      id: "verified_reporter",
      name: "Fact Checker",
      description: "Had 5 reports verified by community",
      icon: <Star className="text-green-600" size={24} />,
      color: "bg-green-100",
      category: "reporter",
      unlocked: userStats.verifiedReports >= 5,
      progress: userStats.verifiedReports,
      maxProgress: 5,
      rarity: "rare",
    },

    // Voter Badges
    {
      id: "first_vote",
      name: "Voice of Change",
      description: "Voted in your first poll",
      icon: <Zap className="text-purple-600" size={24} />,
      color: "bg-purple-100",
      category: "voter",
      unlocked: userStats.pollsVoted >= 1,
      rarity: "common",
    },
    {
      id: "active_voter",
      name: "Poll Master",
      description: "Voted in 25 polls",
      icon: <Users className="text-indigo-600" size={24} />,
      color: "bg-indigo-100",
      category: "voter",
      unlocked: userStats.pollsVoted >= 25,
      progress: userStats.pollsVoted,
      maxProgress: 25,
      rarity: "rare",
    },

    // Community Badges
    {
      id: "supporter",
      name: "Community Supporter",
      description: "Upvoted 100 reports",
      icon: <Heart className="text-pink-600" size={24} />,
      color: "bg-pink-100",
      category: "community",
      unlocked: userStats.reportsUpvoted >= 100,
      progress: userStats.reportsUpvoted,
      maxProgress: 100,
      rarity: "rare",
    },
    {
      id: "influencer",
      name: "Saasan Ambassador",
      description: "Invited 5 friends to join",
      icon: <Award className="text-orange-600" size={24} />,
      color: "bg-orange-100",
      category: "community",
      unlocked: userStats.friendsInvited >= 5,
      progress: userStats.friendsInvited,
      maxProgress: 5,
      rarity: "epic",
    },
    {
      id: "loyal_citizen",
      name: "Loyal Citizen",
      description: "Active for 30 days",
      icon: <Star className="text-gold-600" size={24} />,
      color: "bg-yellow-100",
      category: "special",
      unlocked: userStats.daysActive >= 30,
      progress: userStats.daysActive,
      maxProgress: 30,
      rarity: "legendary",
    },
  ];

  const unlockedBadges = badges.filter((badge) => badge.unlocked);
  const lockedBadges = badges.filter((badge) => !badge.unlocked);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-300";
      case "rare":
        return "border-blue-400";
      case "epic":
        return "border-purple-400";
      case "legendary":
        return "border-yellow-400";
      default:
        return "border-gray-300";
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "";
      case "rare":
        return "shadow-blue-200";
      case "epic":
        return "shadow-purple-200";
      case "legendary":
        return "shadow-yellow-200";
      default:
        return "";
    }
  };

  return (
    <View className="space-y-4">
      {/* Badge Summary */}
      <Card>
        <CardContent className="p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-gray-800">
                Your Achievements
              </Text>
              <Text className="text-sm text-gray-600">
                {unlockedBadges.length} of {badges.length} badges unlocked
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">
                {Math.round((unlockedBadges.length / badges.length) * 100)}%
              </Text>
              <Text className="text-xs text-gray-500">Complete</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="mt-3 bg-gray-200 rounded-full h-2">
            <View
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(unlockedBadges.length / badges.length) * 100}%`,
              }}
            />
          </View>
        </CardContent>
      </Card>

      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <View>
          <Text className="text-lg font-bold text-gray-800 mb-3">
            🏆 Unlocked Badges
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3 px-1">
              {unlockedBadges.map((badge) => (
                <Card
                  key={badge.id}
                  className={`min-w-[120px] ${getRarityColor(
                    badge.rarity
                  )} ${getRarityGlow(badge.rarity)}`}
                >
                  <CardContent className="p-3 items-center">
                    {badge.icon}
                    <Text className="text-xs font-medium text-gray-800 mt-1 text-center">
                      {badge.name}
                    </Text>
                    <Text className="text-xs text-gray-500 text-center mt-1">
                      {badge.description}
                    </Text>
                  </CardContent>
                </Card>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <View>
          <Text className="text-lg font-bold text-gray-800 mb-3">
            🔒 Next Achievements
          </Text>
          <View className="space-y-2">
            {lockedBadges.slice(0, 3).map((badge) => (
              <Card key={badge.id} className="opacity-60">
                <CardContent className="p-3">
                  <View className="flex-row items-center">
                    <View className={`p-2 rounded-full ${badge.color} mr-3`}>
                      {badge.icon}
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium text-gray-800">
                        {badge.name}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {badge.description}
                      </Text>
                      {badge.progress !== undefined && badge.maxProgress && (
                        <View className="mt-1">
                          <View className="flex-row justify-between text-xs">
                            <Text className="text-xs text-gray-500">
                              {badge.progress}/{badge.maxProgress}
                            </Text>
                            <Text className="text-xs text-gray-500">
                              {Math.round(
                                (badge.progress / badge.maxProgress) * 100
                              )}
                              %
                            </Text>
                          </View>
                          <View className="bg-gray-200 rounded-full h-1 mt-1">
                            <View
                              className="bg-blue-500 h-1 rounded-full"
                              style={{
                                width: `${
                                  (badge.progress / badge.maxProgress) * 100
                                }%`,
                              }}
                            />
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        </View>
      )}

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-4">
          <Text className="text-center text-gray-700 font-medium">
            🚀 Keep fighting corruption! Every report and vote makes Nepal
            better.
          </Text>
          <Text className="text-center text-sm text-gray-600 mt-1">
            Share your achievements to inspire others!
          </Text>
        </CardContent>
      </Card>
    </View>
  );
};
