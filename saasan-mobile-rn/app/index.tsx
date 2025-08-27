import { Redirect } from "expo-router";
import { useAuthContext } from "~/contexts/AuthContext";

export default function Index() {
  const { isAuthenticated } = useAuthContext();

  return <Redirect href={isAuthenticated ? "/(tabs)" : "/(auth)/login"} />;
}
