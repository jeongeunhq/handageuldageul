"use client";
import Banner from "@/components/main/banner";
import Introduction from "@/components/main/introduction";
import Board from "@/components/main/board";

export default function Home() {
  return (
    <main className="my-[100px] mx-[30px] md:mx-[120px]">
      <Introduction />
      <Banner />
      <Board />
    </main>
  );
}
