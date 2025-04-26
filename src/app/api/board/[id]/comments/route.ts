import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "ID 파라미터가 필요합니다" },
      { status: 400 }
    );
  }

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
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/posts/${id}/comments`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("API 요청 실패:", error);
    return NextResponse.json({ error: "댓글 조회 실패" }, { status: 500 });
  }
}

// POST 요청: 새로운 댓글 작성
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { content } = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: "ID 파라미터가 필요합니다" },
      { status: 400 }
    );
  }

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
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/posts/${id}/comments`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 201) {
      return NextResponse.json(response.data, { status: 201 });
    } else {
      return NextResponse.json({ error: "댓글 작성 실패" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in POST /api/posts:", error);
    return NextResponse.json(
      { error: "댓글 작성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
