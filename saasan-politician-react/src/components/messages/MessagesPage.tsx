import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Reply, Eye, Clock, CheckCircle, AlertCircle } from "lucide-react";
import type { CitizenMessageDto } from "@/types/api";
import { dummyCitizenMessages } from "@/data/dummy-data";

export function MessagesPage() {
  const [messages] = useState<CitizenMessageDto[]>(dummyCitizenMessages);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMessages = messages.filter(msg =>
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const messagesByStatus = {
    pending: filteredMessages.filter(m => m.status === 'pending'),
    in_progress: filteredMessages.filter(m => m.status === 'in_progress'),
    resolved: filteredMessages.filter(m => m.status === 'resolved'),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Citizen Messages</h1>
        <p className="text-muted-foreground">
          Manage and respond to messages from your constituents
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Export</Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages by Status Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({messagesByStatus.pending.length})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            In Progress ({messagesByStatus.in_progress.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({messagesByStatus.resolved.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {messagesByStatus.pending.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{message.subject}</CardTitle>
                    <CardDescription>
                      From: {message.citizenName} • {message.citizenEmail}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getUrgencyColor(message.urgency)}>
                      {message.urgency}
                    </Badge>
                    {getStatusIcon(message.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {message.message}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {message.jurisdiction} • {new Date(message.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm">
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {messagesByStatus.pending.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No pending messages</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4">
          {messagesByStatus.in_progress.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{message.subject}</CardTitle>
                    <CardDescription>
                      From: {message.citizenName} • {message.responseCount} responses
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getUrgencyColor(message.urgency)}>
                      {message.urgency}
                    </Badge>
                    {getStatusIcon(message.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {message.message}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Last response: {message.lastResponseAt ? 
                      new Date(message.lastResponseAt).toLocaleDateString() : 
                      'No responses yet'
                    }
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
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
          {messagesByStatus.resolved.map((message) => (
            <Card key={message.id} className="opacity-75">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{message.subject}</CardTitle>
                    <CardDescription>
                      From: {message.citizenName} • {message.responseCount} responses
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Resolved</Badge>
                    {getStatusIcon(message.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {message.message}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Resolved on {new Date(message.updatedAt).toLocaleDateString()}
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
    </div>
  );
}
