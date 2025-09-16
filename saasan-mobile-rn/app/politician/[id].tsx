// src/screens/politician/[id].tsx
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  Phone,
  Mail,
  Globe,
  Share,
  Flag,
  Award,
  DollarSign,
  FileText,
  MessageCircle,
} from "lucide-react-native";

interface Promise {
  id: string;
  title: string;
  description: string;
  status: "fulfilled" | "ongoing" | "broken";
  dueDate: string;
  progress: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: "policy" | "development" | "social" | "economic";
}

interface Politician {
  id: string;
  name: string;
  position: string;
  level: "ward" | "municipality" | "district" | "province" | "federal";
  party: string;
  constituency: string;
  rating: number;
  totalVotes: number;
  promisesFulfilled: number;
  totalPromises: number;
  avatar?: string;
  trends: "up" | "down" | "stable";
  bio: string;
  experience: string;
  education: string;
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  socialMedia: {
    facebook?: string;
    twitter?: string;
  };
  budget: {
    allocated: number;
    spent: number;
  };
  promises: Promise[];
  achievements: Achievement[];
  joinedDate: string;
}

const PoliticianDetailScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "promises" | "achievements" | "contact"
  >("overview");

  // Mock data - in real app, this would come from API based on [id]
  const politician: Politician = {
    id: "1",
    name: "KP Sharma Oli",
    position: "Prime Minister",
    level: "federal",
    party: "CPN-UML",
    constituency: "Jhapa-5",
    rating: 3.2,
    totalVotes: 45234,
    promisesFulfilled: 12,
    totalPromises: 45,
    trends: "down",
    bio: "Seasoned politician with over 30 years of experience in Nepali politics. Former Prime Minister with focus on economic development and infrastructure.",
    experience: "30+ years in politics, Former PM (2015-2016, 2018-2021)",
    education: "Bachelor's in Political Science, Tribhuvan University",
    contact: {
      phone: "+977-1-4211000",
      email: "pm@opmcm.gov.np",
      website: "www.kpsharmaoli.com.np",
    },
    socialMedia: {
      facebook: "kpsharmaoli.official",
      twitter: "@kpsharmaoli",
    },
    budget: {
      allocated: 50000000,
      spent: 32000000,
    },
    joinedDate: "2018-02-15",
    promises: [
      {
        id: "1",
        title: "Complete Melamchi Water Project",
        description: "Ensure clean drinking water supply to Kathmandu Valley",
        status: "fulfilled",
        dueDate: "2021-12-31",
        progress: 100,
      },
      {
        id: "2",
        title: "Build 1000km of Roads",
        description: "Construct strategic roads connecting rural areas",
        status: "ongoing",
        dueDate: "2024-12-31",
        progress: 65,
      },
      {
        id: "3",
        title: "Create 100,000 Jobs",
        description: "Generate employment opportunities for youth",
        status: "broken",
        dueDate: "2023-12-31",
        progress: 25,
      },
    ],
    achievements: [
      {
        id: "1",
        title: "COVID-19 Response Program",
        description:
          "Successfully managed pandemic response and vaccination drive",
        date: "2021-03-15",
        category: "social",
      },
      {
        id: "2",
        title: "Economic Recovery Package",
        description: "Launched Rs. 50 billion economic stimulus package",
        date: "2020-07-20",
        category: "economic",
      },
    ],
  };

  const getPartyColor = (party: string) => {
    const colors: { [key: string]: string } = {
      "CPN-UML": "bg-red-500",
      "Nepali Congress": "bg-green-500",
      RSP: "bg-purple-500",
      "CPN-MC": "bg-yellow-500",
    };
    return colors[party] || "bg-gray-500";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="text-green-600" size={20} />;
      case "down":
        return <TrendingDown className="text-red-600" size={20} />;
      default:
        return <Clock className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "fulfilled":
        return "bg-green-500";
      case "ongoing":
        return "bg-yellow-500";
      case "broken":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "policy":
        return <FileText className="text-blue-600" size={16} />;
      case "development":
        return <Award className="text-green-600" size={16} />;
      case "social":
        return <Users className="text-purple-600" size={16} />;
      case "economic":
        return <DollarSign className="text-yellow-600" size={16} />;
      default:
        return <Award className="text-gray-600" size={16} />;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-5 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 p-2 -ml-2"
          >
            <ArrowLeft className="text-gray-600" size={24} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">
              {politician.name}
            </Text>
            <Text className="text-gray-600 text-sm">{politician.position}</Text>
          </View>
          <TouchableOpacity className="p-2">
            <Share className="text-gray-600" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Profile Card */}
        <View className="px-4 py-4">
          <Card>
            <CardContent className="p-4">
              <View className="flex-row items-start">
                <View className="w-20 h-20 bg-gray-300 rounded-full mr-4 items-center justify-center">
                  <Users className="text-gray-600" size={32} />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-gray-800 mb-1">
                    {politician.name}
                  </Text>
                  <Text className="text-gray-600 mb-2">
                    {politician.position}
                  </Text>

                  <View className="flex-row items-center mb-2">
                    <View
                      className={`px-3 py-1 rounded-full ${getPartyColor(
                        politician.party
                      )} mr-3`}
                    >
                      <Text className="text-white text-xs font-bold">
                        {politician.party}
                      </Text>
                    </View>
                    {getTrendIcon(politician.trends)}
                  </View>

                  <View className="flex-row items-center">
                    <MapPin className="text-gray-500" size={14} />
                    <Text className="text-gray-500 text-sm ml-1">
                      {politician.constituency}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Rating & Stats */}
              <View className="flex-row justify-around mt-4 pt-4 border-t border-gray-200">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-gray-800">
                    {politician.rating}
                  </Text>
                  <Text className="text-gray-600 text-xs">Rating</Text>
                  <Star
                    className="text-yellow-500 mt-1"
                    size={16}
                    fill="#EAB308"
                  />
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-gray-800">
                    {(politician.totalVotes / 1000).toFixed(0)}K
                  </Text>
                  <Text className="text-gray-600 text-xs">Votes</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-green-600">
                    {Math.round(
                      (politician.promisesFulfilled /
                        politician.totalPromises) *
                        100
                    )}
                    %
                  </Text>
                  <Text className="text-gray-600 text-xs">Promises</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Tab Navigation */}
        <View className="bg-white border-b border-gray-200">
          <View className="flex-row py-2 px-2">
            {[
              { id: "overview", name: "Overview" },
              { id: "promises", name: "Promises" },
              { id: "achievements", name: "Achievements" },
              { id: "contact", name: "Contact" },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id as any)}
                className={`flex-1 mx-1 px-2 py-3 rounded-lg items-center ${
                  activeTab === tab.id
                    ? "bg-red-100 border-b-2 border-red-600"
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-sm font-medium text-center ${
                    activeTab === tab.id ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  {tab.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tab Content */}
        <View className="px-4 py-4">
          {activeTab === "overview" && (
            <View>
              {/* Bio */}
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Biography</CardTitle>
                </CardHeader>
                <CardContent>
                  <Text className="text-gray-700 leading-6">
                    {politician.bio}
                  </Text>

                  <View className="mt-4 space-y-2">
                    <View className="flex-row">
                      <Text className="font-medium text-gray-800 w-24">
                        Experience:
                      </Text>
                      <Text className="text-gray-700 flex-1">
                        {politician.experience}
                      </Text>
                    </View>
                    <View className="flex-row">
                      <Text className="font-medium text-gray-800 w-24">
                        Education:
                      </Text>
                      <Text className="text-gray-700 flex-1">
                        {politician.education}
                      </Text>
                    </View>
                    <View className="flex-row">
                      <Text className="font-medium text-gray-800 w-24">
                        Joined:
                      </Text>
                      <Text className="text-gray-700 flex-1">
                        {new Date(politician.joinedDate).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </Card>

              {/* Budget Utilization */}
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Budget Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-gray-600">
                      Rs. {(politician.budget.spent / 1000000).toFixed(0)}M
                      spent of Rs.{" "}
                      {(politician.budget.allocated / 1000000).toFixed(0)}M
                      allocated
                    </Text>
                    <Text className="font-bold text-gray-800">
                      {Math.round(
                        (politician.budget.spent /
                          politician.budget.allocated) *
                          100
                      )}
                      %
                    </Text>
                  </View>
                  <View className="bg-gray-300 h-3 rounded-full">
                    <View
                      className="bg-blue-500 h-3 rounded-full"
                      style={{
                        width: `${
                          (politician.budget.spent /
                            politician.budget.allocated) *
                          100
                        }%`,
                      }}
                    />
                  </View>
                </CardContent>
              </Card>
            </View>
          )}

          {activeTab === "promises" && (
            <View>
              {politician.promises.map((promise) => (
                <Card key={promise.id} className="mb-4">
                  <CardContent className="p-4">
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="text-lg font-bold text-gray-800 flex-1 mr-2">
                        {promise.title}
                      </Text>
                      <View
                        className={`px-2 py-1 rounded-full ${getStatusColor(
                          promise.status
                        )}`}
                      >
                        <Text className="text-white text-xs font-bold uppercase">
                          {promise.status}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-gray-600 text-sm mb-3">
                      {promise.description}
                    </Text>

                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-gray-600 text-sm">
                        Due: {new Date(promise.dueDate).toLocaleDateString()}
                      </Text>
                      <Text className="font-bold text-gray-800">
                        {promise.progress}%
                      </Text>
                    </View>

                    <View className="bg-gray-300 h-2 rounded-full">
                      <View
                        className={`h-2 rounded-full ${
                          promise.status === "fulfilled"
                            ? "bg-green-500"
                            : promise.status === "ongoing"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${promise.progress}%` }}
                      />
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          )}

          {activeTab === "achievements" && (
            <View>
              {politician.achievements.map((achievement) => (
                <Card key={achievement.id} className="mb-4">
                  <CardContent className="p-4">
                    <View className="flex-row items-start">
                      <View className="mr-3 mt-1">
                        {getCategoryIcon(achievement.category)}
                      </View>
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800 mb-1">
                          {achievement.title}
                        </Text>
                        <Text className="text-gray-600 text-sm mb-2">
                          {achievement.description}
                        </Text>
                        <View className="flex-row items-center">
                          <Calendar className="text-gray-500" size={12} />
                          <Text className="text-gray-500 text-xs ml-1">
                            {new Date(achievement.date).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          )}

          {activeTab === "contact" && (
            <View>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <View className="space-y-4">
                    {politician.contact.phone && (
                      <TouchableOpacity className="flex-row items-center p-3 bg-gray-50 rounded-lg">
                        <Phone className="text-blue-600 mr-3" size={20} />
                        <Text className="text-gray-800">
                          {politician.contact.phone}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {politician.contact.email && (
                      <TouchableOpacity className="flex-row items-center p-3 bg-gray-50 rounded-lg">
                        <Mail className="text-green-600 mr-3" size={20} />
                        <Text className="text-gray-800">
                          {politician.contact.email}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {politician.contact.website && (
                      <TouchableOpacity className="flex-row items-center p-3 bg-gray-50 rounded-lg">
                        <Globe className="text-purple-600 mr-3" size={20} />
                        <Text className="text-gray-800">
                          {politician.contact.website}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </CardContent>
              </Card>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="px-4 pb-6">
          <View className="flex-row space-x-3">
            <Button className="flex-1 bg-blue-600">
              <View className="flex-row items-center">
                <Star className="text-white mr-2" size={16} />
                <Text className="text-white font-medium">Rate</Text>
              </View>
            </Button>
            <Button className="flex-1 bg-green-600">
              <View className="flex-row items-center">
                <MessageCircle className="text-white mr-2" size={16} />
                <Text className="text-white font-medium">Message</Text>
              </View>
            </Button>
            <Button className="flex-1 bg-red-600">
              <View className="flex-row items-center">
                <Flag className="text-white mr-2" size={16} />
                <Text className="text-white font-medium">Report</Text>
              </View>
            </Button>
          </View>
        </View>

        {/* Bottom padding for tab bar */}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
};

export default PoliticianDetailScreen;
