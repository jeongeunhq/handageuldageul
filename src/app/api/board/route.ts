import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// GET 요청: 게시글 목록 조회
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);

  const accessToken = request.headers
    .get("authorization")
    ?.replace("Bearer ", "");

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token이 필요합니다" },
      { status: 401 }
    );
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/posts`,
      {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: "게시글 불러오기 실패" },
      { status: 500 }
    );
  }
}

// POST 요청: 새로운 게시글 작성
export async function POST(request: NextRequest) {
  const { title, content } = await request.json();

  const accessToken = request.headers
    .get("authorization")
    ?.replace("Bearer ", "");

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token이 필요합니다" },
      { status: 401 }
    );
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/posts`,
      { title, content },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 201) {
      return NextResponse.json(response.data, { status: 201 });
    } else {
      return NextResponse.json({ error: "게시글 작성 실패" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in POST /api/posts:", error);
    return NextResponse.json(
      { error: "게시글 작성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
