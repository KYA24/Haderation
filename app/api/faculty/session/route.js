import { NextResponse } from "next/server";
import { getFacultyPortalData } from "@/lib/domain";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const facultyId = searchParams.get("facultyId") || "f001";
  const data = await getFacultyPortalData(facultyId);
  return NextResponse.json(data);
}
