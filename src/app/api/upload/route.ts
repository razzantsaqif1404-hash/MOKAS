import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { saveFile } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || session.roleName !== "admin") {
      return NextResponse.json({ success: false, message: "Hanya admin yang dapat mengunggah file." }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "File gambar tidak ditemukan dalam formulir." }, { status: 400 });
    }

    const result = await saveFile(file);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Gambar berhasil diunggah.",
      url: result.filePath,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

