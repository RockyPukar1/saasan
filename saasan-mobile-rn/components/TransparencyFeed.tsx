import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import {
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  MapPin,
  Clock,
  Share,
  Heart,
  MessageCircle,
  Eye,
  Zap,
} from "lucide-react-native";
import { Card, CardContent } from "~/components/ui/card";
import { ShareableImage } from "./ShareableImage";

interface FeedItem {
  id: string;
  type:
    | "corruption_report"
    | "poll_result"
    | "politician_update"
    | "system_alert";
  title: string;
  description: string;
  location?: string;
  amount?: number;
  timestamp: string;
  viral_score: number;
  share_count: number;
  reaction_count: number;
  is_verified: boolean;
  priority: "low" | "medium" | "high" | "critical";
  tags: string[];
  viral_message?: string;
}

interface TransparencyFeedProps {
  onItemPress?: (item: FeedItem) => void;
  onShare?: (item: FeedItem) => void;
}

export const TransparencyFeed: React.FC<TransparencyFeedProps> = ({
  onItemPress,
  onShare,
}) => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);

  useEffect(() => {
    loadFeedItems();
  }, []);

  const loadFeedItems = () => {
    // Mock data - in real app, this would come from API
    const mockFeedItems: FeedItem[] = [
      {
        id: "1",
        type: "corruption_report",
        title: "12 Million NPR Misused in Kathmandu Ward 15",
        description:
          "Contractor paid for road construction that was never completed. Investigation ongoing.",
        location: "Kathmandu Ward 15",
        amount: 12000000,
        timestamp: "2024-01-15T14:30:00Z",
        viral_score: 95,
        share_count: 2847,
        reaction_count: 1256,
        is_verified: true,
        priority: "critical",
        tags: ["#Corruption", "#Kathmandu", "#RoadConstruction"],
        viral_message:
          "💸 12M NPR MISUSED in Kathmandu Ward 15 — Reported on Saasan 🔥",
      },
      {
        id: "2",
        type: "poll_result",
        title: "78% of citizens want electricity cuts fixed in Province 2",
        description:
          "Massive poll shows overwhelming demand for reliable electricity supply.",
        timestamp: "2024-01-15T12:15:00Z",
        viral_score: 89,
        share_count: 1923,
        reaction_count: 892,
        is_verified: true,
        priority: "high",
        tags: ["#Electricity", "#Province2", "#CitizenDemand"],
        viral_message:
          "⚡ 78% of citizens want electricity cuts fixed in Province 2 — Join the poll on Saasan 📊",
      },
      {
        id: "3",
        type: "politician_update",
        title: "MP Sharma promises to address water crisis in constituency",
        description:
          "Public commitment made during town hall meeting. Citizens tracking progress.",
        location: "Pokhara Constituency 1",
        timestamp: "2024-01-15T10:45:00Z",
        viral_score: 72,
        share_count: 456,
        reaction_count: 234,
        is_verified: false,
        priority: "medium",
        tags: ["#WaterCrisis", "#Pokhara", "#MPSharma"],
        viral_message:
          "💧 MP Sharma promises to fix water crisis — Track progress on Saasan 👤",
      },
      {
        id: "4",
        type: "corruption_report",
        title: "5.2 Million NPR embezzled from health budget",
        description:
          "Medical equipment funds diverted. Health center still waiting for supplies.",
        location: "Bharatpur Hospital",
        amount: 5200000,
        timestamp: "2024-01-15T09:20:00Z",
        viral_score: 87,
        share_count: 1456,
        reaction_count: 678,
        is_verified: true,
        priority: "high",
        tags: ["#HealthCorruption", "#Bharatpur", "#MedicalEquipment"],
        viral_message:
          "🏥 5.2M NPR embezzled from health budget — Fight corruption with Saasan 🚨",
      },
      {
        id: "5",
        type: "system_alert",
        title: "Top 10 most corrupt politicians (citizen ratings)",
        description:
          "Weekly ranking based on citizen reports and ratings. Updated today.",
        timestamp: "2024-01-15T08:00:00Z",
        viral_score: 92,
        share_count: 3245,
        reaction_count: 1892,
        is_verified: true,
        priority: "critical",
        tags: ["#TopCorrupt", "#CitizenRatings", "#WeeklyRanking"],
        viral_message:
          "🔥 Top 10 most corrupt politicians (citizen ratings) — Updated today on Saasan 📊",
      },
    ];

    setFeedItems(mockFeedItems);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      loadFeedItems();
      setRefreshing(false);
    }, 1000);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case "corruption_report":
        return <AlertTriangle className="text-red-500" size={20} />;
      case "poll_result":
        return <TrendingUp className="text-blue-500" size={20} />;
      case "politician_update":
        return <Users className="text-green-500" size={20} />;
      case "system_alert":
        return <Zap className="text-orange-500" size={20} />;
      default:
        return <Eye className="text-gray-500" size={20} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 border-red-300";
      case "high":
        return "bg-orange-100 border-orange-300";
      case "medium":
        return "bg-yellow-100 border-yellow-300";
      case "low":
        return "bg-green-100 border-green-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const formatAmount = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const handleShare = (item: FeedItem) => {
    setSelectedItem(item);
    onShare?.(item);
  };

  return (
    <View className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-gray-800">
                📰 Live Transparency Feed
              </Text>
              <Text className="text-sm text-gray-600">
                Real-time corruption reports and citizen updates
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              <Text className="text-xs text-green-600 font-bold">LIVE</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Feed Items */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="space-y-3">
          {feedItems.map((item) => (
            <Card
              key={item.id}
              className={`${getPriorityColor(item.priority)} overflow-hidden`}
            >
              <CardContent className="p-0">
                {/* Item Header */}
                <View className="p-4">
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-row items-center flex-1">
                      {getItemIcon(item.type)}
                      <View className="ml-2 flex-1">
                        <Text className="font-bold text-gray-800 text-base">
                          {item.title}
                        </Text>
                        {item.location && (
                          <View className="flex-row items-center mt-1">
                            <MapPin className="text-gray-400 mr-1" size={12} />
                            <Text className="text-sm text-gray-600">
                              {item.location}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-xs text-gray-500">
                        {formatTimeAgo(item.timestamp)}
                      </Text>
                      {item.is_verified && (
                        <View className="flex-row items-center mt-1">
                          <View className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                          <Text className="text-xs text-green-600 font-bold">
                            VERIFIED
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Viral Message */}
                  {item.viral_message && (
                    <View className="bg-white rounded-lg p-3 mb-3 border border-orange-200">
                      <Text className="text-sm font-medium text-gray-800 text-center">
                        {item.viral_message}
                      </Text>
                    </View>
                  )}

                  {/* Description */}
                  <Text className="text-sm text-gray-700 mb-3">
                    {item.description}
                  </Text>

                  {/* Amount Display */}
                  {item.amount && (
                    <View className="flex-row items-center mb-3">
                      <DollarSign className="text-red-500 mr-2" size={16} />
                      <Text className="text-lg font-bold text-red-600">
                        {formatAmount(item.amount)}
                      </Text>
                      <Text className="text-sm text-gray-600 ml-2">
                        involved
                      </Text>
                    </View>
                  )}

                  {/* Stats */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center space-x-4">
                      <View className="flex-row items-center">
                        <Eye className="text-blue-500 mr-1" size={16} />
                        <Text className="text-sm text-gray-600">
                          {item.reaction_count.toLocaleString()}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Share className="text-green-500 mr-1" size={16} />
                        <Text className="text-sm text-gray-600">
                          {item.share_count.toLocaleString()}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <TrendingUp className="text-red-500 mr-1" size={16} />
                        <Text className="text-sm font-bold text-red-500">
                          {item.viral_score}%
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row space-x-2">
                    <TouchableOpacity
                      onPress={() => handleShare(item)}
                      className="flex-1 bg-blue-500 py-2 rounded-lg"
                    >
                      <View className="flex-row items-center justify-center">
                        <Share className="text-white mr-2" size={16} />
                        <Text className="text-white font-medium text-sm">
                          Share
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-1 bg-red-500 py-2 rounded-lg">
                      <View className="flex-row items-center justify-center">
                        <Heart className="text-white mr-2" size={16} />
                        <Text className="text-white font-medium text-sm">
                          React
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-1 bg-gray-500 py-2 rounded-lg">
                      <View className="flex-row items-center justify-center">
                        <MessageCircle className="text-white mr-2" size={16} />
                        <Text className="text-white font-medium text-sm">
                          Comment
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Tags */}
                  <View className="flex-row flex-wrap mt-3">
                    {item.tags.map((tag, index) => (
                      <Text
                        key={index}
                        className="text-blue-500 text-xs mr-2 mb-1"
                      >
                        {tag}
                      </Text>
                    ))}
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Share Modal */}
      {selectedItem && (
        <View className="absolute inset-0 bg-black bg-opacity-50 justify-center p-4">
          <View className="bg-white rounded-lg max-h-[80%]">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-800">
                Share This Update
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedItem(null)}
                className="absolute right-4 top-4"
              >
                <Text className="text-gray-500 text-xl">×</Text>
              </TouchableOpacity>
            </View>
            <ScrollView className="max-h-96">
              <ShareableImage
                type={
                  selectedItem.type === "corruption_report"
                    ? "corruption_report"
                    : "poll_result"
                }
                data={selectedItem}
                onShare={() => setSelectedItem(null)}
              />
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};
