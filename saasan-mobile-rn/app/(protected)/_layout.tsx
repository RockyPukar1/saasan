import { Stack } from "expo-router";
import { useAuthContext } from "~/contexts/AuthContext";
import { Redirect } from "expo-router";
import { ThemeToggle } from "~/components/ThemeToggle";

export default function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return null; // Or a loading screen
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Saasan",
        headerRight: () => <ThemeToggle />,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="politician/[id]" />
      <Stack.Screen name="report/[id]" />
    </Stack>
  );
}
