import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useMemo,
  useCallback,
} from "react";
import { authApi } from "@/services/api";
import type { UserDto } from "@/types/api";
import type { NestedPermissions } from "@/types/auth";

interface AuthContextType {
  user: UserDto | null;
  permissions: string[];
  nestedPermissions: NestedPermissions | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  canAccessPoliticianApp: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [nestedPermissions, setNestedPermissions] =
    useState<NestedPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  const resetAuthState = () => {
    setUser(null);
    setPermissions([]);
    setNestedPermissions(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        try {
          const response = await authApi.getProfile();

          if (response.success) {
            setUser(response.data.user);
            setPermissions(response.data.permissions || []);
            setNestedPermissions(response.data.nestedPermissions || null);
          }
        } catch (error) {
          console.error("Failed to get user profile:", error);
          authApi.logout();
          resetAuthState();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);

    if (response.success) {
      setUser(response.data.user);
      setPermissions(response.data.permissions || []);
      setNestedPermissions(response.data.nestedPermissions || null);

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }
  };

  const refreshUser = async () => {
    const response = await authApi.getProfile();

    if (response.success) {
      setUser(response.data.user);
      setPermissions(response.data.permissions || []);
      setNestedPermissions(response.data.nestedPermissions || null);
    }
  };

  const logout = () => {
    authApi.logout();
    resetAuthState();
  };

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

  const canAccessPoliticianApp = useMemo(() => {
    return !!user && user.role === "politician";
  }, [user]);

  const value: AuthContextType = {
    user,
    permissions,
    nestedPermissions,
    loading,
    login,
    refreshUser,
    logout,
    isAuthenticated: !!user,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessPoliticianApp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
