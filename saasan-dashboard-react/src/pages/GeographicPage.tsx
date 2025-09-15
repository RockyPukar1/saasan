import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Plus, Upload, Download, Building, Map, Home } from "lucide-react";
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
  type DistrictFormData,
  type MunicipalityFormData,
  type WardFormData,
} from "@/lib/validations";

export const GeographicPage: React.FC = () => {
  // const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("districts");
  const [showForm, setShowForm] = useState(false);
  // const [editingItem, setEditingItem] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DistrictFormData | MunicipalityFormData | WardFormData>({
    resolver: zodResolver(
      activeTab === "districts"
        ? districtSchema
        : activeTab === "municipalities"
        ? municipalitySchema
        : wardSchema
    ),
  });

  // Fetch districts
  const { data: districtsData, isLoading: districtsLoading } = useQuery({
    queryKey: ["districts"],
    queryFn: () => geographicApi.getDistricts(),
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

  // Create district mutation
  const createDistrictMutation = useMutation({
    mutationFn: geographicApi.createDistrict,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["districts"] });
      toast.success("District created successfully!");
      setShowForm(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create district");
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
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create municipality"
      );
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
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create ward");
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
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to upload districts"
      );
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
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to upload municipalities"
      );
    },
  });

  const uploadWardMutation = useMutation({
    mutationFn: geographicApi.bulkUploadWards,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["wards"] });
      toast.success(`Successfully imported ${response.data.imported} wards`);
      setShowUploadModal(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to upload wards");
    },
  });

  const handleFormSubmit = (data: any) => {
    if (activeTab === "districts") {
      createDistrictMutation.mutate(data);
    } else if (activeTab === "municipalities") {
      createMunicipalityMutation.mutate(data);
    } else {
      createWardMutation.mutate(data);
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

  const districts = districtsData?.data || [];
  const municipalities = municipalitiesData?.data || [];
  const wards = wardsData?.data || [];

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
      case "districts":
        return districtsLoading;
      case "municipalities":
        return municipalitiesLoading;
      case "wards":
        return wardsLoading;
      default:
        return false;
    }
  };

  const getCurrentMutation = () => {
    switch (activeTab) {
      case "districts":
        return createDistrictMutation;
      case "municipalities":
        return createMunicipalityMutation;
      case "wards":
        return createWardMutation;
      default:
        return createDistrictMutation;
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
            Manage districts, municipalities, and wards
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
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
              : "Ward"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="districts">Districts</TabsTrigger>
          <TabsTrigger value="municipalities">Municipalities</TabsTrigger>
          <TabsTrigger value="wards">Wards</TabsTrigger>
        </TabsList>

        {/* Districts Tab */}
        <TabsContent value="districts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Districts ({districts.length})</CardTitle>
                  <CardDescription>Manage district information</CardDescription>
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
                      <Label htmlFor="provinceId">Province ID</Label>
                      <Input
                        id="provinceId"
                        type="number"
                        {...register("provinceId", { valueAsNumber: true })}
                        className={
                          (errors as any).provinceId ? "border-red-500" : ""
                        }
                      />
                      {(errors as any).provinceId && (
                        <p className="text-sm text-red-600">
                          {(errors as any).provinceId.message}
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
                      {(errors as any).districtId && (
                        <p className="text-sm text-red-600">
                          {(errors as any).districtId.message}
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
                      {(errors as any).type && (
                        <p className="text-sm text-red-600">
                          {(errors as any).type.message}
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
                          (errors as any).number ? "border-red-500" : ""
                        }
                      />
                      {(errors as any).number && (
                        <p className="text-sm text-red-600">
                          {(errors as any).number.message}
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
                      {(errors as any).municipalityId && (
                        <p className="text-sm text-red-600">
                          {(errors as any).municipalityId.message}
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
