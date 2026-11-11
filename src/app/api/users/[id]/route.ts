import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.roleName !== "admin") {
      return NextResponse.json({ success: false, message: "Hanya admin yang memiliki akses." }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, role_id, status } = body;

    const user = await db.findById("Users", id);
    if (!user) {
      return NextResponse.json({ success: false, message: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    // CEK KEAMANAN: Admin tidak bisa menonaktifkan dirinya sendiri
    if (user.id === session.userId && status === "inactive") {
      return NextResponse.json(
        { success: false, message: "Anda tidak dapat menonaktifkan akun Anda sendiri." },
        { status: 400 }
      );
    }

    // CEK KEAMANAN: Cek jika ini adalah admin terakhir dan statusnya diubah atau rolenya diubah
    const allUsers = await db.findMany("Users");
    const roles = await db.findMany("Roles");
    const adminRole = roles.find((r) => r.name === "admin");

    if (adminRole && user.role_id === adminRole.id) {
      const activeAdmins = allUsers.filter(
        (u) => u.role_id === adminRole.id && u.status === "active"
      );

      if (activeAdmins.length <= 1) {
        if (status === "inactive") {
          return NextResponse.json(
            { success: false, message: "Tidak dapat menonaktifkan admin terakhir di sistem." },
            { status: 400 }
          );
        }
        if (role_id && role_id !== adminRole.id) {
          return NextResponse.json(
            { success: false, message: "Tidak dapat menurunkan role admin terakhir di sistem." },
            { status: 400 }
          );
        }
      }
    }

    const updates: any = {};
    if (name) updates.name = name.trim();
    if (role_id) updates.role_id = role_id;
    if (status) updates.status = status;

    const updated = await db.update("Users", id, updates);

    return NextResponse.json({
      success: true,
      message: "Data pengguna berhasil diperbarui.",
      data: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role_id: updated.role_id,
        status: updated.status,
      },
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
      return NextResponse.json({ success: false, message: "Hanya admin yang memiliki akses." }, { status: 403 });
    }

    const { id } = params;

    // CEK KEAMANAN: Admin tidak bisa menghapus dirinya sendiri
    if (id === session.userId) {
      return NextResponse.json(
        { success: false, message: "Anda tidak dapat menghapus akun Anda sendiri." },
        { status: 400 }
      );
    }

    const user = await db.findById("Users", id);
    if (!user) {
      return NextResponse.json({ success: false, message: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    // CEK KEAMANAN: Admin tidak bisa menghapus admin terakhir
    const allUsers = await db.findMany("Users");
    const roles = await db.findMany("Roles");
    const adminRole = roles.find((r) => r.name === "admin");

    if (adminRole && user.role_id === adminRole.id) {
      const activeAdmins = allUsers.filter(
        (u) => u.role_id === adminRole.id && u.status === "active"
      );
      if (activeAdmins.length <= 1) {
        return NextResponse.json(
          { success: false, message: "Tidak dapat menghapus admin terakhir di sistem." },
          { status: 400 }
        );
      }
    }

    await db.delete("Users", id);

    return NextResponse.json({
      success: true,
      message: "Pengguna berhasil dihapus.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

