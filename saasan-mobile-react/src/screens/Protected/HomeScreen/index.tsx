import { useState } from "react";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Gavel,
  ThumbsDown,
  ThumbsUp,
  Users,
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { PageHeader } from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const formatShortDate = (value?: string) => {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  return format(date, "MMM dd");
};

const getStatusTone = (status?: string) => {
  switch ((status || "").toLowerCase()) {
    case "resolved":
      return "bg-green-100 text-green-700";
    case "verified":
    case "in_progress":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-red-100 text-red-700";
  }
};

const getVoteCardTone = (userVote?: "up" | "down" | null) => {
  if (userVote === "up") {
    return "border-green-200 bg-green-50/60";
  }

  if (userVote === "down") {
    return "border-red-200 bg-red-50/60";
  }

  return "border-transparent bg-white";
};

const VoteBadge = ({
  userVote,
  hasVoted,
}: {
  userVote?: "up" | "down" | null;
  hasVoted?: boolean;
}) => {
  if (!hasVoted || !userVote) {
    return null;
  }

  const isUpvote = userVote === "up";
  const Icon = isUpvote ? ThumbsUp : ThumbsDown;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
        isUpvote ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {isUpvote ? "Upvoted" : "Downvoted"}
    </span>
  );
};

export default function HomeScreen() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentDate] = useState(new Date());
  const { dashboardStats, myRecentReports, publicReports, historicalEvents } =
    useDashboard();

  const overview = dashboardStats?.overview;
  const community = dashboardStats?.community;

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <PageHeader
        title={t("dashboard.welcome")}
        subtitle={t("dashboard.overview")}
        showLogout={true}
      />

      <div className="mx-auto flex-1 overflow-y-auto px-4 py-4 lg:max-w-7xl lg:px-8 lg:pb-10">
        <div>
          <div className="mb-6 rounded-3xl bg-gradient-to-r from-red-700 via-red-600 to-orange-500 p-5 shadow-lg lg:p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="mb-1 text-lg font-bold text-white lg:text-3xl">
                  Citizen Dashboard
                </p>
                <p className="max-w-2xl text-sm text-red-100 lg:text-base">
                  Track your reports and stay updated on public issues
                </p>
              </div>
              <div className="rounded-2xl bg-white/15 p-3 backdrop-blur lg:p-4">
                <Gavel className="h-6 w-6 text-white lg:h-8 lg:w-8" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-3 text-lg font-semibold text-gray-800 lg:text-2xl">
              Your Overview
            </p>

            <div className="flex justify-between items-center mb-4 px-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                <p className="text-sm text-gray-600">Your civic feed is live</p>
              </div>
              <p className="text-sm text-gray-600">
                {format(currentDate, "MMM dd, yyyy")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:max-w-2xl">
              <Card className="min-h-28 border-l-4 border-red-500 py-0 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <FileText className="text-red-600 w-5 h-5" />
                    <span className="text-xl font-bold text-red-600">
                      {overview?.myReportsCount || 0}
                    </span>
                  </div>
                  <p className="text-gray-700 text-xs font-semibold">My Reports</p>
                  <p className="text-red-600 text-xs mt-2 leading-snug">
                    {overview?.myReportResolutionRate || 0}% resolved
                  </p>
                </CardContent>
              </Card>

              <Card className="min-h-28 border-l-4 border-green-500 py-0 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <CheckCircle2 className="text-green-600 w-5 h-5" />
                    <span className="text-xl font-bold text-green-600">
                      {overview?.myResolvedReportsCount || 0}
                    </span>
                  </div>
                  <p className="text-gray-700 text-xs font-semibold">
                    Resolved For Me
                  </p>
                  <p className="text-green-600 text-xs mt-2 leading-snug">
                    Cases closed from your submissions
                  </p>
                </CardContent>
              </Card>

              <Card className="min-h-28 border-l-4 border-blue-500 py-0 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <AlertTriangle className="text-blue-600 w-5 h-5" />
                    <span className="text-xl font-bold text-blue-600">
                      {overview?.totalPublicReportsCount || 0}
                    </span>
                  </div>
                  <p className="text-gray-700 text-xs font-semibold">
                    Public Reports
                  </p>
                  <p className="text-blue-600 text-xs mt-2 leading-snug">
                    {community?.publicReportResolutionRate || 0}% resolved
                    platform-wide
                  </p>
                </CardContent>
              </Card>

              <Card className="min-h-28 border-l-4 border-orange-500 py-0 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <Users className="text-orange-600 w-5 h-5" />
                    <span className="text-xl font-bold text-orange-600">
                      {overview?.activePoliticians || 0}
                    </span>
                  </div>
                  <p className="text-gray-700 text-xs font-semibold">
                    Active Politicians
                  </p>
                  <p className="text-orange-600 text-xs mt-2 leading-snug">
                    of {overview?.totalPoliticians || 0} listed representatives
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
          <div>
            <p className="mb-4 text-xl font-bold text-gray-800">
              Your Recent Reports
            </p>
            {myRecentReports.length === 0 ? (
              <Card>
                <CardContent className="p-4">
                  <p className="text-center text-gray-500">
                    You have not submitted any reports yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              myRecentReports.map((report) => (
                <Card
                  key={report.id}
                  className={`mb-3 cursor-pointer border shadow-sm ${getVoteCardTone(
                    report.userVote,
                  )}`}
                  onClick={() =>
                    navigate(`/reports/${report.id}?from=my_reports`)
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="mb-1 text-base font-bold text-gray-800">
                          {report.title}
                        </p>
                        <p className="mb-2 text-sm text-gray-600 line-clamp-2">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>
                            {report.referenceNumber || "No reference yet"}
                          </span>
                          <span>•</span>
                          <span>{formatShortDate(report.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <VoteBadge
                          userVote={report.userVote}
                          hasVoted={report.hasVoted}
                        />
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusTone(
                            report.status,
                          )}`}
                        >
                          {report.status || "pending"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div>
            <p className="mb-4 text-xl font-bold text-gray-800">
              Community Feed
            </p>
            {publicReports.length === 0 ? (
              <Card>
                <CardContent className="p-4">
                  <p className="text-center text-gray-500">
                    No recent public reports to display
                  </p>
                </CardContent>
              </Card>
            ) : (
              publicReports.slice(0, 5).map((report) => (
                <Card
                  key={report.id}
                  className={`mb-3 cursor-pointer border shadow-sm transition-shadow hover:shadow-md ${getVoteCardTone(
                    report.userVote,
                  )}`}
                  onClick={() =>
                    navigate(`/reports/${report.id}?from=all_reports`)
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="mb-1 text-base font-bold text-gray-800">
                          {report.title}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {report.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <VoteBadge
                          userVote={report.userVote}
                          hasVoted={report.hasVoted}
                        />
                        <span className="text-xs text-gray-500">
                          {formatShortDate(report.createdAt)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-4 text-xl font-bold text-gray-800">On This Day</p>
          {historicalEvents.length === 0 ? (
            <Card>
              <CardContent className="p-4">
                <p className="text-center text-gray-500">
                  No historical events to display today
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {historicalEvents.map((event) => (
                <Card key={event.id} className="shadow-sm">
                  <CardContent className="p-4">
                    <p className="mb-2 text-lg font-bold text-gray-800">
                      {event.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {event.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <p className="mb-4 text-xl font-bold text-gray-800">Take Action</p>
          <div className="grid grid-cols-3 gap-3">
            <Link
              className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70"
              to={"/reports?tab=new"}
            >
              <div className="mb-2 rounded-full bg-red-100 p-3">
                <AlertTriangle className="text-red-600 w-6 h-6" />
              </div>
              <p className="text-gray-700 text-sm font-medium">Report Issue</p>
            </Link>

            <Link
              className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70"
              to={"/reports?tab=my_reports"}
            >
              <div className="mb-2 rounded-full bg-emerald-100 p-3">
                <FileText className="text-emerald-600 w-6 h-6" />
              </div>
              <p className="text-gray-700 text-sm font-medium">My Reports</p>
            </Link>

            <Link
              className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70"
              to={"/politics/politicians"}
            >
              <div className="mb-2 rounded-full bg-blue-100 p-3">
                <Users className="text-blue-600 w-6 h-6" />
              </div>
              <p className="text-gray-700 text-sm font-medium">Find Leaders</p>
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <Card className="bg-red-500 border-red-500">
            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col items-center lg:flex-row lg:justify-between lg:gap-8">
                <div className="text-center lg:text-left">
                  <p className="text-white font-bold text-center mb-2 lg:text-left">
                  Daily Reminder
                  </p>
                  <p className="text-white text-sm text-center mb-3 lg:mb-0 lg:text-left">
                  Keep reporting issues that affect your ward and follow up on
                  the progress from your dashboard.
                  </p>
                </div>
                <Button
                  className="bg-white px-6 py-3 rounded-lg"
                  onClick={() => navigate("/reports?tab=my_reports")}
                >
                  <p className="text-red-600 font-bold text-center">
                    View My Reports
                  </p>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="pb-6">
          <p className="text-center text-gray-500 text-xs">
            Last updated: {format(currentDate, "PPpp")}
          </p>
        </div>
      </div>
    </div>
  );
}
