// src/screens/PoliticiansScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Search,
  MapPin,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react-native";
import { useRouter } from "expo-router";

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
}

interface GovernmentLevel {
  id: string;
  name: string;
  description: string;
  count: number;
}

const PoliticiansScreen = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>("federal");
  const [searchQuery, setSearchQuery] = useState("");

  const governmentLevels: GovernmentLevel[] = [
    {
      id: "federal",
      name: "Federal",
      description: "Prime Minister, Ministers",
      count: 89,
    },
    {
      id: "province",
      name: "Province",
      description: "Chief Ministers, Provincial MPs",
      count: 550,
    },
    {
      id: "district",
      name: "District",
      description: "District Coordinators",
      count: 77,
    },
    {
      id: "municipality",
      name: "Local",
      description: "Mayors, Deputy Mayors",
      count: 753,
    },
    { id: "ward", name: "Ward", description: "Ward Chairpersons", count: 6743 },
  ];

  const mockPoliticians: Politician[] = [
    {
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
    },
    {
      id: "2",
      name: "Sher Bahadur Deuba",
      position: "Former PM",
      level: "federal",
      party: "Nepali Congress",
      constituency: "Dadeldhura-1",
      rating: 2.8,
      totalVotes: 38291,
      promisesFulfilled: 8,
      totalPromises: 32,
      trends: "stable",
    },
    {
      id: "3",
      name: "Rabi Lamichhane",
      position: "Party President",
      level: "federal",
      party: "RSP",
      constituency: "Chitwan-2",
      rating: 4.1,
      totalVotes: 52341,
      promisesFulfilled: 18,
      totalPromises: 25,
      trends: "up",
    },
  ];

  const filteredPoliticians = mockPoliticians.filter(
    (politician) =>
      politician.level === selectedLevel &&
      politician.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-14 pb-4 px-5 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">
          Political Leaders
        </Text>
        <Text className="text-gray-600 text-sm mt-1">
          Track performance & promises
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search className="text-gray-500" size={20} />
          <TextInput
            placeholder="Search politicians..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-gray-800"
          />
        </View>
      </View>

      <View className="bg-white border-b border-gray-200">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-2"
        >
          <View className="flex-row py-2">
            {governmentLevels.map((level) => (
              <TouchableOpacity
                key={level.id}
                onPress={() => setSelectedLevel(level.id)}
                className={`mx-1 px-3 py-2 rounded-lg ${
                  selectedLevel === level.id
                    ? "bg-red-100 border-b-2 border-red-600"
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-sm font-medium text-center ${
                    selectedLevel === level.id
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {level.name}
                </Text>
                <Text
                  className={`text-xs text-center mt-0.5 ${
                    selectedLevel === level.id
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {level.count}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      {/* Politicians List */}
      <ScrollView className="flex-1 px-4 py-4">
        {filteredPoliticians.length > 0 ? (
          filteredPoliticians.map((politician) => (
            <PoliticianCard key={politician.id} politician={politician} />
          ))
        ) : (
          <View className="flex-1 justify-center items-center py-20">
            <Users className="text-gray-400" size={64} />
            <Text className="text-gray-600 text-lg font-medium mt-4">
              No politicians found
            </Text>
            <Text className="text-gray-500 text-sm text-center mt-2">
              Try adjusting your search or government level filter
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity className="absolute bottom-6 right-6 bg-red-600 w-14 h-14 rounded-full items-center justify-center shadow-lg">
        <Text className="text-white text-2xl">+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PoliticiansScreen;

const PoliticianCard = ({ politician }: { politician: Politician }) => {
  const router = useRouter();
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
        return <TrendingUp className="text-green-600" size={16} />;
      case "down":
        return <TrendingDown className="text-red-600" size={16} />;
      default:
        return <Clock className="text-gray-600" size={16} />;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/politician/${politician.id}`)}
    >
      <Card className="mb-4">
        <CardContent className="p-4">
          {/* Header */}
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800">
                {politician.name}
              </Text>
              <Text className="text-gray-600 text-sm">
                {politician.position}
              </Text>
              <View className="flex-row items-center mt-1">
                <MapPin className="text-gray-500" size={12} />
                <Text className="text-gray-500 text-xs ml-1">
                  {politician.constituency}
                </Text>
              </View>
            </View>

            <View className="items-end">
              <View
                className={`px-2 py-1 rounded-full ${getPartyColor(
                  politician.party
                )}`}
              >
                <Text className="text-white text-xs font-bold">
                  {politician.party}
                </Text>
              </View>
              <View className="flex-row items-center mt-2">
                {getTrendIcon(politician.trends)}
              </View>
            </View>
          </View>

          {/* Rating */}
          <View className="flex-row items-center mb-3">
            <Star className="text-yellow-500" size={16} fill="#EAB308" />
            <Text className="text-gray-800 font-bold ml-1">
              {politician.rating}
            </Text>
            <Text className="text-gray-500 text-sm ml-1">
              ({politician.totalVotes.toLocaleString()} votes)
            </Text>
          </View>

          {/* Promise Tracker */}
          <View className="bg-gray-50 p-3 rounded-lg mb-3">
            <Text className="text-gray-700 font-medium mb-2">
              Promise Tracker
            </Text>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-600">
                {politician.promisesFulfilled} of {politician.totalPromises}{" "}
                fulfilled
              </Text>
              <Text className="text-sm font-bold text-gray-800">
                {Math.round(
                  (politician.promisesFulfilled / politician.totalPromises) *
                    100
                )}
                %
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="bg-gray-300 h-2 rounded-full">
              <View
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${
                    (politician.promisesFulfilled / politician.totalPromises) *
                    100
                  }%`,
                }}
              />
            </View>

            {/* Status Icons */}
            <View className="flex-row justify-between mt-2">
              <View className="flex-row items-center">
                <CheckCircle className="text-green-600" size={14} />
                <Text className="text-xs text-gray-600 ml-1">
                  {politician.promisesFulfilled} Kept
                </Text>
              </View>
              <View className="flex-row items-center">
                <XCircle className="text-red-600" size={14} />
                <Text className="text-xs text-gray-600 ml-1">
                  {politician.totalPromises - politician.promisesFulfilled}{" "}
                  Pending
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-2">
            <Button className="flex-1 bg-blue-600">
              <Text className="text-white font-medium">Rate Performance</Text>
            </Button>
            <Button className="flex-1 bg-gray-200">
              <Text className="text-gray-700 font-medium">View Promises</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};
