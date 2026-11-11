import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteFile } from "@/lib/storage";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const article = await db.findById("News", id);
    if (!article) {
      return NextResponse.json({ success: false, message: "Artikel tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: article });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.roleName !== "admin") {
      return NextResponse.json({ success: false, message: "Hanya admin yang dapat mengedit berita." }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();
    const { title, excerpt, content, thumbnail_path, status } = body;

    const article = await db.findById("News", id);
    if (!article) {
      return NextResponse.json({ success: false, message: "Artikel tidak ditemukan." }, { status: 404 });
    }

    const updates: any = {};
    if (title) updates.title = title.trim();
    if (excerpt !== undefined) updates.excerpt = excerpt.trim();
    if (content) updates.content = content.trim();
    if (thumbnail_path) updates.thumbnail_path = thumbnail_path;
    if (status) updates.status = status;

    const updated = await db.update("News", id, updates);

    return NextResponse.json({
      success: true,
      message: "Artikel berhasil diperbarui.",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.roleName !== "admin") {
      return NextResponse.json({ success: false, message: "Hanya admin yang dapat menghapus berita." }, { status: 403 });
    }

    const { id } = params;
    const article = await db.findById("News", id);
    if (!article) {
      return NextResponse.json({ success: false, message: "Artikel tidak ditemukan." }, { status: 404 });
    }

    // Jika artikel memiliki gambar upload lokal di /uploads/, bersihkan filenya
    if (article.thumbnail_path && article.thumbnail_path.startsWith("/uploads/")) {
      await deleteFile(article.thumbnail_path);
    }

    await db.delete("News", id);

    return NextResponse.json({
      success: true,
      message: "Artikel berhasil dihapus.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

