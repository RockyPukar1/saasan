// src/screens/DashboardScreen.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { format, differenceInDays, parseISO } from "date-fns";
import {
  AlertTriangle,
  Users,
  CheckCircle,
  FileText,
  Share,
  Gavel,
  Zap,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react-native";

// Import your UI components from React Native Reusables
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useDashboard } from "~/hooks/useDashboard";
import Loading from "~/components/Loading";
import Error from "~/components/Error";
import { useRouter } from "expo-router";

interface CorruptionCase {
  id: string;
  title: string;
  daysSince: number;
  status: "unsolved" | "ongoing" | "solved";
  category: "murder" | "financial" | "abuse_of_power";
  description: string;
}

interface LiveStats {
  totalCorruptionCases: number;
  activeCases: number;
  solvedThisMonth: number;
  citizenReports: number;
}

interface HistoricalEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  year: number;
}

interface LiveElectricityStats {
  electricityOnlineWards: number;
  electricityOfflineWards: number;
}

const DashboardScreen = () => {
  const router = useRouter();
  const [currentDate] = useState(new Date());

  const { dashboardStats, error, loading, majorCases, refresh, serviceStatus } =
    useDashboard();

  // Calculate electricity status from service data
  const electricityStats = useMemo(() => {
    const electricityServices = serviceStatus.filter(
      (s) => s.serviceType === "electricity"
    );
    const online = electricityServices.filter(
      (s) => s.status === "online"
    ).length;
    const offline = electricityServices.filter(
      (s) => s.status === "offline"
    ).length;

    return { online, offline, total: online + offline };
  }, [serviceStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unsolved":
        return "bg-red-500";
      case "ongoing":
        return "bg-yellow-500";
      case "solved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "murder":
        return <AlertTriangle className="text-red-600" size={20} />;
      case "financial":
        return <FileText className="text-yellow-600" size={20} />;
      case "abuse_of_power":
        return <Gavel className="text-purple-600" size={20} />;
      default:
        return <AlertTriangle className="text-gray-600" size={20} />;
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateDaysSince = (dateString: string): number => {
    return differenceInDays(new Date(), parseISO(dateString));
  };

  if (loading && !dashboardStats) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} refresh={refresh} />;
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
    >
      {/* Header */}
      <View className="bg-red-600 pt-5 pb-6 px-5">
        <Text className="text-white text-xl font-bold">
          Political Transparency
        </Text>
        <Text className="text-red-100 text-sm mt-1">
          {format(currentDate, "EEEE, MMMM dd, yyyy")}
        </Text>
        <Text className="text-red-200 text-xs mt-1">
          Live tracking of corruption cases & political accountability
        </Text>
      </View>

      {/* Live Stats Cards */}
      {dashboardStats?.overview && (
        <View className="px-4 -mt-4 mb-6">
          <View className="flex-row flex-wrap justify-between">
            <Card className="w-[48%] mb-4 border-l-4 border-red-500">
              <CardContent className="p-4">
                <View className="flex-row justify-between items-center">
                  <Gavel className="text-red-600" size={24} />
                  <Text className="text-2xl font-bold text-red-600">
                    {dashboardStats.overview.totalReports}
                  </Text>
                </View>
                <Text className="text-gray-600 text-xs mt-2">
                  Total Reports
                </Text>
                <Text className="text-red-500 text-xs mt-1">
                  {dashboardStats.overview.resolutionRate}% resolved
                </Text>
              </CardContent>
            </Card>

            <Card className="w-[48%] mb-4 border-l-4 border-yellow-500">
              <CardContent className="p-4">
                <View className="flex-row justify-between items-center">
                  <Clock className="text-yellow-600" size={24} />
                  <Text className="text-2xl font-bold text-yellow-600">
                    {dashboardStats.overview.totalReports -
                      dashboardStats.overview.resolvedReports}
                  </Text>
                </View>
                <Text className="text-gray-600 text-xs mt-2">
                  Pending Cases
                </Text>
              </CardContent>
            </Card>

            <Card className="w-[48%] mb-4 border-l-4 border-green-500">
              <CardContent className="p-4">
                <View className="flex-row justify-between items-center">
                  <CheckCircle className="text-green-600" size={24} />
                  <Text className="text-2xl font-bold text-green-600">
                    {dashboardStats.overview.resolvedReports}
                  </Text>
                </View>
                <Text className="text-gray-600 text-xs mt-2">
                  Cases Resolved
                </Text>
              </CardContent>
            </Card>

            <Card className="w-[48%] mb-4 border-l-4 border-blue-500">
              <CardContent className="p-4">
                <View className="flex-row justify-between items-center">
                  <Users className="text-blue-600" size={24} />
                  <Text className="text-2xl font-bold text-blue-600">
                    {dashboardStats.overview.activePoliticians}
                  </Text>
                </View>
                <Text className="text-gray-600 text-xs mt-2">
                  Active Politicians
                </Text>
                <Text className="text-blue-500 text-xs mt-1">
                  of {dashboardStats.overview.totalPoliticians} total
                </Text>
              </CardContent>
            </Card>
          </View>
        </View>
      )}

      {/* Electricity Status Card */}
      {electricityStats.total > 0 && (
        <View className="px-4 mb-6">
          <Card className="border-l-4 border-yellow-500">
            <CardContent className="p-4">
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                  <Zap className="text-yellow-600 mr-2" size={20} />
                  <Text className="text-lg font-bold text-gray-800">
                    Electricity Status
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                  <Text className="text-green-600 text-xs font-bold">LIVE</Text>
                </View>
              </View>

              <View className="mb-3">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-green-600 text-sm font-medium">
                    Online: {electricityStats.online}
                  </Text>
                  <Text className="text-red-600 text-sm font-medium">
                    Offline: {electricityStats.offline}
                  </Text>
                </View>

                <View className="bg-red-200 h-6 rounded-full overflow-hidden">
                  <View
                    className="bg-green-500 h-6 rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        (electricityStats.online / electricityStats.total) * 100
                      }%`,
                    }}
                  />
                </View>

                <View className="flex-row justify-between mt-1">
                  <Text className="text-xs text-gray-500">0%</Text>
                  <Text className="text-xs text-gray-500">
                    {Math.round(
                      (electricityStats.online / electricityStats.total) * 100
                    )}
                    % Online
                  </Text>
                  <Text className="text-xs text-gray-500">100%</Text>
                </View>
              </View>

              <Text className="text-xs text-gray-600 text-center">
                Total Areas: {electricityStats.total}
              </Text>
            </CardContent>
          </Card>
        </View>
      )}

      {/* Historical Events - On This Day */}
      {/* <View className="px-4 mb-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          On This Day
        </Text>
        {historicalEvents.map((event) => (
          <Card key={event.id} className="mb-4">
            <CardContent className="p-4">
              <Text className="text-red-600 font-bold text-sm mb-1">
                {event.date}
              </Text>
              <Text className="text-lg font-bold text-gray-800 mb-2">
                {event.title}
              </Text>
              <Text className="text-gray-600 text-sm">{event.description}</Text>
              <Text className="text-gray-500 text-xs mt-2">
                {currentDate.getFullYear() - event.year} years ago
              </Text>
            </CardContent>
          </Card>
        ))}
      </View> */}

      {/* Major Cases Tracker */}
      <View className="px-4 mb-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Major Cases Tracker
        </Text>
        {majorCases.length === 0 ? (
          <Card>
            <CardContent className="p-4">
              <Text className="text-gray-500 text-center">
                No major cases to display
              </Text>
            </CardContent>
          </Card>
        ) : (
          majorCases.map((caseItem) => (
            <TouchableOpacity
              key={caseItem.id}
              onPress={() => router.push(`/report/${caseItem.id}`)}
              activeOpacity={0.7}
            >
              <Card className="mb-4">
                <CardContent className="p-4">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1 mr-3">
                      <View className="flex-row items-center mb-2">
                        <Text className="text-lg font-bold text-gray-800 flex-1">
                          {caseItem.title}
                        </Text>
                      </View>
                      <Text
                        className="text-gray-600 text-sm mb-2"
                        numberOfLines={2}
                      >
                        {caseItem.description}
                      </Text>
                      {caseItem.amountInvolved && (
                        <View className="flex-row items-center mb-2">
                          <DollarSign className="text-red-500 mr-1" size={16} />
                          <Text className="text-red-600 text-sm font-bold">
                            {formatCurrency(caseItem.amountInvolved)}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View
                      className={`px-3 py-1 rounded-full ${getStatusColor(
                        caseItem.status
                      )}`}
                    >
                      <Text className="text-white text-xs font-bold uppercase">
                        {caseItem.status.replace("_", " ")}
                      </Text>
                    </View>
                  </View>

                  {/* Days Counter */}
                  <View className="bg-gray-100 p-3 rounded-lg">
                    <Text className="text-2xl font-bold text-red-600 text-center">
                      {calculateDaysSince(caseItem.createdAt)} DAYS
                    </Text>
                    <Text className="text-gray-600 text-center text-sm">
                      since reported
                    </Text>
                  </View>

                  {/* Engagement Stats */}
                  <View className="flex-row justify-around mt-3 pt-3 border-t border-gray-200">
                    <View className="flex-row items-center">
                      <TrendingUp className="text-green-600 mr-1" size={16} />
                      <Text className="text-green-600 text-sm font-bold">
                        {caseItem.upvotesCount}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <FileText className="text-blue-600 mr-1" size={16} />
                      <Text className="text-blue-600 text-sm">
                        {caseItem.referenceNumber}
                      </Text>
                    </View>
                    <Text
                      className={`text-sm font-bold ${getPriorityColor(
                        caseItem.priority
                      )}`}
                    >
                      {caseItem.priority.toUpperCase()} PRIORITY
                    </Text>
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Category Breakdown */}
      {dashboardStats?.categoryBreakdown && (
        <View className="px-4 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Cases by Category
          </Text>
          <Card>
            <CardContent className="p-4">
              {dashboardStats.categoryBreakdown.map((category, index) => (
                <View key={category.categoryName} className="mb-3">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-gray-700 font-medium">
                      {category.categoryName || "Uncategorized"}
                    </Text>
                    <Text className="text-gray-600 font-bold">
                      {category.count}
                    </Text>
                  </View>
                  <View className="bg-gray-200 h-2 rounded-full">
                    {dashboardStats.overview && (
                      <View
                        className="bg-red-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (category.count /
                              dashboardStats.overview.totalReports || 0) * 100
                          }%`,
                        }}
                      />
                    )}
                  </View>
                </View>
              ))}
            </CardContent>
          </Card>
        </View>
      )}

      {/* Quick Actions */}
      <View className="px-4 mb-8">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Take Action
        </Text>
        <View className="flex-row justify-around">
          <TouchableOpacity className="items-center p-4" onPress={() => {}}>
            <View className="bg-red-100 p-3 rounded-full mb-2">
              <AlertTriangle className="text-red-600" size={24} />
            </View>
            <Text className="text-gray-700 text-sm font-medium">
              Report Issue
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center p-4" onPress={() => {}}>
            <View className="bg-blue-100 p-3 rounded-full mb-2">
              <Users className="text-blue-600" size={24} />
            </View>
            <Text className="text-gray-700 text-sm font-medium">Rate MP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center p-4"
            onPress={() =>
              Alert.alert("Share", "Share app functionality coming soon!")
            }
          >
            <View className="bg-green-100 p-3 rounded-full mb-2">
              <Share className="text-green-600" size={24} />
            </View>
            <Text className="text-gray-700 text-sm font-medium">Share App</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Daily Reminder Banner */}
      <View className="mx-4 mb-6 bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-lg">
        <Text className="text-white font-bold text-center mb-2">
          📢 Daily Reminder
        </Text>
        <Text className="text-white text-sm text-center mb-3">
          Call your local MP today and ask: "What have you done for our
          constituency this week?"
        </Text>
        <Button className="bg-white" onPress={() => {}}>
          <Text className="text-red-600 font-bold">Find My MP</Text>
        </Button>
      </View>

      {/* Last Updated Info */}
      <View className="px-4 pb-6">
        <Text className="text-center text-gray-500 text-xs">
          Last updated: {format(currentDate, "PPpp")}
        </Text>
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;
