"use client";
import Banner from "@/components/main/banner";
import Introduction from "@/components/main/introduction";
import Board from "@/components/main/board";

export default function Home() {
  return (
    <main>
      <Introduction />
      <Banner />
      <Board />
    </main>
  );
}
