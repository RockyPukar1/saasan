import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
  Plus,
  Upload,
  Download,
  Building,
  Map,
  Home,
  Users,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { geographicApi } from "@/services/api";
import {
  districtSchema,
  municipalitySchema,
  wardSchema,
  provinceSchema,
  constituencySchema,
  type DistrictFormData,
  type MunicipalityFormData,
  type WardFormData,
  type ProvinceFormData,
  type ConstituencyFormData,
} from "@/lib/validations";

// Type alias for form errors to simplify error handling
type FormErrors = Record<string, { message?: string }>;

// Type for API error responses
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Types for API data
interface DistrictApiData {
  name: string;
  provinceId: number;
}

interface MunicipalityApiData {
  name: string;
  districtId: string;
  type:
    | "metropolitan"
    | "sub_metropolitan"
    | "municipality"
    | "rural_municipality";
}

interface WardApiData {
  number: number;
  municipalityId: string;
  name?: string;
}

interface ConstituencyApiData {
  name: string;
  district_id: string;
  type?: "federal" | "provincial";
}

export const GeographicPage = () => {
  const [activeTab, setActiveTab] = useState("provinces");
  const [showForm, setShowForm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<
    | ProvinceFormData
    | DistrictFormData
    | MunicipalityFormData
    | WardFormData
    | ConstituencyFormData
  >({
    resolver: zodResolver(
      activeTab === "provinces"
        ? provinceSchema
        : activeTab === "districts"
        ? districtSchema
        : activeTab === "municipalities"
        ? municipalitySchema
        : activeTab === "wards"
        ? wardSchema
        : constituencySchema
    ),
  });

  // Fetch provinces
  const { data: provincesData, isLoading: provincesLoading } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => geographicApi.getProvinces(),
  });

  // Fetch districts
  const { data: districtsData, isLoading: districtsLoading } = useQuery({
    queryKey: ["districts", selectedProvince],
    queryFn: () => geographicApi.getDistricts(selectedProvince),
    enabled: activeTab === "districts",
  });

  // Fetch municipalities
  const { data: municipalitiesData, isLoading: municipalitiesLoading } =
    useQuery({
      queryKey: ["municipalities", selectedDistrict],
      queryFn: () => geographicApi.getMunicipalities(selectedDistrict),
      enabled: !!selectedDistrict,
    });

  // Fetch wards
  const { data: wardsData, isLoading: wardsLoading } = useQuery({
    queryKey: ["wards", selectedDistrict, selectedMunicipality],
    queryFn: () =>
      geographicApi.getWards(selectedDistrict, selectedMunicipality),
    enabled: !!selectedDistrict && !!selectedMunicipality,
  });

  // Fetch constituencies
  const { data: constituenciesData, isLoading: constituenciesLoading } =
    useQuery({
      queryKey: ["constituencies", selectedDistrict],
      queryFn: () => geographicApi.getConstituencies(selectedDistrict),
      enabled: activeTab === "constituencies",
    });

  // Create province mutation
  const createProvinceMutation = useMutation({
    mutationFn: geographicApi.createProvince,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provinces"] });
      toast.success("Province created successfully!");
      setShowForm(false);
      reset();
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as ApiError).response?.data?.message ||
        "Failed to create province";
      toast.error(errorMessage);
    },
  });

  // Create district mutation
  const createDistrictMutation = useMutation({
    mutationFn: geographicApi.createDistrict,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["districts"] });
      toast.success("District created successfully!");
      setShowForm(false);
      reset();
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as ApiError).response?.data?.message ||
        "Failed to create district";
      toast.error(errorMessage);
    },
  });

  // Create municipality mutation
  const createMunicipalityMutation = useMutation({
    mutationFn: geographicApi.createMunicipality,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["municipalities"] });
      toast.success("Municipality created successfully!");
      setShowForm(false);
      reset();
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as ApiError).response?.data?.message ||
        "Failed to create municipality";
      toast.error(errorMessage);
    },
  });

  // Create ward mutation
  const createWardMutation = useMutation({
    mutationFn: geographicApi.createWard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wards"] });
      toast.success("Ward created successfully!");
      setShowForm(false);
      reset();
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as ApiError).response?.data?.message || "Failed to create ward";
      toast.error(errorMessage);
    },
  });

  // Create constituency mutation
  const createConstituencyMutation = useMutation({
    mutationFn: geographicApi.createConstituency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["constituencies"] });
      toast.success("Constituency created successfully!");
      setShowForm(false);
      reset();
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as ApiError).response?.data?.message ||
        "Failed to create constituency";
      toast.error(errorMessage);
    },
  });

  // Bulk upload mutations
  const uploadDistrictMutation = useMutation({
    mutationFn: geographicApi.bulkUploadDistricts,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["districts"] });
      toast.success(
        `Successfully imported ${response.data.imported} districts`
      );
      setShowUploadModal(false);
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as ApiError).response?.data?.message ||
        "Failed to upload districts";
      toast.error(errorMessage);
    },
  });

  const uploadMunicipalityMutation = useMutation({
    mutationFn: geographicApi.bulkUploadMunicipalities,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["municipalities"] });
      toast.success(
        `Successfully imported ${response.data.imported} municipalities`
      );
      setShowUploadModal(false);
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as ApiError).response?.data?.message ||
        "Failed to upload municipalities";
      toast.error(errorMessage);
    },
  });

  const uploadWardMutation = useMutation({
    mutationFn: geographicApi.bulkUploadWards,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["wards"] });
      toast.success(`Successfully imported ${response.data.imported} wards`);
      setShowUploadModal(false);
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as ApiError).response?.data?.message || "Failed to upload wards";
      toast.error(errorMessage);
    },
  });

  const handleFormSubmit = (
    data:
      | ProvinceFormData
      | DistrictFormData
      | MunicipalityFormData
      | WardFormData
      | ConstituencyFormData
  ) => {
    if (activeTab === "provinces") {
      createProvinceMutation.mutate(data as ProvinceFormData);
    } else if (activeTab === "districts") {
      const districtData = data as DistrictFormData;
      createDistrictMutation.mutate({
        name: districtData.name,
        provinceId: parseInt(districtData.provinceId),
      } as DistrictApiData);
    } else if (activeTab === "municipalities") {
      const municipalityData = data as MunicipalityFormData;
      createMunicipalityMutation.mutate({
        name: municipalityData.name,
        districtId: municipalityData.districtId,
        type: municipalityData.type,
      } as MunicipalityApiData);
    } else if (activeTab === "wards") {
      const wardData = data as WardFormData;
      createWardMutation.mutate({
        number: wardData.number,
        municipalityId: wardData.municipalityId,
        name: wardData.name,
      } as WardApiData);
    } else if (activeTab === "constituencies") {
      const constituencyData = data as ConstituencyFormData;
      createConstituencyMutation.mutate({
        name: constituencyData.name,
        district_id: constituencyData.districtId,
        type: constituencyData.type,
      } as ConstituencyApiData);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (activeTab === "districts") {
        uploadDistrictMutation.mutate(file);
      } else if (activeTab === "municipalities") {
        uploadMunicipalityMutation.mutate(file);
      } else {
        uploadWardMutation.mutate(file);
      }
    }
  };

  const provinces = provincesData?.data || [];
  const allDistricts = districtsData?.data || [];
  const municipalities = municipalitiesData?.data || [];
  const wards = wardsData?.data || [];
  const allConstituencies = constituenciesData?.data || [];

  // Filter districts by selected province
  const districts =
    selectedProvince && selectedProvince !== "all"
      ? allDistricts.filter(
          (district) => district.provinceId === parseInt(selectedProvince)
        )
      : allDistricts;

  // Filter constituencies by selected district
  const constituencies =
    selectedDistrict && selectedDistrict !== "all"
      ? allConstituencies.filter(
          (constituency) => constituency.district_id === selectedDistrict
        )
      : allConstituencies;

  // const getCurrentData = () => {
  //   switch (activeTab) {
  //     case "districts":
  //       return districts;
  //     case "municipalities":
  //       return municipalities;
  //     case "wards":
  //       return wards;
  //     default:
  //       return [];
  //   }
  // };

  const getCurrentLoading = () => {
    switch (activeTab) {
      case "provinces":
        return provincesLoading;
      case "districts":
        return districtsLoading;
      case "municipalities":
        return municipalitiesLoading;
      case "wards":
        return wardsLoading;
      case "constituencies":
        return constituenciesLoading;
      default:
        return false;
    }
  };

  const getCurrentMutation = () => {
    switch (activeTab) {
      case "provinces":
        return createProvinceMutation;
      case "districts":
        return createDistrictMutation;
      case "municipalities":
        return createMunicipalityMutation;
      case "wards":
        return createWardMutation;
      case "constituencies":
        return createConstituencyMutation;
      default:
        return createProvinceMutation;
    }
  };

  const getCurrentUploadMutation = () => {
    switch (activeTab) {
      case "districts":
        return uploadDistrictMutation;
      case "municipalities":
        return uploadMunicipalityMutation;
      case "wards":
        return uploadWardMutation;
      default:
        return uploadDistrictMutation;
    }
  };

  // const currentData = getCurrentData();
  const isLoading = getCurrentLoading();
  const currentMutation = getCurrentMutation();
  const currentUploadMutation = getCurrentUploadMutation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Geographic Data</h1>
          <p className="text-gray-600">
            Manage provinces, districts, municipalities, wards, and
            constituencies
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          {activeTab !== "provinces" && (
            <>
              <Button
                variant="outline"
                onClick={() => setShowUploadModal(true)}
                disabled={currentUploadMutation.isPending}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV
              </Button>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add{" "}
                {activeTab === "districts"
                  ? "District"
                  : activeTab === "municipalities"
                  ? "Municipality"
                  : activeTab === "wards"
                  ? "Ward"
                  : "Constituency"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="provinces">Provinces</TabsTrigger>
          <TabsTrigger value="districts">Districts</TabsTrigger>
          <TabsTrigger value="municipalities">Municipalities</TabsTrigger>
          <TabsTrigger value="wards">Wards</TabsTrigger>
          <TabsTrigger value="constituencies">Constituencies</TabsTrigger>
        </TabsList>

        {/* Provinces Tab */}
        <TabsContent value="provinces">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Provinces ({provinces.length})</CardTitle>
                  <CardDescription>Manage province information</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : provinces.length === 0 ? (
                <div className="text-center py-8">
                  <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No provinces found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {provinces.map((province) => (
                    <div
                      key={province.id}
                      className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedProvince(province.id);
                        // Map will handle province selection
                      }}
                    >
                      <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Map className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {province.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {province.name_nepali} • Capital: {province.capital}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProvince(province.id);
                            // Map will handle province selection
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Districts Tab */}
        <TabsContent value="districts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Districts ({districts.length})</CardTitle>
                  <CardDescription>Manage district information</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Select
                    value={selectedProvince}
                    onValueChange={setSelectedProvince}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Provinces</SelectItem>
                      {provinces.map((province) => (
                        <SelectItem key={province.id} value={province.id}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : districts.length === 0 ? (
                <div className="text-center py-8">
                  <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No districts found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {districts.map((district) => (
                    <div
                      key={district.id}
                      className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                        <Map className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {district.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Province ID: {district.provinceId}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Municipalities Tab */}
        <TabsContent value="municipalities">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Municipalities ({municipalities.length})
                  </CardTitle>
                  <CardDescription>
                    Manage municipality information
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Select
                    value={selectedDistrict}
                    onValueChange={setSelectedDistrict}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.id} value={district.id}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : municipalities.length === 0 ? (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {selectedDistrict
                      ? "No municipalities found"
                      : "Select a district to view municipalities"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {municipalities.map((municipality) => (
                    <div
                      key={municipality.id}
                      className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {municipality.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {municipality.type.replace("_", " ")} • District:{" "}
                          {municipality.districtId}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wards Tab */}
        <TabsContent value="wards">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Wards ({wards.length})</CardTitle>
                  <CardDescription>Manage ward information</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Select
                    value={selectedDistrict}
                    onValueChange={setSelectedDistrict}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="District" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.id} value={district.id}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedMunicipality}
                    onValueChange={setSelectedMunicipality}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Municipality" />
                    </SelectTrigger>
                    <SelectContent>
                      {municipalities.map((municipality) => (
                        <SelectItem
                          key={municipality.id}
                          value={municipality.id}
                        >
                          {municipality.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : wards.length === 0 ? (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {selectedDistrict && selectedMunicipality
                      ? "No wards found"
                      : "Select district and municipality to view wards"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {wards.map((ward) => (
                    <div
                      key={ward.id}
                      className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                        <Home className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          Ward {ward.number}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {ward.name || "No name"} • Municipality:{" "}
                          {ward.municipalityId}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Constituencies Tab */}
        <TabsContent value="constituencies">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Constituencies ({constituencies.length})
                  </CardTitle>
                  <CardDescription>
                    Manage constituency information
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Select
                    value={selectedDistrict}
                    onValueChange={setSelectedDistrict}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by district" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      {districts.map((district) => (
                        <SelectItem key={district.id} value={district.id}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : constituencies.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {selectedDistrict
                      ? "No constituencies found"
                      : "Select a district to view constituencies"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {constituencies.map((constituency) => (
                    <div
                      key={constituency.id}
                      className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {constituency.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {constituency.name_nepali} • District:{" "}
                          {constituency.district_id}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowForm(false)}
        >
          <Card
            className="w-full max-w-md bg-white border border-gray-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Add New{" "}
                  {activeTab === "districts"
                    ? "District"
                    : activeTab === "municipalities"
                    ? "Municipality"
                    : "Ward"}
                </CardTitle>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-4"
              >
                {activeTab === "provinces" && (
                  <>
                    <div>
                      <Label htmlFor="name">Province Name</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="name_nepali">
                        Province Name (Nepali)
                      </Label>
                      <Input
                        id="name_nepali"
                        {...register("name_nepali")}
                        className={errors.name_nepali ? "border-red-500" : ""}
                      />
                      {errors.name_nepali && (
                        <p className="text-sm text-red-600">
                          {errors.name_nepali.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="capital">Capital</Label>
                      <Input
                        id="capital"
                        {...register("capital")}
                        className={
                          (errors as FormErrors).capital ? "border-red-500" : ""
                        }
                      />
                      {(errors as FormErrors).capital && (
                        <p className="text-sm text-red-600">
                          {(errors as FormErrors).capital.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="capital_nepali">Capital (Nepali)</Label>
                      <Input
                        id="capital_nepali"
                        {...register("capital_nepali")}
                        className={
                          (errors as FormErrors).capital_nepali
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {(errors as FormErrors).capital_nepali && (
                        <p className="text-sm text-red-600">
                          {(errors as FormErrors).capital_nepali.message}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {activeTab === "districts" && (
                  <>
                    <div>
                      <Label htmlFor="name">District Name</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="name_nepali">
                        District Name (Nepali)
                      </Label>
                      <Input
                        id="name_nepali"
                        {...register("name_nepali")}
                        className={errors.name_nepali ? "border-red-500" : ""}
                      />
                      {errors.name_nepali && (
                        <p className="text-sm text-red-600">
                          {errors.name_nepali.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="provinceId">Province</Label>
                      <Select {...register("provinceId")}>
                        <SelectTrigger
                          className={
                            (errors as FormErrors).provinceId
                              ? "border-red-500"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((province) => (
                            <SelectItem key={province.id} value={province.id}>
                              {province.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {(errors as FormErrors).provinceId && (
                        <p className="text-sm text-red-600">
                          {(errors as FormErrors).provinceId.message}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {activeTab === "municipalities" && (
                  <>
                    <div>
                      <Label htmlFor="name">Municipality Name</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="districtId">District</Label>
                      <Select {...register("districtId")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district.id} value={district.id}>
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {(errors as FormErrors).districtId && (
                        <p className="text-sm text-red-600">
                          {(errors as FormErrors).districtId.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select {...register("type")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="metropolitan">
                            Metropolitan
                          </SelectItem>
                          <SelectItem value="sub_metropolitan">
                            Sub Metropolitan
                          </SelectItem>
                          <SelectItem value="municipality">
                            Municipality
                          </SelectItem>
                          <SelectItem value="rural_municipality">
                            Rural Municipality
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {(errors as FormErrors).type && (
                        <p className="text-sm text-red-600">
                          {(errors as FormErrors).type.message}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {activeTab === "wards" && (
                  <>
                    <div>
                      <Label htmlFor="number">Ward Number</Label>
                      <Input
                        id="number"
                        type="number"
                        {...register("number", { valueAsNumber: true })}
                        className={
                          (errors as FormErrors).number ? "border-red-500" : ""
                        }
                      />
                      {(errors as FormErrors).number && (
                        <p className="text-sm text-red-600">
                          {(errors as FormErrors).number.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="municipalityId">Municipality</Label>
                      <Select {...register("municipalityId")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select municipality" />
                        </SelectTrigger>
                        <SelectContent>
                          {municipalities.map((municipality) => (
                            <SelectItem
                              key={municipality.id}
                              value={municipality.id}
                            >
                              {municipality.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {(errors as FormErrors).municipalityId && (
                        <p className="text-sm text-red-600">
                          {(errors as FormErrors).municipalityId.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="name">Ward Name (Optional)</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {activeTab === "constituencies" && (
                  <>
                    <div>
                      <Label htmlFor="name">Constituency Name</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="name_nepali">
                        Constituency Name (Nepali)
                      </Label>
                      <Input
                        id="name_nepali"
                        {...register("name_nepali")}
                        className={errors.name_nepali ? "border-red-500" : ""}
                      />
                      {errors.name_nepali && (
                        <p className="text-sm text-red-600">
                          {errors.name_nepali.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="districtId">District</Label>
                      <Select {...register("districtId")}>
                        <SelectTrigger
                          className={
                            (errors as FormErrors).districtId
                              ? "border-red-500"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district.id} value={district.id}>
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {(errors as FormErrors).districtId && (
                        <p className="text-sm text-red-600">
                          {(errors as FormErrors).districtId.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select {...register("type")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="federal">Federal</SelectItem>
                          <SelectItem value="provincial">Provincial</SelectItem>
                        </SelectContent>
                      </Select>
                      {(errors as FormErrors).type && (
                        <p className="text-sm text-red-600">
                          {(errors as FormErrors).type.message}
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      // setEditingItem(null);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={currentMutation.isPending}>
                    {currentMutation.isPending ? "Saving..." : "Create"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowUploadModal(false)}
        >
          <Card
            className="w-full max-w-md bg-white border border-gray-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Upload{" "}
                  {activeTab === "districts"
                    ? "Districts"
                    : activeTab === "municipalities"
                    ? "Municipalities"
                    : "Wards"}{" "}
                  CSV
                </CardTitle>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <CardDescription>
                Upload a CSV file with {activeTab} data. Make sure the file has
                the correct format.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csvFile">CSV File</Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={currentUploadMutation.isPending}
                  />
                </div>
                <div className="text-sm text-gray-500">
                  <p>CSV should include columns:</p>
                  <ul className="list-disc list-inside mt-1">
                    {activeTab === "districts" && (
                      <>
                        <li>name</li>
                        <li>provinceId</li>
                      </>
                    )}
                    {activeTab === "municipalities" && (
                      <>
                        <li>name</li>
                        <li>districtId</li>
                        <li>type</li>
                      </>
                    )}
                    {activeTab === "wards" && (
                      <>
                        <li>number</li>
                        <li>municipalityId</li>
                        <li>name (optional)</li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                    disabled={currentUploadMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
