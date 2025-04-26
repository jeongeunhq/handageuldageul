import PostDetailContent from "@/components/post/postDetailContent";
import CommentsDetail from "@/components/comments/commentDetail";

interface PostDetailPageProps {
  params: {
    id: string;
  };
}

const PostDetailPage = async ({ params }: PostDetailPageProps) => {
  const { id } = params;

  if (!id) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="px-0 mt-0 sm:px-12 sm:mt-6 flex flex-col items-center justify-center">
      <div className="w-full bg-white sm:rounded-[10px] border border-gray_300 overflow-hidden">
        <PostDetailContent id={id} />
        <CommentsDetail postId={id} />
      </div>
    </div>
  );
};

export default PostDetailPage;
