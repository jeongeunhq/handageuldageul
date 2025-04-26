"use client";

import { usePosts } from "@/components/widgets/hooks/usePosts";
import { faMessage, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUserStore } from "@/components/store/userStore";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Pagination from "@/components/lib/pagination";
import { useIsMobile } from "@/components/widgets/hooks/useIsMobile";

type Post = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  viewCount: number;
  commentCount: number;
  isAuthor: boolean;
};

const Board = () => {
  const { user } = useUserStore();
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const { data, isLoading, error } = usePosts(currentPage);

  const isFetchingMore = useRef(false);

  useEffect(() => {
    if (data?.items) {
      if (currentPage === 1) {
        setPosts(data.items);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data.items]);
      }
    }
    isFetchingMore.current = false;
  }, [data, currentPage]);

  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10;

      if (
        bottom &&
        !isLoading &&
        !isFetchingMore.current &&
        data?.meta?.currentPage !== undefined &&
        data?.meta?.totalPages !== undefined &&
        data.meta.currentPage < data.meta.totalPages
      ) {
        isFetchingMore.current = true;
        setCurrentPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, isLoading, data]);

  if (isLoading && currentPage === 1)
    return <p className="text-center">불러오는 중...</p>;
  if (error) return <p>에러 발생: {(error as Error).message}</p>;

  const meta = data?.meta || {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
  };

  return (
    <div className=" mt-[100px] mx-[16px] md:mx-[30px] relative bg-white md:py-5 px-[14px] md:rounded-xl">
      <div className="flex items-center justify-between border-b py-4">
        <h1 className="text-[24px] font-bold">게시판</h1>
        {!isMobile && (
          <button
            className={`px-[24px] py-3 ${
              user
                ? "bg-Primary_normal text-white hover:bg-Primary_hover"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            } rounded-lg`}
            disabled={!user}
          >
            <Link href={user ? "/posts/create" : "#"}>글쓰기</Link>
          </button>
        )}
      </div>

      {!user ? (
        <p className="text-center text-lg text-gray-600 mt-4">
          로그인 후 사용해주세요.
        </p>
      ) : (
        <ul className="space-y-2">
          {posts.map((post) => (
            <li key={post.id} className="border-b py-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <Link
                  href={`/posts/${post.id}`}
                  className="md:max-w-[65%] flex-shrink min-w-0"
                >
                  <span className="text-lg font-normal hover:underline cursor-pointer block truncate">
                    {post.title}
                  </span>
                </Link>
                <div className="flex justify-between items-center mt-2 md:mt-0 md:gap-4 text-sm text-gray_600 font-normal sm:flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span>
                      {new Intl.DateTimeFormat("ko-KR", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                      })
                        .format(new Date(post.createdAt))
                        .replace(/\.$/, "")}
                    </span>
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faMessage} />
                      {post.commentCount}
                    </span>
                  </div>
                  {post.isAuthor && user?.profileImageUrl ? (
                    <Image
                      src={user.profileImageUrl}
                      alt="User Profile"
                      width={24}
                      height={24}
                      className="rounded-full"
                      unoptimized
                    />
                  ) : (
                    <div className="size-6 bg-gray_600 rounded-full" />
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isMobile && user && (
        <Link
          href="/posts/create"
          className="fixed bottom-6 right-6 bg-Primary_normal text-white p-4 rounded-full shadow-lg hover:bg-Primary_hover"
        >
          <FontAwesomeIcon icon={faPen} size="lg" />
        </Link>
      )}

      {/* 모바일: 스크롤 로딩, PC: 페이지네이션 */}
      {isMobile ? (
        isLoading &&
        currentPage > 1 && (
          <div className="text-center py-4">불러오는 중...</div>
        )
      ) : (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={meta.totalPages}
            onPageChange={(page) => {
              setPosts([]);
              setCurrentPage(page);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Board;
