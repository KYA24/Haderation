import { NextResponse } from "next/server";
import { createFacultyRequest } from "@/lib/domain";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const data = await createFacultyRequest(body);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "تعذر تنفيذ الطلب" },
      { status: 400 }
    );
  }
}
