import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader } from "@/components/ui/card";
import { geographicApi } from "@/services/api";
import GeographyTabs from "@/components/geography/GeographyTabs";
import { useParams } from "react-router-dom";

export type EntityType =
  | "province"
  | "district"
  | "municipality"
  | "ward"
  | "constituency";

export default function ProvinceScreen() {
  const { provinceId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<EntityType>("district");

  const PAGE_SIZE = 10;
  const [cursorHistories, setCursorHistories] = useState<
    Record<Exclude<EntityType, "province">, Array<string | null>>
  >({
    district: [null],
    municipality: [null],
    ward: [null],
    constituency: [null],
  });

  const currentCursor = (
    entity: Exclude<EntityType, "province">,
  ) => cursorHistories[entity][cursorHistories[entity].length - 1] || null;
  const currentPage = (entity: Exclude<EntityType, "province">) =>
    cursorHistories[entity].length;
  const goToNextPage = (
    entity: Exclude<EntityType, "province">,
    nextCursor?: string | null,
  ) => {
    if (!nextCursor) {
      return;
    }

    setCursorHistories((previous) => ({
      ...previous,
      [entity]: [...previous[entity], nextCursor],
    }));
  };
  const goToPreviousPage = (entity: Exclude<EntityType, "province">) => {
    setCursorHistories((previous) => ({
      ...previous,
      [entity]:
        previous[entity].length > 1
          ? previous[entity].slice(0, -1)
          : previous[entity],
    }));
  };

  const { data: districtsData, isLoading: districtsLoading } = useQuery({
    queryKey: ["districts", currentCursor("district"), provinceId],
    queryFn: () =>
      geographicApi.getDistrictsByProvinceId(
        provinceId!,
        currentCursor("district"),
        PAGE_SIZE,
      ),
  });

  const { data: municipalitiesData, isLoading: municipalitiesLoading } =
    useQuery({
      queryKey: ["municipalities", currentCursor("municipality"), provinceId],
      queryFn: () =>
        geographicApi.getMunicipalitiesByProvinceId(
          provinceId!,
          currentCursor("municipality"),
          PAGE_SIZE,
        ),
    });

  const { data: wardsData, isLoading: wardsLoading } = useQuery({
    queryKey: ["wards", currentCursor("ward"), provinceId],
    queryFn: () =>
      geographicApi.getWardsByProvinceId(
        provinceId!,
        currentCursor("ward"),
        PAGE_SIZE,
      ),
  });

  const { data: constituenciesData, isLoading: constituenciesLoading } =
    useQuery({
      queryKey: ["constituencies", currentCursor("constituency"), provinceId],
      queryFn: () =>
        geographicApi.getConstituenciesByProvinceId(
          provinceId!,
          currentCursor("constituency"),
          PAGE_SIZE,
        ),
    });

  const districts = districtsData?.data || [];
  const districtsTotal = districtsData?.total || 0;
  const municipalities = municipalitiesData?.data || [];
  const municipalitiesTotal = municipalitiesData?.total || 0;
  const wards = wardsData?.data || [];
  const wardsTotal = wardsData?.total || 0;
  const constituencies = constituenciesData?.data || [];
  const constituenciesTotal = constituenciesData?.total || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Geography Management
          </h1>
          <p className="text-gray-600">
            Manage provinces, districts, municipalities, wards, and
            constituencies
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
          </div>
        </CardHeader>
      </Card>
      <GeographyTabs
        tabs={{
          activeTab: activeTab,
          setActiveTab: setActiveTab,
          pageSize: PAGE_SIZE,
        }}
        data={{
          district: {
            detailsPage: "/geography/district",
            label: "District",
            total: districtsTotal,
            isLoading: districtsLoading,
            tabData: districts,
            columns: [
              { key: "name", label: "Name" },
              { key: "headquarter", label: "Headquarter" },
            ],
            page: currentPage("district"),
            hasNext: districtsData?.hasNext || false,
            goToPreviousPage: () => goToPreviousPage("district"),
            goToNextPage: () => goToNextPage("district", districtsData?.nextCursor),
          },
          municipality: {
            detailsPage: "/geography/municipality",
            label: "Municipality",
            total: municipalitiesTotal,
            isLoading: municipalitiesLoading,
            tabData: municipalities,
            columns: [
              { key: "name", label: "Name" },
              { key: "district.name", label: "District" },
            ],
            page: currentPage("municipality"),
            hasNext: municipalitiesData?.hasNext || false,
            goToPreviousPage: () => goToPreviousPage("municipality"),
            goToNextPage: () =>
              goToNextPage("municipality", municipalitiesData?.nextCursor),
          },
          ward: {
            detailsPage: "/geography/ward",
            label: "Ward",
            total: wardsTotal,
            isLoading: wardsLoading,
            tabData: wards,
            columns: [
              { key: "wardNumber", label: "Ward Number" },
              { key: "municipality.name", label: "Municipality" },
              { key: "district.name", label: "District" },
              {
                key: "constituency.constituencyNumber",
                label: "Constituency",
              },
            ],
            page: currentPage("ward"),
            hasNext: wardsData?.hasNext || false,
            goToPreviousPage: () => goToPreviousPage("ward"),
            goToNextPage: () => goToNextPage("ward", wardsData?.nextCursor),
          },
          constituency: {
            detailsPage: "/geography/constituency",
            label: "Constituency",
            total: constituenciesTotal,
            isLoading: constituenciesLoading,
            tabData: constituencies,
            columns: [
              { key: "constituencyNumber", label: "Constituency Number" },
              { key: "district.name", label: "District" },
            ],
            page: currentPage("constituency"),
            hasNext: constituenciesData?.hasNext || false,
            goToPreviousPage: () => goToPreviousPage("constituency"),
            goToNextPage: () =>
              goToNextPage("constituency", constituenciesData?.nextCursor),
          },
        }}
      />
    </div>
  );
}
