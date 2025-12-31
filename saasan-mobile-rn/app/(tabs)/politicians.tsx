import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
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
import { usePoliticians, Politician } from "~/hooks/usePoliticians";
import Loading from "~/components/Loading";
import Error from "~/components/Error";
import { useLanguage } from "~/contexts/LanguageContext";
import { PageHeader } from "~/components/PageHeader";

const PoliticiansScreen = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    politicians,
    governmentLevels,
    selectedLevel,
    setSelectedLevel,
    loading,
    error,
    refresh,
  } = usePoliticians();

  const filteredPoliticians = useMemo(
    () =>
      politicians.filter((politician) =>
        politician.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [politicians, searchQuery]
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Language Toggle */}
      <PageHeader
        title={t("politicians.title")}
        subtitle={t("politicians.searchLeaders")}
        showLogout={true}
      />

      {/* Search Bar */}
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        {/* Active Filter Indicator */}
        {selectedLevel && (
          <View className="mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Users className="text-red-600 mr-2" size={16} />
              <Text className="text-sm font-medium text-gray-700">
                Showing {selectedLevel} level politicians
              </Text>
            </View>
            <Button
              onPress={() => setSelectedLevel("")}
              className="bg-red-100 px-2 py-1 rounded-full"
            >
              <Text className="text-xs text-red-600 font-medium">Clear</Text>
            </Button>
          </View>
        )}

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

      {/* Government Level Filter */}
      {governmentLevels.length > 0 && (
        <View className="bg-white border-b border-gray-200">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            <View className="flex-row py-2">
              {governmentLevels.map((level) => (
                <Button
                  key={level.id}
                  onPress={() => setSelectedLevel(level.name)}
                  className={`mx-1 px-4 py-3 rounded-lg min-w-[80px] flex-row gap-1 ${
                    selectedLevel === level.name
                      ? "bg-red-100 border-b-2 border-red-600"
                      : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium text-center ${
                      selectedLevel === level.name
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {level.name.charAt(0).toUpperCase() + level.name.slice(1)}
                  </Text>
                  <Text
                    className={`text-ss text-center mt-0.5 ${
                      selectedLevel === level.name
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    ({level.count})
                  </Text>
                </Button>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
      {loading ? (
        <Loading />
      ) : error ? (
        <Error error={error} refresh={refresh} />
      ) : (
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} />
          }
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
        >
          {filteredPoliticians.length > 0 ? (
            filteredPoliticians.map((politician) => (
              <PoliticianCard key={politician.id} politician={politician} />
            ))
          ) : (
            <View className="flex-1 justify-center items-center py-20">
              <Users className="text-gray-400" size={64} />
              <Text className="text-gray-600 text-lg font-medium mt-4">
                {loading ? "Loading politicians..." : "No politicians found"}
              </Text>
              <Text className="text-gray-500 text-sm text-center mt-2">
                {loading
                  ? "Please wait while we fetch the data..."
                  : "Try adjusting your search or government level filter"}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Bottom padding for tab bar */}
      <View className="h-24" />
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
      RPP: "bg-blue-500",
      JSP: "bg-green-600",
      LSP: "bg-yellow-600",
    };
    return colors[party] || "bg-gray-500";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="text-green-600" size={14} />;
      case "down":
        return <TrendingDown className="text-red-600" size={14} />;
      default:
        return <Clock className="text-gray-600" size={14} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Button
      onPress={() => router.push(`/politician/${politician.id}`)}
      className="mb-3"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-3">
          {/* Compact Header */}
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1 mr-2">
              <Text
                className="text-base font-bold text-gray-800 mb-1"
                numberOfLines={1}
              >
                {politician.name}
              </Text>
              {politician.posts.length && (
                <>
                  {politician.posts.map((p) => (
                    <Text
                      className="text-gray-600 text-xs mb-1"
                      numberOfLines={1}
                    >
                      {p.position} ({p.level})
                    </Text>
                  ))}
                </>
              )}

              {politician.constituency && (
                <View className="flex-row items-center">
                  <MapPin className="text-gray-500" size={10} />
                  <Text
                    className="text-gray-500 text-xs ml-1"
                    numberOfLines={1}
                  >
                    {politician.constituency}
                  </Text>
                </View>
              )}
            </View>

            {/* Party Badge - Compact */}
            <View
              className={`px-2 py-1 rounded ${getPartyColor(politician.party)}`}
            >
              <Text className="text-white text-xs font-bold" numberOfLines={1}>
                {politician.party}
              </Text>
            </View>
          </View>

          {/* Compact Rating and Stats */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Star className="text-yellow-500" size={14} fill="#EAB308" />
              <Text className="text-gray-800 font-bold ml-1 text-sm">
                {typeof politician.rating === "number"
                  ? politician.rating.toFixed(1)
                  : "0.0"}
              </Text>
              <Text className="text-gray-500 text-xs ml-1">
                ({politician.totalVotes?.toLocaleString() || 0})
              </Text>
            </View>
            {getTrendIcon(politician.trends)}
          </View>

          {/* Compact Promise Tracker */}
          {politician.totalPromises > 0 && (
            <View className="bg-gray-50 p-2 rounded mb-2">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-gray-700 font-medium text-xs">
                  Promises
                </Text>
                <Text className="text-xs font-bold text-gray-800">
                  {Math.round(
                    (politician.promisesFulfilled / politician.totalPromises) *
                      100
                  )}
                  %
                </Text>
              </View>

              {/* Compact Progress Bar */}
              <View className="bg-gray-300 h-1.5 rounded-full">
                <View
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      (politician.promisesFulfilled /
                        politician.totalPromises) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </View>

              {/* Compact Status */}
              <View className="flex-row justify-between mt-1">
                <View className="flex-row items-center">
                  <CheckCircle className="text-green-600" size={12} />
                  <Text className="text-xs text-gray-600 ml-1">
                    {politician.promisesFulfilled}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <XCircle className="text-red-600" size={12} />
                  <Text className="text-xs text-gray-600 ml-1">
                    {politician.totalPromises - politician.promisesFulfilled}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Compact Action Buttons */}
          <View className="flex-row gap-2">
            <Button
              className="flex-1 bg-blue-600 py-2 rounded"
              onPress={() => {
                console.log("Rate politician:", politician.id);
              }}
            >
              <Text className="text-white font-medium text-center text-xs">
                Rate
              </Text>
            </Button>
            <Button
              className="flex-1 bg-gray-200 py-2 rounded"
              onPress={() => router.push(`/politician/${politician.id}`)}
            >
              <Text className="text-gray-700 font-medium text-center text-xs">
                View Details
              </Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </Button>
  );
};
