"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "@/components/store/userStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "next-auth/react";

const Header = () => {
  const { user } = useUserStore();
  const [isPopover, setPopover] = useState(false);

  const popoverRef = useRef<HTMLDivElement | null>(null);
  const togglePopover = () => setPopover((prev) => !prev);

  const handleLogoutClick = () => {
    setPopover(false);
    const isConfirmed = window.confirm("로그아웃 하시겠습니까?");
    if (isConfirmed) {
      signOut();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setPopover(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white p-4">
      <div className="max-w-[1024px] mx-[30px] flex justify-between items-center md:max-w-[1440px] md:mx-[120px]">
        <Link href="/">
          <Image src="/logo.svg" alt="로고" width={67} height={38} />
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative">
              <div
                onClick={togglePopover}
                className="cursor-pointer flex items-center"
              >
                <FontAwesomeIcon icon={faCircleUser} className="text-[38px]" />
              </div>

              {isPopover && (
                <div
                  ref={popoverRef}
                  className="absolute top-12 right-0 bg-white p-4 rounded-lg shadow-md w-max max-w-[200px] z-50"
                >
                  <div className="flex items-center space-x-2">
                    {user.profileImageUrl ? (
                      <Image
                        src={user.profileImageUrl}
                        alt="User Profile"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faCircleUser}
                        className="text-gray-500 text-2xl"
                      />
                    )}
                    <p className="text-black max-w-full">{user.nickname}님</p>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-sm text-red-500 font-semibold hover:text-red-700 mt-2"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-black px-4 py-2 rounded-lg transition"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
