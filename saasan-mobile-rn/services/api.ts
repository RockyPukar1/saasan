import AsyncStore from "@react-native-async-storage/async-storage";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api/v1";

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = BASE_URL;
  }

  private async getAuthToken(): Promise<string | null> {
    return await AsyncStore.getItem("auth_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const res = await fetch(`${this.baseURL}${endpoint}`, config);

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
  }

  // Dashboard APIs
  async getDashboardStats() {
    return this.request("/dashboard/stats");
  }
}

export const apiService = new ApiService();
