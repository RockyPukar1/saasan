import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import type { IRegisterData } from "@/types/auth";
import toast from "react-hot-toast";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: () => apiService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: !!localStorage.getItem("accessToken"),
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiService.login({ email, password }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Login successful!");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Login failed");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: IRegisterData) => apiService.register(data),
    onSuccess: () => {
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
      queryClient.clear();
      toast.success("Logged out successfully");
    },
    onError: () => {
      queryClient.clear();
      toast.success("Logged out successfully");
    },
  });

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

  const refreshUser = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["auth"] });
  }, [queryClient]);

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
    user: user?.data || null,
    loading: isLoading,
    error: errorState instanceof Error ? errorState.message : null,
    login,
    register,
    logout,
    refreshUser,
  };
};
