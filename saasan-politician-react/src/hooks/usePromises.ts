import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { promisesApi } from "@/services/api";

export const usePromises = (cursor?: string | null, limit = 10) => {
  return useQuery({
    queryKey: ["promises", cursor, limit],
    queryFn: () => promisesApi.getAll(cursor, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdatePromise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      promisesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promises"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useCreatePromise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => promisesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promises"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useDeletePromise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => promisesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promises"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
