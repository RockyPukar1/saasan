import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import {
  Eye,
  EyeOff,
  Shield,
  Users,
  Star,
  ArrowRight,
  ChevronRight,
  Check,
} from "lucide-react-native";
import { Card, CardContent } from "~/components/ui/card";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isRequired: boolean;
  options?: Array<{
    id: string;
    label: string;
    description: string;
    icon: string;
  }>;
}

interface LightweightOnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

interface OnboardingData {
  browsingMode: "anonymous" | "registered";
  interests: string[];
  location?: string;
  notifications: boolean;
  privacyLevel: "public" | "private" | "anonymous";
}

export const LightweightOnboarding: React.FC<LightweightOnboardingProps> = ({
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    browsingMode: "anonymous",
    interests: [],
    notifications: true,
    privacyLevel: "anonymous",
  });

  const onboardingSteps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to Saasan! 🚀",
      description:
        "Fight corruption, track politicians, and make Nepal transparent. You can browse anonymously or create an account.",
      icon: <Shield className="text-blue-500" size={48} />,
      isRequired: false,
    },
    {
      id: "browsing_mode",
      title: "How would you like to use Saasan?",
      description: "Choose your preferred browsing mode:",
      icon: <Eye className="text-green-500" size={48} />,
      isRequired: true,
      options: [
        {
          id: "anonymous",
          label: "Browse Anonymously",
          description: "View reports and polls without creating an account",
          icon: "👁️",
        },
        {
          id: "registered",
          label: "Create Account",
          description:
            "Submit reports, vote in polls, and track your contributions",
          icon: "👤",
        },
      ],
    },
    {
      id: "interests",
      title: "What interests you most?",
      description: "Select topics you care about (optional):",
      icon: <Star className="text-yellow-500" size={48} />,
      isRequired: false,
      options: [
        {
          id: "corruption_reports",
          label: "Corruption Reports",
          description: "Stay updated on corruption cases",
          icon: "🚨",
        },
        {
          id: "politician_tracking",
          label: "Politician Tracking",
          description: "Monitor politician performance",
          icon: "👤",
        },
        {
          id: "public_polls",
          label: "Public Polls",
          description: "Participate in citizen polls",
          icon: "📊",
        },
        {
          id: "government_updates",
          label: "Government Updates",
          description: "Get latest government news",
          icon: "🏛️",
        },
        {
          id: "election_news",
          label: "Election News",
          description: "Stay informed about elections",
          icon: "🗳️",
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy & Notifications",
      description: "Control your privacy and notification preferences:",
      icon: <Shield className="text-purple-500" size={48} />,
      isRequired: false,
    },
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(onboardingData);
    }
  };

  const handleSkip = () => {
    if (onboardingSteps[currentStep].isRequired) {
      Alert.alert(
        "Required Step",
        "This step is required to continue. Please make a selection.",
        [{ text: "OK" }]
      );
    } else {
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete(onboardingData);
      }
    }
  };

  const handleOptionSelect = (stepId: string, optionId: string) => {
    switch (stepId) {
      case "browsing_mode":
        setOnboardingData((prev) => ({
          ...prev,
          browsingMode: optionId as "anonymous" | "registered",
        }));
        break;
      case "interests":
        setOnboardingData((prev) => ({
          ...prev,
          interests: prev.interests.includes(optionId)
            ? prev.interests.filter((id) => id !== optionId)
            : [...prev.interests, optionId],
        }));
        break;
    }
  };

  const handlePrivacyChange = (setting: string, value: boolean | string) => {
    setOnboardingData((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const renderStepContent = () => {
    const step = onboardingSteps[currentStep];

    switch (step.id) {
      case "welcome":
        return (
          <View className="items-center space-y-4">
            {step.icon}
            <Text className="text-lg font-bold text-gray-800 text-center">
              {step.title}
            </Text>
            <Text className="text-gray-600 text-center">
              {step.description}
            </Text>

            <Card className="w-full mt-4">
              <CardContent className="p-4">
                <Text className="font-bold text-gray-800 mb-2">
                  🎯 What you can do:
                </Text>
                <View className="space-y-2">
                  <View className="flex-row items-center">
                    <Text className="text-green-500 mr-2">✅</Text>
                    <Text className="text-sm text-gray-700">
                      Browse corruption reports anonymously
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-green-500 mr-2">✅</Text>
                    <Text className="text-sm text-gray-700">
                      Vote in public polls
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-green-500 mr-2">✅</Text>
                    <Text className="text-sm text-gray-700">
                      Track politician performance
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-green-500 mr-2">✅</Text>
                    <Text className="text-sm text-gray-700">
                      Share viral content
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </View>
        );

      case "browsing_mode":
        return (
          <View className="space-y-4">
            {step.icon}
            <Text className="text-lg font-bold text-gray-800 text-center">
              {step.title}
            </Text>
            <Text className="text-gray-600 text-center">
              {step.description}
            </Text>

            <View className="space-y-3">
              {step.options?.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleOptionSelect(step.id, option.id)}
                  className={`p-4 rounded-lg border ${
                    onboardingData.browsingMode === option.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <View className="flex-row items-center">
                    <Text className="text-2xl mr-3">{option.icon}</Text>
                    <View className="flex-1">
                      <Text className="font-bold text-gray-800">
                        {option.label}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {option.description}
                      </Text>
                    </View>
                    {onboardingData.browsingMode === option.id && (
                      <Check className="text-blue-500" size={20} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case "interests":
        return (
          <View className="space-y-4">
            {step.icon}
            <Text className="text-lg font-bold text-gray-800 text-center">
              {step.title}
            </Text>
            <Text className="text-gray-600 text-center">
              {step.description}
            </Text>

            <View className="space-y-3">
              {step.options?.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleOptionSelect(step.id, option.id)}
                  className={`p-3 rounded-lg border ${
                    onboardingData.interests.includes(option.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <View className="flex-row items-center">
                    <Text className="text-xl mr-3">{option.icon}</Text>
                    <View className="flex-1">
                      <Text className="font-medium text-gray-800">
                        {option.label}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {option.description}
                      </Text>
                    </View>
                    {onboardingData.interests.includes(option.id) && (
                      <Check className="text-blue-500" size={16} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-xs text-gray-500 text-center">
              You can change these preferences later in settings
            </Text>
          </View>
        );

      case "privacy":
        return (
          <View className="space-y-4">
            {step.icon}
            <Text className="text-lg font-bold text-gray-800 text-center">
              {step.title}
            </Text>
            <Text className="text-gray-600 text-center">
              {step.description}
            </Text>

            <View className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="font-medium text-gray-800">
                        🔔 Push Notifications
                      </Text>
                      <Text className="text-sm text-gray-600">
                        Get updates on corruption reports and polls
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        handlePrivacyChange(
                          "notifications",
                          !onboardingData.notifications
                        )
                      }
                      className={`w-12 h-6 rounded-full ${
                        onboardingData.notifications
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <View
                        className={`w-5 h-5 rounded-full bg-white mt-0.5 ${
                          onboardingData.notifications ? "ml-6" : "ml-0.5"
                        }`}
                      />
                    </TouchableOpacity>
                  </View>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <Text className="font-medium text-gray-800 mb-3">
                    🔒 Privacy Level
                  </Text>
                  <View className="space-y-2">
                    {[
                      {
                        id: "anonymous",
                        label: "Anonymous",
                        description: "Maximum privacy, no personal data",
                      },
                      {
                        id: "private",
                        label: "Private",
                        description: "Limited personal data, secure",
                      },
                      {
                        id: "public",
                        label: "Public",
                        description: "Visible to community, more features",
                      },
                    ].map((option) => (
                      <TouchableOpacity
                        key={option.id}
                        onPress={() =>
                          handlePrivacyChange("privacyLevel", option.id)
                        }
                        className={`p-3 rounded-lg border ${
                          onboardingData.privacyLevel === option.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <View className="flex-row items-center">
                          <View className="flex-1">
                            <Text className="font-medium text-gray-800">
                              {option.label}
                            </Text>
                            <Text className="text-sm text-gray-600">
                              {option.description}
                            </Text>
                          </View>
                          {onboardingData.privacyLevel === option.id && (
                            <Check className="text-blue-500" size={16} />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </CardContent>
              </Card>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    const step = onboardingSteps[currentStep];
    if (!step.isRequired) return true;

    switch (step.id) {
      case "browsing_mode":
        return onboardingData.browsingMode !== null;
      default:
        return true;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-gray-800">Setup Saasan</Text>
          <TouchableOpacity onPress={onSkip}>
            <ChevronRight className="text-gray-500" size={20} />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View className="mt-3 bg-gray-200 rounded-full h-2">
          <View
            className="bg-blue-500 h-2 rounded-full"
            style={{
              width: `${((currentStep + 1) / onboardingSteps.length) * 100}%`,
            }}
          />
        </View>
        <Text className="text-xs text-gray-500 mt-1">
          Step {currentStep + 1} of {onboardingSteps.length}
        </Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        <View className="space-y-6">{renderStepContent()}</View>
      </ScrollView>

      {/* Footer */}
      <View className="bg-white p-4 border-t border-gray-200">
        <View className="flex-row space-x-3">
          {!onboardingSteps[currentStep].isRequired && (
            <TouchableOpacity
              onPress={handleSkip}
              className="flex-1 py-3 rounded-lg border border-gray-300"
            >
              <Text className="text-gray-700 font-medium text-center">
                Skip
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleNext}
            disabled={!canProceed()}
            className={`flex-1 py-3 rounded-lg ${
              canProceed() ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <View className="flex-row items-center justify-center">
              <Text
                className={`font-medium ${
                  canProceed() ? "text-white" : "text-gray-500"
                }`}
              >
                {currentStep === onboardingSteps.length - 1
                  ? "Get Started"
                  : "Continue"}
              </Text>
              <ArrowRight
                className={`ml-2 ${
                  canProceed() ? "text-white" : "text-gray-500"
                }`}
                size={16}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
