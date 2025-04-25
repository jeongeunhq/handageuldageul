import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useUserStore } from "@/components/store/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface FormData {
  title: string;
  content: string;
}

const PostForm = () => {
  const [isClient, setIsClient] = useState(false); // 클라이언트 환경 체크
  const queryClient = useQueryClient();

  // useRouter를 클라이언트에서만 사용
  useEffect(() => {
    setIsClient(true); // 클라이언트 사이드에서만 useRouter 사용
  }, []);

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

  // useMutation 훅
  const postMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(`/api/board`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (isClient) {
        window.location.href = "/"; // 클라이언트에서만 페이지 이동
      }
    },
    onError: () => {
      setError("게시글 작성 중 오류가 발생했습니다.");
    },
  });

  const onSubmit = (data: FormData) => {
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

    postMutation.mutate(data);
  };

  return (
    <div className="w-full">
      <form
        id="post-form"
        className="p-6 bg-white rounded-[10px] border border-gray_300"
        onSubmit={handleSubmit(onSubmit)}
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
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-[200px] h-[59px] py-2 bg-black text-white rounded-xl disabled:opacity-50"
          >
            {loading ? "작성 중..." : "등록하기"}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default PostForm;
