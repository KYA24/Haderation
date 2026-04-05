import { NextResponse } from "next/server";
import { reviewRequest } from "@/lib/domain";

export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  try {
    const body = await request.json();
    const resolvedParams = await params;
    const data = await reviewRequest(resolvedParams.id, body.decision, body.reviewNote);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "تعذر تحديث حالة الطلب" },
      { status: 400 }
    );
  }
}
