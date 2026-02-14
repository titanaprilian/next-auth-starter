import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@api/api";

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie");

    const response = await fetch(API_ENDPOINTS.AUTH.REFRESH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({}),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const responseToBrowser = NextResponse.json(data);
    const backendCookies = response.headers.get("set-cookie");

    if (backendCookies) {
      backendCookies.split(",").forEach((cookie) => {
        responseToBrowser.headers.append("Set-Cookie", cookie.trim());
      });
    }

    return responseToBrowser;
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to connect to server" },
      { status: 500 },
    );
  }
}
