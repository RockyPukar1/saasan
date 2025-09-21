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
import { useLanguage } from "~/contexts/LanguageContext";
import { PageHeader } from "~/components/PageHeader";

const PollScreen = () => {
  const router = useRouter();
  const { user } = useAuthContext();
  const { t } = useLanguage();
  const {
    loading,
    votingLoading,
    error,
    polls,
    loadPolls,
    voteOnPoll,
    loadPollResults,
  } = usePolling();

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
    if (!user) {
      Alert.alert(t("polling.authRequired"), t("polling.loginToVote"), [
        { text: t("common.cancel"), style: "cancel" },
        { text: t("nav.login"), onPress: () => router.push("/(auth)/login") },
      ]);
      return;
    }

    try {
      await voteOnPoll(pollId, optionId);
      // Success - UI will update automatically
    } catch (err) {
      Alert.alert(t("common.error"), t("polling.voteFailed"));
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
        return t("polling.active");
      case PollStatus.ENDED:
        return t("polling.ended");
      case PollStatus.DRAFT:
        return t("polling.draft");
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
            <View className="items-end">
              <View
                className={`px-3 py-1 rounded-full ${getStatusColor(
                  poll.status
                )} mb-1`}
              >
                <Text className="text-white text-xs font-bold">
                  {getStatusText(poll.status)}
                </Text>
              </View>
              <View className="px-2 py-1 bg-blue-100 rounded-full">
                <Text className="text-blue-800 text-xs font-medium">
                  {poll.type === "multiple_choice"
                    ? t("polling.multipleChoice")
                    : t("polling.singleChoice")}
                </Text>
              </View>
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

              const isMultipleChoice = poll.type === "multiple_choice";
              const canVote = poll.status === PollStatus.ACTIVE && user;
              const isDisabled =
                !canVote ||
                (!isMultipleChoice && hasVoted && !isSelected) ||
                votingLoading;

              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => {
                    if (canVote) {
                      handleVote(poll.id, option.id);
                    }
                  }}
                  disabled={isDisabled}
                  className={`mb-2 p-3 rounded-lg border ${
                    isSelected
                      ? "border-green-500 bg-green-50"
                      : isDisabled
                      ? "border-gray-200 bg-gray-50"
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
                      {votingLoading && " ⏳"}
                    </Text>
                    <Text
                      className={`text-sm ${
                        isSelected ? "text-green-800" : "text-gray-600"
                      }`}
                    >
                      {option.votes_count} {t("polling.votes")} ({percentage}%)
                    </Text>
                  </View>
                  <View className="mt-2 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className={`h-2 ${
                        isSelected ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </View>
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
              {poll.total_votes} {t("polling.votes")}
            </Text>
            {poll.is_anonymous && (
              <View className="flex-row items-center">
                <AlertCircle className="text-gray-500" size={14} />
                <Text className="text-gray-500 text-xs ml-1">
                  {t("polling.anonymous")}
                </Text>
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
          <Text className="text-white">{t("common.retry")}</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Language Toggle */}
      <PageHeader
        title={t("polling.title")}
        subtitle={`${polls.filter((p) => p.status === "active").length} ${t(
          "polling.activePolls"
        )}`}
      />

      {/* Search and Filter */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        {/* Voted Status */}
        <View className="mb-3 flex-row items-center justify-end">
          <View className="flex-row items-center">
            <CheckCircle2 className="text-green-600 mr-1" size={14} />
            <Text className="text-xs text-gray-600">
              {polls.filter((p) => p.user_vote !== undefined).length} voted
            </Text>
          </View>
        </View>

        <View className="flex-row space-x-2">
          <TextInput
            placeholder={
              t("common.search") + " " + t("polling.title").toLowerCase()
            }
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
              {t("polling.activePolls")}
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
              {t("polling.myPolls")}
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
            <Text>{t("polling.loadingPolls")}</Text>
          </View>
        ) : polls.length === 0 ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-gray-600">{t("polling.noPolls")}</Text>
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

        {/* Bottom padding for tab bar */}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
};

export default PollScreen;
