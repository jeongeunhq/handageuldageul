import Pagination from "@/components/lib/pagination";
import { usePosts } from "@/components/widgets/providers/boardProvider";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUserStore } from "@/components/store/userStore";
import Image from "next/image";

const Board = () => {
  const { posts, meta, currentPage, setCurrentPage } = usePosts();
  const { user } = useUserStore();

  return (
    <div className="bg-white py-5 px-[14px] rounded-xl">
      <div className="flex items-center justify-between border-b py-4">
        <h1 className="text-[24px] font-bold">게시판</h1>
        <button className="px-[24px] py-3 bg-Primary_normal text-white rounded-lg">
          글쓰기
        </button>
      </div>

      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="border-b py-4">
            <div className="flex justify-between items-center">
              {/* 제목 */}
              <div className="text-lg font-normal">{post.title}</div>

              {/* 오른쪽: 날짜, 댓글 수, 프로필 */}
              <div className="flex items-center gap-2 text-sm text-gray_600 font-normal">
                {/* 작성일 */}
                <span>
                  {new Intl.DateTimeFormat("ko-KR", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                  })
                    .format(new Date(post.createdAt))
                    .replace(/\.$/, "")}
                </span>

                {/* 댓글 수 */}
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faMessage} />
                  {post.commentCount}
                </span>

                {/* 프로필 이미지 */}
                {post.isAuthor && user?.profileImageUrl ? (
                  <Image
                    src={user.profileImageUrl}
                    alt="User Profile"
                    width={24}
                    height={24}
                    className="rounded-full"
                    unoptimized
                  />
                ) : (
                  <div className="size-6 bg-gray_600 rounded-full" />
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Pagination
        currentPage={currentPage}
        totalPages={meta.totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Board;
