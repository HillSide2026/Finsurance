import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { NdaIntakePatch } from "@shared/schema";

async function getErrorMessage(
  res: Response,
  fallback: string,
): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.message === "string") {
      return body.message;
    }
  } catch {
    // Ignore JSON parse issues and fall back to the default message.
  }

  return fallback;
}

export function useChats() {
  return useQuery({
    queryKey: [api.chats.list.path],
    queryFn: async () => {
      const res = await fetch(api.chats.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch chats");
      return api.chats.list.responses[200].parse(await res.json());
    },
  });
}

export function useChat(id: number, enabled = true) {
  return useQuery({
    queryKey: [api.chats.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.chats.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch chat");
      return api.chats.get.responses[200].parse(await res.json());
    },
    enabled: enabled && id > 0,
    retry: false,
  });
}

export function useCreateChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title?: string) => {
      const res = await fetch(api.chats.create.path, {
        method: api.chats.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Failed to create chat"));
      }
      return api.chats.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.chats.list.path] });
    },
  });
}

export function useUpdateChatIntake() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      chatId,
      intake,
    }: {
      chatId: number;
      intake: NdaIntakePatch;
    }) => {
      const url = buildUrl(api.chats.updateIntake.path, { id: chatId });
      const res = await fetch(url, {
        method: api.chats.updateIntake.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(intake),
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(
          await getErrorMessage(res, "Failed to update consultation details"),
        );
      }
      return api.chats.updateIntake.responses[200].parse(await res.json());
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [api.chats.get.path, variables.chatId],
      });
      queryClient.invalidateQueries({ queryKey: [api.chats.list.path] });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ chatId, content }: { chatId: number; content: string }) => {
      const url = buildUrl(api.chats.sendMessage.path, { id: chatId });
      const res = await fetch(url, {
        method: api.chats.sendMessage.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Failed to send message"));
      }
      return api.chats.sendMessage.responses[201].parse(await res.json());
    },
    onSuccess: (data, variables) => {
      // Optimistic update or refetch
      queryClient.invalidateQueries({ queryKey: [api.chats.get.path, variables.chatId] });
      queryClient.invalidateQueries({ queryKey: [api.chats.list.path] });
    },
  });
}
