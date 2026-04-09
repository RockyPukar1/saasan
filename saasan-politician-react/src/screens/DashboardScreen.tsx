import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Target,
  Megaphone,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { dashboardApi, messagesApi, type MessageThread } from "@/services/api";
import { toast } from "@/components/ui/toast";

export const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMessages: 0,
    activePromises: 0,
    announcements: 0,
    constituentsReached: 0,
    messagesThisWeek: 0,
    promisesFulfilled: 0,
    announcementsThisMonth: 0,
    newConstituentsThisWeek: 0,
  });
  const [recentMessages, setRecentMessages] = useState<MessageThread[]>([]);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load stats
      const statsResponse = await dashboardApi.getStats();
      setStats(
        statsResponse.data || {
          totalMessages: 0,
          activePromises: 0,
          announcements: 0,
          constituentsReached: 0,
          messagesThisWeek: 0,
          promisesFulfilled: 0,
          announcementsThisMonth: 0,
          newConstituentsThisWeek: 0,
        },
      );

      // Load recent messages
      const messagesResponse = await messagesApi.getAll();
      setRecentMessages(messagesResponse.slice(0, 5) || []);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data. Please try again.");
    }
  };

  const recentPromises = [
    {
      id: "1",
      title: "Upgrade local health facilities",
      progress: 65,
      status: "ongoing",
      dueDate: "2024-12-31",
    },
    {
      id: "2",
      title: "Construct 50km of rural roads",
      progress: 40,
      status: "ongoing",
      dueDate: "2024-10-30",
    },
    {
      id: "3",
      title: "Digital literacy program",
      progress: 100,
      status: "fulfilled",
      dueDate: "2024-03-15",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
      case "fulfilled":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_progress":
      case "ongoing":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Politician Header */}
      <div className="bg-red-600 rounded-lg p-6 mb-6 mx-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold mb-2">
              Welcome back, Honorable Representative
            </h1>
            <p className="text-red-100 text-sm">
              Manage your constituency and connect with citizens
            </p>
          </div>
          <div className="bg-red-500 rounded-full p-3">
            <Users className="text-white" size={24} />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
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
                  {stats.totalMessages}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">Total Messages</p>
              <p className="text-red-500 text-xs mt-1">
                +{stats.messagesThisWeek} this week
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/promises")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Target className="text-blue-600" size={24} />
                <span className="text-2xl font-bold text-blue-600">
                  {stats.activePromises}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">Active Promises</p>
              <p className="text-blue-500 text-xs mt-1">
                {stats.promisesFulfilled} fulfilled
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/announcements")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Megaphone className="text-green-600" size={24} />
                <span className="text-2xl font-bold text-green-600">
                  {stats.announcements}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">Announcements</p>
              <p className="text-green-500 text-xs mt-1">
                +{stats.announcementsThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Users className="text-yellow-600" size={24} />
                <span className="text-2xl font-bold text-yellow-600">
                  {stats.constituentsReached}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">Constituents Reached</p>
              <p className="text-yellow-500 text-xs mt-1">
                +{stats.newConstituentsThisWeek} this week
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 grid gap-6 lg:grid-cols-2">
        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Recent Messages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate("/messages")}
                >
                  <div className="flex-1">
                    <div className="font-medium">{message.subject}</div>
                    <div className="text-sm text-gray-600">
                      From: {message.participants.citizen.name}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(message.status)}
                    <span
                      className={`text-sm ${getUrgencyColor(message.urgency)}`}
                    >
                      {message.urgency}
                    </span>
                  </div>
                </div>
              ))}
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

        {/* Recent Promises */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Recent Promises</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPromises.map((promise) => (
                <div
                  key={promise.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate("/promises")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{promise.title}</div>
                    {getStatusIcon(promise.status)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{promise.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${promise.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    Due: {format(new Date(promise.dueDate), "MMM dd, yyyy")}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Button
                onClick={() => navigate("/promises")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                View All Promises
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
