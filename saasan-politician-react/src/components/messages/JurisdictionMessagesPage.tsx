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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Reply,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  MessageSquare,
} from "lucide-react";
import type {
  MessageThread,
  JurisdictionHierarchy,
} from "@/types/jurisdiction";
import {
  jurisdictionMessageThreads,
  politicianJurisdiction,
  accessibleLocations,
} from "@/data/jurisdiction-dummy-data";

export function JurisdictionMessagesPage() {
  const [threads] = useState<MessageThread[]>(jurisdictionMessageThreads);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJurisdiction, setSelectedJurisdiction] =
    useState<JurisdictionHierarchy>(politicianJurisdiction);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(
    null,
  );

  // Filter threads based on search and jurisdiction
  const filteredThreads = threads.filter((thread) => {
    const matchesSearch =
      thread.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.participants.citizen.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Jurisdiction filtering logic
    const isInJurisdiction = selectedJurisdiction.constituencyId
      ? thread.jurisdiction.constituencyId ===
        selectedJurisdiction.constituencyId
      : true;

    return matchesSearch && isInJurisdiction;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
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

  const getLocationName = (jurisdiction: JurisdictionHierarchy) => {
    if (jurisdiction.wardId) {
      const ward = accessibleLocations.find(
        (loc) => loc._id === jurisdiction.wardId,
      );
      return ward ? `Ward ${ward.wardNumber}` : "Unknown Ward";
    }
    if (jurisdiction.constituencyId) {
      const constituency = accessibleLocations.find(
        (loc) => loc._id === jurisdiction.constituencyId,
      );
      return constituency ? constituency.name : "Unknown Constituency";
    }
    return "Unknown Location";
  };

  const threadsByStatus = {
    pending: filteredThreads.filter((t) => t.status === "pending"),
    in_progress: filteredThreads.filter((t) => t.status === "in_progress"),
    resolved: filteredThreads.filter((t) => t.status === "resolved"),
  };

  const MessageThreadDialog = ({ thread }: { thread: MessageThread }) => (
    <Dialog
      open={!!selectedThread}
      onOpenChange={() => setSelectedThread(null)}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>{thread.subject}</span>
          </DialogTitle>
          <DialogDescription>
            Conversation with {thread.participants.citizen.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Thread Info */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {getLocationName(thread.jurisdiction)}
              </span>
              <Badge variant={getUrgencyColor(thread.urgency)}>
                {thread.urgency}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(thread.status)}
              <span className="text-sm text-muted-foreground">
                {thread.status}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {thread.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderType === "citizen" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.senderType === "citizen"
                      ? "bg-muted text-left"
                      : "bg-primary text-primary-foreground text-right"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">
                      {message.senderType === "citizen"
                        ? thread.participants.citizen.name
                        : "You"}
                    </span>
                    <span className="text-xs opacity-70">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                  {message.readAt && (
                    <div className="text-xs opacity-70 mt-1">
                      Read {new Date(message.readAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Reply Input */}
          <div className="space-y-2">
            <Label htmlFor="reply">Your Response</Label>
            <Input id="reply" placeholder="Type your response..." />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedThread(null)}>
                Close
              </Button>
              <Button>Send Reply</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">
          Jurisdiction Messages
        </h1>
        <p className="text-muted-foreground">
          Manage citizen communications within your constituency
        </p>
      </div>

      {/* Jurisdiction Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Jurisdiction Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Province</Label>
              <Select
                value={selectedJurisdiction.provinceId}
                onValueChange={(value) =>
                  setSelectedJurisdiction((prev) => ({
                    ...prev,
                    provinceId: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Province" />
                </SelectTrigger>
                <SelectContent>
                  {accessibleLocations
                    .filter((loc) => loc.type === "province")
                    .map((province) => (
                      <SelectItem key={province._id} value={province._id}>
                        {province.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>District</Label>
              <Select
                value={selectedJurisdiction.districtId}
                onValueChange={(value) =>
                  setSelectedJurisdiction((prev) => ({
                    ...prev,
                    districtId: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {accessibleLocations
                    .filter(
                      (loc) =>
                        loc.type === "district" &&
                        loc.provinceId === selectedJurisdiction.provinceId,
                    )
                    .map((district) => (
                      <SelectItem key={district._id} value={district._id}>
                        {district.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Constituency</Label>
              <Select
                value={selectedJurisdiction.constituencyId}
                onValueChange={(value) =>
                  setSelectedJurisdiction((prev) => ({
                    ...prev,
                    constituencyId: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Constituency" />
                </SelectTrigger>
                <SelectContent>
                  {accessibleLocations
                    .filter(
                      (loc) =>
                        loc.type === "constituency" &&
                        loc.districtId === selectedJurisdiction.districtId,
                    )
                    .map((constituency) => (
                      <SelectItem
                        key={constituency._id}
                        value={constituency._id}
                      >
                        {constituency.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ward</Label>
              <Select
                value={selectedJurisdiction.wardId || ""}
                onValueChange={(value) =>
                  setSelectedJurisdiction((prev) => ({
                    ...prev,
                    wardId: value || undefined,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Wards" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Wards</SelectItem>
                  {accessibleLocations
                    .filter(
                      (loc) =>
                        loc.type === "ward" &&
                        loc.municipalityId === "municipality-1",
                    )
                    .map((ward) => (
                      <SelectItem key={ward._id} value={ward._id}>
                        {ward.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Stats */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search message threads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>Total: {filteredThreads.length} threads</span>
          <span>In {getLocationName(selectedJurisdiction)}</span>
        </div>
      </div>

      {/* Message Threads by Status */}
      <Tabs defaultValue="in_progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({threadsByStatus.pending.length})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            In Progress ({threadsByStatus.in_progress.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({threadsByStatus.resolved.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {threadsByStatus.pending.map((thread) => (
            <Card
              key={thread.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedThread(thread)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{thread.subject}</CardTitle>
                    <CardDescription>
                      From: {thread.participants.citizen.name} •{" "}
                      {thread.messages.length} messages
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getUrgencyColor(thread.urgency)}>
                      {thread.urgency}
                    </Badge>
                    {getStatusIcon(thread.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{getLocationName(thread.jurisdiction)}</span>
                    </div>
                    <span>
                      Last message:{" "}
                      {new Date(thread.lastMessageAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Thread
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4">
          {threadsByStatus.in_progress.map((thread) => (
            <Card
              key={thread.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedThread(thread)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{thread.subject}</CardTitle>
                    <CardDescription>
                      From: {thread.participants.citizen.name} •{" "}
                      {thread.messages.length} messages
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getUrgencyColor(thread.urgency)}>
                      {thread.urgency}
                    </Badge>
                    {getStatusIcon(thread.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {thread.messages[thread.messages.length - 1].content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{getLocationName(thread.jurisdiction)}</span>
                      </div>
                      <span>
                        Active since{" "}
                        {new Date(thread.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Button size="sm">
                      <Reply className="h-4 w-4 mr-1" />
                      Continue
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {threadsByStatus.resolved.map((thread) => (
            <Card
              key={thread.id}
              className="opacity-75 cursor-pointer"
              onClick={() => setSelectedThread(thread)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{thread.subject}</CardTitle>
                    <CardDescription>
                      From: {thread.participants.citizen.name} •{" "}
                      {thread.messages.length} messages
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Resolved</Badge>
                    {getStatusIcon(thread.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Resolved on{" "}
                    {new Date(thread.updatedAt).toLocaleDateString()} •
                    {getLocationName(thread.jurisdiction)}
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Thread Dialog */}
      {selectedThread && <MessageThreadDialog thread={selectedThread} />}
    </div>
  );
}
