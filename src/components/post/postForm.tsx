"use client";

import { useForm } from "react-hook-form";
import { useUserStore } from "@/components/store/userStore";
import { useCreatePost, FormData } from "@/components/widgets/hooks/usePosts";
import { usePostDetail } from "@/components/widgets/hooks/usePostDetail";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PostForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const postId = searchParams.get("id");
  const isEdit = searchParams.get("edit") === "true";

  const { user } = useUserStore();
  const accessToken = user?.accessToken;

  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const contentValue = watch("content") || "";

  const postMutation = useCreatePost();
  const { post, editPost, isEditing } = usePostDetail(postId || "");

  // 수정 모드일 때 폼 초기값 세팅
  useEffect(() => {
    if (isEdit && post) {
      setValue("title", post.title);
      setValue("content", post.content);
    }
  }, [isEdit, post, setValue]);

  const onSubmit = (data: FormData) => {
    setError(null);

    if (!accessToken) {
      setError("로그인이 필요합니다.");
      return;
    }

    if (data.title.length < 1) {
      setError("제목은 최소 1자 이상 입력해주세요.");
      return;
    }

    if (data.content.length < 5) {
      setError("내용은 최소 5자 이상 입력해주세요.");
      return;
    }

    if (isEdit && postId) {
      // 수정 모드
      editPost(data, {
        onSuccess: () => {
          router.push(`/posts/${postId}`);
        },
        onError: () => {
          setError("게시글 수정 중 오류가 발생했습니다.");
        },
      });
    } else {
      // 작성 모드
      postMutation.mutate(data, {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
        onError: () => {
          setError("게시글 작성 중 오류가 발생했습니다.");
        },
      });
    }
  };

  return (
    <div className="w-full">
      <form
        id="post-form"
        className="p-6 bg-white rounded-[10px] border border-gray_300"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-xl font-bold mb-6">
          {isEdit ? "게시글 수정" : "게시글 작성"}
        </h2>
        <div className="mb-4">
          <input
            id="title"
            placeholder="제목을 입력해주세요."
            {...register("title", { required: "최소 1자 이상 입력해주세요." })}
            className={`w-full px-4 py-3 border rounded-lg ${
              errors.title ? "border-error border-2" : ""
            }`}
          />
          {errors.title && (
            <p className="text-error text-xs mt-2 font-semibold">
              {errors.title.message}
            </p>
          )}
        </div>
        <div className="relative">
          <textarea
            id="content"
            placeholder="내용을 입력해주세요."
            {...register("content", {
              required: "최소 5자 이상 입력해주세요.",
              minLength: {
                value: 5,
                message: "내용은 최소 5자 이상 입력해주세요.",
              },
              maxLength: {
                value: 300,
                message: "300자 이하로 입력해주세요.",
              },
            })}
            style={{ height: "322px" }}
            className={`w-full px-4 py-3 border rounded-lg resize-none ${
              errors.content ? "border-error border-2" : ""
            }`}
          />
          <div className="absolute bottom-4 right-4 text-xs text-gray-400">
            {contentValue.length}/300
          </div>
        </div>
        {errors.content && (
          <p className="text-error text-xs mt-2 font-semibold">
            {errors.content.message}
          </p>
        )}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={postMutation.isPending || isEditing}
            className="w-[200px] h-[59px] py-2 bg-black text-white rounded-xl disabled:opacity-50"
          >
            {isEdit
              ? isEditing
                ? "수정 중..."
                : "수정하기"
              : postMutation.isPending
              ? "작성 중..."
              : "등록하기"}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default PostForm;
