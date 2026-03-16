import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { X, Users } from "lucide-react";
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
import { partyApi } from "@/services/api";
import type { IParty } from "@/types/politics";

interface PartyEditFormProps {
  setShowForm: (show: boolean) => void;
  editingParty: IParty | null;
  setEditingParty: (party: IParty | null) => void;
}

interface PartyFormData {
  name: string;
  abbreviation: string;
  ideology: string;
  foundedIn: string;
  logoUrl: string;
  color: string;
}

export default function PartyEditForm({
  setShowForm,
  editingParty,
  setEditingParty,
}: PartyEditFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PartyFormData>({
    defaultValues: {
      name: "",
      abbreviation: "",
      ideology: "",
      foundedIn: "",
      logoUrl: "",
      color: "#FF0000",
    },
  });

  const logoUrl = watch("logoUrl");

  // Fetch politicians associated with party when editing
  const { data: partyPoliticiansData, isLoading: isLoadingPoliticians } =
    useQuery({
      queryKey: ["party-politicians", editingParty?.id],
      queryFn: async () => {
        if (!editingParty?.id) return { data: [] };
        const response = await partyApi.getPoliticiansByParty(editingParty.id);
        return response;
      },
      enabled: !!editingParty?.id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

  const partyPoliticians = partyPoliticiansData?.data || [];

  useEffect(() => {
    if (editingParty) {
      reset({
        name: editingParty.name || "",
        abbreviation: editingParty.abbreviation || "",
        ideology: editingParty.ideology || "",
        foundedIn: new Date(editingParty.foundedIn).getFullYear().toString(),
        logoUrl: editingParty.logoUrl || "",
        color: editingParty.color || "#FF0000",
      });
    } else {
      reset({
        name: "",
        abbreviation: "",
        ideology: "",
        foundedIn: "",
        logoUrl: "",
        color: "#FF0000",
      });
    }
  }, [editingParty, reset]);

  const createMutation = useMutation({
    mutationFn: async (data: PartyFormData) => {
      const response = await partyApi.create({
        ...data,
        foundedIn: new Date(parseInt(data.foundedIn), 0, 1),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      toast.success("Party created successfully!");
      setShowForm(false);
      setEditingParty(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create party");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PartyFormData }) => {
      const response = await partyApi.update(id, {
        ...data,
        foundedIn: new Date(parseInt(data.foundedIn), 0, 1),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      toast.success("Party updated successfully!");
      setShowForm(false);
      setEditingParty(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update party");
    },
  });

  const onSubmit = (data: PartyFormData) => {
    if (editingParty) {
      updateMutation.mutate({ id: editingParty.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingParty(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {editingParty ? "Edit Party" : "Add New Party"}
              </CardTitle>
              <CardDescription>
                {editingParty
                  ? "Update party information"
                  : "Enter details for new political party"}
              </CardDescription>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Party Name *</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Party name is required" })}
                  placeholder="Enter party name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="abbreviation">Abbreviation *</Label>
                <Input
                  id="abbreviation"
                  {...register("abbreviation", {
                    required: "Party abbreviation is required",
                    maxLength: {
                      value: 10,
                      message: "Abbreviation must be 10 characters or less",
                    },
                  })}
                  placeholder="e.g., NC, UML"
                  className={errors.abbreviation ? "border-red-500" : ""}
                />
                {errors.abbreviation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.abbreviation.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ideology">Ideology</Label>
                <Input
                  id="ideology"
                  {...register("ideology")}
                  placeholder="e.g., Social Democracy, Communism"
                />
              </div>
              <div>
                <Label htmlFor="foundedIn">Founded Year *</Label>
                <Input
                  id="foundedIn"
                  type="number"
                  {...register("foundedIn", {
                    required: "Founded year is required",
                    min: {
                      value: 1800,
                      message: "Year must be 1800 or later",
                    },
                    max: {
                      value: new Date().getFullYear(),
                      message: `Year cannot be later than ${new Date().getFullYear()}`,
                    },
                    validate: {
                      isNumber: (value) =>
                        !isNaN(Number(value)) || "Must be a valid number",
                    },
                  })}
                  placeholder="e.g., 1950"
                  className={errors.foundedIn ? "border-red-500" : ""}
                />
                {errors.foundedIn && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.foundedIn.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  {...register("logoUrl")}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <Label htmlFor="color">Party Color *</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="color"
                    type="color"
                    {...register("color", {
                      required: "Party color is required",
                      pattern: {
                        value: /^#[0-9A-Fa-f]{6}$/,
                        message: "Must be a valid hex color",
                      },
                    })}
                    className="w-20 h-10"
                  />
                  <Input
                    {...register("color")}
                    placeholder="#FF0000"
                    className="flex-1"
                  />
                </div>
                {errors.color && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.color.message}
                  </p>
                )}
              </div>
            </div>

            {logoUrl && (
              <div>
                <Label>Logo Preview</Label>
                <div className="mt-2 p-4 border rounded-lg">
                  <img
                    src={logoUrl}
                    alt="Party logo preview"
                    className="h-16 w-auto object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Associated Politicians Section */}
            {editingParty && (
              <div>
                <Label>
                  Associated Politicians ({partyPoliticians.length})
                </Label>
                <div className="mt-2 border rounded-lg">
                  {isLoadingPoliticians ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">
                        Loading politicians...
                      </p>
                    </div>
                  ) : partyPoliticians.length === 0 ? (
                    <div className="p-4 text-center">
                      <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        No politicians associated with this party
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-40 overflow-y-auto">
                      {partyPoliticians.map((politician: any) => (
                        <div
                          key={politician.id}
                          className="flex items-center space-x-3 p-3 border-b hover:bg-gray-50"
                        >
                          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {politician.fullName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {politician.position} • Rating:{" "}
                              {politician.rating || 0}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">
                              {politician.verifiedReports || 0}/
                              {politician.totalReports || 0} reports
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : editingParty
                    ? "Update Party"
                    : "Create Party"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
