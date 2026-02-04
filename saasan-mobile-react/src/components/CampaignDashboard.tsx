import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Vote,
  TrendingUp,
  MapPin,
  Calendar,
  Heart,
  Flag,
  BarChart3,
  UserCheck,
  UserX,
  HelpCircle,
} from "lucide-react";
import { useBilingual } from "@/hooks/useBilingual";
import {
  campaignApi,
  type CampaignDashboard as CampaignDashboardData,
} from "@/services/campaignApi";

export default function CampaignDashboard() {
  const { language, getText, getLanguageName } = useBilingual();
  const [dashboardData, setDashboardData] =
    useState<CampaignDashboardData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCampaignData = async () => {
    try {
      setLoading(true);
      const data = await campaignApi.getCampaignDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error("Error loading campaign data:", error);
      // Alert.alert(
      //   getText("त्रुटि", "Error"),
      //   getText("अभियान डेटा लोड गर्न असफल।", "Failed to load campaign data.")
      // );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaignData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCampaignData();
    setRefreshing(false);
  };

  const handleRegisterVoter = () => {
    // Alert.alert(
    //   getText("मतदाता दर्ता", "Voter Registration"),
    //   getText(
    //     "तपाईंले मतदाता दर्ता गर्न चाहनुहुन्छ?",
    //     "Do you want to register as a voter?"
    //   ),
    //   [
    //     { text: getText("रद्द गर्नुहोस्", "Cancel"), style: "cancel" },
    //     {
    //       text: getText("दर्ता गर्नुहोस्", "Register"),
    //       onPress: () => {
    //         // Navigate to registration form
    //         console.log("Navigate to voter registration");
    //       },
    //     },
    //   ]
    // );
  };

  const handleTakeSurvey = () => {
    // Alert.alert(
    //   getText("सर्वेक्षण लिनुहोस्", "Take Survey"),
    //   getText(
    //     "तपाईंको मतदानको इरादा बारे सर्वेक्षण लिनुहुन्छ?",
    //     "Take a survey about your voting intentions?"
    //   ),
    //   [
    //     { text: getText("रद्द गर्नुहोस्", "Cancel"), style: "cancel" },
    //     {
    //       text: getText("सर्वेक्षण लिनुहोस्", "Take Survey"),
    //       onPress: () => {
    //         // Navigate to survey form
    //         console.log("Navigate to voter survey");
    //       },
    //     },
    //   ]
    // );
  };

  const getReturnIntentIcon = (intent: string) => {
    switch (intent) {
      case "returning":
        return <UserCheck size={16} color="#10b981" />;
      case "unsure":
        return <HelpCircle size={16} color="#f59e0b" />;
      case "cannot":
        return <UserX size={16} color="#ef4444" />;
      default:
        return <Users size={16} color="#6b7280" />;
    }
  };

  const getReturnIntentColor = (intent: string) => {
    switch (intent) {
      case "returning":
        return "bg-green-100 text-green-800";
      case "unsure":
        return "bg-yellow-100 text-yellow-800";
      case "cannot":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex-1 justify-center items-center bg-gray-50">
        <p className="text-gray-600 text-lg">
          {getText("लोड हुँदै...", "Loading...")}
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex-1 bg-gray-50"
    >
      {/* Campaign Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <div className="items-center">
          <Flag size={48} color="white" />
          <p className="text-white text-2xl font-bold mt-2 text-center">
            {dashboardData?.campaignMessage.title ||
              getText(
                "यो छुट्टी मेरो देशका लागि",
                "This Holiday for My Country"
              )}
          </p>
          <p className="text-white/90 text-base mt-1 text-center">
            {dashboardData?.campaignMessage.description ||
              getText(
                "नेपाल फर्केर मतदान गर्नुहोस्। आफ्नो मत दिनुहोस्। आफ्नो देश बनाउनुहोस्।",
                "Return to Nepal to vote. Make your voice heard. Build your country."
              )}
          </p>
          <p className="text-white/80 text-sm mt-1 text-center">
            {getText(
              "२०२७ को निर्वाचनका लागि तयार हुनुहोस्",
              "Get ready for the 2027 elections"
            )}
          </p>
        </div>

        <div className="flex-row gap-3 mt-6">
          <Button
            className="flex-1 bg-white/20 rounded-lg p-3"
            onClick={handleRegisterVoter}
          >
            <Users size={20} color="white" />
            <p className="text-white text-sm font-medium mt-1">
              {getText("दर्ता गर्नुहोस्", "Register")}
            </p>
          </Button>

          <Button
            className="flex-1 bg-white/20 rounded-lg p-3"
            onClick={handleTakeSurvey}
          >
            <BarChart3 size={20} color="white" />
            <p className="text-white text-sm font-medium mt-1">
              {getText("सर्वेक्षण", "Survey")}
            </p>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="p-4">
        <p className="text-xl font-bold text-gray-900 mb-4">
          {getText("अभियान तथ्याङ्क", "Campaign Statistics")}
        </p>

        <div className="flex-row gap-3 mb-4">
          <Card className="flex-1 p-4">
            <div className="items-center">
              <Users size={24} color="#3b82f6" />
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {dashboardData?.analytics.totalRegistrations.toLocaleString() ||
                  "0"}
              </p>
              <p className="text-sm text-gray-600 text-center">
                {getText("कुल दर्ता", "Total Registrations")}
              </p>
            </div>
          </Card>

          <Card className="flex-1 p-4">
            <div className="items-center">
              <BarChart3 size={24} color="#10b981" />
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {dashboardData?.analytics.totalSurveys.toLocaleString() || "0"}
              </p>
              <p className="text-sm text-gray-600 text-center">
                {getText("कुल सर्वेक्षण", "Total Surveys")}
              </p>
            </div>
          </Card>
        </div>

        {/* Return Intent Breakdown */}
        <Card className="p-4 mb-4">
          <p className="text-lg font-semibold text-gray-900 mb-3">
            {getText("फर्कने इरादा", "Return Intent")}
          </p>

          <div className="space-y-2">
            <div className="flex-row items-center justify-between">
              <div className="flex-row items-center gap-2">
                {getReturnIntentIcon("returning")}
                <p className="text-gray-700">
                  {getText("फर्कने", "Returning")}
                </p>
              </div>
              <Badge className={getReturnIntentColor("returning")}>
                {dashboardData?.analytics.returnIntentBreakdown.returning.toLocaleString() ||
                  "0"}
              </Badge>
            </div>

            <div className="flex-row items-center justify-between">
              <div className="flex-row items-center gap-2">
                {getReturnIntentIcon("unsure")}
                <p className="text-gray-700">
                  {getText("अनिश्चित", "Unsure")}
                </p>
              </div>
              <Badge className={getReturnIntentColor("unsure")}>
                {dashboardData?.analytics.returnIntentBreakdown.unsure.toLocaleString() ||
                  "0"}
              </Badge>
            </div>

            <div className="flex-row items-center justify-between">
              <div className="flex-row items-center gap-2">
                {getReturnIntentIcon("cannot")}
                <p className="text-gray-700">
                  {getText("सक्दैन", "Cannot")}
                </p>
              </div>
              <Badge className={getReturnIntentColor("cannot")}>
                {dashboardData?.analytics.returnIntentBreakdown.cannot.toLocaleString() ||
                  "0"}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Voting Intent Breakdown */}
        <Card className="p-4 mb-4">
          <p className="text-lg font-semibold text-gray-900 mb-3">
            {getText("मतदानको इरादा", "Voting Intent")}
          </p>

          <div className="space-y-2">
            <div className="flex-row items-center justify-between">
              <div className="flex-row items-center gap-2">
                <Vote size={16} color="#10b981" />
                <p className="text-gray-700">
                  {getText("मतदान गर्ने", "Will Vote")}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {dashboardData?.analytics.votingIntentBreakdown.will_vote.toLocaleString() ||
                  "0"}
              </Badge>
            </div>

            <div className="flex-row items-center justify-between">
              <div className="flex-row items-center gap-2">
                <HelpCircle size={16} color="#f59e0b" />
                <p className="text-gray-700">
                  {getText("हुनसक्छ", "Might Vote")}
                </p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">
                {dashboardData?.analytics.votingIntentBreakdown.might_vote.toLocaleString() ||
                  "0"}
              </Badge>
            </div>

            <div className="flex-row items-center justify-between">
              <div className="flex-row items-center gap-2">
                <UserX size={16} color="#ef4444" />
                <p className="text-gray-700">
                  {getText("मतदान गर्नेछैन", "Will Not Vote")}
                </p>
              </div>
              <Badge className="bg-red-100 text-red-800">
                {dashboardData?.analytics.votingIntentBreakdown.will_not_vote.toLocaleString() ||
                  "0"}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-4">
          <p className="text-lg font-semibold text-gray-900 mb-3">
            {getText("हालैको गतिविधि", "Recent Activity")}
          </p>

          <div className="space-y-3">
            {dashboardData?.recentRegistrations
              .slice(0, 5)
              .map((registration: any) => (
                <div
                  key={registration.id}
                  className="flex-row items-center gap-3 p-2 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center">
                    <UserCheck size={16} color="#3b82f6" />
                  </div>

                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">
                      Registration #{registration.registrationNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(
                        registration.registrationDate
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <Badge
                    className={
                      registration.verificationStatus === "verified"
                        ? "bg-green-100 text-green-800"
                        : registration.verificationStatus === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {getText(
                      registration.verificationStatus === "verified"
                        ? "प्रमाणित"
                        : registration.verificationStatus === "rejected"
                        ? "अस्वीकृत"
                        : "बाँकी",
                      registration.verificationStatus === "verified"
                        ? "Verified"
                        : registration.verificationStatus === "rejected"
                        ? "Rejected"
                        : "Pending"
                    )}
                  </Badge>
                </div>
              )) || []}

            {dashboardData?.recentSurveys.slice(0, 3).map((survey: any) => (
              <div
                key={survey.id}
                className="flex-row items-center gap-3 p-2 bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full items-center justify-center">
                  <BarChart3 size={16} color="#10b981" />
                </div>

                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    Survey Response
                  </p>
                  <p className="text-sm text-gray-600">
                    {getText(
                      survey.returnIntent === "returning"
                        ? "फर्कने"
                        : survey.returnIntent === "unsure"
                        ? "अनिश्चित"
                        : "सक्दैन",
                      survey.returnIntent === "returning"
                        ? "Returning"
                        : survey.returnIntent === "unsure"
                        ? "Unsure"
                        : "Cannot"
                    )}
                  </p>
                </div>

                <Badge
                  className={
                    survey.returnIntent === "returning"
                      ? "bg-green-100 text-green-800"
                      : survey.returnIntent === "unsure"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {getText(
                    survey.returnIntent === "returning"
                      ? "फर्कने"
                      : survey.returnIntent === "unsure"
                      ? "अनिश्चित"
                      : "सक्दैन",
                    survey.returnIntent === "returning"
                      ? "Returning"
                      : survey.returnIntent === "unsure"
                      ? "Unsure"
                      : "Cannot"
                  )}
                </Badge>
              </div>
            )) || []}
          </div>
        </Card>
      </div>
    </div>
  );
}
