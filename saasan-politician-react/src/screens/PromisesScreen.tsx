import React from "react";
import {
  Target,
  Clock,
  CheckCircle,
  Edit,
  TrendingUp,
  Calendar,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { dummyPolitician } from "@/data/dummy-data";

export const PromisesScreen: React.FC = () => {
  const promises = dummyPolitician.promises || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "fulfilled":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "ongoing":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "fulfilled":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      case "ongoing":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
      case "pending":
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
    }
  };

  const promisesByStatus = {
    pending: promises.filter((p) => p.status === "pending"),
    ongoing: promises.filter((p) => p.status === "ongoing"),
    fulfilled: promises.filter((p) => p.status === "fulfilled"),
  };

  const PromiseCard = ({ promise }: { promise: any }) => {
    const getProgressColor = (progress: number) => {
      if (progress >= 75)
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      if (progress >= 50) return "bg-gradient-to-r from-blue-500 to-indigo-500";
      if (progress >= 25)
        return "bg-gradient-to-r from-yellow-500 to-orange-500";
      return "bg-gradient-to-r from-red-500 to-pink-500";
    };

    return (
      <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50 border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-lg text-gray-800">
                {promise.title}
              </CardTitle>
              <p className="text-gray-600 leading-relaxed">
                {promise.description}
              </p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Badge className={`${getStatusColor(promise.status)} shadow-sm`}>
                {promise.status}
              </Badge>
              {getStatusIcon(promise.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Progress Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Progress
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-800">
                    {promise.progress}%
                  </span>
                  <div
                    className={`w-3 h-3 rounded-full ${getProgressColor(promise.progress)}`}
                  />
                </div>
              </div>
              <div className="relative">
                <Progress
                  value={promise.progress}
                  className="h-3 bg-gray-200"
                />
                <div
                  className={`absolute top-0 left-0 h-full rounded-full ${getProgressColor(promise.progress)} transition-all duration-500`}
                  style={{ width: `${promise.progress}%` }}
                />
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Due: {new Date(promise.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>High Priority</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md"
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Promises Header */}
      <div className="bg-red-600 rounded-lg p-6 mb-6 mx-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold mb-2">Promises</h1>
            <p className="text-red-100 text-sm">
              Track and manage your commitments to constituents
            </p>
          </div>
          <div className="bg-red-500 rounded-full p-3">
            <Target className="text-white" size={24} />
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                  <Target className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {promises.length}
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-3 font-medium">
                Total Promises
              </p>
              <p className="text-red-500 text-xs mt-1">All commitments</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                  <Clock className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {promisesByStatus.ongoing.length}
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-3 font-medium">Ongoing</p>
              <p className="text-blue-500 text-xs mt-1">In progress</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                  <CheckCircle className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {promisesByStatus.fulfilled.length}
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-3 font-medium">
                Fulfilled
              </p>
              <p className="text-green-500 text-xs mt-1">Completed</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                  <TrendingUp className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-orange-600">
                  {Math.round(
                    promises.reduce((acc, p) => acc + p.progress, 0) /
                      promises.length,
                  )}
                  %
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-3 font-medium">
                Avg Progress
              </p>
              <p className="text-orange-500 text-xs mt-1">Overall completion</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Promises Feed - Single View */}
      <div className="px-4">
        <div className="space-y-4">
          {promises.map((promise: any) => (
            <PromiseCard key={promise.id} promise={promise} />
          ))}
        </div>
      </div>
    </div>
  );
};
