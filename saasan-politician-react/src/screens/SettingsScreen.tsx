import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Lock,
  Smartphone,
  Mail,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dummyPolitician } from "@/data/dummy-data";
import { sessionApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { PERMISSIONS } from "@/constants/permission.constants";

export const SettingsScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const { user, permissions, hasPermission, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("english");
  const [timezone, setTimezone] = useState("Asia/Kathmandu");

  const handleSaveSettings = () => {
    console.log("Saving settings...");
  };

  const handlePasswordChange = () => {
    console.log("Changing password...");
  };

  const handleExportData = () => {
    console.log("Exporting data...");
  };

  const handleDeleteAccount = () => {
    console.log("Deleting account...");
  };

  const settingsTabs = [
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "advanced", label: "Advanced", icon: Settings },
  ];

  const currentSessionId = sessionApi.getCurrentSessionId();
  const canViewSessions = hasPermission(PERMISSIONS.sessions.view);
  const canRevokeSessions = hasPermission(PERMISSIONS.sessions.revoke);
  const { data: sessionsResponse, isLoading: sessionsLoading } = useQuery({
    queryKey: ["politician-auth-sessions"],
    queryFn: () => sessionApi.getMySessions(),
    enabled: canViewSessions,
  });

  const revokeSessionMutation = useMutation({
    mutationFn: (sessionId: string) => sessionApi.revokeSession(sessionId),
    onSuccess: () => {
      toast.success("Session revoked");
      queryClient.invalidateQueries({ queryKey: ["politician-auth-sessions"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to revoke session");
    },
  });

  const revokeAllMutation = useMutation({
    mutationFn: () => sessionApi.revokeAllOtherSessions(),
    onSuccess: () => {
      toast.success("Other sessions revoked");
      queryClient.invalidateQueries({ queryKey: ["politician-auth-sessions"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to revoke sessions");
    },
  });

  const sessions = (sessionsResponse?.data || []).map((session) => ({
    ...session,
    current: session.id === currentSessionId,
  }));
  const currentSession = currentSessionId
    ? sessions.find((session) => session.current) || null
    : null;
  const securityHighlights = [
    {
      label: "Role",
      value: user?.role || "politician",
    },
    {
      label: "Permissions",
      value: String(permissions.length),
    },
    {
      label: "Session access",
      value: canViewSessions ? "Enabled" : "Hidden",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Settings Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 mb-6 mx-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold mb-2">Settings</h1>
            <p className="text-indigo-100 text-sm">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="bg-indigo-500 rounded-full p-3">
            <Settings className="text-white" size={24} />
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {settingsTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          activeTab === tab.id
                            ? "bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600"
                            : "text-gray-700"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Profile Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          defaultValue={dummyPolitician.fullName}
                          className="border-indigo-200 focus:border-indigo-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={dummyPolitician.contact.email}
                          className="border-indigo-200 focus:border-indigo-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          defaultValue={dummyPolitician.contact.phone}
                          className="border-indigo-200 focus:border-indigo-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profession">Profession</Label>
                        <Input
                          id="profession"
                          defaultValue={dummyPolitician.profession}
                          className="border-indigo-200 focus:border-indigo-400"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biography</Label>
                      <textarea
                        id="bio"
                        rows={4}
                        defaultValue={dummyPolitician.biography}
                        className="w-full p-2 border border-indigo-200 rounded-md focus:border-indigo-400 focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveSettings}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Social Media Links</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          defaultValue={dummyPolitician.socialMedia.facebook}
                          className="border-indigo-200 focus:border-indigo-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          defaultValue={dummyPolitician.socialMedia.twitter}
                          className="border-indigo-200 focus:border-indigo-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          defaultValue={dummyPolitician.socialMedia.instagram}
                          className="border-indigo-200 focus:border-indigo-400"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveSettings}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="h-5 w-5" />
                      <span>Notification Preferences</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <Label
                            htmlFor="email-notifications"
                            className="font-medium"
                          >
                            Email Notifications
                          </Label>
                        </div>
                        <p className="text-sm text-gray-600">
                          Receive email updates about your account activity
                        </p>
                      </div>
                      <input
                        id="email-notifications"
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) =>
                          setEmailNotifications(e.target.checked)
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-4 w-4 text-gray-500" />
                          <Label
                            htmlFor="push-notifications"
                            className="font-medium"
                          >
                            Push Notifications
                          </Label>
                        </div>
                        <p className="text-sm text-gray-600">
                          Receive push notifications on your mobile device
                        </p>
                      </div>
                      <input
                        id="push-notifications"
                        type="checkbox"
                        checked={pushNotifications}
                        onChange={(e) => setPushNotifications(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-4 w-4 text-gray-500" />
                          <Label
                            htmlFor="sms-notifications"
                            className="font-medium"
                          >
                            SMS Notifications
                          </Label>
                        </div>
                        <p className="text-sm text-gray-600">
                          Receive important updates via SMS
                        </p>
                      </div>
                      <input
                        id="sms-notifications"
                        type="checkbox"
                        checked={smsNotifications}
                        onChange={(e) => setSmsNotifications(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Types</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      "New messages from citizens",
                      "Promise deadline reminders",
                      "Announcement updates",
                      "System notifications",
                      "Weekly activity summary",
                    ].map((type) => (
                      <div
                        key={type}
                        className="flex items-center justify-between py-2"
                      >
                        <span className="text-sm font-medium">{type}</span>
                        <input
                          type="checkbox"
                          defaultChecked={type === "New messages from citizens"}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Role and Access</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-3 md:grid-cols-3">
                      {securityHighlights.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-4"
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                            {item.label}
                          </p>
                          <p className="mt-2 text-lg font-semibold text-slate-900">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-medium text-slate-900">
                        Signed in as {user?.fullName || user?.email || "Politician"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Your current access is enforced by backend role
                        permissions. What you can see in this portal is based on
                        your live permission set, not hardcoded frontend access.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-900">
                        Active permissions
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {permissions.length > 0 ? (
                          permissions.map((permission) => (
                            <Badge key={permission} variant="secondary">
                              {permission}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-slate-600">
                            No explicit permissions were returned for this
                            account.
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lock className="h-5 w-5" />
                      <span>Change Password</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          className="pr-10 border-indigo-200 focus:border-indigo-400"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          className="pr-10 border-indigo-200 focus:border-indigo-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        className="border-indigo-200 focus:border-indigo-400"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handlePasswordChange}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        Update Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                      <CardTitle>Active Sessions</CardTitle>
                      {canRevokeSessions && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => revokeAllMutation.mutate()}
                          disabled={
                            revokeAllMutation.isPending || sessions.length <= 1
                          }
                        >
                          Sign Out Other Devices
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!canViewSessions ? (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        Your current role does not include permission to view
                        session details.
                      </div>
                    ) : (
                      <>
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm font-medium text-slate-900">
                            Current device
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {currentSession?.userAgent ||
                              "This browser has not been matched to a saved session id yet."}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Active sessions: {sessions.length}
                          </p>
                        </div>

                        <div className="space-y-3">
                          {sessionsLoading ? (
                        [...Array(3)].map((_, index) => (
                          <div
                            key={index}
                            className="h-20 rounded-lg bg-gray-100 animate-pulse"
                          />
                        ))
                          ) : sessions.length === 0 ? (
                            <p className="text-sm text-gray-600">
                              No active sessions found.
                            </p>
                          ) : (
                            sessions.map((session) => (
                              <div
                                key={session.id}
                                className={`flex items-center justify-between p-3 border rounded-lg ${
                                  session.current
                                    ? "border-indigo-200 bg-indigo-50/60"
                                    : "border-gray-200"
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Monitor className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      {session.userAgent || "Unknown device"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {session.ipAddress || "Unknown IP"} • Last used{" "}
                                      {session.lastUsedAt
                                        ? new Date(
                                            session.lastUsedAt,
                                          ).toLocaleString()
                                        : "recently"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {session.current && (
                                    <Badge variant="secondary">Current</Badge>
                                  )}
                                  {(session.current || canRevokeSessions) && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                      onClick={() =>
                                        session.current
                                          ? logout()
                                          : revokeSessionMutation.mutate(
                                              session.id,
                                            )
                                      }
                                      disabled={revokeSessionMutation.isPending}
                                    >
                                      {session.current ? "Sign Out" : "Revoke"}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Palette className="h-5 w-5" />
                      <span>Theme Preferences</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label className="font-medium">Theme</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "light", label: "Light", icon: Sun },
                          { value: "dark", label: "Dark", icon: Moon },
                          { value: "system", label: "System", icon: Monitor },
                        ].map((themeOption) => {
                          const Icon = themeOption.icon;
                          return (
                            <button
                              key={themeOption.value}
                              onClick={() => setTheme(themeOption.value)}
                              className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                                theme === themeOption.value
                                  ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <Icon className="h-6 w-6" />
                              <span className="text-sm font-medium">
                                {themeOption.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="border-indigo-200 focus:border-indigo-400">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="nepali">
                            नेपाली (Nepali)
                          </SelectItem>
                          <SelectItem value="hindi">हिन्दी (Hindi)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger className="border-indigo-200 focus:border-indigo-400">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Kathmandu">
                            Asia/Kathmandu (GMT+5:45)
                          </SelectItem>
                          <SelectItem value="Asia/Delhi">
                            Asia/Delhi (GMT+5:30)
                          </SelectItem>
                          <SelectItem value="UTC">UTC (GMT+0:00)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Display Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      "Compact mode",
                      "Show timestamps",
                      "Enable animations",
                      "High contrast mode",
                    ].map((preference) => (
                      <div
                        key={preference}
                        className="flex items-center justify-between py-2"
                      >
                        <span className="text-sm font-medium">
                          {preference}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Privacy Settings */}
            {activeTab === "privacy" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Privacy Controls</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        title: "Profile Visibility",
                        description:
                          "Control who can see your profile information",
                        type: "select",
                        options: ["Public", "Constituents Only", "Private"],
                      },
                      {
                        title: "Contact Information",
                        description: "Show/hide your contact details",
                        type: "switch",
                        default: true,
                      },
                      {
                        title: "Activity Status",
                        description: "Show when you're online",
                        type: "switch",
                        default: false,
                      },
                      {
                        title: "Message Requests",
                        description: "Allow messages from anyone",
                        type: "switch",
                        default: true,
                      },
                    ].map((control, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{control.title}</h4>
                          <p className="text-sm text-gray-600">
                            {control.description}
                          </p>
                        </div>
                        {control.type === "switch" ? (
                          <input
                            type="checkbox"
                            defaultChecked={control.default}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                        ) : (
                          <Select defaultValue={control.options?.[0] || ""}>
                            <SelectTrigger className="w-32 border-indigo-200 focus:border-indigo-400">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {control.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium">Export Your Data</h4>
                        <p className="text-sm text-gray-600">
                          Download a copy of your data
                        </p>
                      </div>
                      <Button
                        onClick={handleExportData}
                        variant="outline"
                        className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Advanced Settings */}
            {activeTab === "advanced" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Advanced Options</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium">Developer Mode</h4>
                        <p className="text-sm text-gray-600">
                          Enable advanced debugging features
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium">Beta Features</h4>
                        <p className="text-sm text-gray-600">
                          Try out new features before they're released
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium">API Access</h4>
                        <p className="text-sm text-gray-600">
                          Manage API keys and access tokens
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                      >
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-red-800">
                            Delete Account
                          </h4>
                          <p className="text-sm text-red-600">
                            Permanently delete your account and all data
                          </p>
                        </div>
                        <Button
                          onClick={handleDeleteAccount}
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
