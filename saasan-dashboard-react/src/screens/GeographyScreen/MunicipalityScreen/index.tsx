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

export default function MunicipalityScreen() {
  const { municipalityId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<EntityType>("ward");

  const PAGE_SIZE = 10;
  const [wardPage, setWardPage] = useState(1);

  const { data: wardsData, isLoading: wardsLoading } = useQuery({
    queryKey: ["wards", wardPage, municipalityId],
    queryFn: () =>
      geographicApi.getWardsByMunicipalityId(
        municipalityId!,
        wardPage,
        PAGE_SIZE,
      ),
  });
  const wards = wardsData?.data || [];
  const wardsTotal = wardsData?.total || 0;

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
          ward: {
            detailsPage: "/geography/ward",
            label: "Ward",
            total: wardsTotal,
            isLoading: wardsLoading,
            tabData: wards,
            columns: [
              { key: "wardNumber", label: "Ward Number" },
              { key: "municipality.name", label: "Municipality" },
              {
                key: "constituency.constituencyNumber",
                label: "Constituency",
              },
            ],
            page: wardPage,
            setPage: setWardPage,
          },
        }}
      />
    </div>
  );
}
