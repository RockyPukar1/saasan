import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  AlertTriangle,
  RefreshCcw,
  RotateCcw,
  Workflow,
} from "lucide-react";
import { jobsApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { PERMISSIONS } from "@/constants/permission.constants";
import { PermissionGate } from "@/components/PermissionGate";

export default function JobsScreen() {
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();
  const canRetryJobs = hasPermission(PERMISSIONS.jobs.retry);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["failed-jobs"],
    queryFn: () => jobsApi.getFailed(),
  });

  const retryMutation = useMutation({
    mutationFn: (jobId: string) => jobsApi.retry(jobId),
    onSuccess: async () => {
      toast.success("Job scheduled for retry");
      await queryClient.invalidateQueries({ queryKey: ["failed-jobs"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to retry job");
    },
  });

  const jobs = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Failed Jobs</h1>
          <p className="text-gray-600">
            Review dead-lettered background work and republish selected jobs.
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Workflow className="h-4 w-4" />
              Dead-Lettered Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <RotateCcw className="h-4 w-4" />
              Retry Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {canRetryJobs ? "Allowed" : "Not allowed"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4" />
              Last Error Visibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Includes topic, job type, attempts, and the latest failure.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Queue</CardTitle>
          <CardDescription>
            Jobs listed here are currently dead-lettered and require manual
            retry.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded bg-gray-100" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-12 text-center">
              <Workflow className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-500">No failed jobs right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id || job._id || job.jobKey}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                          {job.status}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                          {job.topic}
                        </span>
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                          {job.jobType}
                        </span>
                      </div>
                      <p className="font-mono text-sm text-gray-900">
                        {job.jobKey}
                      </p>
                      <p className="text-sm text-gray-600">
                        Attempts: {job.attempts} / {job.maxAttempts}
                      </p>
                      <p className="text-sm text-gray-600">
                        Updated: {new Date(job.updatedAt).toLocaleString()}
                      </p>
                      {job.lastError && (
                        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-900">
                          {job.lastError}
                        </div>
                      )}
                    </div>

                    <PermissionGate permission={PERMISSIONS.jobs.retry}>
                      <Button
                        onClick={() =>
                          retryMutation.mutate(job.id || job._id || "")
                        }
                        disabled={
                          retryMutation.isPending || !(job.id || job._id)
                        }
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Retry Job
                      </Button>
                    </PermissionGate>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
