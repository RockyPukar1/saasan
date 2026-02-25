import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  FileText,
  AlertTriangle,
  TrendingUp,
  Settings,
  Shield,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dashboardApi, reportsApi, politicsApi } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Admin-specific data queries
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardApi.getStats(),
  });

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: () => reportsApi.getAll(),
  });

  const { data: politicians, isLoading: politiciansLoading } = useQuery({
    queryKey: ["politicians"],
    queryFn: () => politicsApi.getAll(),
  });

  // const { data: viralMetrics, isLoading: viralLoading } = useQuery({
  //   queryKey: ["viral-metrics"],
  //   queryFn: () => viralApi.getViralMetrics(),
  // });

  const isLoading = statsLoading || reportsLoading || politiciansLoading;

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

  const recentReports = reports?.slice(0, 5) || [];
  const recentPoliticians = politicians?.data?.slice(0, 5) || [];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-blue-600 rounded-lg p-6 mb-6 mx-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold mb-2">
              Admin Dashboard
            </h1>
            <p className="text-blue-100 text-sm">
              Manage corruption reports, politicians, and polling data
            </p>
          </div>
          <div className="bg-blue-500 rounded-full p-3">
            <Shield className="text-white" size={24} />
          </div>
        </div>
      </div>

      {/* Admin Quick Actions */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/reports")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <FileText className="text-blue-600" size={24} />
                <span className="text-2xl font-bold text-blue-600">
                  {overview.totalReports}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">Total Reports</p>
              <p className="text-blue-500 text-xs mt-1">Click to manage</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/politicians")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Users className="text-green-600" size={24} />
                <span className="text-2xl font-bold text-green-600">
                  {overview.totalPoliticians}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">Politicians</p>
              <p className="text-green-500 text-xs mt-1">Click to manage</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/polling")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <BarChart3 className="text-purple-600" size={24} />
                <span className="text-2xl font-bold text-purple-600">0</span>
              </div>
              <p className="text-gray-600 text-sm mt-2">Active Polls</p>
              <p className="text-purple-500 text-xs mt-1">Click to manage</p>
            </CardContent>
          </Card>

          {/* <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/viral-management")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <TrendingUp className="text-purple-600" size={24} />
                <span className="text-2xl font-bold text-purple-600">
                  {viralMetrics?.totalShares || 0}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">Viral Shares</p>
              <p className="text-purple-500 text-xs mt-1">Click to manage</p>
            </CardContent>
          </Card> */}

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/settings")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Settings className="text-orange-600" size={24} />
                <span className="text-2xl font-bold text-orange-600">
                  <Settings className="inline" size={20} />
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">System Settings</p>
              <p className="text-orange-500 text-xs mt-1">Click to configure</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Reports Management */}
      <div className="px-4 mb-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Reports</CardTitle>
              <Button onClick={() => navigate("/reports")} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Manage All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate("/reports")}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {report.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {report.description?.substring(0, 100)}...
                    </p>
                    {/* <div className="flex items-center space-x-4 mt-1">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          report.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {report.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {safeFormatDate(report.createdAt, "MMM dd")}
                      </span>
                    </div> */}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Politicians Management */}
      <div className="px-4 mb-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Politicians</CardTitle>
              <Button onClick={() => navigate("/politicians")} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Manage All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPoliticians.map((politician) => (
                <div
                  key={politician.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate("/politicians")}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {politician.fullName}
                    </h4>
                    {/* <p className="text-sm text-gray-600">
                      Position {politician.positionId} • Constituency{" "}
                      {politician.constituencyId}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        Party {politician.partyId}
                      </span>
                      <span className="text-xs text-gray-500">
                        Experience: {politician.experienceYears} years
                      </span>
                    </div> */}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Viral Metrics Overview */}
      {/* {viralMetrics && (
        <div className="px-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Viral Engagement Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Share className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">
                    {(viralMetrics?.totalShares || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Shares</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    {(viralMetrics?.totalVotes || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Votes</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">
                    {(viralMetrics?.totalComments || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Comments</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">
                    {viralMetrics?.viralScore || 0}/100
                  </p>
                  <p className="text-sm text-gray-600">Viral Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )} */}

      {/* Admin Actions */}
      <div className="px-4 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button
            className="flex items-center justify-center gap-2 p-4 h-auto"
            onClick={() => navigate("/reports")}
          >
            <AlertTriangle className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Manage Reports</div>
              <div className="text-sm opacity-90">Review and moderate</div>
            </div>
          </Button>

          <Button
            className="flex items-center justify-center gap-2 p-4 h-auto"
            onClick={() => navigate("/politicians")}
          >
            <Users className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Manage Politicians</div>
              <div className="text-sm opacity-90">Add and edit profiles</div>
            </div>
          </Button>

          <Button
            className="flex items-center justify-center gap-2 p-4 h-auto"
            onClick={() => navigate("/polling")}
          >
            <BarChart3 className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Manage Polls</div>
              <div className="text-sm opacity-90">Create and monitor</div>
            </div>
          </Button>

          <Button
            className="flex items-center justify-center gap-2 p-4 h-auto"
            onClick={() => navigate("/viral-management")}
          >
            <TrendingUp className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Viral Management</div>
              <div className="text-sm opacity-90">Monitor engagement</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Admin Reminder */}
      <div className="mx-4 mb-6 bg-linear-to-r from-blue-500 to-blue-600 p-4 rounded-lg">
        <p className="text-white font-bold text-center mb-2">
          📢 Admin Reminder
        </p>
        <p className="text-white text-sm text-center mb-3">
          Review pending reports and update politician information regularly
        </p>
        <div className="flex justify-center space-x-4">
          <Button className="bg-white" onClick={() => navigate("/reports")}>
            <span className="text-blue-600 font-bold">Review Reports</span>
          </Button>
          <Button className="bg-white" onClick={() => navigate("/settings")}>
            <span className="text-blue-600 font-bold">System Settings</span>
          </Button>
        </div>
      </div>

      {/* Last Updated Info */}
      <div className="px-4 pb-6">
        <p className="text-center text-gray-500 text-xs">
          Admin Dashboard • Last updated: {format(new Date(), "PPpp")}
        </p>
      </div>
    </div>
  );
};
