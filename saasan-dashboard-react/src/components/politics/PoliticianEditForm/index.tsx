import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { politicianSchema, type PoliticianFormData } from "@/lib/validations";
import { politicsApi } from "@/services/api";
import type { IPolitician } from "@/types/politics";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface IPoliticianEditForm {
  setShowForm: (show: boolean) => void;
  editingPolitician: IPolitician;
  setEditingPolitician: (politician: IPolitician | null) => void;
  setShowUploadModal: (show: boolean) => void;
}

export default function PoliticianEditForm({ setShowForm, editingPolitician, setEditingPolitician }: IPoliticianEditForm) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PoliticianFormData>({
    defaultValues: editingPolitician,
    resolver: zodResolver(politicianSchema),
  });

  const queryClient = useQueryClient();

  const handleFormSubmit = (data: PoliticianFormData) => {
    if (editingPolitician) {
      updateMutation.mutate({ id: editingPolitician.id, data: data as any });
    } else {
      createMutation.mutate(data);
    }
  };

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
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IPolitician> }) =>
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
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={() => {
        setEditingPolitician(null);
        setShowForm(false)
      }}
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
               onClick={() => {
                setEditingPolitician(null);
                setShowForm(false)
              }}
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
  )
}