import { usePostDetail } from "@/components/widgets/providers/postDetailProvider";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUserStore } from "@/components/store/userStore";
import DeleteModal from "@/components/post/deleteModal"; // DeleteModal 컴포넌트 import
import Link from "next/link"; // Link 컴포넌트 import

const PostDetailContent = () => {
  const {
    post,
    loading,
    error,
    isModalOpen,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  } = usePostDetail();
  const { user } = useUserStore();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>로딩 중...</p>
      </div>
    );

  if (error) return <p>{error}</p>;
  if (!post)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>해당 게시물을 찾을 수 없습니다.</p>
      </div>
    );

  const formattedDate = new Date(post.createdAt)
    .toLocaleDateString("ko-KR")
    .replace(/\.$/, "");

  const renderDeleteModal = isModalOpen ? (
    <DeleteModal
      isOpen={isModalOpen}
      onClose={closeDeleteModal}
      onConfirm={handleDelete}
    />
  ) : null;

  return (
    <div className="px-12 mt-6 flex items-center justify-center">
      <div className="w-full bg-white rounded-[10px] border border-gray_300 overflow-hidden">
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
                {/* Link 컴포넌트를 사용하여 수정 페이지로 이동 */}
                <Link href={`/posts/create?edit=true&id=${post.id}`}>
                  <button>수정</button>
                </Link>
                <span>|</span>
                <button onClick={openDeleteModal}>삭제</button>
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
      {renderDeleteModal}
    </div>
  );
};

export default PostDetailContent;
