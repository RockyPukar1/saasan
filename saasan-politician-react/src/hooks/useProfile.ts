import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/services/api";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => profileApi.get(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 30 * 60 * 1000, // 30 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => profileApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
