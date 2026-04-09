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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
} from "lucide-react";
import type { PromiseDto } from "@/types/api";
import { dummyPolitician } from "@/data/dummy-data";

export function PromisesPage() {
  const [promises] = useState<PromiseDto[]>(dummyPolitician.promises || []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "fulfilled":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "ongoing":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      case "broken":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "fulfilled":
        return "default";
      case "ongoing":
        return "secondary";
      case "pending":
        return "outline";
      case "broken":
        return "destructive";
      default:
        return "outline";
    }
  };

  // const getProgressColor = (progress: number) => {
  //   if (progress === 100) return 'bg-green-600';
  //   if (progress >= 60) return 'bg-blue-600';
  //   if (progress >= 30) return 'bg-yellow-600';
  //   return 'bg-red-600';
  // };

  const promisesByStatus = {
    ongoing: promises.filter((p) => p.status === "ongoing"),
    fulfilled: promises.filter((p) => p.status === "fulfilled"),
    pending: promises.filter((p) => p.status === "pending"),
  };

  const overallProgress =
    promises.length > 0
      ? Math.round(
          promises.reduce((acc, p) => acc + p.progress, 0) / promises.length,
        )
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            My Promises
          </h1>
          <p className="text-muted-foreground">
            Track and manage your commitments to constituents
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Promise
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Promises
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promises.length}</div>
            <p className="text-xs text-muted-foreground">All commitments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promisesByStatus.ongoing.length}
            </div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fulfilled</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promisesByStatus.fulfilled.length}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Progress
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Promises by Status */}
      <Tabs defaultValue="ongoing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ongoing">
            Ongoing ({promisesByStatus.ongoing.length})
          </TabsTrigger>
          <TabsTrigger value="fulfilled">
            Fulfilled ({promisesByStatus.fulfilled.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({promisesByStatus.pending.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing" className="space-y-4">
          {promisesByStatus.ongoing.map((promise) => (
            <Card
              key={promise.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{promise.title}</CardTitle>
                    <CardDescription>{promise.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(promise.status)}>
                      {promise.status}
                    </Badge>
                    {getStatusIcon(promise.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {promise.progress}%
                      </span>
                    </div>
                    <Progress value={promise.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      Due: {new Date(promise.dueDate).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {promisesByStatus.ongoing.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No ongoing promises</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="fulfilled" className="space-y-4">
          {promisesByStatus.fulfilled.map((promise) => (
            <Card key={promise.id} className="opacity-75">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{promise.title}</CardTitle>
                    <CardDescription>{promise.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">Fulfilled</Badge>
                    {getStatusIcon(promise.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {promise.progress}%
                      </span>
                    </div>
                    <Progress value={promise.progress} className="h-2" />
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Fulfilled on{" "}
                    {new Date(promise.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {promisesByStatus.pending.map((promise) => (
            <Card key={promise.id} className="border-dashed">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{promise.title}</CardTitle>
                    <CardDescription>{promise.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Pending</Badge>
                    {getStatusIcon(promise.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Planned start:{" "}
                    {new Date(promise.dueDate).toLocaleDateString()}
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Start Work
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {promisesByStatus.pending.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending promises</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
