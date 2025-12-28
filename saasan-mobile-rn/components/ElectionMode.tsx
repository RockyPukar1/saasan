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

interface PollData {
  id: string;
  candidateId: string;
  candidateName: string;
  party: string;
  percentage: number;
  votes: number;
  trend: "up" | "down" | "stable";
  change: number;
}

interface PollIssue {
  id: string;
  topic: string;
  importance: number;
  sentiment: "positive" | "negative" | "neutral";
  mentions: number;
}

interface PublicOpinion {
  id: string;
  author: string;
  comment: string;
  candidateId: string;
  timestamp: string;
  likes: number;
  sentiment: "positive" | "negative" | "neutral";
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

  const [pollData, setPollData] = useState<PollData[]>([
    {
      id: "1",
      candidateId: "2",
      candidateName: "Priya Gurung",
      party: "Nepali Congress",
      percentage: 42.5,
      votes: 7650,
      trend: "up",
      change: 2.3,
    },
    {
      id: "2",
      candidateId: "1",
      candidateName: "Rajesh Sharma",
      party: "Nepal Communist Party",
      percentage: 38.2,
      votes: 6876,
      trend: "down",
      change: -1.5,
    },
    {
      id: "3",
      candidateId: "3",
      candidateName: "Amit Thapa",
      party: "Rastriya Prajatantra Party",
      percentage: 19.3,
      votes: 3474,
      trend: "stable",
      change: 0.2,
    },
  ]);

  const [pollIssues, setPollIssues] = useState<PollIssue[]>([
    {
      id: "1",
      topic: "Healthcare Reform",
      importance: 95,
      sentiment: "positive",
      mentions: 3420,
    },
    {
      id: "2",
      topic: "Economic Development",
      importance: 88,
      sentiment: "positive",
      mentions: 2890,
    },
    {
      id: "3",
      topic: "Education Budget",
      importance: 82,
      sentiment: "neutral",
      mentions: 2150,
    },
    {
      id: "4",
      topic: "Infrastructure",
      importance: 75,
      sentiment: "positive",
      mentions: 1980,
    },
  ]);

  const [publicOpinions, setPublicOpinions] = useState<PublicOpinion[]>([
    {
      id: "1",
      author: "Sita Tamang",
      comment: "Priya Gurung's healthcare plan is exactly what we need!",
      candidateId: "2",
      timestamp: "2 hours ago",
      likes: 124,
      sentiment: "positive",
    },
    {
      id: "2",
      author: "Ram Bahadur",
      comment: "Rajesh Sharma has done good work in infrastructure.",
      candidateId: "1",
      timestamp: "5 hours ago",
      likes: 89,
      sentiment: "positive",
    },
    {
      id: "3",
      author: "Gita Shrestha",
      comment: "We need fresh ideas, not the same old promises.",
      candidateId: "3",
      timestamp: "1 day ago",
      likes: 67,
      sentiment: "neutral",
    },
  ]);

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

  const renderComparison = () => {
    const candidatesToCompare = candidates.filter((c) =>
      selectedCandidates.includes(c.id)
    );

    if (selectedCandidates.length !== 2) {
      return (
        <View className="space-y-4">
          <Card>
            <CardContent className="p-6 items-center">
              <BarChart3 className="text-gray-400 mb-3" size={48} />
              <Text className="text-lg font-bold text-gray-800 mb-2">
                📊 Candidate Comparison
              </Text>
              <Text className="text-gray-600 text-center mb-4">
                Select 2 candidates from the Candidates tab to compare their
                manifestos, achievements, and ratings.
              </Text>
              <Button
                onPress={() => setActiveTab("candidates")}
                className="bg-blue-500 py-2 px-4 rounded-lg"
              >
                <Text className="text-white font-medium">Go to Candidates</Text>
              </Button>
            </CardContent>
          </Card>
        </View>
      );
    }

    const [candidate1, candidate2] = candidatesToCompare;

    return (
      <View className="space-y-3">
        {/* Header with both candidates side by side */}
        <View className="flex-row space-x-2">
          {/* Candidate 1 Header */}
          <View className="flex-1">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600">
              <CardContent className="p-3">
                <View className="items-center">
                  <Text className="text-white font-bold text-sm mb-1">
                    {candidate1.name}
                  </Text>
                  <Text className="text-white text-xs text-center mb-2">
                    {candidate1.party}
                  </Text>
                  {candidate1.isIncumbent && (
                    <View className="bg-white/20 px-2 py-0.5 rounded-full">
                      <Text className="text-white text-xs font-medium">
                        Current MP
                      </Text>
                    </View>
                  )}
                </View>
              </CardContent>
            </Card>
          </View>

          {/* VS Divider */}
          <View className="justify-center items-center px-1">
            <View className="bg-gray-200 rounded-full px-2 py-1">
              <Text className="text-gray-700 font-bold text-xs">VS</Text>
            </View>
          </View>

          {/* Candidate 2 Header */}
          <View className="flex-1">
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600">
              <CardContent className="p-3">
                <View className="items-center">
                  <Text className="text-white font-bold text-sm mb-1">
                    {candidate2.name}
                  </Text>
                  <Text className="text-white text-xs text-center mb-2">
                    {candidate2.party}
                  </Text>
                  {candidate2.isIncumbent && (
                    <View className="bg-white/20 px-2 py-0.5 rounded-full">
                      <Text className="text-white text-xs font-medium">
                        Current MP
                      </Text>
                    </View>
                  )}
                </View>
              </CardContent>
            </Card>
          </View>
        </View>

        {/* Quick Stats Comparison - Side by Side */}
        <Card>
          <CardContent className="p-4">
            <Text className="text-sm font-bold text-gray-800 mb-3">
              ⚡ Quick Stats
            </Text>

            {/* Rating Comparison */}
            <View className="mb-4">
              <Text className="text-xs text-gray-600 mb-2">Rating</Text>
              <View className="flex-row items-center space-x-2">
                <View className="flex-1 items-center">
                  <View className="flex-row items-center">
                    <Star className="text-yellow-500 mr-1" size={14} />
                    <Text className="font-bold text-gray-800">
                      {candidate1.rating}/5
                    </Text>
                  </View>
                </View>
                <View className="w-8 h-0.5 bg-gray-200" />
                <View className="flex-1 items-center">
                  <View className="flex-row items-center">
                    <Star className="text-yellow-500 mr-1" size={14} />
                    <Text className="font-bold text-gray-800">
                      {candidate2.rating}/5
                    </Text>
                  </View>
                </View>
              </View>
              {/* Visual bar comparison */}
              <View className="flex-row items-center space-x-2 mt-1">
                <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-blue-500"
                    style={{ width: `${(candidate1.rating / 5) * 100}%` }}
                  />
                </View>
                <View className="w-8" />
                <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-purple-500"
                    style={{ width: `${(candidate2.rating / 5) * 100}%` }}
                  />
                </View>
              </View>
            </View>

            {/* Promises, Achievements, Controversies - Grid Layout */}
            <View className="space-y-3">
              {/* Promises */}
              <View>
                <Text className="text-xs text-gray-600 mb-2">Promises</Text>
                <View className="flex-row items-center space-x-2">
                  <View className="flex-1 items-center bg-green-50 py-2 rounded">
                    <Text className="text-lg font-bold text-green-600">
                      {candidate1.promises}
                    </Text>
                  </View>
                  <View className="w-8" />
                  <View className="flex-1 items-center bg-green-50 py-2 rounded">
                    <Text className="text-lg font-bold text-green-600">
                      {candidate2.promises}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Achievements */}
              <View>
                <Text className="text-xs text-gray-600 mb-2">Achievements</Text>
                <View className="flex-row items-center space-x-2">
                  <View className="flex-1 items-center bg-blue-50 py-2 rounded">
                    <Text className="text-lg font-bold text-blue-600">
                      {candidate1.achievements}
                    </Text>
                  </View>
                  <View className="w-8" />
                  <View className="flex-1 items-center bg-blue-50 py-2 rounded">
                    <Text className="text-lg font-bold text-blue-600">
                      {candidate2.achievements}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Controversies */}
              <View>
                <Text className="text-xs text-gray-600 mb-2">
                  Controversies
                </Text>
                <View className="flex-row items-center space-x-2">
                  <View className="flex-1 items-center bg-red-50 py-2 rounded">
                    <Text className="text-lg font-bold text-red-600">
                      {candidate1.controversies}
                    </Text>
                  </View>
                  <View className="w-8" />
                  <View className="flex-1 items-center bg-red-50 py-2 rounded">
                    <Text className="text-lg font-bold text-red-600">
                      {candidate2.controversies}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Manifesto Comparison - Stacked with alternating colors */}
        <Card>
          <CardContent className="p-4">
            <Text className="text-sm font-bold text-gray-800 mb-3">
              📋 Manifesto Comparison
            </Text>

            <View className="space-y-2">
              {Array.from({
                length: Math.max(
                  candidate1.manifesto.length,
                  candidate2.manifesto.length
                ),
              }).map((_, index) => (
                <View key={index} className="space-y-2">
                  {/* Candidate 1 Manifesto Item */}
                  {candidate1.manifesto[index] && (
                    <View className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                      <View className="flex-row items-start">
                        <View className="bg-blue-500 rounded-full w-5 h-5 items-center justify-center mr-2 mt-0.5">
                          <Text className="text-white text-xs font-bold">
                            1
                          </Text>
                        </View>
                        <Text className="flex-1 text-sm text-gray-800">
                          {candidate1.manifesto[index]}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Candidate 2 Manifesto Item */}
                  {candidate2.manifesto[index] && (
                    <View className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-500">
                      <View className="flex-row items-start">
                        <View className="bg-purple-500 rounded-full w-5 h-5 items-center justify-center mr-2 mt-0.5">
                          <Text className="text-white text-xs font-bold">
                            2
                          </Text>
                        </View>
                        <Text className="flex-1 text-sm text-gray-800">
                          {candidate2.manifesto[index]}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Divider between items */}
                  {index <
                    Math.max(
                      candidate1.manifesto.length,
                      candidate2.manifesto.length
                    ) -
                      1 && <View className="h-px bg-gray-200 my-1" />}
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <View className="space-y-2">
          <Button
            onPress={() => onVote?.(candidate1.id)}
            className="bg-blue-500 py-3 rounded-lg"
          >
            <Text className="text-white font-bold text-center">
              Vote for {candidate1.name.split(" ")[0]}
            </Text>
          </Button>
          <Button
            onPress={() => onVote?.(candidate2.id)}
            className="bg-purple-500 py-3 rounded-lg"
          >
            <Text className="text-white font-bold text-center">
              Vote for {candidate2.name.split(" ")[0]}
            </Text>
          </Button>
          <Button
            onPress={() => {
              setSelectedCandidates([]);
              setActiveTab("candidates");
            }}
            className="bg-gray-200 py-2 rounded-lg"
          >
            <Text className="text-gray-700 font-medium text-center">
              Select Different Candidates
            </Text>
          </Button>
        </View>
      </View>
    );
  };

  const renderPolls = () => {
    const sortedPolls = [...pollData].sort(
      (a, b) => b.percentage - a.percentage
    );
    const totalVotes = pollData.reduce((sum, poll) => sum + poll.votes, 0);

    return (
      <View className="space-y-4">
        {/* Poll Results Header */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600">
          <CardContent className="p-4">
            <View className="flex-row items-center justify-between mb-2">
              <View>
                <Text className="text-white font-bold text-lg">
                  📊 Latest Poll Results
                </Text>
                <Text className="text-white text-xs mt-1">
                  {totalVotes.toLocaleString()} responses
                </Text>
              </View>
              <TrendingUp className="text-white" size={24} />
            </View>
            <Text className="text-white text-xs">
              Updated 2 hours ago • Kathmandu-1
            </Text>
          </CardContent>
        </Card>

        {/* Poll Results - Visual Bars */}
        <Card>
          <CardContent className="p-4">
            <Text className="text-sm font-bold text-gray-800 mb-4">
              🗳️ Candidate Polling
            </Text>

            {sortedPolls.map((poll, index) => {
              const candidate = candidates.find(
                (c) => c.id === poll.candidateId
              );
              const isLeading = index === 0;

              return (
                <View key={poll.id} className="mb-4 last:mb-0">
                  {/* Candidate Info Row */}
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-1">
                      <View className="flex-row items-center">
                        {isLeading && (
                          <Award className="text-yellow-500 mr-1" size={14} />
                        )}
                        <Text
                          className={`text-sm font-bold ${
                            isLeading ? "text-gray-800" : "text-gray-700"
                          }`}
                        >
                          {poll.candidateName}
                        </Text>
                      </View>
                      <Text className="text-xs text-gray-500">
                        {poll.party}
                      </Text>
                    </View>

                    <View className="items-end">
                      <Text className="text-lg font-bold text-gray-800">
                        {poll.percentage.toFixed(1)}%
                      </Text>
                      <View className="flex-row items-center">
                        {poll.trend === "up" && (
                          <TrendingUp
                            className="text-green-500 mr-1"
                            size={12}
                          />
                        )}
                        {poll.trend === "down" && (
                          <TrendingUp
                            className="text-red-500 mr-1"
                            size={12}
                            style={{ transform: [{ rotate: "180deg" }] }}
                          />
                        )}
                        {poll.trend === "stable" && (
                          <View className="w-2 h-2 bg-gray-400 rounded-full mr-1" />
                        )}
                        <Text
                          className={`text-xs ${
                            poll.trend === "up"
                              ? "text-green-600"
                              : poll.trend === "down"
                              ? "text-red-600"
                              : "text-gray-500"
                          }`}
                        >
                          {poll.change > 0 ? "+" : ""}
                          {poll.change.toFixed(1)}%
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className={`h-full ${
                        index === 0
                          ? "bg-indigo-500"
                          : index === 1
                          ? "bg-blue-500"
                          : "bg-purple-500"
                      }`}
                      style={{ width: `${poll.percentage}%` }}
                    />
                  </View>

                  {/* Votes Count */}
                  <Text className="text-xs text-gray-500 mt-1">
                    {poll.votes.toLocaleString()} votes
                  </Text>
                </View>
              );
            })}
          </CardContent>
        </Card>

        {/* Trending Issues */}
        <Card>
          <CardContent className="p-4">
            <Text className="text-sm font-bold text-gray-800 mb-3">
              🔥 Trending Election Issues
            </Text>

            <View className="space-y-3">
              {pollIssues.map((issue) => (
                <View
                  key={issue.id}
                  className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500"
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-gray-800">
                        {issue.topic}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">
                        {issue.mentions.toLocaleString()} mentions
                      </Text>
                    </View>
                    <View
                      className={`px-2 py-1 rounded-full ${
                        issue.sentiment === "positive"
                          ? "bg-green-100"
                          : issue.sentiment === "negative"
                          ? "bg-red-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          issue.sentiment === "positive"
                            ? "text-green-700"
                            : issue.sentiment === "negative"
                            ? "text-red-700"
                            : "text-gray-700"
                        }`}
                      >
                        {issue.sentiment}
                      </Text>
                    </View>
                  </View>

                  {/* Importance Bar */}
                  <View className="mt-2">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-xs text-gray-600">Importance</Text>
                      <Text className="text-xs font-bold text-gray-800">
                        {issue.importance}%
                      </Text>
                    </View>
                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-blue-500"
                        style={{ width: `${issue.importance}%` }}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* Public Opinions */}
        <Card>
          <CardContent className="p-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-bold text-gray-800">
                💬 Public Opinions
              </Text>
              <Text className="text-xs text-gray-500">
                {publicOpinions.length} comments
              </Text>
            </View>

            <View className="space-y-3">
              {publicOpinions.map((opinion) => {
                const candidate = candidates.find(
                  (c) => c.id === opinion.candidateId
                );

                return (
                  <View
                    key={opinion.id}
                    className={`p-3 rounded-lg border ${
                      opinion.sentiment === "positive"
                        ? "bg-green-50 border-green-200"
                        : opinion.sentiment === "negative"
                        ? "bg-red-50 border-red-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1">
                        <Text className="text-sm font-bold text-gray-800">
                          {opinion.author}
                        </Text>
                        {candidate && (
                          <Text className="text-xs text-gray-500">
                            About {candidate.name}
                          </Text>
                        )}
                      </View>
                      <Text className="text-xs text-gray-400">
                        {opinion.timestamp}
                      </Text>
                    </View>

                    <Text className="text-sm text-gray-700 mb-2">
                      {opinion.comment}
                    </Text>

                    <View className="flex-row items-center">
                      <View className="flex-row items-center bg-white px-2 py-1 rounded-full">
                        <Text className="text-xs text-gray-600 mr-1">👍</Text>
                        <Text className="text-xs text-gray-600">
                          {opinion.likes}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Load More Button */}
            <Button
              onPress={() => {
                // Handle load more opinions
              }}
              className="bg-gray-100 py-2 rounded-lg mt-3"
            >
              <Text className="text-gray-700 font-medium text-center">
                Load More Comments
              </Text>
            </Button>
          </CardContent>
        </Card>

        {/* Poll Statistics Summary */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-4">
            <Text className="text-sm font-bold text-gray-800 mb-3">
              📈 Poll Statistics
            </Text>

            <View className="space-y-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-gray-600">Total Responses</Text>
                <Text className="text-sm font-bold text-gray-800">
                  {totalVotes.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-gray-600">Margin of Error</Text>
                <Text className="text-sm font-bold text-gray-800">±3.2%</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-gray-600">Poll Date</Text>
                <Text className="text-sm font-bold text-gray-800">
                  {new Date().toLocaleDateString()}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-gray-600">Sample Size</Text>
                <Text className="text-sm font-bold text-gray-800">
                  {totalVotes.toLocaleString()} voters
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    );
  };

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
        {activeTab === "compare" && renderComparison()}
        {activeTab === "polls" && renderPolls()}
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
