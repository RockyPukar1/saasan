import { useState, useCallback, useEffect } from "react";
import { apiService } from "@/services/api";
import type { IRegisterData } from "@/types/auth";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    phone?: string;
    district?: string;
    municipality?: string;
    ward_number?: number;
    last_active_at: string;
    created_at: string;
    updated_at: string;
  } | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await apiService.login({ email, password });
      setState({
        isAuthenticated: true,
        user: response.data.user,
        loading: false,
        error: null,
      });
      return response.data;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Login failed",
      }));
      throw error;
    }
  }, []);

  const register = useCallback(
    async (data: IRegisterData) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const response = await apiService.register(data);
        setState({
          isAuthenticated: true,
          user: response.data.user,
          loading: false,
          error: null,
        });
        return response.data;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Registration failed",
        }));
        throw error;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      console.log("Logout initiated...");
      setState((prev) => ({ ...prev, loading: true }));
      await apiService.logout();
      console.log("Token removed, setting state...");
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
      console.log("Logout completed successfully");
    } catch (error) {
      console.log("Logout error, clearing state anyway:", error);
      // Even if logout fails, clear local state
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      console.log("Checking auth status...");
      setState((prev) => ({ ...prev, loading: true }));

      // Check if token exists first
      const token = localStorage.getItem("accessToken");
      console.log("Token exists:", !!token);
      if (!token) {
        console.log("No token found, setting as unauthenticated");
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
        return;
      }

      console.log("Token found, checking with API...");
      const response = await apiService.getProfile();
      console.log("API response successful, user authenticated");
      setState({
        isAuthenticated: true,
        user: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.log("API call failed, removing token:", error);
      // If API call fails, remove token and set as unauthenticated
      await localStorage.removeItem("auth_token");
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();

    // Listen for app state changes to check auth when app comes to foreground
    // const handleAppStateChange = (nextAppState: string) => {
    //   if (nextAppState === "active") {
    //     checkAuthStatus();
    //   }
    // };

    // const subscription = AppState.addEventListener(
    //   "change",
    //   handleAppStateChange
    // );

    // return () => {
    //   subscription?.remove();
    // };
  }, [checkAuthStatus]);

  return {
    ...state,
    login,
    register,
    logout,
    refreshUser: checkAuthStatus,
  };
};
