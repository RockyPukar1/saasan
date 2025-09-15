import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Clock,
  Gavel,
  Zap,
  Share,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dashboardApi } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardApi.getStats(),
  });

  const { data: majorCases, isLoading: casesLoading } = useQuery({
    queryKey: ["major-cases"],
    queryFn: () => dashboardApi.getMajorCases(),
  });

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["live-services"],
    queryFn: () => dashboardApi.getLiveServices(),
  });

  const isLoading = statsLoading || casesLoading || servicesLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
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

  const overview = stats?.data?.overview || {
    totalReports: 0,
    resolvedReports: 0,
    totalPoliticians: 0,
    activePoliticians: 0,
    resolutionRate: 0,
  };

  // Ensure numeric values are properly handled
  const resolutionRate =
    typeof overview.resolutionRate === "number"
      ? overview.resolutionRate
      : parseFloat(overview.resolutionRate) || 0;

  const totalReports =
    typeof overview.totalReports === "number"
      ? overview.totalReports
      : parseInt(overview.totalReports) || 0;

  const resolvedReports =
    typeof overview.resolvedReports === "number"
      ? overview.resolvedReports
      : parseInt(overview.resolvedReports) || 0;

  // const activePoliticians =
  //   typeof overview.activePoliticians === "number"
  //     ? overview.activePoliticians
  //     : parseInt(overview.activePoliticians) || 0;

  const recentCases = majorCases?.data?.slice(0, 5) || [];
  const electricityServices =
    services?.data?.filter((s) => s.serviceType === "electricity") || [];
  const onlineElectricity = electricityServices.filter(
    (s) => s.status === "online"
  ).length;
  const offlineElectricity = electricityServices.filter(
    (s) => s.status === "offline"
  ).length;

  // const statCards = [
  //   {
  //     title: "Total Reports",
  //     value: totalReports.toLocaleString(),
  //     description: "Corruption reports submitted",
  //     icon: FileText,
  //     color: "text-blue-600",
  //     bgColor: "bg-blue-100",
  //   },
  //   {
  //     title: "Resolved Cases",
  //     value: resolvedReports.toLocaleString(),
  //     description: `${resolutionRate.toFixed(1)}% resolution rate`,
  //     icon: CheckCircle,
  //     color: "text-green-600",
  //     bgColor: "bg-green-100",
  //   },
  //   {
  //     title: "Active Politicians",
  //     value: activePoliticians.toLocaleString(),
  //     description: `of ${overview.totalPoliticians || 0} total politicians`,
  //     icon: Users,
  //     color: "text-purple-600",
  //     bgColor: "bg-purple-100",
  //   },
  //   {
  //     title: "Electricity Status",
  //     value: `${onlineElectricity}/${onlineElectricity + offlineElectricity}`,
  //     description: "Wards with electricity",
  //     icon: Activity,
  //     color: "text-orange-600",
  //     bgColor: "bg-orange-100",
  //   },
  // ];

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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateDaysSince = (dateString: string): number => {
    return Math.floor(
      (new Date().getTime() - new Date(dateString).getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Red Banner */}
      <div className="bg-saasan-red rounded-lg p-6 mb-6 mx-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold mb-2">
              Saasan Dashboard
            </h1>
            <p className="text-red-100 text-sm">
              Monitor corruption cases, track politicians, and stay informed
            </p>
          </div>
          <div className="bg-red-500 rounded-full p-3">
            <Gavel className="text-white" size={24} />
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          System Status
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
            <span className="text-sm text-gray-600">
              All systems operational
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="text-gray-500 mr-1" size={16} />
            <span className="text-sm text-gray-600">
              {format(new Date(), "MMM dd, yyyy")}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="card-saasan-red">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <Gavel className="text-saasan-red" size={24} />
                <span className="text-2xl font-bold text-saasan-red">
                  {totalReports}
                </span>
              </div>
              <p className="text-gray-600 text-xs mt-2">Total Reports</p>
              <p className="text-saasan-red text-xs mt-1">
                {resolutionRate.toFixed(1)}% resolved
              </p>
            </CardContent>
          </Card>

          <Card className="card-saasan-yellow">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <Clock className="text-saasan-yellow" size={24} />
                <span className="text-2xl font-bold text-saasan-yellow">
                  {totalReports - resolvedReports}
                </span>
              </div>
              <p className="text-gray-600 text-xs mt-2">Pending Cases</p>
            </CardContent>
          </Card>

          <Card className="card-saasan-green">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <CheckCircle className="text-saasan-green" size={24} />
                <span className="text-2xl font-bold text-saasan-green">
                  {overview.resolvedReports}
                </span>
              </div>
              <p className="text-gray-600 text-xs mt-2">Cases Resolved</p>
            </CardContent>
          </Card>

          <Card className="card-saasan-blue">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <Users className="text-saasan-blue" size={24} />
                <span className="text-2xl font-bold text-saasan-blue">
                  {overview.activePoliticians}
                </span>
              </div>
              <p className="text-gray-600 text-xs mt-2">Active Politicians</p>
              <p className="text-saasan-blue text-xs mt-1">
                of {overview.totalPoliticians} total
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Electricity Status Card */}
      {electricityServices.length > 0 && (
        <div className="px-4 mb-6">
          <Card className="card-saasan-yellow">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <Zap className="text-saasan-yellow mr-2" size={20} />
                  <span className="text-lg font-bold text-gray-800">
                    Electricity Status
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                  <span className="text-green-600 text-xs font-bold">LIVE</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between mb-2">
                  <span className="text-green-600 text-sm font-medium">
                    Online: {onlineElectricity}
                  </span>
                  <span className="text-red-600 text-sm font-medium">
                    Offline: {offlineElectricity}
                  </span>
                </div>

                <div className="bg-red-200 h-6 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-6 rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        (onlineElectricity /
                          (onlineElectricity + offlineElectricity)) *
                        100
                      }%`,
                    }}
                  />
                </div>

                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">0%</span>
                  <span className="text-xs text-gray-500">
                    {Math.round(
                      (onlineElectricity /
                        (onlineElectricity + offlineElectricity)) *
                        100
                    )}
                    % Online
                  </span>
                  <span className="text-xs text-gray-500">100%</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 text-center">
                Total Areas: {onlineElectricity + offlineElectricity}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Major Cases Tracker */}
      <div className="px-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Major Cases Tracker
        </h2>
        {recentCases.length === 0 ? (
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-500 text-center">
                No major cases to display
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {recentCases.map((caseItem) => (
              <Card
                key={caseItem.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-3">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-bold text-gray-800 flex-1">
                          {caseItem.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {caseItem.description}
                      </p>
                      {caseItem.amountInvolved &&
                        caseItem.amountInvolved > 0 && (
                          <div className="flex items-center mb-2">
                            <DollarSign
                              className="text-red-500 mr-1"
                              size={16}
                            />
                            <span className="text-red-600 text-sm font-bold">
                              {formatCurrency(caseItem.amountInvolved)}
                            </span>
                          </div>
                        )}
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full ${getStatusColor(
                        caseItem.status
                      )}`}
                    >
                      <span className="text-white text-xs font-bold uppercase">
                        {caseItem.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Days Counter */}
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-red-600 text-center">
                      {caseItem.createdAt
                        ? calculateDaysSince(caseItem.createdAt)
                        : 0}{" "}
                      DAYS
                    </p>
                    <p className="text-gray-600 text-center text-sm">
                      since reported
                    </p>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex justify-around mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center">
                      <TrendingUp className="text-green-600 mr-1" size={16} />
                      <span className="text-green-600 text-sm font-bold">
                        {caseItem.upvotesCount || 0}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="text-blue-600 mr-1" size={16} />
                      <span className="text-blue-600 text-sm">
                        {caseItem.referenceNumber}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-bold ${getPriorityColor(
                        caseItem.priority
                      )}`}
                    >
                      {caseItem.priority?.toUpperCase() || "MEDIUM"} PRIORITY
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      {stats?.data?.categoryBreakdown &&
        stats.data.categoryBreakdown.length > 0 && (
          <div className="px-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Cases by Category
            </h2>
            <Card>
              <CardContent className="p-4">
                {stats.data.categoryBreakdown.map((category) => (
                  <div key={category.categoryName} className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">
                        {category.categoryName || "Uncategorized"}
                      </span>
                      <span className="text-gray-600 font-bold">
                        {category.count}
                      </span>
                    </div>
                    <div className="bg-gray-200 h-2 rounded-full">
                      <div
                        className="bg-saasan-red h-2 rounded-full"
                        style={{
                          width: `${(
                            (category.count / (totalReports || 1)) *
                            100
                          ).toFixed(1)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

      {/* Quick Actions */}
      <div className="px-4 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Take Action</h2>
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => navigate("/reports")}
          >
            <div className="bg-red-100 p-3 rounded-full mb-2">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <span className="text-gray-700 text-sm font-medium">
              Report Issue
            </span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => navigate("/politicians")}
          >
            <div className="bg-blue-100 p-3 rounded-full mb-2">
              <Users className="text-blue-600" size={24} />
            </div>
            <span className="text-gray-700 text-sm font-medium">Rate MP</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "Saasan App",
                  text: "Help fight corruption in Nepal with Saasan App",
                  url: "https://saasan.app",
                });
              } else {
                alert("Share app functionality coming soon!");
              }
            }}
          >
            <div className="bg-green-100 p-3 rounded-full mb-2">
              <Share className="text-green-600" size={24} />
            </div>
            <span className="text-gray-700 text-sm font-medium">Share App</span>
          </Button>
        </div>
      </div>

      {/* Daily Reminder Banner */}
      <div className="mx-4 mb-6 bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-lg">
        <p className="text-white font-bold text-center mb-2">
          📢 Daily Reminder
        </p>
        <p className="text-white text-sm text-center mb-3">
          Call your local MP today and ask: "What have you done for our
          constituency this week?"
        </p>
        <Button
          className="bg-white text-red-600 font-bold w-full"
          onClick={() => navigate("/politicians")}
        >
          Find My MP
        </Button>
      </div>

      {/* Last Updated Info */}
      <div className="px-4 pb-6">
        <p className="text-center text-gray-500 text-xs">
          Last updated: {format(new Date(), "PPpp")}
        </p>
      </div>
    </div>
  );
};
