"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useUserStore } from "@/components/store/userStore";

interface FormData {
  title: string;
  content: string;
}

const PostForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUserStore();
  const accessToken = user?.accessToken;
  const contentValue = watch("content") || "";

  const onSubmit = async (data: FormData) => {
    setError(null);
    setLoading(true);

    if (!accessToken) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    if (data.title.length < 1) {
      setError("제목은 최소 1자 이상 입력해주세요.");
      setLoading(false);
      return;
    }

    if (data.content.length < 5) {
      setError("내용은 최소 5자 이상 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`/api/board`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201) {
        window.location.href = "/";
      } else {
        setError(response.data.error || "게시글 작성 실패");
      }
    } catch (err) {
      console.error("Error submitting post:", err);
      setError("게시글 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form
        id="post-form"
        className=" p-6 bg-white rounded-[10px] border border-gray_300"
      >
        <h2 className="text-xl font-bold mb-6">게시글 작성</h2>
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
      </form>

      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className="w-[200px] h-[59px] py-2 bg-black text-white rounded-xl disabled:opacity-50"
        >
          {loading ? "작성 중..." : "등록하기"}
        </button>
      </div>
    </div>
  );
};

export default PostForm;
