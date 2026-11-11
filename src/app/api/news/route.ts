import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await getCurrentSession();
    const isAdmin = session?.roleName === "admin";
    const statusFilter = searchParams.get("status");

    let allNews = await db.findMany("News");

    // Jika bukan admin dan tidak ada statusFilter khusus, hanya tampilkan yang 'published'
    if (!isAdmin) {
      allNews = allNews.filter((n) => n.status === "published");
    } else if (statusFilter) {
      allNews = allNews.filter((n) => n.status === statusFilter);
    }

    // Urutkan berdasarkan tanggal terbaru
    allNews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ success: true, data: allNews });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || session.roleName !== "admin") {
      return NextResponse.json({ success: false, message: "Hanya admin yang dapat menerbitkan berita." }, { status: 403 });
    }

    const body = await request.json();
    const { title, excerpt, content, thumbnail_path, status } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: "Judul dan isi artikel wajib diisi." },
        { status: 400 }
      );
    }

    // Buat slug ramah SEO dari judul
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const newArticle = await db.create("News", {
      title: title.trim(),
      slug: slug,
      excerpt: excerpt?.trim() || title.substring(0, 150) + "...",
      content: content.trim(),
      thumbnail_path: thumbnail_path || "/images/news-cek-mesin.svg",
      status: status === "draft" ? "draft" : "published",
      author_id: session.userId,
    });

    return NextResponse.json({
      success: true,
      message: "Artikel berita berhasil disimpan.",
      data: newArticle,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

