import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-static";

const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json");

async function getAuthCredentials() {
  try {
    const data = await fs.readFile(SETTINGS_FILE, "utf-8");
    const json = JSON.parse(data);
    return json.auth || { username: "admin", password: "password" };
  } catch (error) {
    return { username: "admin", password: "password" };
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const isAuthenticated = session?.value === "authenticated";
  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, username, password } = body;

    if (action === "logout") {
      const cookieStore = await cookies();
      cookieStore.delete("admin_session");
      return NextResponse.json({ success: true, message: "Logged out successfully" });
    }

    const credentials = await getAuthCredentials();

    if (username === credentials.username && password === credentials.password) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: "admin_session",
        value: "authenticated",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });
      return NextResponse.json({ success: true, message: "Authentication successful" });
    }

    return NextResponse.json(
      { success: false, message: "Invalid username or password" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Authentication server error" },
      { status: 500 }
    );
  }
}
