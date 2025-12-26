import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useAuthContext } from "~/contexts/AuthContext";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuthContext();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(email, password);
      // router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error instanceof Error ? error.message : "Please check your credentials"
      );
    }
  };

  return (
    <View className="flex-1 justify-center px-4 bg-background">
      <View className="bg-card rounded-lg p-6 shadow-md">
        <Text className="text-2xl font-bold text-center mb-6 text-foreground">
          Welcome Back
        </Text>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-foreground mb-1">
              Email
            </Text>
            <TextInput
              className="bg-input rounded-md px-4 py-2 text-foreground"
              placeholder="Enter your email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-foreground mb-1">
              Password
            </Text>
            <TextInput
              className="bg-input rounded-md px-4 py-2 text-foreground"
              placeholder="Enter your password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>
        </View>
        <View className="space-y-4">
          <Button
            className="bg-primary py-3 rounded-md"
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold">
              {loading ? "Logging in..." : "Login"}
            </Text>
          </Button>

          <Button onPress={() => router.push("/register")} className="mt-4">
            <Text className="text-primary text-center">
              Don't have an account? Register
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
