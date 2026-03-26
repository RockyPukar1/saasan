import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { X, MapPin, Shield } from "lucide-react";
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
import { userApi } from "@/services/api";
import { geographicApi } from "@/services/api";
import type { IUser, UserRole } from "@/types/user";
import type {
  IProvince,
  IDistrict,
  IMunicipality,
  IWard,
} from "@/types/location";
import { FormField } from "@/components/ui/form";

interface UserEditFormProps {
  setShowForm: (show: boolean) => void;
  editingUser: IUser;
  setEditingUser: (user: IUser | null) => void;
}

interface UserFormData {
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  provinceId: string;
  districtId: string;
  municipalityId: string;
  wardId: string;
  constituencyId: string;
}

export default function UserEditForm({
  setShowForm,
  editingUser,
  setEditingUser,
}: UserEditFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    defaultValues: {
      email: editingUser.email || "",
      fullName: editingUser.fullName || "",
      role: editingUser.role || "citizen",
      isActive: editingUser.isActive ?? true,
      isVerified: editingUser.isVerified ?? false,
      provinceId: editingUser.provinceId || "",
      districtId: editingUser.districtId || "",
      municipalityId: editingUser.municipalityId || "",
      wardId: editingUser.wardId || "",
      constituencyId: editingUser.constituencyId || "",
    },
  });

  const selectedRole = watch("role");
  const selectedProvinceId = watch("provinceId");
  const selectedDistrictId = watch("districtId");
  const selectedMunicipalityId = watch("municipalityId");
  const selectedWardId = watch("wardId");
  const selectedConstituencyId = watch("constituencyId");

  const handleProvinceChange = () => {
    if (selectedProvinceId) {
      setValue("districtId", "");
      setValue("municipalityId", "");
      setValue("wardId", "");
      setValue("constituencyId", "");
    }
  };

  const handleDistrictChange = () => {
    if (selectedDistrictId) {
      setValue("municipalityId", "");
      setValue("wardId", "");
      setValue("constituencyId", "");
    }
  };

  const handleMunicipalityChange = () => {
    if (selectedMunicipalityId) {
      setValue("wardId", "");
      setValue("constituencyId", "");
    }
  };

  const handleWardChange = () => {
    if (!selectedWardId) {
      setValue("constituencyId", "");
    }
  };

  // Fetch geographical data
  const { data: provincesData } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => geographicApi.getProvinces(),
  });

  const { data: districtsData } = useQuery({
    queryKey: ["districts", selectedProvinceId],
    queryFn: () => geographicApi.getDistrictsByProvinceId(selectedProvinceId),
    enabled: !!selectedProvinceId,
  });

  const { data: municipalitiesData } = useQuery({
    queryKey: ["municipalities", selectedProvinceId, selectedDistrictId],
    queryFn: () =>
      geographicApi.getMunicipalitiesByDistrictId(selectedDistrictId),
    enabled: !!selectedProvinceId && !!selectedDistrictId,
  });

  const { data: wardsData } = useQuery({
    queryKey: [
      "wards",
      selectedProvinceId,
      selectedDistrictId,
      selectedMunicipalityId,
    ],
    queryFn: () =>
      geographicApi.getWardsByMunicipalityId(selectedMunicipalityId),
    enabled:
      !!selectedProvinceId && !!selectedDistrictId && !!selectedMunicipalityId,
  });

  const { data: constituencyData } = useQuery({
    queryKey: [
      "constituency",
      selectedProvinceId,
      selectedDistrictId,
      selectedMunicipalityId,
      selectedWardId,
    ],
    queryFn: () => geographicApi.getConstituencyByWardId(selectedWardId),
    enabled:
      !!selectedProvinceId &&
      !!selectedDistrictId &&
      !!selectedMunicipalityId &&
      !!selectedWardId &&
      !!selectedConstituencyId,
  });

  const provinces = provincesData?.data || [];
  const districts = districtsData?.data || [];
  const municipalities = municipalitiesData?.data || [];
  const wards = wardsData?.data || [];
  const constituency = constituencyData?.data || null;

  const createMutation = useMutation({
    mutationFn: async () => {
      // For now, we'll skip user creation as it needs auth endpoints
      throw new Error("User creation not implemented yet");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully!");
      setShowForm(false);
      setEditingUser(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create user");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UserFormData }) => {
      const response = await userApi.update(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully!");
      setShowForm(false);
      setEditingUser(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  const onSubmit = (data: UserFormData) => {
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data });
    } else {
      createMutation.mutate();
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingUser(null);
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
                {editingUser ? "Edit User" : "Add New User"}
              </CardTitle>
              <CardDescription>
                {editingUser
                  ? "Update user information and permissions"
                  : "Enter details for new user account"}
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
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="user@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                  placeholder="John Doe"
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value: UserRole) => setValue("role", value)}
                >
                  <SelectTrigger
                    className={errors.role ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="citizen">Citizen</SelectItem>
                    <SelectItem value="politician">Politician</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register("isActive")}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive" className="flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Active
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isVerified"
                  {...register("isVerified")}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isVerified" className="flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Verified
                </Label>
              </div>
            </div>

            {/* Geographical Information */}
            <div className="space-y-4">
              <Label className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Geographical Information
              </Label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="provinceId"
                  render={({ field }) => (
                    <div>
                      <Label htmlFor="provinceId">Province</Label>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleProvinceChange();
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((province: IProvince) => (
                            <SelectItem key={province.id} value={province.id}>
                              {province.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                <FormField
                  control={control}
                  name="districtId"
                  render={({ field }) => (
                    <div>
                      <Label htmlFor="districtId">District</Label>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleDistrictChange();
                        }}
                        disabled={!selectedProvinceId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district: IDistrict) => (
                            <SelectItem key={district.id} value={district.id}>
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                <FormField
                  control={control}
                  name="municipalityId"
                  render={({ field }) => (
                    <div>
                      <Label htmlFor="municipalityId">Municipality</Label>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleMunicipalityChange();
                        }}
                        disabled={!selectedDistrictId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select municipality" />
                        </SelectTrigger>
                        <SelectContent>
                          {municipalities.map((municipality: IMunicipality) => (
                            <SelectItem
                              key={municipality.id}
                              value={municipality.id}
                            >
                              {municipality.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                <FormField
                  control={control}
                  name="wardId"
                  render={({ field }) => (
                    <div>
                      <Label htmlFor="wardId">Ward</Label>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleWardChange();
                        }}
                        disabled={!selectedMunicipalityId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ward" />
                        </SelectTrigger>
                        <SelectContent>
                          {wards.map((ward: IWard) => (
                            <SelectItem key={ward.id} value={ward.id}>
                              {ward.wardNumber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>
              <div>
                <div>
                  <Label htmlFor="constituencyId">Constituency</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="constituencyId"
                      {...register("constituencyId")}
                      placeholder="Auto-selected when ward is chosen"
                      className="flex-1 bg-gray-50"
                      readOnly
                      value={
                        constituency
                          ? `${districts.find((d) => d.id === selectedDistrictId)?.name || ""} - ${constituency?.constituencyNumber || ""}`
                          : ""
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

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
                  : editingUser
                    ? "Update User"
                    : "Create User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
