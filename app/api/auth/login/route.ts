import { NextResponse } from "next/server";
import { Client } from "ssh2";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export const runtime = 'nodejs';

const SECRET_KEY = new TextEncoder().encode(process.env.AUTH_SECRET_KEY!);

const verifySSH = (username: string, password: string, host: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const conn = new Client();
    
    conn.on("ready", () => {
      conn.end();
      resolve(true);
    })
    .on("error", () => {
      resolve(false);
    })
    .connect({
      host: host,
      port: 22,
      username: username,
      password: password,
      readyTimeout: 5000,
    });
  });
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const SERVER_IP = process.env.NODE_ENV === "development" ? process.env.SERVER_IP! : "127.0.0.1";

    const isSuccess = await verifySSH(username, password, SERVER_IP);

    if (!isSuccess) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const token = await new SignJWT({ username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(SECRET_KEY);

    const cookieStore = await cookies();

    cookieStore.set("auth_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, 
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}