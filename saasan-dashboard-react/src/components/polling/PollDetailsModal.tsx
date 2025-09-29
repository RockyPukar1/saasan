import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Poll } from "../../../../shared/types/polling";
import { PollResultsChart } from "./PollResultsChart";
import {
  X,
  Calendar,
  Users,
  MapPin,
  Eye,
  EyeOff,
  Shield,
  BarChart3,
  PieChart,
  TrendingUp,
} from "lucide-react";

interface PollDetailsModalProps {
  poll: Poll;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (poll: Poll) => void;
}

export const PollDetailsModal: React.FC<PollDetailsModalProps> = ({
  poll,
  isOpen,
  onClose,
  onEdit,
}) => {
  const [chartType, setChartType] = useState<"bar" | "pie" | "line">("bar");

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes_count,
    0
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "ENDED":
        return "bg-gray-100 text-gray-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Active";
      case "ENDED":
        return "Ended";
      case "DRAFT":
        return "Draft";
      default:
        return status;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{poll.title}</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(poll)}
              className="text-blue-600 hover:text-blue-700"
            >
              Edit Poll
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Poll Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">
                      End Date
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(poll.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">
                      Total Votes
                    </p>
                    <p className="text-sm text-gray-900">{totalVotes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Options</p>
                    <p className="text-sm text-gray-900">
                      {poll.options.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      poll.status
                    )}`}
                  >
                    {getStatusText(poll.status)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{poll.description}</p>
            </CardContent>
          </Card>

          {/* Poll Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Poll Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  {poll.is_anonymous ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="text-sm text-gray-600">
                    {poll.is_anonymous ? "Anonymous voting" : "Public voting"}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {poll.requires_verification
                      ? "Verification required"
                      : "No verification required"}
                  </span>
                </div>

                {poll.district && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {poll.district}
                      {poll.municipality ? `, ${poll.municipality}` : ""}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Poll Options (View Only) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Poll Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {poll.options.map((option) => {
                  const percentage =
                    totalVotes > 0
                      ? Math.round((option.votes_count / totalVotes) * 100)
                      : 0;

                  return (
                    <div
                      key={option.id}
                      className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">
                          {option.text}
                        </span>
                        <span className="text-sm text-gray-600">
                          {option.votes_count} votes ({percentage}%)
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">
                    View-only mode. Use mobile app or edit mode to vote.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Visualization */}
          {totalVotes > 0 && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    Results Visualization
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant={chartType === "bar" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartType("bar")}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={chartType === "pie" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartType("pie")}
                    >
                      <PieChart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={chartType === "line" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartType("line")}
                    >
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <PollResultsChart
                  data={poll.options}
                  type={chartType}
                  height={300}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
