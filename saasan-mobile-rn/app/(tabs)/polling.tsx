import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import {
  BarChart3,
  Plus,
  Filter,
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { usePolling } from "~/hooks/usePolling";
import { Poll, PollStatus, PollType } from "~/types/polling";
import { useAuthContext } from "~/contexts/AuthContext";

const PollScreen = () => {
  const router = useRouter();
  const { user } = useAuthContext();
  const { loading, error, polls, loadPolls, voteOnPoll, loadPollResults } =
    usePolling();

  const [activeTab, setActiveTab] = useState<"all" | "my_votes">("all");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadPolls();
  }, [loadPolls]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadPolls();
    } finally {
      setRefreshing(false);
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      await voteOnPoll(pollId, optionId);
      Alert.alert("Success", "Your vote has been recorded");
      loadPollResults(pollId);
    } catch (err) {
      Alert.alert("Error", "Failed to submit vote");
    }
  };

  const getStatusColor = (status: PollStatus) => {
    switch (status) {
      case PollStatus.ACTIVE:
        return "bg-green-500";
      case PollStatus.ENDED:
        return "bg-gray-500";
      case PollStatus.DRAFT:
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: PollStatus) => {
    switch (status) {
      case PollStatus.ACTIVE:
        return "Active";
      case PollStatus.ENDED:
        return "Ended";
      case PollStatus.DRAFT:
        return "Draft";
      default:
        return status;
    }
  };

  const renderPollCard = (poll: Poll) => {
    const hasVoted = poll.user_vote !== undefined;
    const totalVotes = poll.options.reduce(
      (sum, opt) => sum + opt.votes_count,
      0
    );

    return (
      <Card key={poll.id} className="mb-4">
        <CardContent className="p-4">
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800">
                {poll.title}
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                {poll.description}
              </Text>
              {poll.district && (
                <View className="flex-row items-center mt-2">
                  <MapPin className="text-gray-500" size={12} />
                  <Text className="text-gray-500 text-xs ml-1">
                    {poll.district}
                    {poll.municipality ? `, ${poll.municipality}` : ""}
                  </Text>
                </View>
              )}
            </View>
            <View
              className={`px-3 py-1 rounded-full ${getStatusColor(
                poll.status
              )}`}
            >
              <Text className="text-white text-xs font-bold">
                {getStatusText(poll.status)}
              </Text>
            </View>
          </View>

          {/* Options */}
          <View className="mb-4">
            {poll.options.map((option) => {
              const percentage =
                totalVotes > 0
                  ? Math.round((option.votes_count / totalVotes) * 100)
                  : 0;
              const isSelected =
                poll.user_vote === option.id ||
                (Array.isArray(poll.user_vote) &&
                  poll.user_vote.includes(option.id));

              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => {
                    if (!hasVoted && poll.status === PollStatus.ACTIVE) {
                      handleVote(poll.id, option.id);
                    }
                  }}
                  disabled={hasVoted || poll.status !== PollStatus.ACTIVE}
                  className={`mb-2 p-3 rounded-lg border ${
                    isSelected
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <Text
                      className={`font-medium ${
                        isSelected ? "text-green-800" : "text-gray-800"
                      }`}
                    >
                      {option.text}
                    </Text>
                    {hasVoted && (
                      <Text
                        className={`${
                          isSelected ? "text-green-800" : "text-gray-600"
                        }`}
                      >
                        {percentage}%
                      </Text>
                    )}
                  </View>
                  {hasVoted && (
                    <View className="mt-2 bg-gray-200 rounded-full overflow-hidden">
                      <View
                        className="h-2 bg-green-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View className="flex-row justify-between items-center pt-3 border-t border-gray-200">
            <View className="flex-row items-center">
              <Clock className="text-gray-500" size={14} />
              <Text className="text-gray-500 text-xs ml-1">
                {new Date(poll.end_date).toLocaleDateString()}
              </Text>
            </View>
            <Text className="text-gray-600 text-xs">
              {poll.total_votes} votes
            </Text>
            {poll.is_anonymous && (
              <View className="flex-row items-center">
                <AlertCircle className="text-gray-500" size={14} />
                <Text className="text-gray-500 text-xs ml-1">Anonymous</Text>
              </View>
            )}
          </View>
        </CardContent>
      </Card>
    );
  };

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-600">{error}</Text>
        <Button onPress={() => loadPolls()} className="mt-4">
          <Text className="text-white">Retry</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search and Filter */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row space-x-2">
          <TextInput
            placeholder="Search polls..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 bg-gray-100 px-4 py-2 rounded-lg text-gray-800"
          />
          <TouchableOpacity className="bg-gray-100 p-2 rounded-lg">
            <Filter className="text-gray-600" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Selector */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row px-4 py-2">
          <TouchableOpacity
            onPress={() => setActiveTab("all")}
            className={`flex-1 py-3 items-center border-b-2 ${
              activeTab === "all" ? "border-red-600" : "border-transparent"
            }`}
          >
            <Text
              className={`font-bold ${
                activeTab === "all" ? "text-red-600" : "text-gray-600"
              }`}
            >
              All Polls
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("my_votes")}
            className={`flex-1 py-3 items-center border-b-2 ${
              activeTab === "my_votes" ? "border-red-600" : "border-transparent"
            }`}
          >
            <Text
              className={`font-bold ${
                activeTab === "my_votes" ? "text-red-600" : "text-gray-600"
              }`}
            >
              My Votes
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Poll List */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && polls.length === 0 ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text>Loading polls...</Text>
          </View>
        ) : polls.length === 0 ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-gray-600">No polls found</Text>
          </View>
        ) : (
          polls
            .filter((poll) =>
              activeTab === "my_votes" ? poll.user_vote !== undefined : true
            )
            .filter((poll) =>
              searchQuery
                ? poll.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  poll.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                : true
            )
            .map(renderPollCard)
        )}
      </ScrollView>
    </View>
  );
};

export default PollScreen;
