import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messagesApi } from "@/services/api";

export const useJurisdictionMessages = () => {
  return useQuery({
    queryKey: ["messages", "jurisdiction"],
    queryFn: () => messagesApi.getJurisdictionMessages(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMessage = (messageId: string) => {
  return useQuery({
    queryKey: ["messages", messageId],
    queryFn: () => messagesApi.getById(messageId),
    enabled: !!messageId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useUpdateMessageStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      messageId,
      status,
    }: {
      messageId: string;
      status: string;
    }) => messagesApi.updateStatus(messageId, status as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

export const useAddReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      messageId,
      content,
      attachments,
    }: {
      messageId: string;
      content: string;
      attachments?: any[];
    }) => messagesApi.addReply(messageId, content, attachments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};
