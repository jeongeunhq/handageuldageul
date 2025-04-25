"use client";

import { PostDetailProvider } from "@/components/widgets/providers/postDetailProvider";
import PostDetailContent from "@/components/post/postDetailContent";

const PostDetailPage = () => {
  return (
    <PostDetailProvider>
      <PostDetailContent />
    </PostDetailProvider>
  );
};

export default PostDetailPage;
