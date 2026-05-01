import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Target,
  Clock,
  CheckCircle,
  Edit,
  TrendingUp,
  Calendar,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreatePromise,
  useDeletePromise,
  usePromises,
  useUpdatePromise,
} from "@/hooks/usePromises";
import type { PromiseDto } from "@/types/api";

type PromiseFormState = {
  title: string;
  description: string;
  status: "not-started" | "in-progress" | "fulfilled";
  dueDate: string;
  progress: string;
};

const emptyForm: PromiseFormState = {
  title: "",
  description: "",
  status: "not-started",
  dueDate: "",
  progress: "0",
};

const statusLabel: Record<PromiseDto["status"], string> = {
  "not-started": "Pending",
  "in-progress": "Ongoing",
  fulfilled: "Fulfilled",
};

const PAGE_SIZE = 10;

export const PromisesScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: promisesResponse, isLoading } = usePromises(
    currentPage,
    PAGE_SIZE,
  );
  const createPromise = useCreatePromise();
  const updatePromise = useUpdatePromise();
  const deletePromise = useDeletePromise();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromise, setEditingPromise] = useState<PromiseDto | null>(null);
  const [form, setForm] = useState<PromiseFormState>(emptyForm);
  const promises = promisesResponse?.data || [];
  const totalPromises = promisesResponse?.total || 0;

  const groupedPromises = useMemo(
    () => ({
      pending: promises.filter((promise) => promise.status === "not-started"),
      ongoing: promises.filter((promise) => promise.status === "in-progress"),
      fulfilled: promises.filter((promise) => promise.status === "fulfilled"),
    }),
    [promises],
  );

  const averageProgress = useMemo(() => {
    if (promises.length === 0) return 0;
    return Math.round(
      promises.reduce((total, promise) => total + promise.progress, 0) /
        promises.length,
    );
  }, [promises]);

  const openCreateDialog = () => {
    setEditingPromise(null);
    setForm(emptyForm);
    setIsDialogOpen(true);
  };

  const openEditDialog = (promise: PromiseDto) => {
    setEditingPromise(promise);
    setForm({
      title: promise.title,
      description: promise.description,
      status: promise.status,
      dueDate: new Date(promise.dueDate).toISOString().slice(0, 10),
      progress: String(promise.progress),
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.dueDate) {
      toast.error("Please complete the promise details.");
      return;
    }

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        dueDate: new Date(form.dueDate).toISOString(),
        progress: Number(form.progress) || 0,
      };

      if (editingPromise) {
        await updatePromise.mutateAsync({
          id: editingPromise.id,
          data: payload,
        });
        toast.success("Promise updated successfully");
      } else {
        await createPromise.mutateAsync(payload);
        toast.success("Promise created successfully");
      }

      setIsDialogOpen(false);
      setEditingPromise(null);
      setForm(emptyForm);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save promise");
    }
  };

  const handleDelete = async (promise: PromiseDto) => {
    if (!window.confirm(`Delete "${promise.title}"?`)) return;

    try {
      await deletePromise.mutateAsync(promise.id);
      toast.success("Promise deleted");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete promise");
    }
  };

  const getStatusIcon = (status: PromiseDto["status"]) => {
    switch (status) {
      case "fulfilled":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "not-started":
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: PromiseDto["status"]) => {
    switch (status) {
      case "fulfilled":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      case "in-progress":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
      case "not-started":
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-gradient-to-r from-green-500 to-emerald-500";
    if (progress >= 50) return "bg-gradient-to-r from-blue-500 to-indigo-500";
    if (progress >= 25) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    return "bg-gradient-to-r from-red-500 to-pink-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 rounded-lg p-6 mb-6 mx-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold mb-2">Promises</h1>
            <p className="text-red-100 text-sm">
              Track and manage your commitments to constituents
            </p>
          </div>
          <div className="bg-red-500 rounded-full p-3">
            <Target className="text-white" size={24} />
          </div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                  <Target className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {totalPromises}
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-3 font-medium">
                Total Promises
              </p>
              <p className="text-red-500 text-xs mt-1">All commitments</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                  <Clock className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {groupedPromises.ongoing.length}
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-3 font-medium">Ongoing</p>
              <p className="text-blue-500 text-xs mt-1">In progress</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                  <CheckCircle className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {groupedPromises.fulfilled.length}
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-3 font-medium">
                Fulfilled
              </p>
              <p className="text-green-500 text-xs mt-1">Completed</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                  <TrendingUp className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-orange-600">
                  {averageProgress}%
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-3 font-medium">
                Avg Progress
              </p>
              <p className="text-orange-500 text-xs mt-1">Overall completion</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="px-4 mb-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Keep your public commitments accurate and up to date
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Promise
        </Button>
      </div>

      <div className="px-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-40 rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : promises.length === 0 ? (
          <Card className="border-dashed border-gray-300 bg-white">
            <CardContent className="py-12 text-center">
              <Target className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800">
                No promises yet
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Add your first commitment so constituents can track progress.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {promises.map((promise) => (
              <Card
                key={promise.id}
                className="hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50 border-gray-200"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-lg text-gray-800">
                        {promise.title}
                      </CardTitle>
                      <p className="text-gray-600 leading-relaxed">
                        {promise.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge className={`${getStatusColor(promise.status)} shadow-sm`}>
                        {statusLabel[promise.status]}
                      </Badge>
                      {getStatusIcon(promise.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Progress
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-gray-800">
                            {promise.progress}%
                          </span>
                          <div
                            className={`w-3 h-3 rounded-full ${getProgressColor(promise.progress)}`}
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <Progress value={promise.progress} className="h-3 bg-gray-200" />
                        <div
                          className={`absolute top-0 left-0 h-full rounded-full ${getProgressColor(promise.progress)} transition-all duration-500`}
                          style={{ width: `${promise.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Due: {new Date(promise.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 hover:bg-gray-50"
                          onClick={() => openEditDialog(promise)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(promise)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {promisesResponse && promisesResponse.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {promisesResponse.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(promisesResponse.totalPages, page + 1),
                    )
                  }
                  disabled={currentPage >= promisesResponse.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[560px] bg-gradient-to-br from-slate-50 to-rose-50">
          <DialogHeader className="border-b border-rose-100 pb-4">
            <DialogTitle className="flex items-center space-x-2 text-gray-800">
              <Target className="h-5 w-5 text-red-600" />
              <span>{editingPromise ? "Update Promise" : "Create Promise"}</span>
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Keep this commitment clear, measurable, and current.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 p-1">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <Input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Enter promise title..."
                className="border-rose-200 focus:border-rose-400 bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Describe the commitment..."
                rows={4}
                className="border-rose-200 focus:border-rose-400 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value as PromiseFormState["status"],
                    }))
                  }
                  className="w-full h-8 rounded-lg border border-rose-200 bg-white px-2.5 text-sm focus:border-rose-400 focus:outline-none"
                >
                  <option value="not-started">Pending</option>
                  <option value="in-progress">Ongoing</option>
                  <option value="fulfilled">Fulfilled</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Due Date</label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, dueDate: event.target.value }))
                  }
                  className="border-rose-200 focus:border-rose-400 bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Progress</label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={form.progress}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, progress: event.target.value }))
                  }
                  className="border-rose-200 focus:border-rose-400 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={createPromise.isPending || updatePromise.isPending}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-md"
              >
                {editingPromise ? "Save Changes" : "Create Promise"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
