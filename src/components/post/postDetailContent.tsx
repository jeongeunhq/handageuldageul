"use client";

import { usePostDetail } from "@/components/widgets/hooks/usePostDetail";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUserStore } from "@/components/store/userStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PostDetailContent = ({ id }: { id: string }) => {
  const { user } = useUserStore();
  const accessToken = user?.accessToken;
  const router = useRouter();

  const { post, isLoading, isError, error, deletePost, isDeleting } =
    usePostDetail(id);

  const handleDelete = async () => {
    if (!id || !accessToken) {
      alert("Missing ID or accessToken");
      return;
    }

    const isConfirmed = window.confirm("정말로 게시글을 삭제하시겠습니까?");

    if (!isConfirmed) return;

    try {
      deletePost(undefined, {
        onSuccess: () => {
          router.push("/");
        },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`게시글 삭제에 실패했습니다: ${err.message}`);
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>로딩 중...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{String(error)}</p>
      </div>
    );

  if (!post) return null;

  const formattedDate = new Date(post!.createdAt)
    .toLocaleDateString("ko-KR")
    .replace(/\.$/, "");

  return (
    <div>
      <div className="p-6 pb-0">
        <h1 className="text-2xl font-bold mb-6">{post.title}</h1>
      </div>
      <div className="w-full border-b pb-6 px-6">
        <div className="text-[16px] text-gray_600 flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <p>{post.author.nickname}</p>
            <span>|</span>
            <p>{formattedDate}</p>
          </div>

          {user?.id === post.author.id && (
            <div className="text-sm text-gray_500 space-x-2">
              <Link href={`/posts/create?edit=true&id=${post.id}`}>
                <button>수정</button>
              </Link>
              <span>|</span>
              <button onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 pt-4 flex flex-col h-[289px]">
        <div className="flex-1 whitespace-pre-wrap">{post.content}</div>
        <div className="mt-auto text-sm text-gray_800 flex items-center">
          <FontAwesomeIcon icon={faMessage} className="mr-2" />
          {post.commentCount || 0}개
        </div>
      </div>
    </div>
  );
};

export default PostDetailContent;
