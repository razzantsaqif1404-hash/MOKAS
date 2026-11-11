import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    // Cari user berdasarkan email
    const users = await db.findMany("Users");
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Kombinasi email atau kata sandi salah." },
        { status: 401 }
      );
    }

    if (user.status === "inactive") {
      return NextResponse.json(
        { success: false, message: "Akun Anda dinonaktifkan oleh administrator." },
        { status: 403 }
      );
    }

    // Verifikasi password hash
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Kombinasi email atau kata sandi salah." },
        { status: 401 }
      );
    }

    // Ambil detail role
    const role = await db.findById("Roles", user.role_id);
    const roleName = role ? role.name : "user";

    // Buat JWT Token
    const sessionToken = await createSessionToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      roleId: user.role_id,
      roleName: roleName,
    });

    // Pasang httpOnly cookie
    setSessionCookie(sessionToken);

    return NextResponse.json({
      success: true,
      message: "Login berhasil.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleName,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server: " + (error.message || String(error)) },
      { status: 500 }
    );
  }
}

