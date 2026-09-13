import { NextRequest, NextResponse } from "next/server";
import { CERTIFICATES } from "@/data/certificates";

export async function GET(request: NextRequest) {
  const nim = request.nextUrl.searchParams.get("nim")?.trim();

  if (!nim) {
    return NextResponse.json({ error: "Missing nim parameter" }, { status: 400 });
  }

  const student = CERTIFICATES.find((c) => c.nim.trim() === nim);

  if (!student) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  }

  return NextResponse.json(student);
}
