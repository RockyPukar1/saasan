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
  Filter,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { usePoliticians, Politician } from "~/hooks/usePoliticians";
import Loading from "~/components/Loading";
import Error from "~/components/Error";
import { useLanguage } from "~/contexts/LanguageContext";
import { PageHeader } from "~/components/PageHeader";
import BottomGap from "~/components/BottomGap";

export interface PoliticianFilter {
  level: string[];
  position: string[];
  party: string[];
}

const initialFilter: PoliticianFilter = {
  level: [],
  position: [],
  party: [],
};

const PoliticiansScreen = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<PoliticianFilter>(initialFilter);
  const [toApplyFilter, setToApplyFilter] = useState(initialFilter);

  const {
    politicians,
    governmentLevels,
    parties,
    positions,
    loading,
    error,
    refresh,
  } = usePoliticians();

  const filterNames = [
    {
      name: "level",
      text: "Level",
      data: governmentLevels,
    },
    {
      name: "position",
      text: "Position",
      data: positions,
    },
    {
      name: "party",
      text: "Party",
      data: parties,
    },
  ] as Array<{ name: keyof typeof initialFilter; text: string; data: any[] }>;

  useEffect(() => {
    refresh(toApplyFilter);
  }, [toApplyFilter]);

  // Extract unique parties and positions
  const [currentFilterDropdown, setCurrentFilterDropdown] = useState("");

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
        <View className="flex-row items-center gap-2">
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
            onPress={() =>
              setCurrentFilterDropdown(currentFilterDropdown ? "" : "OPEN")
            }
            className="h-11 w-11 rounded-lg bg-gray-100 items-center justify-center"
          >
            <Filter className="text-gray-700" size={20} />
          </Button>
        </View>
      </View>

      {currentFilterDropdown === "OPEN" && (
        <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl border-t border-gray-200 shadow-xl z-50">
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            <Button
              onPress={() => setCurrentFilterDropdown("")}
              className="p-2"
            >
              <X size={18} className="text-gray-600" />
            </Button>

            <Text className="text-base font-semibold text-gray-800">
              Filters
            </Text>

            <Button
              onPress={() => {
                setFilter(initialFilter);
                setToApplyFilter(initialFilter);
              }}
              disabled={Object.values(filter).flat(1).length === 0}
              className="px-3 py-1.5 rounded-full bg-red-50"
            >
              <Text className="text-xs font-semibold text-red-600">Clear</Text>
            </Button>
          </View>

          {/* Filter content */}
          <ScrollView className="px-4 py-3" style={{ maxHeight: "65%" }}>
            {filterNames.map(({ name, text, data }) => (
              <View key={name} className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  {text}
                </Text>

                <View className="flex-row flex-wrap gap-2">
                  {data.map((d) => {
                    const isSelected = filter[name].includes(d.id);

                    return (
                      <Button
                        key={d.id}
                        onPress={() => {
                          setFilter((prev) => ({
                            ...prev,
                            [name]: isSelected
                              ? prev[name].filter((l) => l !== d.id)
                              : [...prev[name], d.id],
                          }));
                        }}
                        className={`px-3 py-2 rounded-full border ${
                          isSelected
                            ? "bg-red-50 border-red-500"
                            : "bg-gray-100 border-gray-200"
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            isSelected ? "text-red-600" : "text-gray-700"
                          }`}
                        >
                          {d.name}
                        </Text>
                      </Button>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
          <View className="px-4 py-3 border-t border-gray-200">
            <Button
              onPress={() => {
                setToApplyFilter(filter);
                setCurrentFilterDropdown("");
              }}
              className="bg-blue-600 rounded-lg py-3"
            >
              <Text className="text-white font-semibold text-center">
                Apply Filters
              </Text>
            </Button>
          </View>
          <BottomGap />
        </View>
      )}

      {loading ? (
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
          {politicians.length > 0 ? (
            politicians.map((politician) => (
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
      )}

      {/* Bottom padding for tab bar */}
      <BottomGap />
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
            </View>

            <View className="flex gap-1 items-end">
              {politician.sourceCategories?.levels?.length > 0 &&
                politician.sourceCategories.levels.map((l, index) => (
                  <View
                    key={index}
                    className="px-2 py-1 rounded bg-red-100 border border-red-300"
                  >
                    <Text
                      className="text-red-700 text-xs font-bold"
                      numberOfLines={1}
                    >
                      {l}
                    </Text>
                  </View>
                ))}
              {politician.sourceCategories?.positions?.length > 0 &&
                politician.sourceCategories.positions.map((p, index) => (
                  <View
                    key={index}
                    className="px-2 py-1 rounded bg-blue-100 border border-blue-300"
                  >
                    <Text
                      className="text-blue-700 text-xs font-bold"
                      numberOfLines={1}
                    >
                      {p}
                    </Text>
                  </View>
                ))}
              {politician.sourceCategories?.party && (
                <View className="px-2 py-1 rounded bg-green-100 border border-green-300">
                  <Text
                    className="text-green-700 text-xs font-bold"
                    numberOfLines={1}
                  >
                    {politician.sourceCategories.party}
                  </Text>
                </View>
              )}
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
