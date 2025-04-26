"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "@/components/store/userStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "next-auth/react";

const Header = () => {
  const { user } = useUserStore();
  const [isPopover, setPopover] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const popoverRef = useRef<HTMLDivElement | null>(null);
  const togglePopover = () => setPopover((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

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
    <header className="relative bg-white p-4 z-50">
      <div className="max-w-[1024px] flex justify-between items-center md:max-w-[1440px] md:mx-[120px]">
        <div className="block sm:hidden">
          <FontAwesomeIcon
            icon={faBars}
            className="text-2xl cursor-pointer"
            onClick={toggleMenu}
          />
        </div>

        <Link href="/" className="hidden sm:block">
          <Image src="/logo.svg" alt="로고" width={67} height={38} />
        </Link>

        <div
          className={`fixed top-0 left-0 w-[250px] h-full bg-white p-4 transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
        >
          <div className="flex justify-end">
            <FontAwesomeIcon
              icon={faTimes}
              className="text-2xl cursor-pointer text-Label_alternative"
              onClick={() => setMenuOpen(false)}
            />
          </div>

          <div className="flex items-center px-4 py-2 space-x-2 mt-4 border-b border-gray-300 pb-6 z-100">
            {user?.profileImageUrl ? (
              <Image
                src={user.profileImageUrl}
                alt="User Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300" />
            )}
            <p className="text-black">{user?.nickname || "로그인 해주세요."}</p>
          </div>

          <div className="mt-6">
            {user ? (
              <>
                <button
                  onClick={handleLogoutClick}
                  className="block text-black px-4 py-2 rounded-lg transition"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block text-black px-4 py-2 rounded-lg transition"
                onClick={() => setMenuOpen(false)}
              >
                로그인
              </Link>
            )}
            <Link
              href="/"
              className="block text-black px-4 py-2 rounded-lg transition mt-4"
              onClick={() => setMenuOpen(false)}
            >
              커뮤니티
            </Link>
          </div>
        </div>

        <div className=" items-center space-x-4 hidden sm:flex">
          {user ? (
            <div className="relative">
              <div
                onClick={togglePopover}
                className="cursor-pointer flex items-center"
              >
                <FontAwesomeIcon
                  icon={faCircleUser}
                  className="text-black text-2xl"
                />
              </div>

              {isPopover && (
                <div
                  ref={popoverRef}
                  className="absolute top-12 right-0 bg-white p-4 rounded-lg shadow-md w-max max-w-[200px]"
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
                      <div className="w-8 h-8 rounded-full bg-gray-300" />
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
