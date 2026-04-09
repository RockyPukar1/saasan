import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Target, Megaphone, Users, Clock, CheckCircle } from "lucide-react";

export function DashboardOverview() {
  const stats = [
    {
      title: "Total Messages",
      value: "24",
      change: "+3 this week",
      icon: MessageSquare,
      color: "text-blue-600",
    },
    {
      title: "Active Promises",
      value: "8",
      change: "2 fulfilled",
      icon: Target,
      color: "text-green-600",
    },
    {
      title: "Announcements",
      value: "12",
      change: "+2 this month",
      icon: Megaphone,
      color: "text-purple-600",
    },
    {
      title: "Constituents Reached",
      value: "1,247",
      change: "+89 this week",
      icon: Users,
      color: "text-orange-600",
    },
  ];

  const recentMessages = [
    {
      id: "1",
      subject: "Road repair request",
      citizen: "Ramesh Sharma",
      urgency: "high",
      status: "pending",
      time: "2 hours ago",
    },
    {
      id: "2",
      subject: "Water supply issue",
      citizen: "Sita Kumari",
      urgency: "medium",
      status: "in_progress",
      time: "5 hours ago",
    },
    {
      id: "3",
      subject: "School infrastructure",
      citizen: "John Doe",
      urgency: "low",
      status: "resolved",
      time: "1 day ago",
    },
  ];

  const recentPromises = [
    {
      id: "1",
      title: "Upgrade local health post",
      progress: 75,
      status: "ongoing",
      dueDate: "2024-06-30",
    },
    {
      id: "2",
      title: "Install street lights",
      progress: 100,
      status: "fulfilled",
      dueDate: "2024-03-15",
    },
    {
      id: "3",
      title: "Youth skill development program",
      progress: 30,
      status: "ongoing",
      dueDate: "2024-08-31",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening in your constituency.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Latest communications from constituents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div key={message.id} className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {message.subject}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {message.citizen} • {message.time}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={message.urgency === 'high' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {message.urgency}
                    </Badge>
                    <Badge 
                      variant={message.status === 'resolved' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {message.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Promises */}
        <Card>
          <CardHeader>
            <CardTitle>Promise Progress</CardTitle>
            <CardDescription>Track your commitments to constituents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPromises.map((promise) => (
                <div key={promise.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{promise.title}</p>
                    <div className="flex items-center space-x-2">
                      {promise.status === 'fulfilled' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      )}
                      <Badge variant="outline" className="text-xs">
                        {promise.progress}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        promise.status === 'fulfilled' 
                          ? 'bg-green-600' 
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${promise.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Due: {promise.dueDate}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
