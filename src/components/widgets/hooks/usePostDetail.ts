import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/components/store/userStore";

interface Author {
  loginId: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  id: string;
  nickname: string;
}

interface PostDetail {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  viewCount: number;
  commentCount: number;
  isAuthor: boolean;
  content: string;
  author: Author;
}

interface EditPost {
  title: string;
  content: string;
}

export const usePostDetail = (id: string) => {
  const { user } = useUserStore();
  const accessToken = user?.accessToken;
  const queryClient = useQueryClient();

  // 게시글 조회
  const query = useQuery<PostDetail>({
    queryKey: ["post", id],
    queryFn: async () => {
      if (!id || !accessToken) throw new Error("Missing ID or accessToken");
      const response = await axios.get(`/api/board/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    },
    enabled: !!id && !!accessToken,
  });

  // 게시글 삭제
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id || !accessToken) throw new Error("Missing ID or accessToken");
      await axios.delete(`/api/board/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // 게시글 수정
  const editMutation = useMutation({
    mutationFn: async (data: EditPost) => {
      if (!id || !accessToken) throw new Error("Missing ID or accessToken");
      await axios.patch(
        `/api/board/${id}`,
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
    },
  });

  return {
    post: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    deletePost: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    editPost: editMutation.mutate,
    isEditing: editMutation.isPending,
  };
};
