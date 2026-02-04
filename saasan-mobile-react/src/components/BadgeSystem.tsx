import React, { useState, useEffect } from "react";
import {
  Trophy,
  Star,
  Shield,
  Target,
  Users,
  Award,
  Zap,
  Heart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { viralApi } from "@/services/viralApi";
import type { Badge } from "@/types/viral";

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
      setBadges([]);
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
    <div className="space-y-4">
      {/* Badge Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex-row items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-800">
                Your Achievements
              </p>
              <p className="text-sm text-gray-600">
                {unlockedBadges.length} of {badges.length} badges unlocked
              </p>
            </div>
            <div className="items-center">
              <p className="text-2xl font-bold text-blue-600">
                {Math.round((unlockedBadges.length / badges.length) * 100)}%
              </p>
              <p className="text-xs text-gray-500">Complete</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(unlockedBadges.length / badges.length) * 100}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <div>
          <p className="text-lg font-bold text-gray-800 mb-3">
            🏆 Unlocked Badges
          </p>
          <div>
            <div className="flex-row space-x-3 px-1">
              {unlockedBadges.map((badge) => (
                <Card
                  key={badge.id}
                  className={`min-w-[120px] ${getRarityColor(
                    badge.rarity
                  )} ${getRarityGlow(badge.rarity)}`}
                >
                  <CardContent className="p-3 items-center">
                    {badge.icon}
                    <p className="text-xs font-medium text-gray-800 mt-1 text-center">
                      {badge.name}
                    </p>
                    <p className="text-xs text-gray-500 text-center mt-1">
                      {badge.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <p className="text-lg font-bold text-gray-800 mb-3">
            🔒 Next Achievements
          </p>
          <div className="space-y-2">
            {lockedBadges.slice(0, 3).map((badge) => (
              <Card key={badge.id} className="opacity-60">
                <CardContent className="p-3">
                  <div className="flex-row items-center">
                    <div className={`p-2 rounded-full ${badge.color} mr-3`}>
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {badge.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {badge.description}
                      </p>
                      {badge.progress !== undefined && badge.maxProgress && (
                        <div className="mt-1">
                          <div className="flex-row justify-between text-xs">
                            <p className="text-xs text-gray-500">
                              {badge.progress}/{badge.maxProgress}
                            </p>
                            <p className="text-xs text-gray-500">
                              {Math.round(
                                (badge.progress / badge.maxProgress) * 100
                              )}
                              %
                            </p>
                          </div>
                          <div className="bg-gray-200 rounded-full h-1 mt-1">
                            <div
                              className="bg-blue-500 h-1 rounded-full"
                              style={{
                                width: `${
                                  (badge.progress / badge.maxProgress) * 100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-4">
          <p className="text-center text-gray-700 font-medium">
            🚀 Keep fighting corruption! Every report and vote makes Nepal
            better.
          </p>
          <p className="text-center text-sm text-gray-600 mt-1">
            Share your achievements to inspire others!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
