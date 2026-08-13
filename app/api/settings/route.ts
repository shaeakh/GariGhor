import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-static";

const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json");

async function readSettingsFile() {
  const data = await fs.readFile(SETTINGS_FILE, "utf-8");
  return JSON.parse(data);
}

export async function GET() {
  try {
    const json = await readSettingsFile();
    const { config, services, translations } = json;
    return NextResponse.json({ config, services, translations });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read settings data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    
    if (session?.value !== "authenticated") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const newSettings = await request.json();
    const existingSettings = await readSettingsFile();

    // Preserve auth credentials from existing settings file
    const updatedFileContent = {
      auth: existingSettings.auth || { username: "admin", password: "password" },
      config: newSettings.config || existingSettings.config,
      services: newSettings.services || existingSettings.services,
      translations: newSettings.translations || existingSettings.translations,
    };

    await fs.writeFile(
      SETTINGS_FILE,
      JSON.stringify(updatedFileContent, null, 2),
      "utf-8"
    );

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
      data: {
        config: updatedFileContent.config,
        services: updatedFileContent.services,
        translations: updatedFileContent.translations,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save settings data" },
      { status: 500 }
    );
  }
}
