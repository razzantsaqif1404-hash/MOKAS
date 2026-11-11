import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { siteConfig } from "@/config/site";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Akses ditolak. Silakan login." }, { status: 401 });
    }

    let orders = await db.findMany("Orders");

    // Jika bukan admin, hanya kembalikan pesanan milik user sendiri
    if (session.roleName !== "admin") {
      orders = orders.filter((o) => o.user_id === session.userId);
    }

    // Urutkan dari yang terbaru
    orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Silakan login terlebih dahulu untuk melakukan booking unit motor." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      user_name,
      user_whatsapp,
      user_address,
      motorcycle_id,
      motorcycle_name,
      notes,
    } = body;

    // Validasi Form Server-side
    if (!user_name || !user_name.trim()) {
      return NextResponse.json({ success: false, message: "Nama lengkap pemesan wajib diisi." }, { status: 400 });
    }

    if (!user_whatsapp || !user_whatsapp.trim()) {
      return NextResponse.json({ success: false, message: "Nomor WhatsApp aktif pemesan wajib diisi." }, { status: 400 });
    }

    const cleanPhone = user_whatsapp.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 9 || cleanPhone.length > 15) {
      return NextResponse.json({ success: false, message: "Format nomor WhatsApp tidak valid (minimal 9 digit angka)." }, { status: 400 });
    }

    if (!user_address || !user_address.trim()) {
      return NextResponse.json({ success: false, message: "Alamat domisili pembeli wajib diisi." }, { status: 400 });
    }

    if (!motorcycle_id || !motorcycle_name) {
      return NextResponse.json({ success: false, message: "Pilihan unit motor wajib disertakan." }, { status: 400 });
    }

    // Generate Tiket Unik MOKAS: MKS-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `MKS-${dateStr}-${randomCode}`;

    // Nominal Booking Tetap Rp 200.000 sesuai instruksi
    const bookingFee = siteConfig.bookingFee || 200000;

    const newOrder = await db.create("Orders", {
      ticket_number: ticketNumber,
      user_id: session.userId,
      user_name: user_name.trim(),
      user_whatsapp: user_whatsapp.trim(),
      user_address: user_address.trim(),
      motorcycle_id: motorcycle_id,
      motorcycle_name: motorcycle_name,
      total_price: bookingFee,
      order_type: "Cek Fisik di Showroom",
      status: "menunggu_konfirmasi",
      notes: notes?.trim() || "",
    });

    return NextResponse.json({
      success: true,
      message: "Booking tiket berhasil dibuat! Silakan lanjutkan pembayaran tanda jadi via QRIS.",
      data: newOrder,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

