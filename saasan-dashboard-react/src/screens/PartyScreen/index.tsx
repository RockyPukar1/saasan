import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  Plus,
  Search,
  Upload,
  Edit,
  Trash2,
  Filter,
  Download,
  X,
  Palette,
  Building,
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
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import type { IParty } from "@/types/politics";
import PartyEditForm from "@/components/party/PartyEditForm";

const initialFilter = {
  search: "",
};

export default function PartyScreen() {
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [searchQuery, setSearchQuery] = useState("");
  const [toApplyFilter, setToApplyFilter] = useState(initialFilter);
  const [showForm, setShowForm] = useState(false);
  const [editingParty, setEditingParty] = useState<IParty | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const queryClient = useQueryClient();

  const { data: partiesData, isLoading } = useQuery({
    queryKey: ["parties"],
    queryFn: () => politicsApi.getParties(),
  });

  // Delete party mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await politicsApi.delete(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      toast.success("Party deleted successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to delete party";
      if (
        error.message?.includes(
          "Cannot delete party with associated politicians",
        )
      ) {
        toast.error(errorMessage, {
          duration: 8000,
          style: {
            background: "#ef4444",
            color: "white",
          },
        });
      } else {
        toast.error(errorMessage);
      }
    },
  });

  // Bulk upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Note: You'll need to add this endpoint to the backend
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/parties/bulk-upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload file");
      return response.json();
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      toast.success(`Successfully imported ${response.imported} parties`);
      setShowUploadModal(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to upload file");
    },
  });

  const handleEdit = async (party: IParty) => {
    try {
      setEditingParty(party);
      setShowForm(true);
    } catch (error) {
      console.error("Error fetching party data:", error);
      toast.error("Failed to load party data");
    }
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete Party",
      description:
        "Are you sure you want to delete this party? This action cannot be undone.",
      variant: "destructive",
      confirmText: "Delete",
      onConfirm: () => deleteMutation.mutate(id),
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const parties = partiesData || [];
  const total = parties.length;

  const filteredParties = parties.filter((party: IParty) => {
    const searchLower = toApplyFilter.search.toLowerCase();
    return (
      party.name.toLowerCase().includes(searchLower) ||
      party.abbreviation.toLowerCase().includes(searchLower) ||
      (party.ideology && party.ideology.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Political Parties
          </h1>
          <p className="text-gray-600">
            Manage political party data and information
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
            Add Party
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search parties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-end">
                <Button
                  onClick={() => setToApplyFilter({ search: searchQuery })}
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
                    setSearchQuery("");
                    setToApplyFilter(initialFilter);
                  }}
                  variant="outline"
                  disabled={!toApplyFilter.search}
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

      {/* Parties List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Political Parties ({total})</CardTitle>
              <CardDescription>
                Manage political party profiles and information
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
          ) : filteredParties.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No parties found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredParties.map((party) => (
                <div
                  key={party.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: party.color }}
                  >
                    {party.abbreviation}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {party.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {party.abbreviation} • Founded:{" "}
                          {new Date(party.foundedIn).getFullYear()}
                        </p>
                        {party.ideology && (
                          <p className="text-xs text-gray-400">
                            Ideology: {party.ideology}
                          </p>
                        )}
                        {party.count !== undefined && (
                          <p className="text-xs text-gray-400">
                            Members: {party.count}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 items-end ml-4">
                        <div className="flex items-center">
                          <Palette className="h-3 w-3 text-gray-500 mr-1" />
                          <div
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: party.color }}
                            title={party.color}
                          />
                        </div>
                        {party.logoUrl && (
                          <img
                            src={party.logoUrl}
                            alt={`${party.name} logo`}
                            className="h-8 w-8 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(party)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(party.id)}
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
        <PartyEditForm
          setShowForm={setShowForm}
          editingParty={editingParty}
          setEditingParty={setEditingParty}
        />
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
                <CardTitle>Upload Parties CSV</CardTitle>
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
                Upload a CSV file with party data. Make sure the file has the
                correct format.
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
                    <li>name</li>
                    <li>abbreviation</li>
                    <li>ideology</li>
                    <li>foundedIn</li>
                    <li>logoUrl</li>
                    <li>color</li>
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
      <ConfirmDialog />
    </div>
  );
}
