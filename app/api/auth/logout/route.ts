import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    cookieStore.delete("auth_session");

    return NextResponse.json({ success: true, message: "Logout successful!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process logout" }, { status: 500 });
  }
}