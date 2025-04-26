"use client";

import { useForm } from "react-hook-form";
import { useUserStore } from "@/components/store/userStore";
import { useCreatePost, FormData } from "@/components/widgets/hooks/usePosts";
import { usePostDetail } from "@/components/widgets/hooks/usePostDetail";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/components/widgets/hooks/useIsMobile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const PostForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const postId = searchParams.get("id");
  const isEdit = searchParams.get("edit") === "true";

  const { user } = useUserStore();
  const accessToken = user?.accessToken;

  const [error, setError] = useState<string | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const isMobile = useIsMobile();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const titleValue = watch("title") || "";
  const contentValue = watch("content") || "";

  const postMutation = useCreatePost();
  const { post, editPost, isEditing } = usePostDetail(postId || "");
  const handleBack = () => {
    router.push("/");
  };

  // 수정 모드일 때 폼 초기값 세팅
  useEffect(() => {
    if (isEdit && post) {
      setValue("title", post.title);
      setValue("content", post.content);
    }
  }, [isEdit, post, setValue]);

  useEffect(() => {
    if (isEdit && post) {
      const isTitleChanged = titleValue !== post.title;
      const isContentChanged = contentValue !== post.content;
      setIsChanged(isTitleChanged || isContentChanged);
    }
  }, [titleValue, contentValue, post, isEdit]);

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
        className="p-6 bg-white md:rounded-[10px] md:border-gray_300"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center justify-between mb-6">
          {isMobile && (
            <button onClick={handleBack} className="text-[18px]">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          )}
          <h2 className="text-xl font-bold">
            {isEdit ? "게시글 수정" : "게시글 작성"}
          </h2>
          {isMobile && (
            <button
              type="submit"
              disabled={
                postMutation.isPending || isEditing || (isEdit && !isChanged)
              }
              className="ml-auto  py-2 font-bold  text-black rounded-xl disabled:opacity-50"
            >
              {isEdit
                ? isEditing
                  ? "수정 중..."
                  : "수정"
                : postMutation.isPending
                ? "작성 중..."
                : "등록"}
            </button>
          )}
        </div>

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
        <div className="justify-center mt-6 sm:flex hidden ">
          <button
            type="submit"
            disabled={
              postMutation.isPending || isEditing || (isEdit && !isChanged)
            }
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
      {error && <p className="text-error mt-4">{error}</p>}
    </div>
  );
};

export default PostForm;
