import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Megaphone,
  Plus,
  Edit,
  Eye,
  Calendar,
  Users,
  FileText,
} from "lucide-react";
import type { AnnouncementDto } from "@/types/api";
import { dummyAnnouncements } from "@/data/dummy-data";

export function AnnouncementsPage() {
  const [announcements] = useState<AnnouncementDto[]>(dummyAnnouncements);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "outline";
      case "update":
        return "secondary";
      case "achievement":
        return "default";
      case "notice":
        return "outline";
      default:
        return "outline";
    }
  };

  const announcementsByType = {
    meeting: announcements.filter((a) => a.type === "meeting"),
    update: announcements.filter((a) => a.type === "update"),
    achievement: announcements.filter((a) => a.type === "achievement"),
    notice: announcements.filter((a) => a.type === "notice"),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            Announcements
          </h1>
          <p className="text-muted-foreground">
            Manage public communications and updates
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
              <DialogDescription>
                Create a new announcement for your constituents
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Announcement title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Input id="content" placeholder="Announcement content" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="notice">Notice</option>
                    <option value="update">Update</option>
                    <option value="achievement">Achievement</option>
                    <option value="meeting">Meeting</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Create Announcement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Announcements
            </CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
            <p className="text-xs text-muted-foreground">All communications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meetings</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcementsByType.meeting.length}
            </div>
            <p className="text-xs text-muted-foreground">Public meetings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Megaphone className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcementsByType.achievement.length}
            </div>
            <p className="text-xs text-muted-foreground">Success stories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Updates</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcementsByType.update.length}
            </div>
            <p className="text-xs text-muted-foreground">Progress updates</p>
          </CardContent>
        </Card>
      </div>

      {/* Announcements by Type */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({announcements.length})</TabsTrigger>
          <TabsTrigger value="meeting">
            Meetings ({announcementsByType.meeting.length})
          </TabsTrigger>
          <TabsTrigger value="update">
            Updates ({announcementsByType.update.length})
          </TabsTrigger>
          <TabsTrigger value="achievement">
            Achievements ({announcementsByType.achievement.length})
          </TabsTrigger>
          <TabsTrigger value="notice">
            Notices ({announcementsByType.notice.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {announcements.map((announcement) => (
            <Card
              key={announcement.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(announcement.type)}
                      <CardTitle className="text-lg">
                        {announcement.title}
                      </CardTitle>
                    </div>
                    <CardDescription>{announcement.content}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getPriorityColor(announcement.priority)}>
                      {announcement.priority}
                    </Badge>
                    <Badge variant={getTypeColor(announcement.type)}>
                      {announcement.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {announcement.scheduledAt ? (
                      <>
                        Scheduled:{" "}
                        {new Date(
                          announcement.scheduledAt,
                        ).toLocaleDateString()}
                      </>
                    ) : (
                      <>
                        Published:{" "}
                        {new Date(
                          announcement.publishedAt!,
                        ).toLocaleDateString()}
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="meeting" className="space-y-4">
          {announcementsByType.meeting.map((announcement) => (
            <Card key={announcement.id} className="border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <CardTitle className="text-lg">
                        {announcement.title}
                      </CardTitle>
                    </div>
                    <CardDescription>{announcement.content}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getPriorityColor(announcement.priority)}>
                      {announcement.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Meeting scheduled:{" "}
                    {new Date(announcement.scheduledAt!).toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="achievement" className="space-y-4">
          {announcementsByType.achievement.map((announcement) => (
            <Card key={announcement.id} className="border-green-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Megaphone className="h-4 w-4 text-green-600" />
                      <CardTitle className="text-lg">
                        {announcement.title}
                      </CardTitle>
                    </div>
                    <CardDescription>{announcement.content}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">Achievement</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Published:{" "}
                    {new Date(announcement.publishedAt!).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="update" className="space-y-4">
          {announcementsByType.update.map((announcement) => (
            <Card key={announcement.id} className="border-purple-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                      <CardTitle className="text-lg">
                        {announcement.title}
                      </CardTitle>
                    </div>
                    <CardDescription>{announcement.content}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Update</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Updated:{" "}
                    {new Date(announcement.publishedAt!).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="notice" className="space-y-4">
          {announcementsByType.notice.map((announcement) => (
            <Card key={announcement.id} className="border-orange-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <CardTitle className="text-lg">
                        {announcement.title}
                      </CardTitle>
                    </div>
                    <CardDescription>{announcement.content}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Notice</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Published:{" "}
                    {new Date(announcement.publishedAt!).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
