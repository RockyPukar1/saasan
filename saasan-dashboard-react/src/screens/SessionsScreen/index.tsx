import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Shield, Monitor, Clock, Trash2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sessionApi } from "@/services/api";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { PERMISSIONS } from "@/constants/permission.constants";
import { PermissionGate } from "@/components/PermissionGate";

export default function SessionsPage() {
  const queryClient = useQueryClient();
  const { ConfirmDialog, confirm } = useConfirmDialog();
  const { hasPermission, logout } = useAuth();

  const canViewSessions = hasPermission(PERMISSIONS.sessions.view);
  const canRevokeSessions = hasPermission(PERMISSIONS.sessions.revoke);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["auth-sessions"],
    queryFn: () => sessionApi.getMySessions(),
    enabled: canViewSessions,
  });

  const revokeSessionMutation = useMutation({
    mutationFn: (sessionId: string) => sessionApi.revokeSession(sessionId),
    onSuccess: () => {
      toast.success("Session revoked successfully");
      queryClient.invalidateQueries({ queryKey: ["auth-sessions"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to revoke session");
    },
  });

  const revokeAllMutation = useMutation({
    mutationFn: () => sessionApi.revokeAllOtherSessions(),
    onSuccess: async () => {
      toast.success("All other sessions revoked successfully");
      await queryClient.invalidateQueries({ queryKey: ["auth-sessions"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to revoke sessions");
    },
  });

  const handleRevokeSession = (sessionId: string) => {
    if (!canRevokeSessions) {
      toast.error("You do not have permission to revoke sessions");
      return;
    }

    confirm({
      title: "Revoke Session",
      description:
        "Are you sure you want to revoke this session? It will be logged out immediately.",
      confirmText: "Revoke",
      variant: "destructive",
      onConfirm: () => revokeSessionMutation.mutate(sessionId),
    });
  };

  const handleRevokeAll = () => {
    if (!canRevokeSessions) {
      toast.error("You do not have permission to revoke sessions");
      return;
    }

    confirm({
      title: "Revoke All Other Sessions",
      description:
        "This will log out all your other active sessions. Your current session will remain active.",
      confirmText: "Revoke All",
      variant: "destructive",
      onConfirm: () => revokeAllMutation.mutate(),
    });
  };

  const sessions = data?.data || [];

  if (!canViewSessions) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              You do not have permission to view sessions.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>
          <p className="text-gray-600">
            View and manage your active login sessions
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <PermissionGate permission={PERMISSIONS.sessions.revoke}>
            <Button
              variant="destructive"
              onClick={handleRevokeAll}
              disabled={revokeAllMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Revoke Other Sessions
            </Button>
          </PermissionGate>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            These are the sessions currently associated with your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 rounded bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-12 text-center">
              <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No active sessions found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="border rounded-lg p-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-gray-500" />
                      <p className="font-medium text-gray-900 truncate">
                        {session.userAgent || "Unknown device"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        Last used:{" "}
                        {session.lastUsedAt
                          ? new Date(session.lastUsedAt).toLocaleString()
                          : "Unknown"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">
                      IP Address: {session.ipAddress || "Unknown"}
                    </p>

                    <p className="text-sm text-gray-600">
                      Created: {new Date(session.createdAt).toLocaleString()}
                    </p>

                    <p className="text-sm text-gray-600">
                      Refresh expires:{" "}
                      {new Date(session.refreshExpiresAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <PermissionGate permission={PERMISSIONS.sessions.revoke}>
                      <Button
                        variant="outline"
                        onClick={() => handleRevokeSession(session.id)}
                        disabled={revokeSessionMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Revoke
                      </Button>
                    </PermissionGate>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Session</CardTitle>
          <CardDescription>
            Sign out of this device if you are done using the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => logout()}>
            Sign Out Current Session
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog />
    </div>
  );
}
