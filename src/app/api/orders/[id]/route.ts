import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Akses ditolak. Silakan login." }, { status: 401 });
    }

    const { id } = params;
    const order = await db.findById("Orders", id);

    if (!order) {
      return NextResponse.json({ success: false, message: "Pesanan tiket tidak ditemukan." }, { status: 404 });
    }

    // Hanya admin atau pemilik tiket yang boleh melihat detailnya
    if (session.roleName !== "admin" && order.user_id !== session.userId) {
      return NextResponse.json({ success: false, message: "Anda tidak berhak melihat tiket ini." }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: order });
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
    // Hanya admin yang boleh mengubah status pemesanan
    if (!session || session.roleName !== "admin") {
      return NextResponse.json({ success: false, message: "Hanya admin yang dapat mengonfirmasi atau membatalkan pesanan." }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();
    const { status, cancel_reason } = body;

    if (!["menunggu_konfirmasi", "dikonfirmasi", "dibatalkan"].includes(status)) {
      return NextResponse.json({ success: false, message: "Status pesanan tidak valid." }, { status: 400 });
    }

    const order = await db.findById("Orders", id);
    if (!order) {
      return NextResponse.json({ success: false, message: "Tiket pesanan tidak ditemukan." }, { status: 404 });
    }

    const updates: any = { status };
    if (status === "dibatalkan" && cancel_reason) {
      updates.cancel_reason = cancel_reason.trim();
    }

    const updated = await db.update("Orders", id, updates);

    return NextResponse.json({
      success: true,
      message: `Status pesanan berhasil diubah menjadi "${status}".`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

