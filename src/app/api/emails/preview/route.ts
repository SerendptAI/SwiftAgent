import { readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

const TEMPLATES_DIR = join(process.cwd(), "src/emails");

const PLACEHOLDER_DATA: Record<string, string> = {
  logoUrl: "/images/newlogo.svg",
  heroImageUrl: "/images/emails/welcome.svg",
  dashboardUrl: "#",
  unsubscribeUrl: "#",
};

export async function GET(request: NextRequest) {
  const template = request.nextUrl.searchParams.get("template") || "welcome";

  try {
    const filePath = join(TEMPLATES_DIR, `${template}.html`);
    let html = readFileSync(filePath, "utf-8");

    for (const [key, value] of Object.entries(PLACEHOLDER_DATA)) {
      html = html.replaceAll(`{{${key}}}`, value);
    }

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch {
    return NextResponse.json(
      { error: `Template "${template}" not found` },
      { status: 404 },
    );
  }
}
