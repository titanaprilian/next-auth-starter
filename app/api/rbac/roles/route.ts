import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@api/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search") || "";

    const queryParams = new URLSearchParams();
    if (page) queryParams.set("page", page);
    if (limit) queryParams.set("limit", limit);
    if (search) queryParams.set("search", search);

    const authHeader = request.headers.get("authorization");

    const response = await fetch(
      `${API_ENDPOINTS.RBAC.ROLES_LIST}?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader && { Authorization: authHeader }),
        },
        credentials: "include",
      }
    );

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("authorization");

    const response = await fetch(API_ENDPOINTS.RBAC.ROLES_CREATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
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
