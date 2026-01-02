import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  RefreshControl,
} from "react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Search,
  MapPin,
  Star,
  Users,
  ChevronDown,
  CheckCircle,
  X,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { usePoliticians, Politician } from "~/hooks/usePoliticians";
import Loading from "~/components/Loading";
import Error from "~/components/Error";
import { useLanguage } from "~/contexts/LanguageContext";
import { PageHeader } from "~/components/PageHeader";

export interface PoliticianFilter {
  level: string[];
  position: string[];
  party: string[];
}

const initialFilter = {
  level: [],
  position: [],
  party: [],
};

const PoliticiansScreen = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<PoliticianFilter>({
    level: [],
    position: [],
    party: [],
  });

  const {
    politicians,
    governmentLevels,
    parties,
    positions,
    loading,
    error,
    refresh,
  } = usePoliticians();

  useEffect(() => {
    refresh(filter);
  }, [filter]);

  const filteredPoliticians = useMemo(() => {
    let filtered = politicians;

    return filtered;
  }, [politicians, searchQuery, filter]);

  // Extract unique parties and positions
  const [currentFilterDropdown, setCurrentFilterDropdown] = useState("");

  const getTotalSelectedCount = () => {
    return filter.level.length + filter.party.length + filter.position.length;
  };

  const canSelectMore = () => {
    return getTotalSelectedCount() < 2;
  };

  console.log(filter);

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
        <View className="flex-row items-center justify-between gap-2 rounded-lg">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
            <Search className="text-gray-500" size={20} />
            <TextInput
              placeholder="Search politicians..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-2 text-gray-800"
            />
          </View>
          <Button
            onPress={() => setFilter(initialFilter)}
            className="bg-white px-3 py-1.5 rounded-full shadow-sm"
          >
            <Text className="text-xs text-red-600 font-semibold">Clear</Text>
          </Button>
        </View>
      </View>

      {/* Unified Filter Section */}
      <View className="bg-white border-b border-gray-200">
        {/* Selected Chips Row */}
        {/* <View className="px-4 pt-3 pb-2">
          <View className="flex-row flex-wrap items-center gap-2">
            {selectedFilters.map((item) => (
              <View
                key={`${item.type}-${item.id}`}
                className="flex-row items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-md"
              >
                <Text className="text-xs font-medium text-gray-700">
                  {item.name}
                </Text>
                <Button
                  onPress={() => removeFilter(item.type, item.id)}
                >
                  <X className="text-gray-500" size={14} />
                </Button>
              </View>
            ))}
          </View>
        </View> */}
        {/* Filter Dropdowns Row */}
        <View className="px-3 py-2">
          <View className="flex-row items-center gap-3">
            <View className="relative flex-1">
              {filter.level.length ? (
                <>
                  {filter.level.map((item) => (
                    <View
                      key={item}
                      className="flex-row items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-md"
                    >
                      <Text className="text-xs font-medium text-gray-700">
                        {governmentLevels.find((l) => l.id === item)?.name}
                      </Text>
                      <Button
                        onPress={() => {
                          setFilter((prev) => ({
                            ...prev,
                            level: prev.level.filter((l) => l !== item),
                          }));
                        }}
                      >
                        <X className="text-gray-500" size={14} />
                      </Button>
                    </View>
                  ))}
                </>
              ) : null}

              <Button
                onPress={() => {
                  setCurrentFilterDropdown("level");
                }}
                className={`flex-row items-center justify-between px-2 py-2 rounded-xl transition-all ${
                  currentFilterDropdown === "level"
                    ? "bg-red-50 border-2 border-red-500"
                    : "bg-gray-50 border-2 border-gray-200"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    currentFilterDropdown === "level"
                      ? "text-red-600"
                      : "text-gray-700"
                  }`}
                >
                  Level {filter.level.length > 0 && `(${filter.level.length})`}
                </Text>
                <ChevronDown
                  className={
                    currentFilterDropdown === "level"
                      ? "text-red-600"
                      : "text-gray-500"
                  }
                  size={18}
                />
              </Button>

              {currentFilterDropdown === "level" && (
                <View className="absolute top-14 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                  {governmentLevels.map((level, index) => {
                    const isSelected = filter.level.includes(level.id);
                    const isDisabled = !canSelectMore();

                    return (
                      <Button
                        key={level.id}
                        onPress={() => {
                          if (!isDisabled) {
                            setFilter((prev) => ({
                              ...prev,
                              level: prev.level.includes(level.id)
                                ? prev.level.filter((l) => l !== level.id)
                                : [...prev.level, level.id],
                            }));
                          }
                        }}
                        disabled={isDisabled}
                        className={`px-4 py-3.5 ${
                          index !== governmentLevels.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        } ${
                          isSelected
                            ? "bg-red-50"
                            : isDisabled
                            ? "bg-gray-50"
                            : "bg-white"
                        }`}
                      >
                        <View className="flex-row items-center justify-between">
                          <Text
                            className={`text-sm ${
                              isSelected
                                ? "text-red-600 font-bold"
                                : isDisabled
                                ? "text-gray-400"
                                : "text-gray-800 font-medium"
                            }`}
                          >
                            {level.name}
                          </Text>
                          {isSelected && (
                            <View className="bg-red-600 rounded-full p-0.5">
                              <CheckCircle className="text-white" size={14} />
                            </View>
                          )}
                        </View>
                      </Button>
                    );
                  })}
                </View>
              )}
            </View>
            <View className="relative flex-1">
              <Button
                onPress={() => {
                  setCurrentFilterDropdown("position");
                }}
                className={`flex-row items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  currentFilterDropdown === "position"
                    ? "bg-red-50 border-2 border-red-500"
                    : "bg-gray-50 border-2 border-gray-200"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    currentFilterDropdown === "position"
                      ? "text-red-600"
                      : "text-gray-700"
                  }`}
                >
                  Position{" "}
                  {filter.position.length > 0 && `(${filter.position.length})`}
                </Text>
                <ChevronDown
                  className={
                    currentFilterDropdown === "position"
                      ? "text-red-600"
                      : "text-gray-500"
                  }
                  size={18}
                />
              </Button>

              {currentFilterDropdown === "position" && (
                <View className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                  <ScrollView style={{ maxHeight: 220 }}>
                    {positions.map((position, index) => {
                      const isSelected = filter.position.includes(position.id);
                      const isDisabled = !isSelected && !canSelectMore();

                      return (
                        <Button
                          key={position.id}
                          onPress={() => {
                            if (!isDisabled) {
                              setFilter((prev) => ({
                                ...prev,
                                position: prev.position.includes(position.id)
                                  ? prev.position.filter(
                                      (l) => l !== position.id
                                    )
                                  : [...prev.position, position.id],
                              }));
                            }
                          }}
                          disabled={isDisabled}
                          className={`px-4 py-3.5 ${
                            index !== positions.length - 1
                              ? "border-b border-gray-100"
                              : ""
                          } ${
                            isSelected
                              ? "bg-red-50"
                              : isDisabled
                              ? "bg-gray-50"
                              : "bg-white"
                          }`}
                        >
                          <View className="flex-row items-center justify-between">
                            <Text
                              className={`text-sm ${
                                isSelected
                                  ? "text-red-600 font-bold"
                                  : isDisabled
                                  ? "text-gray-400"
                                  : "text-gray-800 font-medium"
                              }`}
                            >
                              {position.title}
                            </Text>
                            {isSelected && (
                              <View className="bg-red-600 rounded-full p-0.5">
                                <CheckCircle className="text-white" size={14} />
                              </View>
                            )}
                          </View>
                        </Button>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Party Dropdown */}
            <View className="relative flex-1">
              <Button
                onPress={() => {
                  setCurrentFilterDropdown("party");
                }}
                className={`flex-row items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  currentFilterDropdown === "party"
                    ? "bg-red-50 border-2 border-red-500"
                    : "bg-gray-50 border-2 border-gray-200"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    currentFilterDropdown === "party"
                      ? "text-red-600"
                      : "text-gray-700"
                  }`}
                >
                  Party {filter.party.length > 0 && `(${filter.party.length})`}
                </Text>
                <ChevronDown
                  className={
                    currentFilterDropdown === "party"
                      ? "text-red-600"
                      : "text-gray-500"
                  }
                  size={18}
                />
              </Button>

              {currentFilterDropdown === "party" && (
                <View className="absolute top-14 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                  <ScrollView style={{ maxHeight: 220 }}>
                    {parties.map((party, index) => {
                      const isSelected = filter.party.includes(party.id);
                      const isDisabled = !isSelected && !canSelectMore();

                      return (
                        <Button
                          key={party.id}
                          onPress={() => {
                            if (!isDisabled) {
                              setFilter((prev) => ({
                                ...prev,
                                party: prev.party.includes(party.id)
                                  ? prev.party.filter((l) => l !== party.id)
                                  : [...prev.party, party.id],
                              }));
                            }
                          }}
                          disabled={isDisabled}
                          className={`px-4 py-3.5 ${
                            index !== parties.length - 1
                              ? "border-b border-gray-100"
                              : ""
                          } ${
                            isSelected
                              ? "bg-red-50"
                              : isDisabled
                              ? "bg-gray-50"
                              : "bg-white"
                          }`}
                        >
                          <View className="flex-row items-center justify-between">
                            <Text
                              className={`text-sm ${
                                isSelected
                                  ? "text-red-600 font-bold"
                                  : isDisabled
                                  ? "text-gray-400"
                                  : "text-gray-800 font-medium"
                              }`}
                            >
                              {party.name}
                            </Text>
                            {isSelected && (
                              <View className="bg-red-600 rounded-full p-0.5">
                                <CheckCircle className="text-white" size={14} />
                              </View>
                            )}
                          </View>
                        </Button>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* {loading ? (
        <Loading />
      ) : error ? (
        <Error error={error} refresh={() => refresh(filter)} />
      ) : (
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => refresh(filter)}
            />
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
                  : "Try adjusting your search or filter"}
              </Text>
            </View>
          )}
        </ScrollView>
      )} */}

      {/* Bottom padding for tab bar */}
      <View className="h-24" />
    </View>
  );
};

export default PoliticiansScreen;

const PoliticianCard = ({ politician }: { politician: Politician }) => {
  const router = useRouter();

  return (
    <View className="mb-3">
      <Card className="overflow-hidden">
        <CardContent className="p-3">
          {/* Compact Header */}
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1 mr-2">
              <Text
                className="text-base font-bold text-gray-800 mb-1"
                numberOfLines={1}
              >
                {politician.fullName}
              </Text>

              {politician.constituencyNumber && (
                <View className="flex-row items-center">
                  <MapPin className="text-gray-500" size={10} />
                  <Text
                    className="text-gray-500 text-xs ml-1"
                    numberOfLines={1}
                  >
                    {politician.constituencyNumber}
                  </Text>
                </View>
              )}
            </View>

            {/* Party Badge - Compact */}
            {politician.party && (
              <View className="px-2 py-1 rounded bg-gray-500">
                <Text
                  className="text-white text-xs font-bold"
                  numberOfLines={1}
                >
                  {politician.party}
                </Text>
              </View>
            )}
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
            </View>
          </View>

          {/* Compact Action Buttons */}
          <View className="flex-row gap-2">
            <Button
              className="flex-1 bg-blue-600 py-2 rounded"
              onPress={(e) => {
                e.stopPropagation();
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
    </View>
  );
};
