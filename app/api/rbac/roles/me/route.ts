import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@api/api";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    const response = await fetch(API_ENDPOINTS.RBAC.ROLES_ME, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to connect to server" },
      { status: 500 }
    );
  }
}
