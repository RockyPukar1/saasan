import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiService } from "~/services/api";

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
    async (data: {
      fullName: string;
      email: string;
      password: string;
      phone?: string;
      district?: string;
      municipality?: string;
      wardNumber?: number;
    }) => {
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
      setState((prev) => ({ ...prev, loading: true }));
      await apiService.logout();
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Logout failed",
      }));
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await apiService.getProfile();
      setState({
        isAuthenticated: true,
        user: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
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
  }, [checkAuthStatus]);

  return {
    ...state,
    login,
    register,
    logout,
    refreshUser: checkAuthStatus,
  };
};
