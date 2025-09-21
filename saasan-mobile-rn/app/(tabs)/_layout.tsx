import { Tabs, Redirect } from "expo-router";
import { Home, Users, FileText, Vote } from "lucide-react-native";
import { useAuthContext } from "~/contexts/AuthContext";

export default function TabLayout() {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return null; // Or a loading screen
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#DC2626",
        tabBarInactiveTintColor: "#6B7280",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          marginBottom: 15,
          marginHorizontal: 15,
          borderRadius: 20,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="politicians"
        options={{
          title: "Leaders",
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FileText color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="polling"
        options={{
          title: "Polling",
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Vote color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
