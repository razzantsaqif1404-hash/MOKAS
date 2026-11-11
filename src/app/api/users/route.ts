import { NextResponse } from "next/server";
import { getCurrentSession, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || session.roleName !== "admin") {
      return NextResponse.json({ success: false, message: "Hanya admin yang memiliki akses." }, { status: 403 });
    }

    const [users, roles] = await Promise.all([db.findMany("Users"), db.findMany("Roles")]);

    const roleMap = new Map(roles.map((r) => [r.id, r.name]));

    // Sembunyikan password_hash dari response
    const sanitizedUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role_id: u.role_id,
      role_name: roleMap.get(u.role_id) || "user",
      status: u.status,
      created_at: u.created_at,
      updated_at: u.updated_at,
    }));

    return NextResponse.json({ success: true, data: sanitizedUsers });
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
    const { name, email, password, role_id } = body;

    if (!name || !email || !password || !role_id) {
      return NextResponse.json({ success: false, message: "Semua kolom wajib diisi." }, { status: 400 });
    }

    const existingUsers = await db.findMany("Users");
    if (existingUsers.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return NextResponse.json({ success: false, message: "Email sudah terdaftar." }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await db.create("Users", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password_hash: hashedPassword,
      role_id: role_id,
      status: "active",
    });

    return NextResponse.json({
      success: true,
      message: "Pengguna berhasil ditambahkan.",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role_id: newUser.role_id,
        status: newUser.status,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

