import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "../../../shared/types/user";
import { authApi, rbacApi } from "@/services/api";
import type { IPermission } from "@/types/rbac";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  permissions: IPermission[];
  hasPermission: (resource: string, action: string) => boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<IPermission[]>([]);

  const hasPermission = (resource: string, action: string) => {
    return permissions.some(
      (p) => p.resource === resource && p.action === action,
    );
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await authApi.getProfile();
          if (response.success) {
            setUser(response.data);
          }
        } catch (error) {
          console.error("Failed to get user profile:", error);
          localStorage.removeItem("accessToken");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      console.log(response);
      if (response.success) {
        setUser(response.data.user);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        const userPermissions = await rbacApi.getUserPermissions();
        setPermissions(userPermissions);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    authApi.logout();
    setPermissions([]);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    permissions,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
