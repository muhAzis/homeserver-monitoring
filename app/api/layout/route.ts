import { NextResponse } from "next/server";
import dayjs from "@/lib/dayjs";

export const dynamic = "force-dynamic";

export async function GET() {
  const serverTimeMs = dayjs().valueOf();
  
  return NextResponse.json({ serverTime: serverTimeMs });
}