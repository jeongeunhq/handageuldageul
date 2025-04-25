"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
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

interface PostDetailContextType {
  post: PostDetail | null;
  loading: boolean;
  error: string | null;
}

const PostDetailContext = createContext<PostDetailContextType | undefined>(
  undefined
);

export const usePostDetail = () => {
  const context = useContext(PostDetailContext);
  if (!context) {
    throw new Error("usePostDetail must be used within a PostDetailProvider");
  }
  return context;
};

export const PostDetailProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();
  const accessToken = user?.accessToken;

  useEffect(() => {
    if (!id || !accessToken) return;

    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/board/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPost(response.data);
      } catch (err) {
        setError("게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, accessToken]);

  return (
    <PostDetailContext.Provider value={{ post, loading, error }}>
      {children}
    </PostDetailContext.Provider>
  );
};
