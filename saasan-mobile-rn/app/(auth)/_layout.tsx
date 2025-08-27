import { Stack } from "expo-router";
import { useAuthContext } from "~/contexts/AuthContext";
import { Redirect } from "expo-router";

export default function AuthLayout() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
