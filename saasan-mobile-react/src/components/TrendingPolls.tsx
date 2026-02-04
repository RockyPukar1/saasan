import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import {
  TrendingUp,
  Flame,
  Users,
  Clock,
  Share,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShareableImage } from "./ShareableImage";

interface TrendingPoll {
  id: string;
  title: string;
  description: string;
  category: string;
  total_votes: number;
  trending_score: number;
  options: Array<{
    id: string;
    text: string;
    votes_count: number;
    percentage: number;
  }>;
  created_at: string;
  viral_potential: "low" | "medium" | "high" | "explosive";
  share_count: number;
  hashtags: string[];
}

interface TrendingPollsProps {
  onVote?: (pollId: string, optionId: string) => void;
  onShare?: (poll: TrendingPoll) => void;
}

export const TrendingPolls: React.FC<TrendingPollsProps> = ({
  onVote,
  onShare,
}) => {
  const [selectedPoll, setSelectedPoll] = useState<TrendingPoll | null>(null);

  const trendingPolls: TrendingPoll[] = [
    {
      id: "1",
      title: "Do you trust the current interim government?",
      description:
        "Share your opinion on the current government's performance and trustworthiness.",
      category: "Politics",
      total_votes: 15420,
      trending_score: 95,
      options: [
        {
          id: "1a",
          text: "Yes, completely trust",
          votes_count: 3240,
          percentage: 21,
        },
        { id: "1b", text: "Somewhat trust", votes_count: 4620, percentage: 30 },
        {
          id: "1c",
          text: "Don't trust much",
          votes_count: 4620,
          percentage: 30,
        },
        {
          id: "1d",
          text: "No trust at all",
          votes_count: 2940,
          percentage: 19,
        },
      ],
      created_at: "2024-01-15T10:00:00Z",
      viral_potential: "explosive",
      share_count: 2847,
      hashtags: ["#GovernmentTrust", "#NepalPolitics", "#InterimGovernment"],
    },
    {
      id: "2",
      title: "Should politicians above 65 be required to retire?",
      description:
        "Age limit debate: Should there be a mandatory retirement age for politicians?",
      category: "Policy",
      total_votes: 12890,
      trending_score: 87,
      options: [
        {
          id: "2a",
          text: "Yes, mandatory retirement at 65",
          votes_count: 7740,
          percentage: 60,
        },
        { id: "2b", text: "Yes, but at 70", votes_count: 2580, percentage: 20 },
        {
          id: "2c",
          text: "No age limit needed",
          votes_count: 2570,
          percentage: 20,
        },
      ],
      created_at: "2024-01-14T15:30:00Z",
      viral_potential: "high",
      share_count: 1923,
      hashtags: ["#AgeLimit", "#PoliticalReform", "#NepalPolitics"],
    },
    {
      id: "3",
      title: "Which sector has the most corruption in Nepal?",
      description:
        "Based on your experience, which sector needs the most anti-corruption attention?",
      category: "Corruption",
      total_votes: 8930,
      trending_score: 78,
      options: [
        {
          id: "3a",
          text: "Government Administration",
          votes_count: 2680,
          percentage: 30,
        },
        { id: "3b", text: "Police", votes_count: 1780, percentage: 20 },
        { id: "3c", text: "Judiciary", votes_count: 1780, percentage: 20 },
        { id: "3d", text: "Education", votes_count: 1340, percentage: 15 },
        { id: "3e", text: "Health", votes_count: 1350, percentage: 15 },
      ],
      created_at: "2024-01-13T09:15:00Z",
      viral_potential: "high",
      share_count: 1456,
      hashtags: ["#Corruption", "#NepalFight", "#Transparency"],
    },
    {
      id: "4",
      title: "Do you support the new federal structure?",
      description:
        "How do you feel about Nepal's federal system after several years of implementation?",
      category: "Governance",
      total_votes: 6720,
      trending_score: 65,
      options: [
        {
          id: "4a",
          text: "Strongly support",
          votes_count: 2020,
          percentage: 30,
        },
        {
          id: "4b",
          text: "Somewhat support",
          votes_count: 2680,
          percentage: 40,
        },
        { id: "4c", text: "Neutral", votes_count: 1340, percentage: 20 },
        { id: "4d", text: "Don't support", votes_count: 680, percentage: 10 },
      ],
      created_at: "2024-01-12T14:20:00Z",
      viral_potential: "medium",
      share_count: 892,
      hashtags: ["#FederalSystem", "#NepalGovernance", "#Constitution"],
    },
  ];

  const getViralPotentialColor = (potential: string) => {
    switch (potential) {
      case "explosive":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getViralPotentialIcon = (potential: string) => {
    switch (potential) {
      case "explosive":
        return "💥";
      case "high":
        return "🔥";
      case "medium":
        return "📈";
      case "low":
        return "📊";
      default:
        return "📊";
    }
  };

  const getTrendingMessage = (poll: TrendingPoll) => {
    const topOption = poll.options.reduce(
      (max, opt) => (opt.votes_count > max.votes_count ? opt : max),
      poll.options[0]
    );
    const percentage = topOption.percentage;

    return `⚡ ${percentage}% of ${poll.total_votes.toLocaleString()} citizens say "${
      topOption.text
    }" — Join the conversation!`;
  };

  const handleVote = (pollId: string, optionId: string) => {
    onVote?.(pollId, optionId);
    Alert.alert(
      "Vote Recorded",
      "Thank you for participating! Your vote has been recorded."
    );
  };

  const handleShare = (poll: TrendingPoll) => {
    setSelectedPoll(poll);
    onShare?.(poll);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-4">
          <div className="flex-row items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-800">
                🔥 Trending Polls
              </p>
              <p className="text-sm text-gray-600">
                Join the viral conversations shaping Nepal
              </p>
            </div>
            <Flame className="text-orange-500" size={24} />
          </div>
        </CardContent>
      </Card>

      {/* Trending Polls List */}
      <div showsVerticalScrollIndicator={false}>
        <div className="space-y-3">
          {trendingPolls.map((poll) => (
            <Card key={poll.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Poll Header */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex-row items-start justify-between">
                    <div className="flex-1 mr-2">
                      <p className="text-lg font-bold text-gray-800 mb-1">
                        {poll.title}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {poll.description}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full ${getViralPotentialColor(
                        poll.viral_potential
                      )}`}
                    >
                      <p className="text-xs font-bold">
                        {getViralPotentialIcon(poll.viral_potential)}{" "}
                        {poll.viral_potential.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Viral Message */}
                  <div className="bg-white rounded-lg p-3 mt-2 border border-orange-200">
                    <p className="text-sm font-medium text-gray-800 text-center">
                      {getTrendingMessage(poll)}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex-row items-center justify-between mt-3">
                    <div className="flex-row items-center space-x-4">
                      <div className="flex-row items-center">
                        <Users className="text-blue-500 mr-1" size={16} />
                        <p className="text-sm text-gray-600">
                          {poll.total_votes.toLocaleString()} votes
                        </p>
                      </div>
                      <div className="flex-row items-center">
                        <Share className="text-green-500 mr-1" size={16} />
                        <p className="text-sm text-gray-600">
                          {poll.share_count.toLocaleString()} shares
                        </p>
                      </div>
                    </div>
                    <div className="flex-row items-center">
                      <TrendingUp className="text-red-500 mr-1" size={16} />
                      <p className="text-sm font-bold text-red-500">
                        {poll.trending_score}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Poll Options */}
                <div className="p-4">
                  <div className="space-y-2">
                    {poll.options.map((option) => (
                      <Button
                        key={option.id}
                        onPress={() => handleVote(poll.id, option.id)}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-row items-center justify-between">
                          <p className="flex-1 text-gray-800 font-medium">
                            {option.text}
                          </p>
                          <div className="items-end">
                            <p className="font-bold text-gray-800">
                              {option.votes_count.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {option.percentage}%
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${option.percentage}%` }}
                          />
                        </div>
                      </Button>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-row space-x-2 mt-4">
                    <Button
                      onPress={() => handleShare(poll)}
                      className="flex-1 bg-blue-500 py-3 rounded-lg"
                    >
                      <div className="flex-row items-center justify-center">
                        <Share className="text-white mr-2" size={16} />
                        <p className="text-white font-medium">
                          Share Poll
                        </p>
                      </div>
                    </Button>

                    <Button className="flex-1 bg-gray-500 py-3 rounded-lg">
                      <div className="flex-row items-center justify-center">
                        <MessageCircle className="text-white mr-2" size={16} />
                        <p className="text-white font-medium">Comment</p>
                      </div>
                    </Button>
                  </div>

                  {/* Hashtags */}
                  <div className="flex-row flex-wrap mt-3">
                    {poll.hashtags.map((hashtag, index) => (
                      <p
                        key={index}
                        className="text-blue-500 text-sm mr-2 mb-1"
                      >
                        {hashtag}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {selectedPoll && (
        <div className="absolute inset-0 bg-black/50 justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80%]">
            <div className="p-4 border-b border-gray-200 flex-row items-center justify-between">
              <p className="text-lg font-bold text-gray-800">
                Share This Poll
              </p>
              <Button onPress={() => setSelectedPoll(null)} className="p-1">
                <p className="text-gray-500 text-xl font-bold">×</p>
              </Button>
            </div>
            <div className="max-h-96">
              <ShareableImage
                type="poll_result"
                data={selectedPoll}
                onShare={() => setSelectedPoll(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
