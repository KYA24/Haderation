import { NextResponse } from "next/server";
import { getAdminOverview } from "@/lib/domain";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getAdminOverview();
  return NextResponse.json(data);
}
