import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
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
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAnnouncements,
  useCreateAnnouncement,
  useDeleteAnnouncement,
  useUpdateAnnouncement,
} from "@/hooks/useAnnouncements";
import type { AnnouncementDto } from "@/types/api";

type AnnouncementFormState = {
  title: string;
  content: string;
  type: AnnouncementDto["type"];
  priority: AnnouncementDto["priority"];
  isPublic: boolean;
  scheduledAt: string;
};

const emptyForm: AnnouncementFormState = {
  title: "",
  content: "",
  type: "update",
  priority: "medium",
  isPublic: true,
  scheduledAt: "",
};

const PAGE_SIZE = 10;

export const AnnouncementsScreen: React.FC = () => {
  const [cursorHistory, setCursorHistory] = useState<Array<string | null>>([null]);
  const currentCursor = cursorHistory[cursorHistory.length - 1] || null;
  const currentPage = cursorHistory.length;
  const { data: announcementsResponse, isLoading } = useAnnouncements(
    currentCursor,
    PAGE_SIZE,
  );
  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<AnnouncementDto | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementDto | null>(null);
  const [form, setForm] = useState<AnnouncementFormState>(emptyForm);
  const announcements = announcementsResponse?.data || [];
  const totalAnnouncements = announcementsResponse?.total || 0;
  const goToNextPage = () => {
    if (!announcementsResponse?.nextCursor) {
      return;
    }

    setCursorHistory((previous) => [
      ...previous,
      announcementsResponse.nextCursor,
    ]);
  };
  const goToPreviousPage = () => {
    setCursorHistory((previous) =>
      previous.length > 1 ? previous.slice(0, -1) : previous,
    );
  };

  const counts = useMemo(
    () => ({
      updates: announcements.filter((item) => item.type === "update").length,
      achievements: announcements.filter((item) => item.type === "achievement")
        .length,
      meetings: announcements.filter((item) => item.type === "meeting").length,
    }),
    [announcements],
  );

  const openCreateDialog = () => {
    setEditingAnnouncement(null);
    setForm(emptyForm);
    setIsDialogOpen(true);
  };

  const openEditDialog = (announcement: AnnouncementDto) => {
    setEditingAnnouncement(announcement);
    setForm({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      isPublic: announcement.isPublic,
      scheduledAt: announcement.scheduledAt
        ? new Date(announcement.scheduledAt).toISOString().slice(0, 16)
        : "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Please complete the announcement details.");
      return;
    }

    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        type: form.type,
        priority: form.priority,
        isPublic: form.isPublic,
        scheduledAt: form.scheduledAt
          ? new Date(form.scheduledAt).toISOString()
          : null,
      };

      if (editingAnnouncement) {
        await updateAnnouncement.mutateAsync({
          id: editingAnnouncement.id,
          data: payload,
        });
        toast.success("Announcement updated successfully");
      } else {
        await createAnnouncement.mutateAsync(payload);
        toast.success("Announcement created successfully");
      }

      setIsDialogOpen(false);
      setEditingAnnouncement(null);
      setForm(emptyForm);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to save announcement",
      );
    }
  };

  const handleDelete = async (announcement: AnnouncementDto) => {
    if (!window.confirm(`Delete "${announcement.title}"?`)) return;

    try {
      await deleteAnnouncement.mutateAsync(announcement.id);
      toast.success("Announcement deleted");
      if (selectedAnnouncement?.id === announcement.id) {
        setSelectedAnnouncement(null);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete announcement",
      );
    }
  };

  const getTypeIcon = (type: AnnouncementDto["type"]) => {
    switch (type) {
      case "meeting":
        return <Users className="h-4 w-4" />;
      case "update":
        return <FileText className="h-4 w-4" />;
      case "achievement":
        return <Megaphone className="h-4 w-4" />;
      case "notice":
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: AnnouncementDto["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "medium":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
      case "low":
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
    }
  };

  const getTypeColor = (type: AnnouncementDto["type"]) => {
    switch (type) {
      case "meeting":
        return "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200";
      case "update":
        return "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200";
      case "achievement":
        return "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200";
      case "notice":
      default:
        return "bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200";
    }
  };

  const renderAnnouncementDate = (announcement: AnnouncementDto) => {
    if (announcement.scheduledAt) {
      return `Scheduled: ${new Date(announcement.scheduledAt).toLocaleString()}`;
    }

    if (announcement.publishedAt) {
      return `Published: ${new Date(announcement.publishedAt).toLocaleDateString()}`;
    }

    return `Created: ${new Date(announcement.createdAt).toLocaleDateString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="px-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                  <Megaphone className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-purple-600">
                  {totalAnnouncements}
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
                  {counts.updates}
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
                  {counts.achievements}
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
                  {counts.meetings}
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-3 font-medium">Meetings</p>
              <p className="text-orange-500 text-xs mt-1">Public events</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="px-4 mb-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Manage and organize your public communications
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Announcement
        </Button>
      </div>

      <div className="px-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-40 rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <Card className="border-dashed border-gray-300 bg-white">
            <CardContent className="py-12 text-center">
              <Megaphone className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800">
                No announcements yet
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Publish your first update, notice, meeting, or achievement.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card
                key={announcement.id}
                className={`hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50 border-gray-200 ${getTypeColor(announcement.type)}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                          {getTypeIcon(announcement.type)}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-800">
                            {announcement.title}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              className={`${getPriorityColor(announcement.priority)} shadow-sm`}
                            >
                              {announcement.priority}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-white shadow-sm border-purple-300"
                            >
                              {announcement.type}
                            </Badge>
                            {!announcement.isPublic && (
                              <Badge variant="secondary">Private</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed ml-13">
                        {announcement.content}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{renderAnnouncementDate(announcement)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {announcement.isPublic
                            ? "Public announcement"
                            : "Private draft"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 hover:bg-gray-50"
                        onClick={() => setSelectedAnnouncement(announcement)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 hover:bg-gray-50"
                        onClick={() => openEditDialog(announcement)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(announcement)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {announcementsResponse &&
              (currentPage > 1 || announcementsResponse.hasNext) && (
              <div className="flex items-center justify-center gap-4 pt-2">
                <Button
                  variant="outline"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage}
                </span>
                <Button
                  variant="outline"
                  onClick={goToNextPage}
                  disabled={!announcementsResponse.hasNext}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[560px] bg-gradient-to-br from-slate-50 to-purple-50">
          <DialogHeader className="border-b border-purple-100 pb-4">
            <DialogTitle className="flex items-center space-x-2 text-gray-800">
              <Megaphone className="h-5 w-5 text-purple-600" />
              <span>
                {editingAnnouncement
                  ? "Update Announcement"
                  : "Create New Announcement"}
              </span>
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Share important information with your constituents.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 p-1">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <Input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Enter announcement title..."
                className="border-purple-200 focus:border-purple-400 bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Content
              </label>
              <Textarea
                value={form.content}
                onChange={(event) =>
                  setForm((current) => ({ ...current, content: event.target.value }))
                }
                placeholder="Write your announcement..."
                rows={4}
                className="border-purple-200 focus:border-purple-400 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      type: event.target.value as AnnouncementDto["type"],
                    }))
                  }
                  className="w-full h-8 rounded-lg border border-purple-200 bg-white px-2.5 text-sm focus:border-purple-400 focus:outline-none"
                >
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
                <select
                  value={form.priority}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      priority: event.target.value as AnnouncementDto["priority"],
                    }))
                  }
                  className="w-full h-8 rounded-lg border border-purple-200 bg-white px-2.5 text-sm focus:border-purple-400 focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Schedule
                </label>
                <Input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      scheduledAt: event.target.value,
                    }))
                  }
                  className="border-purple-200 focus:border-purple-400 bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Visibility
                </label>
                <select
                  value={form.isPublic ? "public" : "private"}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isPublic: event.target.value === "public",
                    }))
                  }
                  className="w-full h-8 rounded-lg border border-purple-200 bg-white px-2.5 text-sm focus:border-purple-400 focus:outline-none"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  createAnnouncement.isPending || updateAnnouncement.isPending
                }
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md"
              >
                {editingAnnouncement ? "Save Changes" : "Create Announcement"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedAnnouncement}
        onOpenChange={(open) => {
          if (!open) setSelectedAnnouncement(null);
        }}
      >
        <DialogContent className="sm:max-w-[560px] bg-white">
          <DialogHeader>
            <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
            <DialogDescription>
              {selectedAnnouncement?.type} • {selectedAnnouncement?.priority}
            </DialogDescription>
          </DialogHeader>

          {selectedAnnouncement && (
            <div className="space-y-4">
              <div className="rounded-xl border border-purple-100 bg-purple-50 p-4 text-sm text-gray-700">
                {selectedAnnouncement.content}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                <div>{renderAnnouncementDate(selectedAnnouncement)}</div>
                <div>
                  Visibility:{" "}
                  {selectedAnnouncement.isPublic ? "Public" : "Private"}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
