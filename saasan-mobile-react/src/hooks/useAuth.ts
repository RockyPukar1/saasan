import { useCallback, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import type { IRegisterData } from "@/types/auth";
import type { NestedPermissions } from "@/types/auth-session";
import toast from "react-hot-toast";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [nestedPermissions, setNestedPermissions] =
    useState<NestedPermissions | null>(null);

  const {
    data: profileResponse,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: async () => {
      const response = await apiService.getProfile();
      setPermissions(response.data.permissions || []);
      setNestedPermissions(response.data.nestedPermissions || null);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: !!localStorage.getItem("accessToken"),
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiService.login({ email, password }),
    onSuccess: (response) => {
      setPermissions(response.data.permissions || []);
      setNestedPermissions(response.data.nestedPermissions || null);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Login successful!");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Login failed");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: IRegisterData) => apiService.register(data),
    onSuccess: (response) => {
      setPermissions(response.data.permissions || []);
      setNestedPermissions(response.data.nestedPermissions || null);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Registration successful!");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Registration failed",
      );
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiService.logout(),
    onSuccess: () => {
      setPermissions([]);
      setNestedPermissions(null);
      queryClient.clear();
      toast.success("Logged out successfully");
    },
    onError: () => {
      setPermissions([]);
      setNestedPermissions(null);
      queryClient.clear();
      toast.success("Logged out successfully");
    },
  });

  const user = profileResponse?.data.user || null;
  const isAuthenticated = !!user;

  const login = useCallback(
    async (email: string, password: string) => {
      return loginMutation.mutateAsync({ email, password });
    },
    [loginMutation],
  );

  const register = useCallback(
    async (data: IRegisterData) => {
      return registerMutation.mutateAsync(data);
    },
    [registerMutation],
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const refreshUser = useCallback(async () => {
    const response = await apiService.getProfile();
    setPermissions(response.data.permissions || []);
    setNestedPermissions(response.data.nestedPermissions || null);
    queryClient.invalidateQueries({ queryKey: ["auth"] });
  }, [queryClient]);

  const hasRole = useCallback(
    (role: string) => {
      return user?.role === role;
    },
    [user],
  );

  const hasPermission = useCallback(
    (permission: string) => {
      return permissions.includes(permission);
    },
    [permissions],
  );

  const hasAnyPermission = useCallback(
    (requiredPermissions: string[]) => {
      return requiredPermissions.some((permission) =>
        permissions.includes(permission),
      );
    },
    [permissions],
  );

  const hasAllPermissions = useCallback(
    (requiredPermissions: string[]) => {
      return requiredPermissions.every((permission) =>
        permissions.includes(permission),
      );
    },
    [permissions],
  );

  const canAccessCitizenApp = useMemo(() => {
    return !!user && user.role === "citizen";
  }, [user]);

  const isLoading =
    loading ||
    loginMutation.isPending ||
    registerMutation.isPending ||
    logoutMutation.isPending;
  const errorState =
    error ||
    loginMutation.error ||
    registerMutation.error ||
    logoutMutation.error;

  return {
    isAuthenticated,
    user,
    permissions,
    nestedPermissions,
    loading: isLoading,
    error: errorState instanceof Error ? errorState.message : null,
    login,
    register,
    logout,
    refreshUser,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessCitizenApp,
  };
};
