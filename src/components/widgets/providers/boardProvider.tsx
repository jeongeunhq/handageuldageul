"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
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

type PostsContextType = {
  posts: Post[];
  meta: Meta;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  fetchData: (page: number) => void;
};

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("게시물을 읽어올  수 없어요.");
  }
  return context;
};

export const PostsProvider = ({ children }: { children: React.ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState<Meta>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    itemsPerPage: 10,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useUserStore();
  const accessToken = user?.accessToken;

  const fetchPosts = async (page: number, limit: number = 10) => {
    if (!accessToken) {
      console.error("Access token is missing");
      return;
    }

    try {
      const response = await axios.get("/api/board", {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("게시글을 불러오는 데 실패했습니다:", error);
    }
  };

  const fetchData = async (page: number) => {
    try {
      const data = await fetchPosts(page, 10);
      if (data) {
        setPosts(data.items);
        setMeta(data.meta);
      }
    } catch (error) {
      console.error("게시글을 불러오는 데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchData(currentPage);
    }
  }, [currentPage, accessToken]);

  return (
    <PostsContext.Provider
      value={{ posts, meta, currentPage, setCurrentPage, fetchData }}
    >
      {children}
    </PostsContext.Provider>
  );
};
