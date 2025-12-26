import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useAuthContext } from "~/contexts/AuthContext";
import { useLocation } from "~/hooks/useLocation";
import { useRouter } from "expo-router";
import { CustomPicker } from "~/components/ui/picker";
import { Button } from "~/components/ui/button";

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    district: "",
    municipality: "",
    wardNumber: "",
  });
  const { register, loading } = useAuthContext();
  const { districts, municipalities, wards, fetchMunicipalities, fetchWards } =
    useLocation();
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    try {
      // Convert wardNumber to number if provided
      const wardNum = formData.wardNumber
        ? parseInt(formData.wardNumber, 10)
        : 1;

      await register({
        ...formData,
        wardNumber: wardNum,
      });
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error instanceof Error ? error.message : "Please check your input"
      );
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4"
    >
      <View className="bg-card rounded-lg p-6 shadow-md mt-8 mb-8">
        <Text className="text-2xl font-bold text-center mb-6 text-foreground">
          Create Account
        </Text>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-foreground mb-1">
              Full Name *
            </Text>
            <TextInput
              className="bg-input rounded-md px-4 py-2 text-foreground"
              placeholder="Enter your full name"
              placeholderTextColor="#666"
              value={formData.fullName}
              onChangeText={(value) => handleChange("fullName", value)}
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-foreground mb-1">
              Email *
            </Text>
            <TextInput
              className="bg-input rounded-md px-4 py-2 text-foreground"
              placeholder="Enter your email"
              placeholderTextColor="#666"
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-foreground mb-1">
              Password *
            </Text>
            <TextInput
              className="bg-input rounded-md px-4 py-2 text-foreground"
              placeholder="Enter your password"
              placeholderTextColor="#666"
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
              secureTextEntry
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-foreground mb-1">
              Phone Number
            </Text>
            <TextInput
              className="bg-input rounded-md px-4 py-2 text-foreground"
              placeholder="Enter your phone number"
              placeholderTextColor="#666"
              value={formData.phone}
              onChangeText={(value) => handleChange("phone", value)}
              keyboardType="phone-pad"
            />
          </View>

          <CustomPicker
            label="District"
            value={formData.district}
            onValueChange={(value) => {
              handleChange("district", value);
              if (value) {
                fetchMunicipalities(value);
                handleChange("municipality", "");
                handleChange("wardNumber", "");
              }
            }}
            items={districts.map((district) => ({
              label: district.name,
              value: district.id,
            }))}
            placeholder="Select District"
            required
          />

          {formData.district && (
            <CustomPicker
              label="Municipality"
              value={formData.municipality}
              onValueChange={(value) => {
                handleChange("municipality", value);
                if (value && formData.district) {
                  fetchWards(formData.district, value);
                  handleChange("wardNumber", "");
                }
              }}
              items={municipalities.map((municipality) => ({
                label: municipality.name,
                value: municipality.id,
              }))}
              placeholder="Select Municipality"
              required
            />
          )}

          {formData.municipality && (
            <CustomPicker
              label="Ward Number"
              value={formData.wardNumber}
              onValueChange={(value) => handleChange("wardNumber", value)}
              items={wards.map((ward) => ({
                label: `Ward ${ward}`,
                value: ward.toString(),
              }))}
              placeholder="Select Ward"
              required
            />
          )}

          <Button
            className="bg-primary py-3 rounded-md"
            onPress={handleRegister}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold">
              {loading ? "Creating account..." : "Register"}
            </Text>
          </Button>

          <Button onPress={() => router.push("/login")} className="mt-4">
            <Text className="text-primary text-center">
              Already have an account? Login
            </Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
