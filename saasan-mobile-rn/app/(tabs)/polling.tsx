import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { Clock, CheckCircle2 } from "lucide-react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { usePolling } from "~/hooks/usePolling";
import { Poll, PollStatus, PollType } from "~/shared-types";
import { useAuthContext } from "~/contexts/AuthContext";
import { useLanguage } from "~/contexts/LanguageContext";
import { PageHeader } from "~/components/PageHeader";

const PollScreen = () => {
  const router = useRouter();
  const { user } = useAuthContext();
  const { t } = useLanguage();
  const { loading, votingLoading, error, polls, loadPolls, voteOnPoll } =
    usePolling();

  const [activeTab, setActiveTab] = useState<"all" | "my-votes">("all");
  const [refreshing, setRefreshing] = useState(false);

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
    const totalVotes = poll.options.reduce(
      (sum, opt) => sum + opt.voteCount,
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
                  ? Math.round((option.voteCount / totalVotes) * 100)
                  : 0;
              const isVoted = option.isVoted;
              return (
                <Button
                  key={option.id}
                  onPress={() => {
                    handleVote(poll.id, option.id);
                  }}
                  className={`mb-2 p-3 rounded-lg border ${
                    isVoted
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <Text className="font-medium text-gray-800">
                      {option.text}
                      {votingLoading && " ⏳"}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {option.voteCount} {t("polling.votes")} ({percentage}%)
                    </Text>
                  </View>
                  <View className="mt-2 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className="h-2 bg-blue-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </View>
                </Button>
              );
            })}
          </View>

          <View className="flex-row justify-between items-center pt-3 border-t border-gray-200">
            <View className="flex-row items-center">
              <Clock className="text-gray-500" size={14} />
              <Text className="text-gray-500 text-xs ml-1">
                {poll.endDate
                  ? new Date(poll.endDate).toLocaleDateString()
                  : "N/A"}
              </Text>
            </View>
            <Text className="text-gray-600 text-xs">
              {poll.totalVotes} {t("polling.votes")}
            </Text>
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
        showLogout={true}
      />

      {/* Tab Selector */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row px-4 py-2">
          <Button
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
          </Button>
          <Button
            onPress={() => setActiveTab("my-votes")}
            className={`flex-1 py-3 items-center border-b-2 ${
              activeTab === "my-votes" ? "border-red-600" : "border-transparent"
            }`}
          >
            <Text
              className={`font-bold ${
                activeTab === "my-votes" ? "text-red-600" : "text-gray-600"
              }`}
            >
              {t("polling.myPolls")}
            </Text>
          </Button>
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
              activeTab === "my-votes"
                ? poll.options.some((o) => o.isVoted)
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
