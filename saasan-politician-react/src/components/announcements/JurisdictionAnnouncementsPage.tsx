import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Megaphone, Plus, Edit, Eye, Calendar, Users, FileText, MapPin, Target } from "lucide-react";
import type { JurisdictionAnnouncement, JurisdictionHierarchy } from "@/types/jurisdiction";
import { jurisdictionAnnouncements, politicianJurisdiction, accessibleLocations } from "@/data/jurisdiction-dummy-data";

export function JurisdictionAnnouncementsPage() {
  const [announcements] = useState<JurisdictionAnnouncement[]>(jurisdictionAnnouncements);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<JurisdictionHierarchy>(politicianJurisdiction);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    type: "notice" as const,
    priority: "medium" as const,
    targetJurisdiction: politicianJurisdiction,
    visibility: {
      provinces: [],
      districts: [],
      constituencies: [],
      municipalities: [],
      wards: []
    }
  });

  // Filter announcements based on selected jurisdiction
  const filteredAnnouncements = announcements.filter(announcement => {
    // Check if announcement targets the selected jurisdiction
    if (selectedJurisdiction.constituencyId) {
      return announcement.targetJurisdiction.constituencyId === selectedJurisdiction.constituencyId ||
             announcement.visibility.constituencies?.includes(selectedJurisdiction.constituencyId);
    }
    if (selectedJurisdiction.districtId) {
      return announcement.targetJurisdiction.districtId === selectedJurisdiction.districtId ||
             announcement.visibility.districts?.includes(selectedJurisdiction.districtId);
    }
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="h-4 w-4" />;
      case 'update': return <FileText className="h-4 w-4" />;
      case 'achievement': return <Megaphone className="h-4 w-4" />;
      case 'notice': return <Calendar className="h-4 w-4" />;
      default: return <Megaphone className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'outline';
      case 'update': return 'secondary';
      case 'achievement': return 'default';
      case 'notice': return 'outline';
      default: return 'outline';
    }
  };

  const getLocationName = (jurisdiction: JurisdictionHierarchy) => {
    if (jurisdiction.wardId) {
      const ward = accessibleLocations.find(loc => loc._id === jurisdiction.wardId);
      return ward ? `Ward ${ward.wardNumber}` : "Unknown Ward";
    }
    if (jurisdiction.municipalityId) {
      const municipality = accessibleLocations.find(loc => loc._id === jurisdiction.municipalityId);
      return municipality ? municipality.name : "Unknown Municipality";
    }
    if (jurisdiction.constituencyId) {
      const constituency = accessibleLocations.find(loc => loc._id === jurisdiction.constituencyId);
      return constituency ? constituency.name : "Unknown Constituency";
    }
    if (jurisdiction.districtId) {
      const district = accessibleLocations.find(loc => loc._id === jurisdiction.districtId);
      return district ? district.name : "Unknown District";
    }
    return "Unknown Location";
  };

  const getVisibilityScope = (announcement: JurisdictionAnnouncement) => {
    const scopes = [];
    if (announcement.visibility.provinces?.length) scopes.push(`${announcement.visibility.provinces.length} provinces`);
    if (announcement.visibility.districts?.length) scopes.push(`${announcement.visibility.districts.length} districts`);
    if (announcement.visibility.constituencies?.length) scopes.push(`${announcement.visibility.constituencies.length} constituencies`);
    if (announcement.visibility.municipalities?.length) scopes.push(`${announcement.visibility.municipalities.length} municipalities`);
    if (announcement.visibility.wards?.length) scopes.push(`${announcement.visibility.wards.length} wards`);
    return scopes.length > 0 ? scopes.join(", ") : getLocationName(announcement.targetJurisdiction);
  };

  const announcementsByType = {
    meeting: filteredAnnouncements.filter(a => a.type === 'meeting'),
    update: filteredAnnouncements.filter(a => a.type === 'update'),
    achievement: filteredAnnouncements.filter(a => a.type === 'achievement'),
    notice: filteredAnnouncements.filter(a => a.type === 'notice'),
  };

  const CreateAnnouncementDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Jurisdiction-Based Announcement</DialogTitle>
          <DialogDescription>
            Create an announcement for specific areas within your constituency
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              placeholder="Announcement title"
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea 
              id="content" 
              placeholder="Announcement content"
              rows={4}
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select value={newAnnouncement.type} onValueChange={(value: any) => 
                setNewAnnouncement(prev => ({ ...prev, type: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notice">Notice</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={newAnnouncement.priority} onValueChange={(value: any) => 
                setNewAnnouncement(prev => ({ ...prev, priority: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Target Jurisdiction</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Constituency</Label>
                <Select value={newAnnouncement.targetJurisdiction.constituencyId} onValueChange={(value: any) => 
                  setNewAnnouncement(prev => ({
                    ...prev,
                    targetJurisdiction: { ...prev.targetJurisdiction, constituencyId: value }
                  }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Constituency" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessibleLocations.filter(loc => loc.type === 'constituency').map(constituency => (
                      <SelectItem key={constituency._id} value={constituency._id}>
                        {constituency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Municipality</Label>
                <Select value={newAnnouncement.targetJurisdiction.municipalityId || ""} onValueChange={(value: any) => 
                  setNewAnnouncement(prev => ({
                    ...prev,
                    targetJurisdiction: { ...prev.targetJurisdiction, municipalityId: value || undefined }
                  }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="All Municipalities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Municipalities</SelectItem>
                    {accessibleLocations.filter(loc => loc.type === 'municipality').map(municipality => (
                      <SelectItem key={municipality._id} value={municipality._id}>
                        {municipality.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Additional Visibility (Optional)</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="all-wards" />
                <Label htmlFor="all-wards" className="text-sm">All wards in constituency</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="neighboring-constituencies" />
                <Label htmlFor="neighboring-constituencies" className="text-sm">Neighboring constituencies</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="entire-district" />
                <Label htmlFor="entire-district" className="text-sm">Entire district</Label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(false)}>
            Create Announcement
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Jurisdiction Announcements</h1>
          <p className="text-muted-foreground">
            Manage location-specific communications and updates
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {/* Jurisdiction Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Current Jurisdiction Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{getLocationName(selectedJurisdiction)}</Badge>
              <span className="text-sm text-muted-foreground">
                Showing {filteredAnnouncements.length} announcements
              </span>
            </div>
            <Select value={selectedJurisdiction.constituencyId} onValueChange={(value: any) => 
              setSelectedJurisdiction(prev => ({ ...prev, constituencyId: value }))
            }>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Change Jurisdiction" />
              </SelectTrigger>
              <SelectContent>
                {accessibleLocations.filter(loc => loc.type === 'constituency').map(constituency => (
                  <SelectItem key={constituency._id} value={constituency._id}>
                    {constituency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAnnouncements.length}</div>
            <p className="text-xs text-muted-foreground">In selected area</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meetings</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcementsByType.meeting.length}</div>
            <p className="text-xs text-muted-foreground">Public meetings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcementsByType.achievement.length}</div>
            <p className="text-xs text-muted-foreground">Success stories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Updates</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcementsByType.update.length}</div>
            <p className="text-xs text-muted-foreground">Progress updates</p>
          </CardContent>
        </Card>
      </div>

      {/* Announcements by Type */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({filteredAnnouncements.length})</TabsTrigger>
          <TabsTrigger value="meeting">Meetings ({announcementsByType.meeting.length})</TabsTrigger>
          <TabsTrigger value="update">Updates ({announcementsByType.update.length})</TabsTrigger>
          <TabsTrigger value="achievement">Achievements ({announcementsByType.achievement.length})</TabsTrigger>
          <TabsTrigger value="notice">Notices ({announcementsByType.notice.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(announcement.type)}
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {announcement.scheduledAt ? (
                        <>Scheduled: {new Date(announcement.scheduledAt).toLocaleString()}</>
                      ) : (
                        <>Published: {new Date(announcement.publishedAt!).toLocaleDateString()}</>
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
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>Target: {getVisibilityScope(announcement)}</span>
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
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Meeting scheduled: {new Date(announcement.scheduledAt!).toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>Location: {getVisibilityScope(announcement)}</span>
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
                      <Target className="h-4 w-4 text-green-600" />
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    </div>
                    <CardDescription>{announcement.content}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">Achievement</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Published: {new Date(announcement.publishedAt!).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>Area: {getVisibilityScope(announcement)}</span>
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
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    </div>
                    <CardDescription>{announcement.content}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Update</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Updated: {new Date(announcement.publishedAt!).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>Scope: {getVisibilityScope(announcement)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <CreateAnnouncementDialog />
    </div>
  );
}
