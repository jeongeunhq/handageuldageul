import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useUserStore } from "@/components/store/userStore";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    nickname: string;
  };
}

// 댓글 조회 훅
export const useComments = (postId: string) => {
  const { user } = useUserStore();

  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const accessToken = user?.accessToken;

      if (!accessToken) {
        throw new Error("로그인이 필요합니다");
      }

      const response = await axios.get(`/api/board/${postId}/comments`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data as Comment[];
    },
    enabled: !!postId && !!user?.accessToken,
    staleTime: 1000 * 60 * 5,
  });
};

// 댓글 작성 훅
export const useCreateComment = (postId: string) => {
  const { user } = useUserStore();
  const accessToken = user?.accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const response = await axios.post(
        `/api/board/${postId}/comments`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
};
