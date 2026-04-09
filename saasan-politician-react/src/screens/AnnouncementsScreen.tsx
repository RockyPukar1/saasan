import React, { useState } from "react";
import {
  Megaphone,
  Edit,
  Eye,
  Calendar,
  Users,
  FileText,
  Plus,
  MapPin,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dummyPolitician } from "@/data/dummy-data";

export const AnnouncementsScreen: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const announcements = dummyPolitician.achievements || []; // Using achievements as placeholder since announcements doesn't exist

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <Users className="h-4 w-4" />;
      case "update":
        return <FileText className="h-4 w-4" />;
      case "achievement":
        return <Megaphone className="h-4 w-4" />;
      case "notice":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Megaphone className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "medium":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
      case "low":
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200";
      case "update":
        return "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200";
      case "achievement":
        return "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200";
      case "notice":
        return "bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200";
      default:
        return "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200";
    }
  };

  const AnnouncementCard = ({ announcement }: { announcement: any }) => {
    return (
      <Card
        className={`hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50 border-gray-200 ${getTypeColor(announcement.type || "update")}`}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                  {getTypeIcon(announcement.type || "update")}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg text-gray-800">
                    {announcement.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge
                      className={`${getPriorityColor(announcement.priority || "medium")} shadow-sm`}
                    >
                      {announcement.priority || "medium"}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-white shadow-sm border-purple-300"
                    >
                      {announcement.type || "update"}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed ml-13">
                {announcement.description}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(announcement.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>All Constituencies</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 hover:bg-gray-50"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Announcements Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 mb-6 mx-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold mb-2">
              Announcements
            </h1>
            <p className="text-purple-100 text-sm">
              Share important updates and news with your constituents
            </p>
          </div>
          <div className="bg-purple-500 rounded-full p-3">
            <Megaphone className="text-white" size={24} />
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                  <Megaphone className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-purple-600">
                  {announcements.length}
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-3 font-medium">
                Total Announcements
              </p>
              <p className="text-purple-500 text-xs mt-1">All communications</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                  <FileText className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {
                    announcements.filter(
                      (a: any) => (a.type || "update") === "update",
                    ).length
                  }
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-3 font-medium">Updates</p>
              <p className="text-blue-500 text-xs mt-1">Progress reports</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                  <Award className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {
                    announcements.filter(
                      (a: any) => (a.type || "update") === "achievement",
                    ).length
                  }
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-3 font-medium">
                Achievements
              </p>
              <p className="text-green-500 text-xs mt-1">Success stories</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                  <Users className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-orange-600">
                  {
                    announcements.filter(
                      (a: any) => (a.type || "update") === "meeting",
                    ).length
                  }
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-3 font-medium">Meetings</p>
              <p className="text-orange-500 text-xs mt-1">Public events</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Action */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Manage and organize your public communications
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Announcement
          </Button>
        </div>
      </div>

      {/* Announcements Feed */}
      <div className="px-4">
        <div className="space-y-4">
          {announcements.map((announcement: any) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
            />
          ))}
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-slate-50 to-purple-50">
          <DialogHeader className="border-b border-purple-100 pb-4">
            <DialogTitle className="flex items-center space-x-2 text-gray-800">
              <Megaphone className="h-5 w-5 text-purple-600" />
              <span>Create New Announcement</span>
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Share important information with your constituents
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                placeholder="Enter announcement title..."
                className="w-full p-2 border border-purple-200 rounded-lg focus:border-purple-400 bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                placeholder="Write your announcement..."
                rows={4}
                className="w-full p-2 border border-purple-200 rounded-lg focus:border-purple-400 bg-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Type
                </label>
                <select className="w-full p-2 border border-purple-200 rounded-lg focus:border-purple-400 bg-white">
                  <option value="update">Update</option>
                  <option value="achievement">Achievement</option>
                  <option value="meeting">Meeting</option>
                  <option value="notice">Notice</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select className="w-full p-2 border border-purple-200 rounded-lg focus:border-purple-400 bg-white">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md">
                Create Announcement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
