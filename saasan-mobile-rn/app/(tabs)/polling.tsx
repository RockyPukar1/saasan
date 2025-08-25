// src/screens/PollingScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Users,
  Vote,
  Target,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  endDate: string;
  category: "election" | "policy" | "performance" | "local";
  location?: string;
  isActive: boolean;
  hasVoted: boolean;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
  color: string;
}

interface ElectionPrediction {
  id: string;
  constituency: string;
  level: "federal" | "provincial" | "local";
  parties: PartyPrediction[];
  totalPredictions: number;
  accuracy: number;
}

interface PartyPrediction {
  name: string;
  percentage: number;
  color: string;
  trend: "up" | "down" | "stable";
}

const PollingScreen = () => {
  const [activeTab, setActiveTab] = useState<"polls" | "predictions">("polls");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "election" | "policy" | "performance"
  >("all");

  const mockPolls: Poll[] = [
    {
      id: "1",
      question: "Who should be the next Prime Minister of Nepal?",
      options: [
        {
          id: "1",
          text: "KP Sharma Oli",
          votes: 1240,
          percentage: 35,
          color: "bg-red-500",
        },
        {
          id: "2",
          text: "Sher Bahadur Deuba",
          votes: 890,
          percentage: 25,
          color: "bg-green-500",
        },
        {
          id: "3",
          text: "Ravi Lamichhane",
          votes: 1065,
          percentage: 30,
          color: "bg-purple-500",
        },
        {
          id: "4",
          text: "Other",
          votes: 355,
          percentage: 10,
          color: "bg-gray-500",
        },
      ],
      totalVotes: 3550,
      endDate: "2024-02-15",
      category: "election",
      isActive: true,
      hasVoted: false,
    },
    {
      id: "2",
      question:
        "Should Nepal prioritize economic development over environmental protection?",
      options: [
        {
          id: "1",
          text: "Economic Development",
          votes: 450,
          percentage: 45,
          color: "bg-blue-500",
        },
        {
          id: "2",
          text: "Environmental Protection",
          votes: 350,
          percentage: 35,
          color: "bg-green-500",
        },
        {
          id: "3",
          text: "Equal Priority",
          votes: 200,
          percentage: 20,
          color: "bg-yellow-500",
        },
      ],
      totalVotes: 1000,
      endDate: "2024-01-30",
      category: "policy",
      isActive: true,
      hasVoted: true,
    },
    {
      id: "3",
      question:
        "Rate the current government's performance on corruption control",
      options: [
        {
          id: "1",
          text: "Excellent",
          votes: 45,
          percentage: 5,
          color: "bg-green-500",
        },
        {
          id: "2",
          text: "Good",
          votes: 180,
          percentage: 20,
          color: "bg-blue-500",
        },
        {
          id: "3",
          text: "Average",
          votes: 270,
          percentage: 30,
          color: "bg-yellow-500",
        },
        {
          id: "4",
          text: "Poor",
          votes: 405,
          percentage: 45,
          color: "bg-red-500",
        },
      ],
      totalVotes: 900,
      endDate: "2024-01-25",
      category: "performance",
      location: "Kathmandu Valley",
      isActive: true,
      hasVoted: false,
    },
  ];

  const mockPredictions: ElectionPrediction[] = [
    {
      id: "1",
      constituency: "Kathmandu-1",
      level: "federal",
      parties: [
        {
          name: "Nepali Congress",
          percentage: 38,
          color: "#22C55E",
          trend: "up",
        },
        { name: "CPN-UML", percentage: 32, color: "#EF4444", trend: "down" },
        { name: "RSP", percentage: 25, color: "#8B5CF6", trend: "up" },
        { name: "Others", percentage: 5, color: "#6B7280", trend: "stable" },
      ],
      totalPredictions: 2340,
      accuracy: 78,
    },
    {
      id: "2",
      constituency: "Chitwan-2",
      level: "federal",
      parties: [
        { name: "RSP", percentage: 45, color: "#8B5CF6", trend: "up" },
        { name: "CPN-UML", percentage: 28, color: "#EF4444", trend: "down" },
        {
          name: "Nepali Congress",
          percentage: 22,
          color: "#22C55E",
          trend: "stable",
        },
        { name: "Others", percentage: 5, color: "#6B7280", trend: "stable" },
      ],
      totalPredictions: 1890,
      accuracy: 82,
    },
  ];

  const filteredPolls =
    selectedCategory === "all"
      ? mockPolls
      : mockPolls.filter((poll) => poll.category === selectedCategory);

  const handleVote = (pollId: string, optionId: string) => {
    // Handle vote submission
    console.log(`Voted for option ${optionId} in poll ${pollId}`);
  };

  const PollCard = ({ poll }: { poll: Poll }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        {/* Poll Header */}
        <View className="mb-4">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-lg font-bold text-gray-800 flex-1 mr-2">
              {poll.question}
            </Text>
            <View
              className={`px-2 py-1 rounded-full ${
                poll.isActive ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  poll.isActive ? "text-green-800" : "text-gray-600"
                }`}
              >
                {poll.isActive ? "ACTIVE" : "ENDED"}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Users className="text-gray-500" size={14} />
              <Text className="text-gray-600 text-sm ml-1">
                {poll.totalVotes.toLocaleString()} votes
              </Text>
            </View>
            {poll.location && (
              <View className="flex-row items-center">
                <MapPin className="text-gray-500" size={14} />
                <Text className="text-gray-600 text-sm ml-1">
                  {poll.location}
                </Text>
              </View>
            )}
            <View className="flex-row items-center">
              <Clock className="text-gray-500" size={14} />
              <Text className="text-gray-600 text-sm ml-1">
                Ends {poll.endDate}
              </Text>
            </View>
          </View>
        </View>

        {/* Poll Options */}
        <View className="mb-4">
          {poll.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() =>
                !poll.hasVoted &&
                poll.isActive &&
                handleVote(poll.id, option.id)
              }
              className={`mb-3 p-3 rounded-lg border ${
                poll.hasVoted || !poll.isActive
                  ? "border-gray-200 bg-gray-50"
                  : "border-gray-300 bg-white"
              }`}
              disabled={poll.hasVoted || !poll.isActive}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-medium text-gray-800 flex-1">
                  {option.text}
                </Text>
                <View className="flex-row items-center">
                  {poll.hasVoted && (
                    <CheckCircle className="text-green-600 mr-2" size={16} />
                  )}
                  <Text className="font-bold text-gray-800">
                    {option.percentage}%
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View className="bg-gray-200 h-2 rounded-full">
                <View
                  className={`h-2 rounded-full ${option.color}`}
                  style={{ width: `${option.percentage}%` }}
                />
              </View>

              <Text className="text-gray-500 text-xs mt-1">
                {option.votes.toLocaleString()} votes
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Vote Button */}
        {!poll.hasVoted && poll.isActive && (
          <Button className="bg-red-600">
            <Text className="text-white font-bold">Cast Your Vote</Text>
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const PredictionCard = ({
    prediction,
  }: {
    prediction: ElectionPrediction;
  }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-lg font-bold text-gray-800">
              {prediction.constituency}
            </Text>
            <Text className="text-gray-600 text-sm capitalize">
              {prediction.level} Election
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-sm text-gray-600">
              {prediction.totalPredictions} predictions
            </Text>
            <Text className="text-xs text-green-600 font-bold">
              {prediction.accuracy}% accuracy
            </Text>
          </View>
        </View>

        {/* Party Predictions */}
        <View>
          {prediction.parties.map((party, index) => (
            <View key={index} className="mb-3">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-medium text-gray-800">{party.name}</Text>
                <View className="flex-row items-center">
                  {party.trend === "up" ? (
                    <TrendingUp className="text-green-600" size={14} />
                  ) : party.trend === "down" ? (
                    <Target className="text-red-600" size={14} />
                  ) : (
                    <View className="w-3 h-3 bg-gray-400 rounded-full" />
                  )}
                  <Text className="font-bold text-gray-800 ml-2">
                    {party.percentage}%
                  </Text>
                </View>
              </View>

              <View className="bg-gray-200 h-2 rounded-full">
                <View
                  className="h-2 rounded-full"
                  style={{
                    width: `${party.percentage}%`,
                    backgroundColor: party.color,
                  }}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Action Button */}
        <Button className="mt-3 bg-blue-600">
          <Text className="text-white font-bold">Make Prediction</Text>
        </Button>
      </CardContent>
    </Card>
  );

  const PollsTab = () => (
    <View className="flex-1">
      {/* Category Filter - Tab Style */}
      <View className="bg-white border-b border-gray-200">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-2"
        >
          <View className="flex-row py-2">
            {["all", "election", "policy", "performance"].map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category as any)}
                className={`mx-1 px-3 py-2 rounded-lg ${
                  selectedCategory === category
                    ? "bg-red-100 border-b-2 border-red-600"
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-sm font-medium text-center capitalize ${
                    selectedCategory === category
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {filteredPolls.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
      </ScrollView>
    </View>
  );

  const PredictionsTab = () => (
    <ScrollView className="flex-1 px-4 py-4">
      {/* Info Banner */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <View className="flex-row items-center">
            <AlertCircle className="text-blue-600" size={24} />
            <View className="flex-1 ml-3">
              <Text className="font-bold text-gray-800">
                Election Predictions
              </Text>
              <Text className="text-gray-600 text-sm">
                Help predict election outcomes in your constituency
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {mockPredictions.map((prediction) => (
        <PredictionCard key={prediction.id} prediction={prediction} />
      ))}
    </ScrollView>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-14 pb-4 px-5 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">
          Polls & Predictions
        </Text>
        <Text className="text-gray-600 text-sm mt-1">
          Voice your opinion & predict outcomes
        </Text>
      </View>

      {/* Tab Selector */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row px-4 py-2">
          <TouchableOpacity
            onPress={() => setActiveTab("polls")}
            className={`flex-1 py-3 items-center border-b-2 ${
              activeTab === "polls" ? "border-red-600" : "border-transparent"
            }`}
          >
            <View className="flex-row items-center">
              <Vote
                className={`mr-2 ${
                  activeTab === "polls" ? "text-red-600" : "text-gray-600"
                }`}
                size={20}
              />
              <Text
                className={`font-bold ${
                  activeTab === "polls" ? "text-red-600" : "text-gray-600"
                }`}
              >
                Live Polls
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("predictions")}
            className={`flex-1 py-3 items-center border-b-2 ${
              activeTab === "predictions"
                ? "border-red-600"
                : "border-transparent"
            }`}
          >
            <View className="flex-row items-center">
              <BarChart3
                className={`mr-2 ${
                  activeTab === "predictions" ? "text-red-600" : "text-gray-600"
                }`}
                size={20}
              />
              <Text
                className={`font-bold ${
                  activeTab === "predictions" ? "text-red-600" : "text-gray-600"
                }`}
              >
                Predictions
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {activeTab === "polls" ? <PollsTab /> : <PredictionsTab />}
    </View>
  );
};

export default PollingScreen;
