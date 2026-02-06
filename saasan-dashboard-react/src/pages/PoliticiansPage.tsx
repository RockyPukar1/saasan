import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
  Plus,
  Search,
  Upload,
  Edit,
  Trash2,
  Users,
  Filter,
  Download,
  X,
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
import { politicsApi } from "@/services/api";
import { politicianSchema, type PoliticianFormData } from "@/lib/validations";
import type { Politician } from "../../../shared/types/politician";
import { MultiSelect } from "@/components/ui/multi-select";
import type { IPolitician } from "@/types/politics";

export interface IPoliticianFilter {
  level: string[];
  position: string[];
  party: string[];
}

const initialFilter: IPoliticianFilter = {
  level: [],
  position: [],
  party: [],
}

export const PoliticiansPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState(initialFilter);
  const [toApplyFilter, setToApplyFilter] = useState(initialFilter);
  const [showForm, setShowForm] = useState(false);
  const [editingPolitician, setEditingPolitician] = useState<Politician | null>(
    null
  );
  const [showUploadModal, setShowUploadModal] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PoliticianFormData>({
    resolver: zodResolver(politicianSchema),
  });

  const { data: politiciansData, isLoading } = useQuery({
    queryKey: ["politicians", toApplyFilter],
    queryFn: () =>
      politicsApi.getAll(toApplyFilter),
  });

  const { data: governmentLevels } = useQuery({
    queryKey: ["government-levels"],
    queryFn: () => politicsApi.getGovernmentLevels(),
  });

  const { data: positions } = useQuery({
    queryKey: ["positions"],
    queryFn: () => politicsApi.getPositions(),
  });

  const { data: parties } = useQuery({
    queryKey: ["parties"],
    queryFn: () => politicsApi.getParties(),
  });

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

  // Create politician mutation
  const createMutation = useMutation({
    mutationFn: politicsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["politicians"] });
      toast.success("Politician created successfully!");
      setShowForm(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create politician"
      );
    },
  });

  // Update politician mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Politician> }) =>
      politicsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["politicians"] });
      toast.success("Politician updated successfully!");
      setEditingPolitician(null);
      setShowForm(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update politician"
      );
    },
  });

  // Delete politician mutation
  const deleteMutation = useMutation({
    mutationFn: politicsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["politicians"] });
      toast.success("Politician deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete politician"
      );
    },
  });

  // Bulk upload mutation
  const uploadMutation = useMutation({
    mutationFn: politicsApi.bulkUpload,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["politicians"] });
      toast.success(
        `Successfully imported ${response.data.imported} politicians`
      );
      setShowUploadModal(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to upload file");
    },
  });

  const handleFormSubmit = (data: PoliticianFormData) => {
    if (editingPolitician) {
      updateMutation.mutate({ id: editingPolitician.id, data: data as any });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (politician: IPolitician) => {
    // setEditingPolitician(politician);
    // // Convert Date to string for form handling
    // const formData = {
    //   ...politician,
    //   dateOfBirth:
    //     typeof politician.dateOfBirth === "string"
    //       ? politician.dateOfBirth
    //       : politician.dateOfBirth.toISOString().split("T")[0],
    //   termStartDate:
    //     typeof politician.termStartDate === "string"
    //       ? politician.termStartDate
    //       : politician.termStartDate.toISOString().split("T")[0],
    //   termEndDate:
    //     typeof politician.termEndDate === "string"
    //       ? politician.termEndDate
    //       : politician.termEndDate.toISOString().split("T")[0],
    // };
    // reset(formData);
    // setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this politician?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const politicians = politiciansData?.data || [];
  const total = politiciansData?.total || 0;

  console.log(filter, toApplyFilter)
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Politicians</h1>
          <p className="text-gray-600">
            Manage politician data and information
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowUploadModal(true)}
            disabled={uploadMutation.isPending}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload CSV
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Politician
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search politicians..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {filterNames.map(({ name, text, data }) => (
              <div>
                <Label>{text}</Label>
                <MultiSelect
                  options={data?.map((d) => ({
                    label: d.name,
                    value: d.id,
                  })) ?? []}
                  value={initialFilter[name]}
                  onValueChange={(value: string[]) => setFilter((prev) => ({
                    ...prev,
                    [name]: value || []
                  }))}
                  popoverClassName="bg-white"
                  placeholder={`Select ${text}`}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <div className="flex items-end">
                <Button onClick={() => setToApplyFilter(filter)} variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setFilter(initialFilter);
                    setToApplyFilter(initialFilter);
                  }}
                  variant="outline"
                  disabled={Object.values(toApplyFilter).flat(1).length === 0}
                  className="w-full text-white bg-red-600 rounded-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Politicians List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Politicians ({total})</CardTitle>
              <CardDescription>
                Manage politician profiles and information
              </CardDescription>
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
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : politicians.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No politicians found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {politicians.map((politician) => (
                <div
                  key={politician.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {politician.fullName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {politician.party || "Unknown Party"} • Rating: {politician.rating || 0}
                        </p>
                        <p className="text-xs text-gray-400">
                          Reports: {politician.verifiedReports || 0}/{politician.totalReports || 0}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-end ml-4">
                        {politician.sourceCategories?.levels?.length > 0 && (
                          <div className="flex flex-wrap gap-1 items-center">
                            <span className="text-xs text-gray-500 font-medium mr-1">Level:</span>
                            {politician.sourceCategories.levels.map((l, index) => (
                              <div
                                key={index}
                                className="px-1.5 py-0.5 rounded bg-red-100 border border-red-300"
                              >
                                <p className="text-red-700 text-xs font-bold">
                                  {l}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                        {politician.sourceCategories?.positions?.length > 0 && (
                          <div className="flex flex-wrap gap-1 items-center">
                            <span className="text-xs text-gray-500 font-medium mr-1">Position:</span>
                            {politician.sourceCategories.positions.map((p, index) => (
                              <div
                                key={index}
                                className="px-1.5 py-0.5 rounded bg-blue-100 border border-blue-300"
                              >
                                <p className="text-blue-700 text-xs font-bold">
                                  {p}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                        {politician.sourceCategories?.party && (
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 font-medium mr-1">Party:</span>
                            <div className="px-1.5 py-0.5 rounded bg-green-100 border border-green-300">
                              <p className="text-green-700 text-xs font-bold">
                                {politician.sourceCategories.party}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(politician)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(politician.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowForm(false)}
        >
          <Card
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {editingPolitician ? "Edit Politician" : "Add New Politician"}
                </CardTitle>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors modal-close-btn"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      {...register("fullName")}
                      className={errors.fullName ? "border-red-500" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-600">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      {...register("contactEmail")}
                      className={errors.contactEmail ? "border-red-500" : ""}
                    />
                    {errors.contactEmail && (
                      <p className="text-sm text-red-600">
                        {errors.contactEmail.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input
                      id="contactPhone"
                      {...register("contactPhone")}
                      className={errors.contactPhone ? "border-red-500" : ""}
                    />
                    {errors.contactPhone && (
                      <p className="text-sm text-red-600">
                        {errors.contactPhone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select {...register("status")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="deceased">Deceased</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-sm text-red-600">
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="positionId">Position ID</Label>
                    <Input
                      id="positionId"
                      type="number"
                      {...register("positionId", { valueAsNumber: true })}
                      className={errors.positionId ? "border-red-500" : ""}
                    />
                    {errors.positionId && (
                      <p className="text-sm text-red-600">
                        {errors.positionId.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="partyId">Party ID</Label>
                    <Input
                      id="partyId"
                      type="number"
                      {...register("partyId", { valueAsNumber: true })}
                      className={errors.partyId ? "border-red-500" : ""}
                    />
                    {errors.partyId && (
                      <p className="text-sm text-red-600">
                        {errors.partyId.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="constituencyId">Constituency ID</Label>
                    <Input
                      id="constituencyId"
                      type="number"
                      {...register("constituencyId", { valueAsNumber: true })}
                      className={errors.constituencyId ? "border-red-500" : ""}
                    />
                    {errors.constituencyId && (
                      <p className="text-sm text-red-600">
                        {errors.constituencyId.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="biography">Biography</Label>
                  <textarea
                    id="biography"
                    rows={3}
                    {...register("biography")}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.biography ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.biography && (
                    <p className="text-sm text-red-600">
                      {errors.biography.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      {...register("education")}
                      className={errors.education ? "border-red-500" : ""}
                    />
                    {errors.education && (
                      <p className="text-sm text-red-600">
                        {errors.education.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="experienceYears">Experience Years</Label>
                    <Input
                      id="experienceYears"
                      type="number"
                      {...register("experienceYears", { valueAsNumber: true })}
                      className={errors.experienceYears ? "border-red-500" : ""}
                    />
                    {errors.experienceYears && (
                      <p className="text-sm text-red-600">
                        {errors.experienceYears.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register("dateOfBirth")}
                      className={errors.dateOfBirth ? "border-red-500" : ""}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-red-600">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="totalVotesReceived">
                      Total Votes Received
                    </Label>
                    <Input
                      id="totalVotesReceived"
                      type="number"
                      {...register("totalVotesReceived", {
                        valueAsNumber: true,
                      })}
                      className={
                        errors.totalVotesReceived ? "border-red-500" : ""
                      }
                    />
                    {errors.totalVotesReceived && (
                      <p className="text-sm text-red-600">
                        {errors.totalVotesReceived.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="termStartDate">Term Start Date</Label>
                    <Input
                      id="termStartDate"
                      type="date"
                      {...register("termStartDate")}
                      className={errors.termStartDate ? "border-red-500" : ""}
                    />
                    {errors.termStartDate && (
                      <p className="text-sm text-red-600">
                        {errors.termStartDate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="termEndDate">Term End Date</Label>
                    <Input
                      id="termEndDate"
                      type="date"
                      {...register("termEndDate")}
                      className={errors.termEndDate ? "border-red-500" : ""}
                    />
                    {errors.termEndDate && (
                      <p className="text-sm text-red-600">
                        {errors.termEndDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="profileImageUrl">Profile Image URL</Label>
                  <Input
                    id="profileImageUrl"
                    type="url"
                    {...register("profileImageUrl")}
                    className={errors.profileImageUrl ? "border-red-500" : ""}
                  />
                  {errors.profileImageUrl && (
                    <p className="text-sm text-red-600">
                      {errors.profileImageUrl.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="officialWebsite">Official Website</Label>
                  <Input
                    id="officialWebsite"
                    type="url"
                    {...register("officialWebsite")}
                    className={errors.officialWebsite ? "border-red-500" : ""}
                  />
                  {errors.officialWebsite && (
                    <p className="text-sm text-red-600">
                      {errors.officialWebsite.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingPolitician(null);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : editingPolitician
                      ? "Update"
                      : "Create"}
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
                <CardTitle>Upload Politicians CSV</CardTitle>
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
                Upload a CSV file with politician data. Make sure the file has
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
                    disabled={uploadMutation.isPending}
                  />
                </div>
                <div className="text-sm text-gray-500">
                  <p>CSV should include columns:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>fullName</li>
                    <li>contactEmail</li>
                    <li>contactPhone</li>
                    <li>positionId</li>
                    <li>partyId</li>
                    <li>constituencyId</li>
                    <li>biography</li>
                    <li>education</li>
                    <li>experienceYears</li>
                    <li>dateOfBirth</li>
                    <li>status</li>
                    <li>termStartDate</li>
                    <li>termEndDate</li>
                  </ul>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                    disabled={uploadMutation.isPending}
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
