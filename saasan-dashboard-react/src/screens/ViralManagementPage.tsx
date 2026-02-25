import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  Share,
  MessageCircle,
  Award,
  BarChart3,
  Eye,
  Settings,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { viralApi } from "@/services/viralApi";
import { format } from "date-fns";

export const ViralManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [selectedType, setSelectedType] = useState("reports");

  // Viral metrics query
  const {
    data: viralMetrics,
    isLoading: metricsLoading,
    refetch: refetchMetrics,
  } = useQuery({
    queryKey: ["viral-metrics"],
    queryFn: () => viralApi.getViralMetrics(),
  });

  // Leaderboard query
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ["leaderboard", selectedType, selectedPeriod],
    queryFn: () =>
      viralApi.getLeaderboard(selectedType as any, selectedPeriod as any),
  });

  // Trending polls query
  const { data: trendingPolls, isLoading: pollsLoading } = useQuery({
    queryKey: ["trending-polls"],
    queryFn: () => viralApi.getTrendingPolls(10),
  });

  // Transparency feed query
  const { data: transparencyFeed, isLoading: feedLoading } = useQuery({
    queryKey: ["transparency-feed"],
    queryFn: () => viralApi.getTransparencyFeed(20),
  });

  const isLoading =
    metricsLoading || leaderboardLoading || pollsLoading || feedLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const metrics = viralMetrics || {
    totalShares: 0,
    totalVotes: 0,
    totalComments: 0,
    activeUsers: 0,
    viralScore: 0,
    topSharedContent: [],
    trendingHashtags: [],
    viralTrends: [],
  };

  const getViralScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    if (score >= 40) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Viral Features Management
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage viral content, engagement, and community features
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => refetchMetrics()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Shares
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {(metrics?.totalShares || 0).toLocaleString()}
                </p>
              </div>
              <Share className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Across all platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Votes</p>
                <p className="text-2xl font-bold text-green-600">
                  {(metrics?.totalVotes || 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Poll participation</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Comments</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(metrics?.totalComments || 0).toLocaleString()}
                </p>
              </div>
              <MessageCircle className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Community engagement</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Viral Score</p>
                <p
                  className={`text-2xl font-bold ${
                    getViralScoreColor(metrics?.viralScore || 0).split(" ")[0]
                  }`}
                >
                  {metrics?.viralScore || 0}/100
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Overall engagement</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="feed">Transparency Feed</TabsTrigger>
          <TabsTrigger value="content">Top Content</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Shared Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share className="h-5 w-5 mr-2" />
                  Top Shared Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(metrics?.topSharedContent || [])
                    .slice(0, 5)
                    .map((content) => (
                      <div
                        key={content.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{content.title}</p>
                          <p className="text-xs text-gray-500">
                            {content.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">
                            {content.shareCount}
                          </p>
                          <p className="text-xs text-gray-500">shares</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Hashtags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Trending Hashtags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(metrics?.trendingHashtags || [])
                    .slice(0, 5)
                    .map((hashtag) => (
                      <div
                        key={hashtag.tag}
                        className="flex items-center justify-between"
                      >
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                          #{hashtag.tag}
                        </span>
                        <span className="font-bold text-gray-700">
                          {hashtag.count}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Leaderboards
                </CardTitle>
                <div className="flex space-x-2">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reports">Reports</SelectItem>
                      <SelectItem value="participation">
                        Participation
                      </SelectItem>
                      <SelectItem value="corruption_fighters">
                        Fighters
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="all_time">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard?.map((entry) => (
                  <div
                    key={entry.rank}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                        {entry.rank <= 3 ? (
                          <span
                            className={`font-bold ${
                              entry.rank === 1
                                ? "text-yellow-600"
                                : entry.rank === 2
                                ? "text-gray-600"
                                : "text-orange-600"
                            }`}
                          >
                            {entry.rank === 1
                              ? "🥇"
                              : entry.rank === 2
                              ? "🥈"
                              : "🥉"}
                          </span>
                        ) : (
                          <span className="font-bold text-gray-600">
                            {entry.rank}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{entry.name}</p>
                        <p className="text-sm text-gray-500">
                          {entry.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {entry.score.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">{entry.metric}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trending Tab */}
        <TabsContent value="trending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Trending Polls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingPolls?.map((poll) => (
                  <div key={poll.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {poll.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {poll.description}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          poll.viral_potential === "explosive"
                            ? "bg-red-500"
                            : poll.viral_potential === "high"
                            ? "bg-orange-500"
                            : poll.viral_potential === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        } text-white`}
                      >
                        {poll.viral_potential.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{poll.total_votes.toLocaleString()} votes</span>
                      <span>{poll.share_count.toLocaleString()} shares</span>
                      <span>Score: {poll.trending_score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transparency Feed Tab */}
        <TabsContent value="feed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Transparency Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transparencyFeed?.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                              item.priority
                            )}`}
                          >
                            {item.priority.toUpperCase()}
                          </span>
                          {item.is_verified && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-500 text-white flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              VERIFIED
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>
                        {format(new Date(item.timestamp), "MMM dd, yyyy")}
                      </span>
                      <div className="flex space-x-4">
                        <span>{item.share_count.toLocaleString()} shares</span>
                        <span>
                          {item.reaction_count.toLocaleString()} reactions
                        </span>
                        <span>Score: {item.viral_score}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Viral Content Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(metrics?.topSharedContent || []).map((content, index) => (
                  <div
                    key={content.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                        <span className="font-bold text-blue-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {content.title}
                        </h4>
                        <p className="text-sm text-gray-500">{content.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">
                        {content.shareCount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">shares</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
