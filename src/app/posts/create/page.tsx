"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/components/store/userStore";
import PostForm from "@/components/post/postForm";
import { toast } from "react-hot-toast";

const CreatePostPage = () => {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      toast.error("로그인이 필요합니다.", { id: "login-required" }); //알림 중복 호출 제거
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="px-12 mt-6 flex items-center justify-center">
      <PostForm />
    </div>
  );
};

export default CreatePostPage;
