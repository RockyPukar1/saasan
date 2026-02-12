import { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { politicsApi } from "@/services/api";
import { politicianSchema } from "@/lib/validations";
import {
  Plus,
  Trash2,
  Save,
  Calendar,
  Award,
  Briefcase,
  RotateCcw,
  User,
  Share2,
} from "lucide-react";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import type { IPolitician } from "@/types/politics";

interface IPoliticianEditForm {
  setShowForm: (show: boolean) => void;
  editingPolitician: IPolitician | null;
  setEditingPolitician: (politician: IPolitician | null) => void;
  setShowUploadModal?: (show: boolean) => void;
}

type PoliticianFormData = z.infer<typeof politicianSchema>;

export default function PoliticianEditForm({
  setShowForm,
  editingPolitician,
  setEditingPolitician,
}: IPoliticianEditForm) {
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editedItems, setEditedItems] = useState<{
    promises: Set<number>;
    achievements: Set<number>;
    experiences: Set<number>;
  }>({ promises: new Set(), achievements: new Set(), experiences: new Set() });
  const [originalValues, setOriginalValues] = useState<any>(null);
  const [showReviewChanges, setShowReviewChanges] = useState(false);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PoliticianFormData>({
    defaultValues: {
      fullName: "",
      biography: "",
      education: "",
      profession: "",
      experienceYears: 0,
      isIndependent: false,
      partyId: "",
      positionIds: [],
      levelIds: [],
      constituencyId: "",
      status: "active",
      contact: {
        email: "",
        phone: "",
        website: "",
      },
      socialMedia: {
        facebook: "",
        twitter: "",
        instagram: "",
      },
      promises: [],
      achievements: [],
    },
    resolver: zodResolver(politicianSchema),
  });

  const queryClient = useQueryClient();

  // Auto-fill form when editingPolitician changes
  useEffect(() => {
    if (editingPolitician) {
      const formData = {
        fullName: editingPolitician.fullName || "",
        biography: editingPolitician.biography || "",
        education: editingPolitician.education || "",
        profession: editingPolitician.profession || "",
        experienceYears: editingPolitician.experienceYears || 0,
        experiences: editingPolitician.experiences || [],
        isIndependent: editingPolitician.isIndependent || false,
        party:
          editingPolitician.sourceCategories?.party ||
          editingPolitician.party ||
          "",
        partyId: editingPolitician.partyId || "",
        positionIds: editingPolitician.sourceCategories?.positions || [],
        levelIds: editingPolitician.sourceCategories?.levels || [],
        constituencyId: editingPolitician.constituencyId || "",
        status: (editingPolitician.status || "active") as
          | "active"
          | "inactive"
          | "deceased",
        contact: {
          email: editingPolitician.contact?.email || "",
          phone: editingPolitician.contact?.phone || "",
          website: editingPolitician.contact?.website || "",
        },
        age: editingPolitician.age || 0,
        rating: editingPolitician.rating || 0,
        totalVotes: editingPolitician.totalVotes || 0,
        isActive: editingPolitician.isActive ?? true,
        createdAt: editingPolitician.createdAt
          ? new Date(editingPolitician.createdAt).toISOString().split("T")[0]
          : "",
        photoUrl: editingPolitician.photoUrl || "",
        dateOfBirth: editingPolitician.dateOfBirth || "",
        totalVotesReceived:
          editingPolitician.totalVotesReceived ||
          editingPolitician.totalVotes ||
          0,
        termStartDate: editingPolitician.termStartDate || "",
        termEndDate: editingPolitician.termEndDate || "",
        profileImageUrl: editingPolitician.profileImageUrl || "",
        officialWebsite: editingPolitician.contact?.website || "",
        socialMedia: {
          facebook: editingPolitician.socialMedia?.facebook || "",
          twitter: editingPolitician.socialMedia?.twitter || "",
          instagram: editingPolitician.socialMedia?.instagram || "",
        },
        promises: editingPolitician.promises || [],
        achievements: editingPolitician.achievements || [],
      };

      reset(formData);
      setOriginalValues(JSON.parse(JSON.stringify(formData))); // Deep copy for comparison
      setChangedFields(new Set());
      setEditedItems({
        promises: new Set(),
        achievements: new Set(),
        experiences: new Set(),
      });
    } else {
      // Reset to empty form when not editing
      const emptyFormData = {
        fullName: "",
        biography: "",
        education: "",
        profession: "",
        experienceYears: 0,
        experiences: [],
        isIndependent: false,
        party: "",
        partyId: "",
        positionIds: [],
        constituencyId: "",
        status: "active" as const,
        contact: {
          email: "",
          phone: "",
          website: "",
        },
        age: 0,
        rating: 0,
        totalVotes: 0,
        isActive: true,
        createdAt: "",
        photoUrl: "",
        dateOfBirth: "",
        totalVotesReceived: 0,
        termStartDate: "",
        termEndDate: "",
        profileImageUrl: "",
        officialWebsite: "",
        socialMedia: {
          facebook: "",
          twitter: "",
          instagram: "",
        },
        promises: [],
        achievements: [],
      };

      reset(emptyFormData);
      setOriginalValues(JSON.parse(JSON.stringify(emptyFormData)));
    }
  }, [editingPolitician, reset]);

  // Track form changes with actual value comparison
  useEffect(() => {
    if (!originalValues) return;

    const currentValues = watch();
    const newChangedFields = new Set<string>();

    // Compare each field with original values
    const compareFields = (obj1: any, obj2: any, prefix: string = "") => {
      Object.keys(obj2).forEach((key) => {
        const fieldPath = prefix ? `${prefix}.${key}` : key;

        if (Array.isArray(obj2[key])) {
          // Handle arrays (promises, achievements, experiences)
          obj2[key].forEach((item: any, index: number) => {
            if (prefix) {
              // Track individual array items
              const itemChanged =
                JSON.stringify(item) !==
                JSON.stringify(obj1[key]?.[index] || {});
              if (itemChanged) {
                newChangedFields.add(fieldPath);
                if (prefix === "promises") {
                  setEditedItems((prev) => ({
                    ...prev,
                    [prefix]: new Set(prev[prefix]).add(index),
                  }));
                } else if (prefix === "achievements") {
                  setEditedItems((prev) => ({
                    ...prev,
                    [prefix]: new Set(prev[prefix]).add(index),
                  }));
                } else if (prefix === "experiences") {
                  setEditedItems((prev) => ({
                    ...prev,
                    [prefix]: new Set(prev[prefix]).add(index),
                  }));
                }
              }
            }
          });
        } else if (typeof obj2[key] === "object" && obj2[key] !== null) {
          compareFields(obj1[key] || {}, obj2[key], fieldPath);
        } else {
          // Handle primitive values
          if (JSON.stringify(obj1[key] || "") !== JSON.stringify(obj2[key])) {
            newChangedFields.add(fieldPath);
          }
        }
      });
    };

    compareFields(originalValues, currentValues);
    setChangedFields(newChangedFields);
    setHasUnsavedChanges(
      newChangedFields.size > 0 ||
        editedItems.promises.size > 0 ||
        editedItems.achievements.size > 0 ||
        editedItems.experiences.size > 0,
    );
  }, [watch, originalValues, editedItems]);

  // Utility function to check if a field is changed
  const isFieldChanged = useCallback(
    (fieldName: string) => {
      return changedFields.has(fieldName);
    },
    [changedFields],
  );

  // Utility function to get field styling based on change status
  const getFieldClassName = useCallback(
    (fieldName: string, baseClassName: string = "") => {
      const isChanged = isFieldChanged(fieldName);
      return `${baseClassName} ${isChanged ? "ring-2 ring-yellow-400 bg-yellow-50" : ""}`.trim();
    },
    [isFieldChanged],
  );

  // Function to scroll to and highlight a field
  // const scrollToField = useCallback((fieldName: string) => {
  //   const element = document.getElementById(fieldName);
  //   if (element) {
  //     element.scrollIntoView({ behavior: "smooth", block: "center" });
  //     element.focus();
  //     // Add temporary highlight effect
  //     element.classList.add("ring-4", "ring-yellow-500", "bg-yellow-100");
  //     setTimeout(() => {
  //       element.classList.remove("ring-4", "ring-yellow-500", "bg-yellow-100");
  //     }, 2000);
  //   }
  // }, []);

  const markItemAsSaved = useCallback(
    (type: "promises" | "achievements" | "experiences", index: number) => {
      setEditedItems((prev) => {
        const newSet = new Set(prev[type]);
        newSet.delete(index);
        return {
          ...prev,
          [type]: newSet,
        };
      });
    },
    [],
  );

  const markItemAsEdited = useCallback(
    (type: "promises" | "achievements" | "experiences", index: number) => {
      setEditedItems((prev) => ({
        ...prev,
        [type]: new Set(prev[type]).add(index),
      }));
    },
    [],
  );

  const resetItem = useCallback(
    (type: "promises" | "achievements" | "experiences", index: number) => {
      if (editingPolitician && editingPolitician[type]) {
        const originalData = editingPolitician[type][index];
        if (originalData) {
          setValue(`${type}.${index}`, originalData);
          markItemAsSaved(type, index);
        }
      }
    },
    [editingPolitician, setValue, markItemAsSaved],
  );

  const handleClose = useCallback(() => {
    if (
      hasUnsavedChanges ||
      editedItems.promises.size > 0 ||
      editedItems.achievements.size > 0 ||
      editedItems.experiences.size > 0
    ) {
      confirm({
        title: "Unsaved Changes",
        description:
          "You have unsaved changes. Do you want to save them before closing?",
        variant: "warning",
        confirmText: "Save & Close",
        cancelText: "Discard & Close",
        middleButton: {
          text: "Review Changes",
          onClick: () => {
            setShowReviewChanges(true);
          },
        },
        onConfirm: () => {
          // Save all changes and close will be handled by the main form submission
          handleSubmit((_) => {
            if (editingPolitician) {
              // This will be handled by the main update mutation
              setShowForm(false);
            } else {
              // This will be handled by the main create mutation
              setShowForm(false);
            }
          })();
        },
        onCancel: () => {
          setShowForm(false);
          reset();
        },
      });
    } else {
      setShowForm(false);
      reset();
    }
  }, [
    hasUnsavedChanges,
    editedItems,
    confirm,
    handleSubmit,
    editingPolitician,
    setShowForm,
    reset,
  ]);

  const {
    fields: promiseFields,
    append: appendPromise,
    remove: removePromise,
  } = useFieldArray({
    control,
    name: "promises",
  });

  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({
    control,
    name: "achievements",
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experiences",
  });

  const addPromise = () => {
    appendPromise({
      title: "",
      description: "",
      status: "not-started" as const,
      dueDate: "",
      progress: 0,
    });
  };

  const addAchievement = () => {
    appendAchievement({
      title: "",
      description: "",
      category: "policy" as const,
      date: new Date(),
    });
  };

  const addExperience = () => {
    appendExperience({
      category: "",
      title: "",
      company: "",
      startDate: new Date(),
      endDate: new Date(),
    });
  };

  const handleFormSubmit = (data: PoliticianFormData) => {
    if (editingPolitician) {
      updateMutation.mutate({ id: editingPolitician.id, data: data as any });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleRemovePromise = (index: number) => {
    confirm({
      title: "Delete Promise",
      description:
        "Are you sure you want to delete this promise? This action cannot be undone.",
      variant: "destructive",
      confirmText: "Delete",
      onConfirm: () => removePromise(index),
    });
  };

  const handleRemoveAchievement = (index: number) => {
    confirm({
      title: "Delete Achievement",
      description:
        "Are you sure you want to delete this achievement? This action cannot be undone.",
      variant: "destructive",
      confirmText: "Delete",
      onConfirm: () => removeAchievement(index),
    });
  };

  const handleRemoveExperience = (index: number) => {
    confirm({
      title: "Delete Experience",
      description:
        "Are you sure you want to delete this experience? This action cannot be undone.",
      variant: "destructive",
      confirmText: "Delete",
      onConfirm: () => removeExperience(index),
    });
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
        error.response?.data?.message || "Failed to create politician",
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
        error.response?.data?.message || "Failed to update politician",
      );
    },
  });

  // Individual section update mutations
  const updatePromisesMutation = useMutation({
    mutationFn: ({ id, promises }: { id: string; promises: any[] }) =>
      politicsApi.updatePromises(id, promises),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["politicians"] });
      toast.success("Promises updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update promises");
    },
  });

  const updateAchievementsMutation = useMutation({
    mutationFn: ({ id, achievements }: { id: string; achievements: any[] }) =>
      politicsApi.updateAchievements(id, achievements),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["politicians"] });
      toast.success("Achievements updated successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update achievements",
      );
    },
  });

  const updateExperiencesMutation = useMutation({
    mutationFn: ({ id, experiences }: { id: string; experiences: any[] }) =>
      politicsApi.updateExperiences(id, experiences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["politicians"] });
      toast.success("Experiences updated successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update experiences",
      );
    },
  });

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        e.stopPropagation();
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
              onClick={handleClose}
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
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <User className="w-4 h-4" />
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    className={getFieldClassName(
                      "fullName",
                      errors.fullName ? "border-red-500" : "",
                    )}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-600">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    {...register("age", { valueAsNumber: true })}
                    className={getFieldClassName(
                      "age",
                      errors.age ? "border-red-500" : "",
                    )}
                  />
                  {errors.age && (
                    <p className="text-sm text-red-600">{errors.age.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="biography">Biography</Label>
                <Textarea
                  id="biography"
                  rows={3}
                  {...register("biography")}
                  className={getFieldClassName(
                    "biography",
                    errors.biography ? "border-red-500" : "",
                  )}
                  placeholder="Brief biography of the politician..."
                />
                {errors.biography && (
                  <p className="text-sm text-red-600">
                    {errors.biography.message}
                  </p>
                )}
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Briefcase className="w-4 h-4" />
                <h3 className="text-lg font-semibold">
                  Professional Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    {...register("education")}
                    className={getFieldClassName(
                      "education",
                      errors.education ? "border-red-500" : "",
                    )}
                    placeholder="Educational background..."
                  />
                  {errors.education && (
                    <p className="text-sm text-red-600">
                      {errors.education.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    {...register("profession")}
                    className={getFieldClassName(
                      "profession",
                      errors.profession ? "border-red-500" : "",
                    )}
                    placeholder="Primary profession..."
                  />
                  {errors.profession && (
                    <p className="text-sm text-red-600">
                      {errors.profession.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div>
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    {...register("rating", { valueAsNumber: true })}
                    className={errors.rating ? "border-red-500" : ""}
                  />
                  {errors.rating && (
                    <p className="text-sm text-red-600">
                      {errors.rating.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="totalVotes">Total Votes</Label>
                  <Input
                    id="totalVotes"
                    type="number"
                    {...register("totalVotes", { valueAsNumber: true })}
                    className={errors.totalVotes ? "border-red-500" : ""}
                  />
                  {errors.totalVotes && (
                    <p className="text-sm text-red-600">
                      {errors.totalVotes.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Political Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Calendar className="w-4 h-4" />
                <h3 className="text-lg font-semibold">Political Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="party">Party Name</Label>
                  <Input
                    id="party"
                    {...register("party")}
                    className={errors.party ? "border-red-500" : ""}
                    placeholder="Political party name..."
                  />
                  {errors.party && (
                    <p className="text-sm text-red-600">
                      {errors.party.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="isIndependent">Independent Candidate</Label>
                  <Select
                    value={watch("isIndependent")?.toString() || "false"}
                    onValueChange={(value) =>
                      setValue("isIndependent", value === "true")
                    }
                  >
                    <SelectTrigger
                      className={errors.isIndependent ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Party Member</SelectItem>
                      <SelectItem value="true">Independent</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.isIndependent && (
                    <p className="text-sm text-red-600">
                      {errors.isIndependent.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="partyId">Party ID</Label>
                  <Input
                    id="partyId"
                    {...register("partyId")}
                    className={errors.partyId ? "border-red-500" : ""}
                    placeholder="Party reference ID..."
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
                    {...register("constituencyId")}
                    className={errors.constituencyId ? "border-red-500" : ""}
                    placeholder="Constituency reference..."
                  />
                  {errors.constituencyId && (
                    <p className="text-sm text-red-600">
                      {errors.constituencyId.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="isActive">Status</Label>
                  <Select
                    value={watch("isActive")?.toString() || "true"}
                    onValueChange={(value) =>
                      setValue("isActive", value === "true")
                    }
                  >
                    <SelectTrigger
                      className={errors.isActive ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.isActive && (
                    <p className="text-sm text-red-600">
                      {errors.isActive.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="createdAt">Joined Date</Label>
                  <Input
                    id="createdAt"
                    type="date"
                    {...register("createdAt")}
                    className={errors.createdAt ? "border-red-500" : ""}
                  />
                  {errors.createdAt && (
                    <p className="text-sm text-red-600">
                      {errors.createdAt.message}
                    </p>
                  )}
                </div>
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
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Share2 className="w-4 h-4" />
                <h3 className="text-lg font-semibold">Contact Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    {...register("contact.email")}
                    className={errors.contact?.email ? "border-red-500" : ""}
                    placeholder="email@example.com"
                  />
                  {errors.contact?.email && (
                    <p className="text-sm text-red-600">
                      {errors.contact.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input
                    id="contactPhone"
                    {...register("contact.phone")}
                    className={errors.contact?.phone ? "border-red-500" : ""}
                    placeholder="+1234567890"
                  />
                  {errors.contact?.phone && (
                    <p className="text-sm text-red-600">
                      {errors.contact.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactWebsite">Contact Website</Label>
                  <Input
                    id="contactWebsite"
                    type="url"
                    {...register("contact.website")}
                    className={errors.contact?.website ? "border-red-500" : ""}
                    placeholder="https://example.com"
                  />
                  {errors.contact?.website && (
                    <p className="text-sm text-red-600">
                      {errors.contact.website.message}
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
                    placeholder="https://official-website.com"
                  />
                  {errors.officialWebsite && (
                    <p className="text-sm text-red-600">
                      {errors.officialWebsite.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Share2 className="w-4 h-4" />
                <h3 className="text-lg font-semibold">Social Media</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    {...register("socialMedia.facebook")}
                    placeholder="Facebook username"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    {...register("socialMedia.twitter")}
                    placeholder="@username"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    {...register("socialMedia.instagram")}
                    placeholder="@username"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="profileImageUrl">Profile Image URL</Label>
                <Input
                  id="profileImageUrl"
                  type="url"
                  {...register("profileImageUrl")}
                  className={errors.profileImageUrl ? "border-red-500" : ""}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.profileImageUrl && (
                  <p className="text-sm text-red-600">
                    {errors.profileImageUrl.message}
                  </p>
                )}
              </div>
            </div>

            {/* Promises Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Calendar className="w-4 h-4" />
                <h3 className="text-lg font-semibold">Political Promises</h3>
              </div>

              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPromise}
                  className="mb-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Promise
                </Button>
              </div>

              {promiseFields.map((field, index) => (
                <Card key={field.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Promise #{index + 1}</h4>
                    <div className="flex gap-2">
                      {editingPolitician && editedItems.promises.has(index) && (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const promises = watch("promises") || [];
                              const singlePromise = promises[index];
                              if (singlePromise) {
                                updatePromisesMutation.mutate({
                                  id: editingPolitician.id,
                                  promises: [singlePromise],
                                });
                                markItemAsSaved("promises", index);
                              }
                            }}
                            disabled={updatePromisesMutation.isPending}
                            className="flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            {updatePromisesMutation.isPending
                              ? "Saving..."
                              : "Save"}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => resetItem("promises", index)}
                            className="flex items-center gap-2"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                          </Button>
                        </>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemovePromise(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`promiseTitle${index}`}>Title</Label>
                      <Input
                        id={`promiseTitle${index}`}
                        {...register(`promises.${index}.title`, {
                          onChange: () => {
                            if (editingPolitician) {
                              markItemAsEdited("promises", index);
                            }
                          },
                        })}
                        placeholder="Promise title..."
                      />
                      {errors.promises?.[index]?.title && (
                        <p className="text-sm text-red-600">
                          {errors.promises[index]?.title?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`promiseStatus${index}`}>Status</Label>
                      <Select
                        onValueChange={(value) => {
                          setValue(`promises.${index}.status`, value as any);
                          if (editingPolitician) {
                            markItemAsEdited("promises", index);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="fulfilled">Fulfilled</SelectItem>
                          <SelectItem value="broken">Broken</SelectItem>
                          <SelectItem value="not-started">
                            Not Started
                          </SelectItem>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.promises?.[index]?.status && (
                        <p className="text-sm text-red-600">
                          {errors.promises[index]?.status?.message}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor={`promiseDescription${index}`}>
                        Description
                      </Label>
                      <Textarea
                        id={`promiseDescription${index}`}
                        {...register(`promises.${index}.description`, {
                          onChange: () => {
                            if (editingPolitician) {
                              markItemAsEdited("promises", index);
                            }
                          },
                        })}
                        placeholder="Promise description..."
                        rows={3}
                      />
                      {errors.promises?.[index]?.description && (
                        <p className="text-sm text-red-600">
                          {errors.promises[index]?.description?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`promiseDueDate${index}`}>Due Date</Label>
                      <Input
                        id={`promiseDueDate${index}`}
                        type="date"
                        {...register(`promises.${index}.dueDate`, {
                          onChange: () => {
                            if (editingPolitician) {
                              markItemAsEdited("promises", index);
                            }
                          },
                        })}
                      />
                      {errors.promises?.[index]?.dueDate && (
                        <p className="text-sm text-red-600">
                          {errors.promises[index]?.dueDate?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`promiseProgress${index}`}>
                        Progress (%)
                      </Label>
                      <Input
                        id={`promiseProgress${index}`}
                        type="number"
                        min="0"
                        max="100"
                        {...register(`promises.${index}.progress`, {
                          onChange: () => {
                            if (editingPolitician) {
                              markItemAsEdited("promises", index);
                            }
                          },
                        })}
                        placeholder="0-100"
                      />
                      {errors.promises?.[index]?.progress && (
                        <p className="text-sm text-red-600">
                          {errors.promises[index]?.progress?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              {promiseFields.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No promises added yet
                </p>
              )}
            </div>

            {/* Achievements Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Award className="w-4 h-4" />
                <h3 className="text-lg font-semibold">Achievements</h3>
              </div>

              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addAchievement}
                  className="mb-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Achievement
                </Button>
              </div>

              {achievementFields.map((field, index) => (
                <Card key={field.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Achievement #{index + 1}</h4>
                    <div className="flex gap-2">
                      {editingPolitician &&
                        editedItems.achievements.has(index) && (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const achievements =
                                  watch("achievements") || [];
                                const singleAchievement = achievements[index];
                                if (singleAchievement) {
                                  updateAchievementsMutation.mutate({
                                    id: editingPolitician.id,
                                    achievements: [singleAchievement],
                                  });
                                  markItemAsSaved("achievements", index);
                                }
                              }}
                              disabled={updateAchievementsMutation.isPending}
                              className="flex items-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              {updateAchievementsMutation.isPending
                                ? "Saving..."
                                : "Save"}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => resetItem("achievements", index)}
                              className="flex items-center gap-2"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Reset
                            </Button>
                          </>
                        )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveAchievement(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`achievementTitle${index}`}>Title</Label>
                      <Input
                        id={`achievementTitle${index}`}
                        {...register(`achievements.${index}.title`)}
                        placeholder="Achievement title..."
                      />
                    </div>
                    <div>
                      <Label htmlFor={`achievementCategory${index}`}>
                        Category
                      </Label>
                      <Select
                        value={
                          watch(`achievements.${index}.category`) || "policy"
                        }
                        onValueChange={(value) =>
                          setValue(
                            `achievements.${index}.category`,
                            value as any,
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="policy">Policy</SelectItem>
                          <SelectItem value="development">
                            Development
                          </SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="economic">Economic</SelectItem>
                          <SelectItem value="economy">Economy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`achievementDescription${index}`}>
                      Description
                    </Label>
                    <Textarea
                      id={`achievementDescription${index}`}
                      rows={3}
                      {...register(`achievements.${index}.description`)}
                      placeholder="Detailed description of the achievement..."
                    />
                  </div>

                  <div>
                    <Label htmlFor={`achievementDate${index}`}>Date</Label>
                    <Input
                      id={`achievementDate${index}`}
                      type="date"
                      {...register(`achievements.${index}.date`, {
                        valueAsDate: true,
                      })}
                    />
                  </div>
                </Card>
              ))}

              {achievementFields.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No achievements added yet
                </p>
              )}
            </div>

            {/* Work Experience Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Briefcase className="w-4 h-4" />
                <h3 className="text-lg font-semibold">Work Experience</h3>
              </div>

              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addExperience}
                  className="mb-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>

              {experienceFields.map((field, index) => (
                <Card key={field.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Experience #{index + 1}</h4>
                    <div className="flex gap-2">
                      {editingPolitician &&
                        editedItems.experiences.has(index) && (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const experiences = watch("experiences") || [];
                                const singleExperience = experiences[index];
                                if (singleExperience) {
                                  updateExperiencesMutation.mutate({
                                    id: editingPolitician.id,
                                    experiences: [singleExperience],
                                  });
                                  markItemAsSaved("experiences", index);
                                }
                              }}
                              disabled={updateExperiencesMutation.isPending}
                              className="flex items-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              {updateExperiencesMutation.isPending
                                ? "Saving..."
                                : "Save"}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => resetItem("experiences", index)}
                              className="flex items-center gap-2"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Reset
                            </Button>
                          </>
                        )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveExperience(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`experienceTitle${index}`}>
                        Title/Position
                      </Label>
                      <Input
                        id={`experienceTitle${index}`}
                        {...register(`experiences.${index}.title`)}
                        placeholder="Job title or position..."
                      />
                    </div>
                    <div>
                      <Label htmlFor={`experienceCompany${index}`}>
                        Company/Organization
                      </Label>
                      <Input
                        id={`experienceCompany${index}`}
                        {...register(`experiences.${index}.company`)}
                        placeholder="Company name..."
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`experienceCategory${index}`}>
                      Category
                    </Label>
                    <Input
                      id={`experienceCategory${index}`}
                      {...register(`experiences.${index}.category`)}
                      placeholder="e.g., Political, Business, Academic..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`experienceStartDate${index}`}>
                        Start Date
                      </Label>
                      <Input
                        id={`experienceStartDate${index}`}
                        type="date"
                        {...register(`experiences.${index}.startDate`, {
                          valueAsDate: true,
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`experienceEndDate${index}`}>
                        End Date
                      </Label>
                      <Input
                        id={`experienceEndDate${index}`}
                        type="date"
                        {...register(`experiences.${index}.endDate`, {
                          valueAsDate: true,
                        })}
                      />
                    </div>
                  </div>
                </Card>
              ))}

              {experienceFields.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No experience added yet
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
                disabled={createMutation.isPending || updateMutation.isPending}
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
      <ConfirmDialog />

      {/* Review Changes Modal */}
      {showReviewChanges && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Review Changes</CardTitle>
                <button
                  onClick={() => setShowReviewChanges(false)}
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
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-4">Changed Fields</h3>
                {Array.from(changedFields).map((field) => (
                  <div
                    key={field}
                    className="p-3 bg-yellow-50 border border-yellow-200 rounded cursor-pointer hover:bg-yellow-100 transition-colors"
                    onClick={() => {
                      setShowReviewChanges(false);
                      setTimeout(() => {
                        const element = document.getElementById(field);
                        if (element) {
                          element.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                          element.focus();
                          element.classList.add(
                            "ring-4",
                            "ring-yellow-500",
                            "bg-yellow-100",
                          );
                          setTimeout(() => {
                            element.classList.remove(
                              "ring-4",
                              "ring-yellow-500",
                              "bg-yellow-100",
                            );
                          }, 2000);
                        }
                      }, 100);
                    }}
                  >
                    <span className="font-medium">{field}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      has been modified
                    </span>
                  </div>
                ))}
                {changedFields.size === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No changes detected
                  </p>
                )}
              </div>
              {editedItems.promises.size > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <span className="font-medium">Promises:</span>
                  <span className="text-sm text-gray-600 ml-2">
                    {Array.from(editedItems.promises)
                      .map((i) => i + 1)
                      .join(", ")}{" "}
                    {editedItems.promises.size === 1 ? "item" : "items"} changed
                  </span>
                </div>
              )}
              {editedItems.achievements.size > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <span className="font-medium">Achievements:</span>
                  <span className="text-sm text-gray-600 ml-2">
                    {Array.from(editedItems.achievements)
                      .map((i) => i + 1)
                      .join(", ")}{" "}
                    {editedItems.achievements.size === 1 ? "item" : "items"}{" "}
                    changed
                  </span>
                </div>
              )}
              {editedItems.experiences.size > 0 && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                  <span className="font-medium">Experiences:</span>
                  <span className="text-sm text-gray-600 ml-2">
                    {Array.from(editedItems.experiences)
                      .map((i) => i + 1)
                      .join(", ")}{" "}
                    {editedItems.experiences.size === 1 ? "item" : "items"}{" "}
                    changed
                  </span>
                </div>
              )}
              {editedItems.promises.size === 0 &&
                editedItems.achievements.size === 0 &&
                editedItems.experiences.size === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No individual items changed
                  </p>
                )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowReviewChanges(false)}
              >
                Close
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
