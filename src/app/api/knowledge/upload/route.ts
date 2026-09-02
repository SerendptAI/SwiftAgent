import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/+$/, "");

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { detail: "Not authenticated" },
        { status: 401 },
      );
    }

    // Forward the raw body as-is (multipart/form-data)
    const contentType = req.headers.get("content-type") ?? "";
    const body = await req.arrayBuffer();

    const backendUrl = `${API_BASE_URL}/api/v1/knowledge/upload`;

    const backendRes = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": contentType,
      },
      body: new Uint8Array(body),
    });

    let data: unknown;
    const resContentType = backendRes.headers.get("content-type") ?? "";
    if (resContentType.includes("application/json")) {
      data = await backendRes.json();
    } else {
      const text = await backendRes.text();
      data = { detail: text || "Unknown backend error" };
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("[knowledge/upload proxy] Error:", error);
    return NextResponse.json(
      {
        detail:
          error instanceof Error
            ? `Proxy error: ${error.message}`
            : "Proxy error: failed to reach backend",
      },
      { status: 502 },
    );
  }
}
