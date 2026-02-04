import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePolling } from "@/hooks/usePolling";
import { type Poll, PollStatus } from "@/types";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import TabSelector from "@/components/common/TabSelector";

const PollScreen = () => {
  const { user } = useAuthContext();
  const { t } = useLanguage();
  const { loading, currentVotingPollId, error, polls, loadPolls, voteOnPoll } =
    usePolling();

  const [activeTab, setActiveTab] = useState<"all" | "my-votes">("all");
  // const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPolls();
  }, [loadPolls]);

  // const onRefresh = async () => {
  //   setRefreshing(true);
  //   try {
  //     await loadPolls();
  //   } finally {
  //     setRefreshing(false);
  //   }
  // };

  const handleVote = async (pollId: string, optionId: string) => {
    if (!user) {
      // Alert.alert(t("polling.authRequired"), t("polling.loginToVote"), [
      //   { text: t("common.cancel"), style: "cancel" },
      //   { text: t("nav.login"), onClick: () => router.push("/(auth)/login") },
      // ]);
      return;
    }

    try {
      await voteOnPoll(pollId, optionId);
    } catch (err) {
      // Alert.alert(t("common.error"), t("polling.voteFailed"));
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
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <p className="text-lg font-bold text-gray-800">
                {poll.title}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {poll.description}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div
                className={`px-3 py-1 rounded-full ${getStatusColor(
                  poll.status
                )} mb-1`}
              >
                <p className="text-white text-xs font-bold">
                  {getStatusText(poll.status)}
                </p>
              </div>
              <div className="px-2 py-1 bg-blue-100 rounded-full">
                <p className="text-blue-800 text-xs font-medium">
                  {poll.type === "multiple_choice"
                    ? t("polling.multipleChoice")
                    : t("polling.singleChoice")}
                </p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="mb-4">
            {poll.options.map((option) => {
              const percentage =
                totalVotes > 0
                  ? Math.round((option.voteCount / totalVotes) * 100)
                  : 0;
              const isVoted = option.isVoted;
              const isDisabled = currentVotingPollId === poll.id;
              return (
                <div
                  key={option.id}
                  onClick={() => {
                    handleVote(poll.id, option.id);
                  }}
                  className={`mb-2 p-3 rounded-lg border w-full cursor-pointer transition-colors ${
                    isVoted
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-gray-800">
                      {option.text}
                      {isDisabled && " ⏳"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {option.voteCount} {t("polling.votes")} ({percentage}%)
                    </p>
                  </div>
                  <div className="bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-blue-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <div className="flex items-center">
              <Clock className="text-gray-500 w-3.5 h-3.5" />
              <p className="text-gray-500 text-xs ml-1">
                {poll.endDate
                  ? new Date(poll.endDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <p className="text-gray-600 text-xs">
              {poll.totalVotes} {t("polling.votes")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => loadPolls()} className="mt-4">
          <p className="text-white">{t("common.retry")}</p>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">

      {/* Tab Selector */}
      <TabSelector
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={[
          {
            label: t("polling.activePolls"),
            value: "all"
          },
          {
            label: t("polling.myPolls"),
            value: "my-votes"
          }
        ]}
      />

      {/* Poll List */}
      <div
        className="flex-1 px-4 py-4"
      >
        {loading && polls.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p>{t("polling.loadingPolls")}</p>
          </div>
        ) : polls.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-600">{t("polling.noPolls")}</p>
          </div>
        ) : (
          polls
            .filter((poll) =>
              activeTab === "my-votes"
                ? poll.options.some((o) => o.isVoted)
                : true
            )
            .map(renderPollCard)
        )}
      </div>
    </div>
  );
};

export default PollScreen;
