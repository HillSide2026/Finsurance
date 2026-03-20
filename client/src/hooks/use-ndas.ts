import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

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
    // Ignore JSON parse issues and use the fallback message.
  }

  return fallback;
}

export function useGenerateNda() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ chatId }: { chatId: number }) => {
      const res = await fetch(api.ndas.generate.path, {
        method: api.ndas.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId }),
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Failed to generate NDA"));
      }
      return api.ndas.generate.responses[201].parse(await res.json());
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.ndas.get.path, data.id] });
      queryClient.invalidateQueries({
        queryKey: [api.ndas.getLatestForChat.path, variables.chatId],
      });
      queryClient.invalidateQueries({
        queryKey: [api.chats.get.path, variables.chatId],
      });
      queryClient.invalidateQueries({ queryKey: [api.chats.list.path] });
    },
  });
}

export function useNdaForChat(chatId: number, enabled = true) {
  return useQuery({
    queryKey: [api.ndas.getLatestForChat.path, chatId],
    queryFn: async () => {
      const url = buildUrl(api.ndas.getLatestForChat.path, { id: chatId });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch NDA");
      return api.ndas.getLatestForChat.responses[200].parse(await res.json());
    },
    enabled: enabled && chatId > 0,
    retry: false,
  });
}
