"use client";
import { useState } from "react";
import {
  useComments,
  useCreateComment,
} from "@/components/widgets/hooks/useComments";

interface CommentsDetailProps {
  postId: string;
}

const CommentsDetail = ({ postId }: CommentsDetailProps) => {
  const { data: comments, isLoading, isError, error } = useComments(postId);
  const [newComment, setNewComment] = useState("");

  const { mutate: postComment } = useCreateComment(postId);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const formData = new FormData();
    formData.append("content", newComment);
    postComment(formData);

    setNewComment("");
  };

  if (isLoading) {
    return <div>댓글을 불러오는 중...</div>;
  }

  if (isError) {
    return (
      <div>
        댓글을 불러오는 데 오류가 발생했습니다
        {error instanceof Error ? error.message : "알 수 없는 오류"}
      </div>
    );
  }

  return (
    <div className="bg-gray_100 border-t border-gray_300">
      {comments?.length === 0 ? (
        <p className="p-6 text-center">댓글이 없습니다.</p>
      ) : (
        <ul>
          {comments?.map((comment) => (
            <li key={comment.id} className="p-6 border-b border-gray_300">
              <span className="font-semibold">{comment.user.nickname}</span>
              <p className="mt-4">{comment.content}</p>
              <div className="mt-4 text-sm text-gray-500">
                {new Intl.DateTimeFormat("ko-KR", {
                  year: "2-digit",
                  month: "2-digit",
                  day: "2-digit",
                })
                  .format(new Date(comment.createdAt))
                  .replace(/\.$/, "")}
              </div>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleCommentSubmit}
        className="h-[100px] p-4 sm:p-6 border-t border-gray_300 flex gap-1 text-[14px] sm:text-[16px]"
      >
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 통해 자유롭게 의견을 나눠보세요"
          className="w-full p-3 border-b border-gray-300 rounded-none resize-none"
          style={{ height: "48px" }}
        />

        <button
          type="submit"
          className="w-[89px] h-[52px] py-2 px-4 bg-black text-white rounded-lg disabled:bg-gray-400"
        >
          등록
        </button>
      </form>
    </div>
  );
};

export default CommentsDetail;
