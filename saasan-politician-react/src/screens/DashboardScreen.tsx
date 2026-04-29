import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { dashboardApi, messagesApi, type MessageThread } from "@/services/api";
import { toast } from "@/components/ui/toast";

interface PoliticianDashboardStats {
  overview: {
    totalMessages: number;
    pendingMessages: number;
    inProgressMessages: number;
    resolvedMessages: number;
    reportOriginThreads: number;
    responseRate: number;
    messagesThisWeek: number;
  };
  recentMessages: MessageThread[];
}

const emptyStats: PoliticianDashboardStats = {
  overview: {
    totalMessages: 0,
    pendingMessages: 0,
    inProgressMessages: 0,
    resolvedMessages: 0,
    reportOriginThreads: 0,
    responseRate: 0,
    messagesThisWeek: 0,
  },
  recentMessages: [],
};

const normalizeMessageStatus = (status?: string) =>
  (status || "").toUpperCase();

const buildStatsFromMessages = (
  messages: MessageThread[],
): PoliticianDashboardStats => {
  const totalMessages = messages.length;
  const pendingMessages = messages.filter(
    (message) => normalizeMessageStatus(message.status) === "PENDING",
  ).length;
  const inProgressMessages = messages.filter(
    (message) => normalizeMessageStatus(message.status) === "IN_PROGRESS",
  ).length;
  const resolvedMessages = messages.filter((message) =>
    ["RESOLVED", "CLOSED"].includes(normalizeMessageStatus(message.status)),
  ).length;
  const reportOriginThreads = messages.filter(
    (message) => message.messageOrigin === "report_converted",
  ).length;
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const messagesThisWeek = messages.filter((message) => {
    const timestamp = new Date(message.createdAt || message.lastMessageAt).getTime();
    return Number.isFinite(timestamp) && timestamp >= oneWeekAgo;
  }).length;

  return {
    overview: {
      totalMessages,
      pendingMessages,
      inProgressMessages,
      resolvedMessages,
      reportOriginThreads,
      responseRate: totalMessages
        ? Number(((resolvedMessages / totalMessages) * 100).toFixed(1))
        : 0,
      messagesThisWeek,
    },
    recentMessages: messages.slice(0, 5),
  };
};

export const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<PoliticianDashboardStats>(emptyStats);
  const [recentMessages, setRecentMessages] = useState<MessageThread[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      let dashboardData: PoliticianDashboardStats = emptyStats;

      try {
        const statsResponse = await dashboardApi.getStats();
        dashboardData = statsResponse.data || emptyStats;
      } catch (error) {
        console.warn("Stats endpoint failed, using message fallback:", error);
      }

      const messages =
        dashboardData.recentMessages?.length > 0
          ? dashboardData.recentMessages
          : await messagesApi.getAll();

      const fallbackStats =
        dashboardData.overview?.totalMessages || messages.length === 0
          ? dashboardData
          : buildStatsFromMessages(messages);

      setStats({
        overview: {
          ...emptyStats.overview,
          ...(fallbackStats.overview || {}),
        },
        recentMessages: fallbackStats.recentMessages || [],
      });
      setRecentMessages(messages.slice(0, 5) || []);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setStats(emptyStats);
      setRecentMessages([]);
      toast.error("Failed to load dashboard data. Please try again.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
      case "closed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const normalizeStatus = (status?: string) => (status || "").toLowerCase();

  const normalizeUrgency = (urgency?: string) => (urgency || "").toLowerCase();

  const getUrgencyColor = (urgency?: string) => {
    switch (normalizeUrgency(urgency)) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-orange-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const overview = stats.overview;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 rounded-lg p-6 mb-6 mx-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold mb-2">
              Politician Dashboard
            </h1>
            <p className="text-red-100 text-sm">
              Review constituency message threads and response progress
            </p>
          </div>
          <div className="bg-red-500 rounded-full p-3">
            <MessageSquare className="text-white" size={24} />
          </div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/messages")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <MessageSquare className="text-red-600" size={24} />
                <span className="text-2xl font-bold text-red-600">
                  {overview.totalMessages}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">Total Threads</p>
              <p className="text-red-500 text-xs mt-1">
                +{overview.messagesThisWeek} this week
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/messages")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <AlertCircle className="text-orange-600" size={24} />
                <span className="text-2xl font-bold text-orange-600">
                  {overview.pendingMessages}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">Pending Replies</p>
              <p className="text-orange-500 text-xs mt-1">
                Need initial attention
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/messages")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Clock className="text-blue-600" size={24} />
                <span className="text-2xl font-bold text-blue-600">
                  {overview.inProgressMessages}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">In Progress</p>
              <p className="text-blue-500 text-xs mt-1">
                Active constituency threads
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/messages")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <CheckCircle className="text-green-600" size={24} />
                <span className="text-2xl font-bold text-green-600">
                  {overview.resolvedMessages}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">Resolved Threads</p>
              <p className="text-green-500 text-xs mt-1">
                {overview.responseRate}% resolution rate
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="px-4 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Recent Message Threads</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No recent threads assigned to your dashboard yet.
                </p>
              ) : (
                recentMessages.map((message) => (
                  <div
                    key={message.id || message._id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate("/messages")}
                  >
                    <div className="flex-1">
                      <div className="font-medium">
                        {message.subject || "Citizen message"}
                      </div>
                      <div className="text-sm text-gray-600">
                        From:{" "}
                        {message.participants?.citizen?.name || "Constituent"}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(normalizeStatus(message.status))}
                      <span
                        className={`text-sm ${getUrgencyColor(message.urgency)}`}
                      >
                        {normalizeUrgency(message.urgency) || "normal"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="pt-4">
              <Button
                onClick={() => navigate("/messages")}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                View All Messages
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Response Snapshot</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-gray-600">Resolution Rate</div>
                <div className="mt-2 text-3xl font-bold text-green-600">
                  {overview.responseRate}%
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Based on resolved and closed threads
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="text-sm text-gray-600">Report-Origin Threads</div>
                <div className="mt-2 text-3xl font-bold text-blue-600">
                  {overview.reportOriginThreads}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Auto-created from approved citizen reports
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="text-sm text-gray-600">New Threads This Week</div>
                <div className="mt-2 text-3xl font-bold text-red-600">
                  {overview.messagesThisWeek}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Fresh activity reaching your office
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
