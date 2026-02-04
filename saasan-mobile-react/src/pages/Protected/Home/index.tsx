import { useDashboard } from "@/hooks/useDashboard";
import { useMemo, useState } from "react";
import { format, differenceInDays, parseISO } from "date-fns";
import { Link, useNavigate } from "react-router-dom"
import {
  AlertTriangle,
  Users,
  CheckCircle,
  FileText,
  Share,
  Gavel,
  Zap,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function HomeScreen() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentDate] = useState(new Date());
  const {
    dashboardStats,
    majorCases,
    historicalEvents,
    serviceStatus,
  } = useDashboard();

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Language Toggle */}
      <PageHeader
        title={t("dashboard.welcome")}
        subtitle={t("dashboard.overview")}
        showLogout={true}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Live Stats Cards */}
          <div className="p-4">
            {/* Red Banner */}
            <div className="bg-red-600 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white text-lg font-bold mb-1">
                    Saasan Dashboard
                  </p>
                  <p className="text-red-100 text-sm">
                    Monitor Corruption, Track Politician, Survey Public
                  </p>
                </div>
                <div className="bg-red-500 rounded-full p-2">
                  <Gavel className="text-white w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Comprehensive Overview Dashboard */}
            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-800 mb-3">
                System Overview
              </p>
              
              {/* System Status Bar */}
              <div className="flex justify-between items-center mb-4 px-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                  <p className="text-sm text-gray-600">
                    All systems operational
                  </p>
                </div>
                <div className="flex items-center">
                  <Clock className="text-gray-500 mr-1 w-4 h-4" />
                  <p className="text-sm text-gray-600">
                    {format(currentDate, "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-between gap-2">
                {/* Reports Box */}
                <Card className="w-[48%] mb-3 border-l-3 border-red-500 py-0">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <FileText className="text-red-600 w-5 h-5" />
                      <span className="text-xl font-bold text-red-600">
                        {dashboardStats?.overview?.totalReportsCount || 0}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs">Total Reports</p>
                    <div className="flex justify-between text-xs mt-1 mb-2">
                      <span className="text-green-600">
                        ✓ {dashboardStats?.overview?.resolvedReportsCount || 0} resolved
                      </span>
                      <span className="text-orange-600">
                        {(dashboardStats?.overview?.totalReportsCount || 0) - (dashboardStats?.overview?.resolvedReportsCount || 0)} pending
                      </span>
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-1">
                      <div 
                        className="bg-red-600 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${dashboardStats?.overview?.reportResolutionRate || 0}%` }}
                      />
                    </div>
                    <p className="text-red-600 text-xs text-center mt-1">
                      {dashboardStats?.overview?.reportResolutionRate || 0}% resolution
                    </p>
                  </CardContent>
                </Card>

                {/* Cases Box */}
                <Card className="w-[48%] mb-3 border-l-3 border-blue-500 py-0">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <AlertTriangle className="text-blue-600 w-5 h-5" />
                      <span className="text-xl font-bold text-blue-600">
                        {dashboardStats?.overview?.totalCasesCount || 0}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs">Total Cases</p>
                    <div className="flex justify-between text-xs mt-1 mb-2">
                      <span className="text-green-600">
                        ✓ {dashboardStats?.overview?.resolvedCasesCount || 0} resolved
                      </span>
                      <span className="text-orange-600">
                        {(dashboardStats?.overview?.totalCasesCount || 0) - (dashboardStats?.overview?.resolvedCasesCount || 0)} pending
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-1">
                      <div 
                        className="bg-blue-600 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${dashboardStats?.overview?.caseResolutionRate || 0}%` }}
                      />
                    </div>
                    <p className="text-blue-600 text-xs text-center mt-1">
                      {dashboardStats?.overview?.caseResolutionRate || 0}% resolution
                    </p>
                  </CardContent>
                </Card>

                {/* Politicians Box */}
                <Card className="w-[48%] mb-3 border-l-3 border-green-500 py-0">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <Users className="text-green-600 w-5 h-5" />
                      <span className="text-xl font-bold text-green-600">
                        {dashboardStats?.overview?.totalPoliticians || 0}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs">Total Politicians</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-green-600 text-xs">
                        ✓ {dashboardStats?.overview?.activePoliticians || 0} active
                      </span>
                      <span className="text-gray-600 text-xs">
                        {Math.round(((dashboardStats?.overview?.activePoliticians || 0) / (dashboardStats?.overview?.totalPoliticians || 1)) * 100)}% active
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Total Activity Box */}
                <Card className="w-[48%] mb-3 border-l-3 border-orange-500 py-0">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <TrendingUp className="text-orange-600 w-5 h-5" />
                      <span className="text-xl font-bold text-orange-600">
                        {(dashboardStats?.overview?.totalReportsCount || 0) + (dashboardStats?.overview?.totalCasesCount || 0)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs">Total Activity</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-orange-600 text-xs">
                        📊 Combined reports & cases
                      </span>
                      <span className="text-gray-600 text-xs">
                        {Math.round(((dashboardStats?.overview?.resolvedReportsCount || 0) + (dashboardStats?.overview?.resolvedCasesCount || 0)) / ((dashboardStats?.overview?.totalReportsCount || 0) + (dashboardStats?.overview?.totalCasesCount || 1)) * 100)}% overall
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        {/* Electricity Status Card */}
        {electricityStats.total > 0 && (
          <div className="px-4 mb-6">
            <Card className="border-l-4 border-yellow-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <Zap className="text-yellow-600 mr-2 w-5 h-5" />
                    <p className="text-lg font-bold text-gray-800">
                      Electricity Status
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                    <p className="text-green-600 text-xs font-bold">
                      LIVE
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between mb-2">
                    <p className="text-green-600 text-sm font-medium">
                      Online: {electricityStats.online}
                    </p>
                    <p className="text-red-600 text-sm font-medium">
                      Offline: {electricityStats.offline}
                    </p>
                  </div>

                  <div className="bg-red-200 h-6 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-6 rounded-full transition-all duration-1000"
                      style={{
                        width: `${
                          (electricityStats.online / electricityStats.total) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-500">0%</p>
                    <p className="text-xs text-gray-500">
                      {Math.round(
                        (electricityStats.online / electricityStats.total) * 100
                      )}
                      % Online
                    </p>
                    <p className="text-xs text-gray-500">100%</p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 text-center">
                  Total Areas: {electricityStats.total}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Major Cases Tracker */}
        <div className="px-4 mb-6">
          <p className="text-xl font-bold text-gray-800 mb-4">
            Major Cases Tracker
          </p>
          {majorCases.length === 0 ? (
            <Card>
              <CardContent className="p-4">
                <p className="text-gray-500 text-center">
                  No major cases to display
                </p>
              </CardContent>
            </Card>
          ) : (
            majorCases.map((caseItem) => (
              <div
                key={caseItem.id}
                onClick={() => navigate(`/report/${caseItem.id}`)}
                className="cursor-pointer"
              >
                <Card className="mb-3">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 mr-2">
                        <p
                          className="text-base font-bold text-gray-800 mb-1"
                        >
                          {caseItem.title}
                        </p>
                        <p
                          className="text-gray-600 text-xs mb-2"
                        >
                          {caseItem.description}
                        </p>
                        {caseItem.amountInvolved &&
                          caseItem.amountInvolved > 0 && (
                            <div className="flex items-center mb-1">
                              <DollarSign
                                className="text-red-500 mr-1 w-3 h-3"
                              />
                              <p className="text-red-600 text-xs font-bold">
                                {formatCurrency(caseItem.amountInvolved)}
                              </p>
                            </div>
                          )}
                      </div>
                      <div
                        className={`px-2 py-1 rounded ${getStatusColor(
                          caseItem.status
                        )}`}
                      >
                        <p className="text-white text-xs font-bold uppercase">
                          {caseItem.status.replace("_", " ")}
                        </p>
                      </div>
                    </div>

                    {/* Compact Days Counter */}
                    <div className="bg-gray-100 p-2 rounded mb-2">
                      <p className="text-lg font-bold text-red-600 text-center">
                        {caseItem.createdAt
                          ? calculateDaysSince(caseItem.createdAt)
                          : 0}{" "}
                        DAYS
                      </p>
                      <p className="text-gray-600 text-center text-xs">
                        since reported
                      </p>
                    </div>

                    {/* Compact Engagement Stats */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <div className="flex items-center">
                        <TrendingUp className="text-green-600 mr-1 w-3 h-3" />
                        <p className="text-green-600 text-xs font-bold">
                          {caseItem.upvotesCount || 0}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <FileText className="text-blue-600 mr-1 w-3 h-3" />
                        <p className="text-blue-600 text-xs">
                          {caseItem.referenceNumber}
                        </p>
                      </div>
                      <p
                        className={`text-xs font-bold ${getPriorityColor(
                          caseItem.priority
                        )}`}
                      >
                        {caseItem.priority?.toUpperCase() || "MEDIUM"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>

        {/* Historical Events */}
        <div className="px-4 mb-6">
          <p className="text-xl font-bold text-gray-800 mb-4">
            Historical Events - On This Day
          </p>
          {historicalEvents?.length === 0 ? (
            <Card>
              <CardContent className="p-4">
                <p className="text-gray-500 text-center">
                  No historical events to display
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {historicalEvents.map((event) => (
                <Card key={event.id} className="mb-4">
                  <CardContent className="p-4">
                    <p className="text-red-600 font-bold text-sm mb-1">
                      {event.date}
                    </p>
                    <p className="text-lg font-bold text-gray-800 mb-2">
                      {event.title}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {event.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
        {/* Quick Actions */}
        <div className="px-4 mb-8">
          <p className="text-xl font-bold text-gray-800 mb-4">
            Take Action
          </p>
          <div className="flex justify-around">
            <Link
              className="flex flex-col items-center p-4"
              to={"/reports"}
            >
              <div className="bg-red-100 p-3 rounded-full mb-2">
                <AlertTriangle className="text-red-600 w-6 h-6" />
              </div>
              <p className="text-gray-700 text-sm font-medium">
                Report Issue
              </p>
            </Link>

            <Link
              className="flex flex-col items-center p-4"
              to={"/politicians"}
            >
              <div className="bg-blue-100 p-3 rounded-full mb-2">
                <Users className="text-blue-600 w-6 h-6" />
              </div>
              <p className="text-gray-700 text-sm font-medium">Rate MP</p>
            </Link>

            <div
              className="flex flex-col items-center p-4"
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.share) {
                  navigator.share({
                    title: "Saasan App",
                    text: "Help fight corruption in Nepal with Saasan App",
                    url: "https://saasan.app",
                  });
                } else {
                  toast("Share app functionality coming soon!");
                }
              }}
            >
              <div className="bg-green-100 p-3 rounded-full mb-2">
                <Share className="text-green-600 w-6 h-6" />
              </div>
              <p className="text-gray-700 text-sm font-medium">
                Share App
              </p>
            </div>
          </div>
        </div>

        {/* Daily Reminder Banner */}
        <div className="px-4 mb-6">
          <Card className="bg-red-500 border-red-500">
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <p className="text-white font-bold text-center mb-2">
                  📢 Daily Reminder
                </p>
                <p className="text-white text-sm text-center mb-3">
                  Call your local MP today and ask: "What have you done for our
                  constituency this week?"
                </p>
                <Button
                  className="bg-white px-6 py-3 rounded-lg"
                  onClick={() => navigate("/politicians")}
                >
                  <p className="text-red-600 font-bold text-center">
                    Find My MP
                  </p>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Last Updated Info */}
        <div className="px-4 pb-6">
          <p className="text-center text-gray-500 text-xs">
            Last updated: {format(currentDate, "PPpp")}
          </p>
        </div>
      </div>
    </div>
  );
};
