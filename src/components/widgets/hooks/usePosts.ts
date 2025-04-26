import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useUserStore } from "@/components/store/userStore";

type Post = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  viewCount: number;
  commentCount: number;
  isAuthor: boolean;
};

type Meta = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
};

type PostsResponse = {
  items: Post[];
  meta: Meta;
};

export interface FormData {
  title: string;
  content: string;
}

const fetchPosts = async (
  page: number,
  accessToken: string
): Promise<PostsResponse> => {
  const response = await axios.get("/api/board", {
    params: { page, limit: 10 },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const usePosts = (page: number) => {
  const { user } = useUserStore();
  const accessToken = user?.accessToken;

  return useQuery({
    queryKey: ["posts", page, accessToken],
    queryFn: () => {
      if (!accessToken) throw new Error("로그인이 필요합니다.");
      return fetchPosts(page, accessToken);
    },
    enabled: !!accessToken,
    staleTime: 1000 * 60, // 1분 동안은 캐시 유지
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const accessToken = user?.accessToken;

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post("/api/board", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.refetchQueries({ queryKey: ["posts"], type: "active" });
    },
  });
};
