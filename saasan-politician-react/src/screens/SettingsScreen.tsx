import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  User,
  Bell,
  Shield,
  Palette,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sessionApi, settingsApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import type { PoliticianDto, PoliticianPreferencesDto } from "@/types/api";

const defaultPreferences: PoliticianPreferencesDto = {
  notifications: {
    email: true,
    push: false,
    sms: true,
    messageUpdates: true,
    promiseReminders: true,
    announcementUpdates: true,
    systemNotifications: true,
    weeklySummary: false,
  },
  appearance: {
    theme: "system",
    language: "english",
    timezone: "Asia/Kathmandu",
    compactMode: false,
    showTimestamps: true,
    enableAnimations: true,
    highContrastMode: false,
  },
  privacy: {
    profileVisibility: "public",
    showContactInfo: true,
    showActivityStatus: false,
    allowMessageRequests: true,
  },
  advanced: {
    developerMode: false,
    betaFeatures: false,
  },
};

type ProfileFormState = {
  fullName: string;
  email: string;
  phone: string;
  profession: string;
  biography: string;
  website: string;
  facebook: string;
  twitter: string;
  instagram: string;
};

const emptyProfileForm: ProfileFormState = {
  fullName: "",
  email: "",
  phone: "",
  profession: "",
  biography: "",
  website: "",
  facebook: "",
  twitter: "",
  instagram: "",
};

export const SettingsScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const { user, permissions, logout, refreshUser } = useAuth();
  const { data: profilePayload, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileFormState>(emptyProfileForm);
  const [preferencesForm, setPreferencesForm] =
    useState<PoliticianPreferencesDto>(defaultPreferences);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [deletePassword, setDeletePassword] = useState("");

  const politicianProfile = useMemo(
    () => ((profilePayload?.profile as Partial<PoliticianDto>) || {}),
    [profilePayload],
  );

  useEffect(() => {
    setProfileForm({
      fullName: politicianProfile.fullName || "",
      email: profilePayload?.user?.email || politicianProfile.contact?.email || "",
      phone: politicianProfile.contact?.phone || "",
      profession: politicianProfile.profession || "",
      biography: politicianProfile.biography || "",
      website: politicianProfile.contact?.website || "",
      facebook: politicianProfile.socialMedia?.facebook || "",
      twitter: politicianProfile.socialMedia?.twitter || "",
      instagram: politicianProfile.socialMedia?.instagram || "",
    });
    setPreferencesForm(
      politicianProfile.preferences
        ? {
            ...defaultPreferences,
            ...politicianProfile.preferences,
            notifications: {
              ...defaultPreferences.notifications,
              ...politicianProfile.preferences.notifications,
            },
            appearance: {
              ...defaultPreferences.appearance,
              ...politicianProfile.preferences.appearance,
            },
            privacy: {
              ...defaultPreferences.privacy,
              ...politicianProfile.preferences.privacy,
            },
            advanced: {
              ...defaultPreferences.advanced,
              ...politicianProfile.preferences.advanced,
            },
          }
        : defaultPreferences,
    );
  }, [politicianProfile, profilePayload?.user?.email]);

  const settingsTabs = [
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "advanced", label: "Advanced", icon: Settings },
  ];

  const currentSessionId = sessionApi.getCurrentSessionId();

  const { data: sessionsResponse, isLoading: sessionsLoading } = useQuery({
    queryKey: ["politician-auth-sessions"],
    queryFn: () => sessionApi.getMySessions(),
  });

  const savePreferencesMutation = useMutation({
    mutationFn: (data: PoliticianPreferencesDto) =>
      settingsApi.updatePreferences(data),
    onSuccess: async () => {
      toast.success("Settings saved");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["profile"] }),
        refreshUser(),
      ]);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to save settings");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      settingsApi.changePassword(data),
    onSuccess: () => {
      toast.success("Password updated");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update password",
      );
    },
  });

  const exportMutation = useMutation({
    mutationFn: () => settingsApi.exportData(),
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `politician-account-export-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Export generated");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to export data");
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (currentPassword: string) =>
      settingsApi.deleteAccount(currentPassword),
    onSuccess: () => {
      toast.success("Account deleted");
      logout();
      window.location.href = "/login";
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete account");
    },
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

  const updateNotification = (
    key: keyof PoliticianPreferencesDto["notifications"],
    value: boolean,
  ) => {
    setPreferencesForm((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [key]: value,
      },
    }));
  };

  const updateAppearance = (
    key: keyof PoliticianPreferencesDto["appearance"],
    value: string | boolean,
  ) => {
    setPreferencesForm((current) => ({
      ...current,
      appearance: {
        ...current.appearance,
        [key]: value,
      },
    }));
  };

  const updatePrivacy = (
    key: keyof PoliticianPreferencesDto["privacy"],
    value: string | boolean,
  ) => {
    setPreferencesForm((current) => ({
      ...current,
      privacy: {
        ...current.privacy,
        [key]: value,
      },
    }));
  };

  const updateAdvanced = (
    key: keyof PoliticianPreferencesDto["advanced"],
    value: boolean,
  ) => {
    setPreferencesForm((current) => ({
      ...current,
      advanced: {
        ...current.advanced,
        [key]: value,
      },
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        fullName: profileForm.fullName,
        email: profileForm.email,
        biography: profileForm.biography,
        profession: profileForm.profession,
        contact: {
          email: profileForm.email,
          phone: profileForm.phone,
          website: profileForm.website,
        },
        socialMedia: {
          facebook: profileForm.facebook,
          twitter: profileForm.twitter,
          instagram: profileForm.instagram,
        },
      });
      await refreshUser();
      toast.success("Profile updated");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    }
  };

  const handleSavePreferences = async () => {
    await savePreferencesMutation.mutateAsync(preferencesForm);
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Please complete the password form.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    await changePasswordMutation.mutateAsync({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Enter your current password to delete the account.");
      return;
    }

    if (
      !window.confirm(
        "Delete this portal account? Your public politician record will remain, but portal access and announcements will be removed.",
      )
    ) {
      return;
    }

    await deleteAccountMutation.mutateAsync(deletePassword);
  };

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
      label: "Active sessions",
      value: String(sessions.length),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

          <div className="lg:col-span-3 space-y-6">
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
                    {profileLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, index) => (
                          <div
                            key={index}
                            className="h-12 rounded-lg bg-gray-100 animate-pulse"
                          />
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              value={profileForm.fullName}
                              onChange={(event) =>
                                setProfileForm((current) => ({
                                  ...current,
                                  fullName: event.target.value,
                                }))
                              }
                              className="border-indigo-200 focus:border-indigo-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileForm.email}
                              onChange={(event) =>
                                setProfileForm((current) => ({
                                  ...current,
                                  email: event.target.value,
                                }))
                              }
                              className="border-indigo-200 focus:border-indigo-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              value={profileForm.phone}
                              onChange={(event) =>
                                setProfileForm((current) => ({
                                  ...current,
                                  phone: event.target.value,
                                }))
                              }
                              className="border-indigo-200 focus:border-indigo-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="profession">Profession</Label>
                            <Input
                              id="profession"
                              value={profileForm.profession}
                              onChange={(event) =>
                                setProfileForm((current) => ({
                                  ...current,
                                  profession: event.target.value,
                                }))
                              }
                              className="border-indigo-200 focus:border-indigo-400"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                              id="website"
                              value={profileForm.website}
                              onChange={(event) =>
                                setProfileForm((current) => ({
                                  ...current,
                                  website: event.target.value,
                                }))
                              }
                              className="border-indigo-200 focus:border-indigo-400"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Biography</Label>
                          <Textarea
                            id="bio"
                            rows={4}
                            value={profileForm.biography}
                            onChange={(event) =>
                              setProfileForm((current) => ({
                                ...current,
                                biography: event.target.value,
                              }))
                            }
                            className="border-indigo-200 focus:border-indigo-400"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="facebook">Facebook</Label>
                            <Input
                              id="facebook"
                              value={profileForm.facebook}
                              onChange={(event) =>
                                setProfileForm((current) => ({
                                  ...current,
                                  facebook: event.target.value,
                                }))
                              }
                              className="border-indigo-200 focus:border-indigo-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter</Label>
                            <Input
                              id="twitter"
                              value={profileForm.twitter}
                              onChange={(event) =>
                                setProfileForm((current) => ({
                                  ...current,
                                  twitter: event.target.value,
                                }))
                              }
                              className="border-indigo-200 focus:border-indigo-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input
                              id="instagram"
                              value={profileForm.instagram}
                              onChange={(event) =>
                                setProfileForm((current) => ({
                                  ...current,
                                  instagram: event.target.value,
                                }))
                              }
                              className="border-indigo-200 focus:border-indigo-400"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            onClick={handleSaveProfile}
                            disabled={updateProfile.isPending}
                            className="bg-indigo-600 hover:bg-indigo-700"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      key: "email" as const,
                      label: "Email Notifications",
                      description: "Receive updates by email",
                      icon: Mail,
                    },
                    {
                      key: "push" as const,
                      label: "Push Notifications",
                      description: "Receive device alerts",
                      icon: Smartphone,
                    },
                    {
                      key: "sms" as const,
                      label: "SMS Notifications",
                      description: "Receive important updates by SMS",
                      icon: Smartphone,
                    },
                    {
                      key: "messageUpdates" as const,
                      label: "New Message Alerts",
                      description: "Notify me about citizen replies",
                      icon: Bell,
                    },
                    {
                      key: "promiseReminders" as const,
                      label: "Promise Reminders",
                      description: "Notify me about due dates",
                      icon: Bell,
                    },
                    {
                      key: "announcementUpdates" as const,
                      label: "Announcement Updates",
                      description: "Notify me about publishing activity",
                      icon: Bell,
                    },
                    {
                      key: "systemNotifications" as const,
                      label: "System Notices",
                      description: "Receive maintenance and access updates",
                      icon: Bell,
                    },
                    {
                      key: "weeklySummary" as const,
                      label: "Weekly Summary",
                      description: "Receive a weekly portal digest",
                      icon: Bell,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.key}
                        className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                        <Checkbox
                          checked={preferencesForm.notifications[item.key]}
                          onCheckedChange={(checked) =>
                            updateNotification(item.key, checked === true)
                          }
                        />
                      </div>
                    );
                  })}
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSavePreferences}
                      disabled={savePreferencesMutation.isPending}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

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
                        Access is enforced by the backend role-permission system
                        and reflected in this portal in real time.
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
                          value={passwordForm.currentPassword}
                          onChange={(event) =>
                            setPasswordForm((current) => ({
                              ...current,
                              currentPassword: event.target.value,
                            }))
                          }
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
                          value={passwordForm.newPassword}
                          onChange={(event) =>
                            setPasswordForm((current) => ({
                              ...current,
                              newPassword: event.target.value,
                            }))
                          }
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
                        value={passwordForm.confirmPassword}
                        onChange={(event) =>
                          setPasswordForm((current) => ({
                            ...current,
                            confirmPassword: event.target.value,
                          }))
                        }
                        className="border-indigo-200 focus:border-indigo-400"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={handlePasswordChange}
                        disabled={changePasswordMutation.isPending}
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => revokeAllMutation.mutate()}
                        disabled={revokeAllMutation.isPending || sessions.length <= 1}
                      >
                        Sign Out Other Devices
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-medium text-slate-900">
                        Current device
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {sessions.find((session) => session.current)?.userAgent ||
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
                                    ? new Date(session.lastUsedAt).toLocaleString()
                                    : "recently"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {session.current && (
                                <Badge variant="secondary">Current</Badge>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() =>
                                  session.current
                                    ? logout()
                                    : revokeSessionMutation.mutate(session.id)
                                }
                                disabled={revokeSessionMutation.isPending}
                              >
                                {session.current ? "Sign Out" : "Revoke"}
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

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
                              onClick={() =>
                                updateAppearance("theme", themeOption.value)
                              }
                              className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                                preferencesForm.appearance.theme ===
                                themeOption.value
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
                      <Select
                        value={preferencesForm.appearance.language}
                        onValueChange={(value) => updateAppearance("language", value)}
                      >
                        <SelectTrigger className="border-indigo-200 focus:border-indigo-400">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="nepali">नेपाली (Nepali)</SelectItem>
                          <SelectItem value="hindi">हिन्दी (Hindi)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={preferencesForm.appearance.timezone}
                        onValueChange={(value) => updateAppearance("timezone", value)}
                      >
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

                    {[
                      { key: "compactMode" as const, label: "Compact mode" },
                      {
                        key: "showTimestamps" as const,
                        label: "Show timestamps",
                      },
                      {
                        key: "enableAnimations" as const,
                        label: "Enable animations",
                      },
                      {
                        key: "highContrastMode" as const,
                        label: "High contrast mode",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between py-2"
                      >
                        <span className="text-sm font-medium">{item.label}</span>
                        <Checkbox
                          checked={preferencesForm.appearance[item.key]}
                          onCheckedChange={(checked) =>
                            updateAppearance(item.key, checked === true)
                          }
                        />
                      </div>
                    ))}

                    <div className="flex justify-end">
                      <Button
                        onClick={handleSavePreferences}
                        disabled={savePreferencesMutation.isPending}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

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
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">Profile Visibility</h4>
                        <p className="text-sm text-gray-600">
                          Control who can see your profile information
                        </p>
                      </div>
                      <Select
                        value={preferencesForm.privacy.profileVisibility}
                        onValueChange={(value) =>
                          updatePrivacy(
                            "profileVisibility",
                            value as PoliticianPreferencesDto["privacy"]["profileVisibility"],
                          )
                        }
                      >
                        <SelectTrigger className="w-40 border-indigo-200 focus:border-indigo-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="constituents_only">
                            Constituents Only
                          </SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {[
                      {
                        key: "showContactInfo" as const,
                        title: "Contact Information",
                        description: "Show or hide your public contact details",
                      },
                      {
                        key: "showActivityStatus" as const,
                        title: "Activity Status",
                        description: "Show when you are active in the portal",
                      },
                      {
                        key: "allowMessageRequests" as const,
                        title: "Message Requests",
                        description: "Allow new message requests in the portal",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                        <Checkbox
                          checked={preferencesForm.privacy[item.key]}
                          onCheckedChange={(checked) =>
                            updatePrivacy(item.key, checked === true)
                          }
                        />
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
                          Download your account, profile, sessions, and announcements
                        </p>
                      </div>
                      <Button
                        onClick={() => exportMutation.mutate()}
                        variant="outline"
                        disabled={exportMutation.isPending}
                        className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSavePreferences}
                        disabled={savePreferencesMutation.isPending}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        Save Privacy Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

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
                    {[
                      {
                        key: "developerMode" as const,
                        title: "Developer Mode",
                        description: "Enable advanced debugging markers",
                      },
                      {
                        key: "betaFeatures" as const,
                        title: "Beta Features",
                        description: "Opt into early feature previews",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                        <Checkbox
                          checked={preferencesForm.advanced[item.key]}
                          onCheckedChange={(checked) =>
                            updateAdvanced(item.key, checked === true)
                          }
                        />
                      </div>
                    ))}
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSavePreferences}
                        disabled={savePreferencesMutation.isPending}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        Save Advanced Settings
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
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-red-800">
                            Delete Account
                          </h4>
                          <p className="text-sm text-red-600">
                            This removes your portal account, signs out every device,
                            and deletes portal announcements. Your public politician
                            record remains for platform continuity.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="delete-password" className="text-red-700">
                            Current Password
                          </Label>
                          <Input
                            id="delete-password"
                            type="password"
                            value={deletePassword}
                            onChange={(event) =>
                              setDeletePassword(event.target.value)
                            }
                            className="border-red-200 bg-white"
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button
                            onClick={handleDeleteAccount}
                            variant="outline"
                            disabled={deleteAccountMutation.isPending}
                            className="border-red-300 text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </Button>
                        </div>
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
