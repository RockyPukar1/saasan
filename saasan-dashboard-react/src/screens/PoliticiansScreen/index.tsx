import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  Plus,
  Search,
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
import { politicsApi } from "@/services/api";
import { MultiSelect } from "@/components/ui/multi-select";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import type { IPolitician } from "@/types/politics";
import PoliticianEditForm from "@/components/politics/PoliticianEditForm";
import { useAuth } from "@/contexts/AuthContext";
import { PERMISSIONS } from "@/constants/permission.constants";
import { PermissionGate } from "@/components/PermissionGate";
import RenderPagination from "@/components/geography/RenderPagination";

export interface IPoliticianFilter {
  level: string[];
  position: string[];
  party: string[];
}

const initialFilter: IPoliticianFilter = {
  level: [],
  position: [],
  party: [],
};

const PAGE_SIZE = 10;

export default function PoliticiansScreen() {
  const { hasPermission } = useAuth();

  const canUpdatePolitician = hasPermission(PERMISSIONS.politicians.update);
  const canDeletePolitician = hasPermission(PERMISSIONS.politicians.delete);
  const canCreatePoliticianAccount = hasPermission(
    PERMISSIONS.politicians.createAccount,
  );

  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState(initialFilter);
  const [toApplyFilter, setToApplyFilter] = useState(initialFilter);
  const [cursorHistory, setCursorHistory] = useState<Array<string | null>>([null]);
  const [showForm, setShowForm] = useState(false);
  const [editingPolitician, setEditingPolitician] =
    useState<IPolitician | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const queryClient = useQueryClient();

  const currentCursor = cursorHistory[cursorHistory.length - 1] || null;
  const currentPage = cursorHistory.length;

  const { data: politiciansData, isLoading } = useQuery({
    queryKey: ["politicians", toApplyFilter, currentCursor],
    queryFn: () =>
      politicsApi.getAll(toApplyFilter, {
        cursor: currentCursor,
        limit: PAGE_SIZE,
      }),
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

  // Delete politician mutation
  const deleteMutation = useMutation({
    mutationFn: politicsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["politicians"] });
      toast.success("Politician deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete politician",
      );
    },
  });

  const handleEdit = async (politician: IPolitician) => {
    if (!canUpdatePolitician) {
      toast.error("You do not have permission to edit politicians");
      return;
    }

    try {
      // Fetch complete politician data before opening form
      const response = await politicsApi.getById(politician.id);
      const completePoliticianData = response.data;

      setEditingPolitician(completePoliticianData as unknown as IPolitician);
      setShowForm(true);
    } catch (error) {
      console.error("Error fetching politician data:", error);
      toast.error("Failed to load politician data");
    }
  };

  const handleCreateAccount = async (politician: IPolitician) => {
    if (!canCreatePoliticianAccount) {
      toast.error("You do not have permission to create politician accounts");
      return;
    }

    if (!politician.contact?.email) {
      toast.error("Politician must have contact email to create account");
      return;
    }

    if (politician.hasAccount) {
      toast.error("Account already exists for this politician");
      return;
    }

    try {
      await politicsApi.createPoliticianAccount(politician.id, {
        email: politician.contact.email,
      });

      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["politicians"] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create account");
    }
  };

  const handleDelete = (id: string) => {
    if (!canDeletePolitician) {
      toast.error("You do not have permission to delete politicians");
      return;
    }

    confirm({
      title: "Delete Politician",
      description:
        "Are you sure you want to delete this politician? This action cannot be undone.",
      variant: "destructive",
      confirmText: "Delete",
      onConfirm: () => deleteMutation.mutate(id),
    });
  };

  const resetPagination = () => setCursorHistory([null]);

  const goToNextPage = () => {
    if (!politiciansData?.nextCursor) {
      return;
    }

    setCursorHistory((previous) => [...previous, politiciansData.nextCursor]);
  };

  const goToPreviousPage = () => {
    setCursorHistory((previous) =>
      previous.length > 1 ? previous.slice(0, -1) : previous,
    );
  };

  const politicians = politiciansData?.data || [];
  const total = politiciansData?.total || 0;

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
          {/* <Button
            variant="outline"
            onClick={() => setShowUploadModal(true)}
            disabled={uploadMutation.isPending}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload CSV
          </Button> */}
          <PermissionGate permission={PERMISSIONS.politicians.create}>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Politician
            </Button>
          </PermissionGate>
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
                  options={
                    data?.map((d) => ({
                      label: d.name,
                      value: d.id,
                    })) ?? []
                  }
                  value={initialFilter[name]}
                  onValueChange={(value: string[]) =>
                    setFilter((prev) => ({
                      ...prev,
                      [name]: value || [],
                    }))
                  }
                  popoverClassName="bg-white"
                  placeholder={`Select ${text}`}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    resetPagination();
                    setToApplyFilter(filter);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setFilter(initialFilter);
                    resetPagination();
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
                          {politician.sourceCategories?.party || "Unknown Party"} • Rating:{" "}
                          {politician.rating || 0}
                        </p>
                        <p className="text-xs text-gray-400">
                          Reports: {politician.verifiedReports || 0}/
                          {politician.totalReports || 0}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-end ml-4">
                        {politician.sourceCategories?.levels?.length > 0 && (
                          <div className="flex flex-wrap gap-1 items-center">
                            <span className="text-xs text-gray-500 font-medium mr-1">
                              Level:
                            </span>
                            {politician.sourceCategories.levels.map(
                              (l, index) => (
                                <div
                                  key={index}
                                  className="px-1.5 py-0.5 rounded bg-red-100 border border-red-300"
                                >
                                  <p className="text-red-700 text-xs font-bold">
                                    {l}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        )}
                        {politician.sourceCategories?.positions?.length > 0 && (
                          <div className="flex flex-wrap gap-1 items-center">
                            <span className="text-xs text-gray-500 font-medium mr-1">
                              Position:
                            </span>
                            {politician.sourceCategories.positions.map(
                              (p, index) => (
                                <div
                                  key={index}
                                  className="px-1.5 py-0.5 rounded bg-blue-100 border border-blue-300"
                                >
                                  <p className="text-blue-700 text-xs font-bold">
                                    {p}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        )}
                        {politician.sourceCategories?.party && (
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 font-medium mr-1">
                              Party:
                            </span>
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
                    <PermissionGate
                      permission={PERMISSIONS.politicians.createAccount}
                    >
                      <Button
                        onClick={() => handleCreateAccount(politician)}
                        size="sm"
                        variant="outline"
                      >
                        Create Account
                      </Button>
                    </PermissionGate>

                    <PermissionGate permission={PERMISSIONS.politicians.update}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(politician)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </PermissionGate>

                    <PermissionGate permission={PERMISSIONS.politicians.delete}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(politician.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </PermissionGate>
                  </div>
                </div>
              ))}
              {politiciansData && (currentPage > 1 || politiciansData.hasNext) && (
                <RenderPagination
                  currentPage={currentPage}
                  hasNext={politiciansData.hasNext}
                  onPrevious={goToPreviousPage}
                  onNext={goToNextPage}
                  totalItems={politiciansData.total}
                  pageSize={PAGE_SIZE}
                  currentItemCount={politicians.length}
                  itemName="politicians"
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Form Modal */}
      <PermissionGate
        permission={
          editingPolitician
            ? PERMISSIONS.politicians.update
            : PERMISSIONS.politicians.create
        }
      >
        {showForm && (
          <PoliticianEditForm
            editingPolitician={editingPolitician}
            setEditingPolitician={setEditingPolitician}
            setShowForm={setShowForm}
            setShowUploadModal={setShowUploadModal}
          />
        )}
      </PermissionGate>

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
                {/* <div>
                  <Label htmlFor="csvFile">CSV File</Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={uploadMutation.isPending}
                  />
                </div> */}
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
                {/* <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                    disabled={uploadMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <ConfirmDialog />
    </div>
  );
}
