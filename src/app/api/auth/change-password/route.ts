import { NextResponse } from "next/server";
import { getCurrentSession, verifyPassword, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Akses ditolak. Silakan login." }, { status: 401 });
    }

    const body = await request.json();
    const { oldPassword, newPassword, confirmNewPassword } = body;

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Kata sandi lama dan kata sandi baru wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Kata sandi baru minimal harus 6 karakter." },
        { status: 400 }
      );
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      return NextResponse.json(
        { success: false, message: "Konfirmasi kata sandi baru tidak cocok." },
        { status: 400 }
      );
    }

    // Ambil user dari database
    const user = await db.findById("Users", session.userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    // Verifikasi password lama
    const isOldValid = await verifyPassword(oldPassword, user.password_hash);
    if (!isOldValid) {
      return NextResponse.json(
        { success: false, message: "Kata sandi lama Anda salah." },
        { status: 400 }
      );
    }

    // Hash kata sandi baru
    const newHash = await hashPassword(newPassword);
    await db.update("Users", user.id, {
      password_hash: newHash,
    });

    return NextResponse.json({
      success: true,
      message: "Kata sandi berhasil diperbarui! Mohon gunakan kata sandi baru saat login berikutnya.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Gagal mengubah kata sandi: " + error.message },
      { status: 500 }
    );
  }
}

