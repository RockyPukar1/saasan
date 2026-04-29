import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  Shield,
  Monitor,
  Clock,
  Trash2,
  RefreshCcw,
  MapPin,
  Laptop,
  UserCog,
  KeyRound,
  AlertTriangle,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

export default function SessionsPage() {
  const queryClient = useQueryClient();
  const { ConfirmDialog, confirm } = useConfirmDialog();
  const { user, permissions, hasPermission, logout } = useAuth();
  const currentSessionId = sessionApi.getCurrentSessionId();

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

  const sessions = (data?.data || []).map((session) => ({
    ...session,
    isCurrent: session.id === currentSessionId,
  }));
  const activeSessionCount = sessions.length;
  const currentSession = currentSessionId
    ? sessions.find((session) => session.isCurrent) || null
    : null;
  const currentSessionResolved = Boolean(currentSession);
  const shouldShowDetectionWarning =
    sessions.length > 0 && !currentSessionResolved && !isLoading;

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
            Review device activity, sign out old devices, and verify account
            access.
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
              disabled={revokeAllMutation.isPending || activeSessionCount <= 1}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Revoke Other Sessions
            </Button>
          </PermissionGate>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <UserCog className="h-4 w-4" />
              Access Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium text-foreground">
              {user?.fullName || user?.email || "Administrator"}
            </p>
            <p className="text-muted-foreground">Role: {user?.role || "admin"}</p>
            <p className="text-muted-foreground">
              Granted permissions: {permissions.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Monitor className="h-4 w-4" />
              Session Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium text-foreground">
              {activeSessionCount} active{" "}
              {activeSessionCount === 1 ? "session" : "sessions"}
            </p>
            <p className="text-muted-foreground">
              Current device matched: {currentSessionResolved ? "Yes" : "No"}
            </p>
            <p className="text-muted-foreground">
              Other devices revokable: {canRevokeSessions ? "Yes" : "No"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound className="h-4 w-4" />
              Security Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              View sessions: {canViewSessions ? "Allowed" : "Not allowed"}
            </p>
            <p className="text-muted-foreground">
              Revoke sessions: {canRevokeSessions ? "Allowed" : "Not allowed"}
            </p>
            <p className="text-muted-foreground">
              Use this page to keep only trusted devices signed in.
            </p>
          </CardContent>
        </Card>
      </div>

      {shouldShowDetectionWarning && (
        <Card className="border-amber-200 bg-amber-50/70">
          <CardContent className="flex gap-3 py-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
            <div className="space-y-1 text-sm">
              <p className="font-medium text-amber-900">
                This device could not be matched to a saved session id.
              </p>
              <p className="text-amber-800">
                The list is still correct, but the dashboard will not guess
                which session is current. Signing in again will restore exact
                current-session labeling on this device.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

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
                  className={`rounded-lg border p-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${
                    session.isCurrent
                      ? "border-emerald-200 bg-emerald-50/60"
                      : "border-border"
                  }`}
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center gap-2">
                      <Laptop className="h-4 w-4 text-gray-500 shrink-0" />
                      <p className="font-medium text-gray-900 break-words">
                        {session.userAgent || "Unknown device"}
                      </p>
                      {session.isCurrent ? (
                        <Badge>Current</Badge>
                      ) : (
                        <Badge variant="secondary">Active</Badge>
                      )}
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

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span>IP Address: {session.ipAddress || "Unknown"}</span>
                    </div>

                    <p className="text-sm text-gray-600">
                      Created: {new Date(session.createdAt).toLocaleString()}
                    </p>

                    <p className="text-sm text-gray-600">
                      Refresh expires:{" "}
                      {new Date(session.refreshExpiresAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {session.isCurrent ? (
                      <Button variant="outline" onClick={() => logout()}>
                        Sign Out
                      </Button>
                    ) : (
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
                    )}
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
          {currentSession ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  {currentSession.userAgent || "Unknown device"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Last used{" "}
                  {currentSession.lastUsedAt
                    ? new Date(currentSession.lastUsedAt).toLocaleString()
                    : "recently"}
                </p>
              </div>
              <Button variant="outline" onClick={() => logout()}>
                Sign Out Current Session
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  Current device not identified
                </p>
                <p className="text-sm text-muted-foreground">
                  You can still sign out this browser safely.
                </p>
              </div>
              <Button variant="outline" onClick={() => logout()}>
                Sign Out Current Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog />
    </div>
  );
}
