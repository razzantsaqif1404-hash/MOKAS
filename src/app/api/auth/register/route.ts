import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, confirmPassword } = body;

    // Validasi form
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Semua kolom wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Kata sandi minimal terdiri dari 6 karakter." },
        { status: 400 }
      );
    }

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Konfirmasi kata sandi tidak cocok." },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUsers = await db.findMany("Users");
    const isEmailTaken = existingUsers.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (isEmailTaken) {
      return NextResponse.json(
        { success: false, message: "Email ini sudah terdaftar. Silakan gunakan email lain atau login." },
        { status: 409 }
      );
    }

    // Role default untuk registrasi selalu 'user'
    const roles = await db.findMany("Roles");
    const userRole = roles.find((r) => r.name === "user") || { id: "role-user", name: "user" };

    // Hash password sebelum disimpan
    const hashedPassword = await hashPassword(password);

    // Simpan user baru
    const newUser = await db.create("Users", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password_hash: hashedPassword,
      role_id: userRole.id,
      status: "active",
    });

    // Otomatis buat sesi login
    const sessionToken = await createSessionToken({
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      roleId: newUser.role_id,
      roleName: "user",
    });

    setSessionCookie(sessionToken);

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil! Selamat datang di MOKAS.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: "user",
      },
    });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server: " + (error.message || String(error)) },
      { status: 500 }
    );
  }
}

