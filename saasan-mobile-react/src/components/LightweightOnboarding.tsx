import React, { useState } from "react";
import {
  Eye,
  Shield,
  Star,
  ArrowRight,
  ChevronRight,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";

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
      // Alert.alert(
      //   "Required Step",
      //   "This step is required to continue. Please make a selection.",
      //   [{ text: "OK" }]
      // );
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
          <div className="items-center space-y-4">
            {step.icon}
            <p className="text-lg font-bold text-gray-800 text-center">
              {step.title}
            </p>
            <p className="text-gray-600 text-center">
              {step.description}
            </p>

            <Card className="w-full mt-4">
              <CardContent className="p-4">
                <p className="font-bold text-gray-800 mb-2">
                  🎯 What you can do:
                </p>
                <div className="space-y-2">
                  <div className="flex-row items-center">
                    <p className="text-green-500 mr-2">✅</p>
                    <p className="text-sm text-gray-700">
                      Browse corruption reports anonymously
                    </p>
                  </div>
                  <div className="flex-row items-center">
                    <p className="text-green-500 mr-2">✅</p>
                    <p className="text-sm text-gray-700">
                      Vote in public polls
                    </p>
                  </div>
                  <div className="flex-row items-center">
                    <p className="text-green-500 mr-2">✅</p>
                    <p className="text-sm text-gray-700">
                      Track politician performance
                    </p>
                  </div>
                  <div className="flex-row items-center">
                    <p className="text-green-500 mr-2">✅</p>
                    <p className="text-sm text-gray-700">
                      Share viral content
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "browsing_mode":
        return (
          <div className="space-y-4">
            {step.icon}
            <p className="text-lg font-bold text-gray-800 text-center">
              {step.title}
            </p>
            <p className="text-gray-600 text-center">
              {step.description}
            </p>

            <div className="space-y-3">
              {step.options?.map((option) => (
                <Button
                  key={option.id}
                  onClick={() => handleOptionSelect(step.id, option.id)}
                  className={`p-4 rounded-lg border ${
                    onboardingData.browsingMode === option.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex-row items-center">
                    <p className="text-2xl mr-3">{option.icon}</p>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">
                        {option.label}
                      </p>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                    {onboardingData.browsingMode === option.id && (
                      <Check className="text-blue-500" size={20} />
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case "interests":
        return (
          <div className="space-y-4">
            {step.icon}
            <p className="text-lg font-bold text-gray-800 text-center">
              {step.title}
            </p>
            <p className="text-gray-600 text-center">
              {step.description}
            </p>

            <div className="space-y-3">
              {step.options?.map((option) => (
                <Button
                  key={option.id}
                  onClick={() => handleOptionSelect(step.id, option.id)}
                  className={`p-3 rounded-lg border ${
                    onboardingData.interests.includes(option.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex-row items-center">
                    <p className="text-xl mr-3">{option.icon}</p>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {option.label}
                      </p>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                    {onboardingData.interests.includes(option.id) && (
                      <Check className="text-blue-500" size={16} />
                    )}
                  </div>
                </Button>
              ))}
            </div>

            <p className="text-xs text-gray-500 text-center">
              You can change these preferences later in settings
            </p>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-4">
            {step.icon}
            <p className="text-lg font-bold text-gray-800 text-center">
              {step.title}
            </p>
            <p className="text-gray-600 text-center">
              {step.description}
            </p>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex-row items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        🔔 Push Notifications
                      </p>
                      <p className="text-sm text-gray-600">
                        Get updates on corruption reports and polls
                      </p>
                    </div>
                    <Button
                      onClick={() =>
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
                      <div
                        className={`w-5 h-5 rounded-full bg-white mt-0.5 ${
                          onboardingData.notifications ? "ml-6" : "ml-0.5"
                        }`}
                      />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="font-medium text-gray-800 mb-3">
                    🔒 Privacy Level
                  </p>
                  <div className="space-y-2">
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
                      <Button
                        key={option.id}
                        onClick={() =>
                          handlePrivacyChange("privacyLevel", option.id)
                        }
                        className={`p-3 rounded-lg border ${
                          onboardingData.privacyLevel === option.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex-row items-center">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {option.label}
                            </p>
                            <p className="text-sm text-gray-600">
                              {option.description}
                            </p>
                          </div>
                          {onboardingData.privacyLevel === option.id && (
                            <Check className="text-blue-500" size={16} />
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex-row items-center justify-between">
          <p className="text-lg font-bold text-gray-800">Setup Saasan</p>
          <Button onClick={onSkip}>
            <ChevronRight className="text-gray-500" size={20} />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{
              width: `${((currentStep + 1) / onboardingSteps.length) * 100}%`,
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Step {currentStep + 1} of {onboardingSteps.length}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="space-y-6">{renderStepContent()}</div>
      </div>

      {/* Footer */}
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="flex-row space-x-3">
          {!onboardingSteps[currentStep].isRequired && (
            <Button
              onClick={handleSkip}
              className="flex-1 py-3 rounded-lg border border-gray-300"
            >
              <p className="text-gray-700 font-medium text-center">
                Skip
              </p>
            </Button>
          )}

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex-1 py-3 rounded-lg ${
              canProceed() ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <div className="flex-row items-center justify-center">
              <p
                className={`font-medium ${
                  canProceed() ? "text-white" : "text-gray-500"
                }`}
              >
                {currentStep === onboardingSteps.length - 1
                  ? "Get Started"
                  : "Continue"}
              </p>
              <ArrowRight
                className={`ml-2 ${
                  canProceed() ? "text-white" : "text-gray-500"
                }`}
                size={16}
              />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
