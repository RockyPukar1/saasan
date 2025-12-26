import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  BarChart3,
  Share,
  Vote,
  Target,
  Award,
  Flag,
  MapPin,
  Star,
} from "lucide-react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "./ui/button";

interface ElectionData {
  electionDate: string;
  electionType: string;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  totalCandidates: number;
  totalConstituencies: number;
  registeredVoters: number;
  isActive: boolean;
}

interface Candidate {
  id: string;
  name: string;
  party: string;
  constituency: string;
  position: string;
  manifesto: string[];
  rating: number;
  promises: number;
  achievements: number;
  controversies: number;
  isIncumbent: boolean;
  imageUrl?: string;
}

interface ElectionModeProps {
  onVote?: (candidateId: string) => void;
  onShare?: (candidate: Candidate) => void;
  onCompare?: (candidates: Candidate[]) => void;
}

export const ElectionMode: React.FC<ElectionModeProps> = ({
  onVote,
  onShare,
  onCompare,
}) => {
  const [electionData, setElectionData] = useState<ElectionData>({
    electionDate: "2024-04-10T08:00:00Z",
    electionType: "Federal Election",
    daysRemaining: 85,
    hoursRemaining: 12,
    minutesRemaining: 30,
    totalCandidates: 1250,
    totalConstituencies: 165,
    registeredVoters: 18000000,
    isActive: true,
  });

  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    "countdown" | "candidates" | "compare" | "polls"
  >("countdown");

  // Mock candidates data
  const candidates: Candidate[] = [
    {
      id: "1",
      name: "Rajesh Sharma",
      party: "Nepal Communist Party",
      constituency: "Kathmandu-1",
      position: "Member of Parliament",
      manifesto: [
        "Improve road infrastructure",
        "Reduce electricity cuts",
        "Increase education budget",
        "Create job opportunities",
      ],
      rating: 4.2,
      promises: 15,
      achievements: 8,
      controversies: 2,
      isIncumbent: true,
    },
    {
      id: "2",
      name: "Priya Gurung",
      party: "Nepali Congress",
      constituency: "Kathmandu-1",
      position: "Member of Parliament",
      manifesto: [
        "Healthcare for all",
        "Women empowerment",
        "Digital governance",
        "Environmental protection",
      ],
      rating: 4.5,
      promises: 12,
      achievements: 6,
      controversies: 0,
      isIncumbent: false,
    },
    {
      id: "3",
      name: "Amit Thapa",
      party: "Rastriya Prajatantra Party",
      constituency: "Kathmandu-1",
      position: "Member of Parliament",
      manifesto: [
        "Economic development",
        "Tourism promotion",
        "Youth employment",
        "Cultural preservation",
      ],
      rating: 3.8,
      promises: 10,
      achievements: 4,
      controversies: 1,
      isIncumbent: false,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const electionDate = new Date(electionData.electionDate);
      const diff = electionDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setElectionData((prev) => ({
          ...prev,
          daysRemaining: days,
          hoursRemaining: hours,
          minutesRemaining: minutes,
        }));
      } else {
        setElectionData((prev) => ({
          ...prev,
          daysRemaining: 0,
          hoursRemaining: 0,
          minutesRemaining: 0,
          isActive: false,
        }));
      }
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [electionData.electionDate]);

  const getCountdownMessage = () => {
    if (!electionData.isActive) {
      return "🗳️ Election Day has arrived! Go vote!";
    }

    if (electionData.daysRemaining <= 7) {
      return "🚨 FINAL WEEK! Make your voice heard!";
    } else if (electionData.daysRemaining <= 30) {
      return "⚡ ONE MONTH LEFT! Research your candidates!";
    } else {
      return "📅 Election approaching! Stay informed!";
    }
  };

  const getCountdownColor = () => {
    if (!electionData.isActive) return "from-green-500 to-blue-500";
    if (electionData.daysRemaining <= 7) return "from-red-500 to-orange-500";
    if (electionData.daysRemaining <= 30)
      return "from-orange-500 to-yellow-500";
    return "from-blue-500 to-purple-500";
  };

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidates((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter((id) => id !== candidateId);
      } else if (prev.length < 2) {
        return [...prev, candidateId];
      } else {
        Alert.alert(
          "Limit Reached",
          "You can compare maximum 2 candidates at once."
        );
        return prev;
      }
    });
  };

  const handleCompare = () => {
    if (selectedCandidates.length === 2) {
      const candidatesToCompare = candidates.filter((c) =>
        selectedCandidates.includes(c.id)
      );
      onCompare?.(candidatesToCompare);
    } else {
      Alert.alert(
        "Select Candidates",
        "Please select exactly 2 candidates to compare."
      );
    }
  };

  const renderCountdown = () => (
    <View className="space-y-4">
      {/* Election Countdown */}
      <Card className={`bg-gradient-to-r ${getCountdownColor()}`}>
        <CardContent className="p-6">
          <View className="items-center">
            <Text className="text-white font-bold text-xl mb-2">
              🗳️ {electionData.electionType}
            </Text>
            <Text className="text-white text-center mb-4">
              {getCountdownMessage()}
            </Text>

            <View className="flex-row space-x-4">
              <View className="items-center">
                <Text className="text-white text-3xl font-bold">
                  {electionData.daysRemaining}
                </Text>
                <Text className="text-white text-sm">Days</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-3xl font-bold">
                  {electionData.hoursRemaining}
                </Text>
                <Text className="text-white text-sm">Hours</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-3xl font-bold">
                  {electionData.minutesRemaining}
                </Text>
                <Text className="text-white text-sm">Minutes</Text>
              </View>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Election Stats */}
      <View className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 items-center">
            <Users className="text-blue-500 mb-2" size={24} />
            <Text className="text-2xl font-bold text-gray-800">
              {electionData.totalCandidates.toLocaleString()}
            </Text>
            <Text className="text-sm text-gray-600 text-center">
              Candidates
            </Text>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 items-center">
            <MapPin className="text-green-500 mb-2" size={24} />
            <Text className="text-2xl font-bold text-gray-800">
              {electionData.totalConstituencies}
            </Text>
            <Text className="text-sm text-gray-600 text-center">
              Constituencies
            </Text>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 items-center">
            <Vote className="text-purple-500 mb-2" size={24} />
            <Text className="text-2xl font-bold text-gray-800">
              {electionData.registeredVoters.toLocaleString()}
            </Text>
            <Text className="text-sm text-gray-600 text-center">
              Registered Voters
            </Text>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 items-center">
            <Calendar className="text-orange-500 mb-2" size={24} />
            <Text className="text-2xl font-bold text-gray-800">
              {electionData.daysRemaining}
            </Text>
            <Text className="text-sm text-gray-600 text-center">Days Left</Text>
          </CardContent>
        </Card>
      </View>
    </View>
  );

  const renderCandidates = () => (
    <View className="space-y-4">
      <Text className="text-lg font-bold text-gray-800 mb-3">
        🏛️ Candidates in Your Constituency
      </Text>

      {candidates.map((candidate) => (
        <Card key={candidate.id}>
          <CardContent className="p-4">
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">
                  {candidate.name}
                </Text>
                <Text className="text-sm text-gray-600">
                  {candidate.party} • {candidate.constituency}
                </Text>
                {candidate.isIncumbent && (
                  <View className="bg-blue-100 px-2 py-1 rounded-full mt-1 self-start">
                    <Text className="text-blue-800 text-xs font-medium">
                      Current MP
                    </Text>
                  </View>
                )}
              </View>

              <View className="items-end">
                <View className="flex-row items-center">
                  <Star className="text-yellow-500 mr-1" size={16} />
                  <Text className="font-bold text-gray-800">
                    {candidate.rating}/5
                  </Text>
                </View>
                <Text className="text-xs text-gray-500">Rating</Text>
              </View>
            </View>

            {/* Candidate Stats */}
            <View className="flex-row justify-between mb-3">
              <View className="items-center">
                <Text className="text-lg font-bold text-green-600">
                  {candidate.promises}
                </Text>
                <Text className="text-xs text-gray-500">Promises</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold text-blue-600">
                  {candidate.achievements}
                </Text>
                <Text className="text-xs text-gray-500">Achievements</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold text-red-600">
                  {candidate.controversies}
                </Text>
                <Text className="text-xs text-gray-500">Controversies</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row space-x-2">
              <Button
                onPress={() => handleCandidateSelect(candidate.id)}
                className={`flex-1 py-2 rounded-lg ${
                  selectedCandidates.includes(candidate.id)
                    ? "bg-blue-500"
                    : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    selectedCandidates.includes(candidate.id)
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {selectedCandidates.includes(candidate.id)
                    ? "Selected"
                    : "Select"}
                </Text>
              </Button>

              <Button
                onPress={() => onShare?.(candidate)}
                className="flex-1 bg-green-500 py-2 rounded-lg"
              >
                <Text className="text-white text-center font-medium">
                  Share
                </Text>
              </Button>
            </View>
          </CardContent>
        </Card>
      ))}

      {/* Compare Button */}
      {selectedCandidates.length === 2 && (
        <Button
          onPress={handleCompare}
          className="bg-purple-500 py-3 rounded-lg"
        >
          <View className="flex-row items-center justify-center">
            <BarChart3 className="text-white mr-2" size={20} />
            <Text className="text-white font-bold">
              Compare Selected Candidates
            </Text>
          </View>
        </Button>
      )}
    </View>
  );

  return (
    <View className="space-y-4">
      {/* Election Mode Header */}
      <Card className="bg-gradient-to-r from-red-500 to-blue-500">
        <CardContent className="p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white font-bold text-lg">
                🗳️ Election Mode
              </Text>
              <Text className="text-white text-sm">
                Stay informed, make your voice heard
              </Text>
            </View>
            <Flag className="text-white" size={24} />
          </View>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <View className="flex-row bg-white rounded-lg p-1">
        {[
          { id: "countdown", label: "⏰ Countdown", icon: "⏰" },
          { id: "candidates", label: "🏛️ Candidates", icon: "🏛️" },
          { id: "compare", label: "📊 Compare", icon: "📊" },
          { id: "polls", label: "📈 Polls", icon: "📈" },
        ].map((tab) => (
          <Button
            key={tab.id}
            onPress={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-2 rounded-md ${
              activeTab === tab.id ? "bg-blue-500" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-xs text-center font-medium ${
                activeTab === tab.id ? "text-white" : "text-gray-600"
              }`}
            >
              {tab.label}
            </Text>
          </Button>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === "countdown" && renderCountdown()}
        {activeTab === "candidates" && renderCandidates()}
        {activeTab === "compare" && (
          <Card>
            <CardContent className="p-4">
              <Text className="text-lg font-bold text-gray-800 mb-3">
                📊 Candidate Comparison
              </Text>
              <Text className="text-gray-600 text-center">
                Select 2 candidates to compare their manifestos, achievements,
                and ratings.
              </Text>
            </CardContent>
          </Card>
        )}
        {activeTab === "polls" && (
          <Card>
            <CardContent className="p-4">
              <Text className="text-lg font-bold text-gray-800 mb-3">
                📈 Election Polls
              </Text>
              <Text className="text-gray-600 text-center">
                See what citizens are saying about the candidates and election
                issues.
              </Text>
            </CardContent>
          </Card>
        )}
      </ScrollView>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-600">
        <CardContent className="p-4">
          <Text className="text-white font-bold text-center mb-2">
            🗳️ Your Vote Matters!
          </Text>
          <Text className="text-white text-center text-sm">
            Research your candidates, compare their promises, and make an
            informed decision for Nepal's future!
          </Text>
        </CardContent>
      </Card>
    </View>
  );
};
