import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || session.roleName !== "admin") {
      return NextResponse.json({ success: false, message: "Hanya admin yang memiliki akses." }, { status: 403 });
    }

    const roles = await db.findMany("Roles");
    return NextResponse.json({ success: true, data: roles });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || session.roleName !== "admin") {
      return NextResponse.json({ success: false, message: "Hanya admin yang memiliki akses." }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, permissions } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: "Nama role wajib diisi." }, { status: 400 });
    }

    const cleanName = name.trim().toLowerCase().replace(/\s+/g, "_");

    const existingRoles = await db.findMany("Roles");
    if (existingRoles.some((r) => r.name.toLowerCase() === cleanName)) {
      return NextResponse.json({ success: false, message: "Role dengan nama ini sudah ada." }, { status: 409 });
    }

    const newRole = await db.create("Roles", {
      id: `role-${cleanName}-${Date.now().toString(36)}`,
      name: cleanName,
      description: description?.trim() || "",
      permissions: permissions || "read_news",
      is_system: "false",
    });

    return NextResponse.json({
      success: true,
      message: "Role baru berhasil ditambahkan.",
      data: newRole,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

