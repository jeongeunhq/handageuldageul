import Pagination from "@/components/lib/pagination";
import { usePosts } from "@/components/widgets/providers/boardProvider";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUserStore } from "@/components/store/userStore";
import Image from "next/image";
import Link from "next/link";

const Board = () => {
  const { posts, meta, currentPage, setCurrentPage } = usePosts();
  const { user } = useUserStore();

  return (
    <div className="bg-white py-5 px-[14px] rounded-xl">
      <div className="flex items-center justify-between border-b py-4">
        <h1 className="text-[24px] font-bold">게시판</h1>
        <button
          className={`px-[24px] py-3 ${
            user
              ? "bg-Primary_normal text-white hover:bg-Primary_hover"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          } rounded-lg`}
          disabled={!user}
        >
          <Link href={user ? "/posts/create" : "#"}>글쓰기</Link>
        </button>
      </div>

      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="border-b py-4">
            <div className="flex justify-between items-center">
              <Link href={`/posts/${post.id}`}>
                <span className="text-lg font-normal hover:underline cursor-pointer">
                  {post.title}
                </span>
              </Link>

              <div className="flex items-center gap-2 text-sm text-gray_600 font-normal">
                <span>
                  {new Intl.DateTimeFormat("ko-KR", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                  })
                    .format(new Date(post.createdAt))
                    .replace(/\.$/, "")}
                </span>

                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faMessage} />
                  {post.commentCount}
                </span>

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
