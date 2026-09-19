import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { format, timetable } = body;

    if (!timetable) {
      return NextResponse.json({ error: "Missing timetable payload" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      format: format || "json",
      message: "Export generated",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
