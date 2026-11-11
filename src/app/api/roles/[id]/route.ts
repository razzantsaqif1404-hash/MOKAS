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
    const { description, permissions } = body;

    const role = await db.findById("Roles", id);
    if (!role) {
      return NextResponse.json({ success: false, message: "Role tidak ditemukan." }, { status: 404 });
    }

    const updates: any = {};
    if (description !== undefined) updates.description = description.trim();
    if (permissions !== undefined) updates.permissions = permissions;

    const updated = await db.update("Roles", id, updates);

    return NextResponse.json({
      success: true,
      message: "Role berhasil diperbarui.",
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
      return NextResponse.json({ success: false, message: "Hanya admin yang memiliki akses." }, { status: 403 });
    }

    const { id } = params;

    const role = await db.findById("Roles", id);
    if (!role) {
      return NextResponse.json({ success: false, message: "Role tidak ditemukan." }, { status: 404 });
    }

    // Role bawaan sistem tidak boleh dihapus
    if (role.is_system === "true") {
      return NextResponse.json(
        { success: false, message: "Role bawaan sistem ('admin' dan 'user') tidak dapat dihapus." },
        { status: 400 }
      );
    }

    // Cek apakah masih ada user yang memakai role ini
    const users = await db.findMany("Users");
    const assignedUsers = users.filter((u) => u.role_id === id);
    if (assignedUsers.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Tidak dapat menghapus role ini karena masih digunakan oleh ${assignedUsers.length} pengguna. Ubah role pengguna tersebut terlebih dahulu.`,
        },
        { status: 400 }
      );
    }

    await db.delete("Roles", id);

    return NextResponse.json({
      success: true,
      message: "Role berhasil dihapus.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

