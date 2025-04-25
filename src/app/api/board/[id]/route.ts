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
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/posts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("API 요청 실패:", error);
    return NextResponse.json(
      { error: "게시글 상세보기 실패" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/posts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("API 요청 실패:", error);
    return NextResponse.json({ error: "게시글 삭제 실패" }, { status: 500 });
  }
}
