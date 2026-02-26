import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader } from "@/components/ui/card";
import { geographicApi } from "@/services/api";
import GeographyTabs from "@/components/geography/GeographyTabs";

export type EntityType =
  | "province"
  | "district"
  | "municipality"
  | "ward"
  | "constituency";

export default function GeographyScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<EntityType>("province");

  const PAGE_SIZE = 10;
  const [provincePage, setProvincePage] = useState(1);
  const [districtPage, setDistrictPage] = useState(1);
  const [municipalityPage, setMunicipalityPage] = useState(1);
  const [wardPage, setWardPage] = useState(1);
  const [constituencyPage, setConstituencyPage] = useState(1);

  const { data: provincesData, isLoading: provincesLoading } = useQuery({
    queryKey: ["allProvinces", provincePage],
    queryFn: () => geographicApi.getProvinces(provincePage, PAGE_SIZE),
  });

  const { data: districtsData, isLoading: districtsLoading } = useQuery({
    queryKey: ["allDistricts", districtPage],
    queryFn: () => geographicApi.getDistricts(districtPage, PAGE_SIZE),
  });

  const { data: municipalitiesData, isLoading: municipalitiesLoading } =
    useQuery({
      queryKey: ["allMunicipalities", municipalityPage],
      queryFn: () =>
        geographicApi.getMunicipalities(municipalityPage, PAGE_SIZE),
    });

  const { data: wardsData, isLoading: wardsLoading } = useQuery({
    queryKey: ["allWards", wardPage],
    queryFn: () => geographicApi.getWards(wardPage, PAGE_SIZE),
  });

  const { data: constituenciesData, isLoading: constituenciesLoading } =
    useQuery({
      queryKey: ["allConstituencies", constituencyPage],
      queryFn: () =>
        geographicApi.getConstituencies(constituencyPage, PAGE_SIZE),
    });

  const provinces = provincesData?.data || [];
  const provincesTotal = provincesData?.total || 0;
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
          province: {
            detailsPage: "/geography/province",
            label: "Province",
            total: provincesTotal,
            isLoading: provincesLoading,
            tabData: provinces,
            columns: [
              { key: "name", label: "Name" },
              { key: "provinceNumber", label: "Province Numer" },
              { key: "capital", label: "Capital" },
            ],
            page: provincePage,
            setPage: setProvincePage,
          },
          district: {
            detailsPage: "/geography/district",
            label: "District",
            total: districtsTotal,
            isLoading: districtsLoading,
            tabData: districts,
            columns: [
              { key: "name", label: "Name" },
              { key: "headquarter", label: "Headquarter" },
              { key: "province.name", label: "Province" },
            ],
            page: districtPage,
            setPage: setDistrictPage,
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
              { key: "province.name", label: "Province" },
            ],
            page: municipalityPage,
            setPage: setMunicipalityPage,
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
              { key: "province.name", label: "Province" },
            ],
            page: wardPage,
            setPage: setWardPage,
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
              { key: "province.name", label: "Province" },
            ],
            page: constituencyPage,
            setPage: setConstituencyPage,
          },
        }}
      />
    </div>
  );
}
