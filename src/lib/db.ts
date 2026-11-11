import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role_id: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface RoleRecord {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: "true" | "false";
  created_at: string;
}

export interface NewsRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "published" | "draft";
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface OrderRecord {
  id: string;
  ticket_number: string;
  user_id: string;
  user_name: string;
  user_whatsapp: string;
  user_address?: string;
  motorcycle_id: string;
  motorcycle_name: string;
  total_price: number | string;
  order_type?: string; // e.g. "Cek Fisik di Showroom"
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "dibatalkan";
  notes?: string;
  cancel_reason?: string;
  created_at: string;
  updated_at: string;
}

// Fallback local database path untuk testing sebelum Apps Script dihubungkan
const LOCAL_DB_PATH = path.join(process.cwd(), "data", "local-db.json");

interface LocalDbSchema {
  Users: UserRecord[];
  Roles: RoleRecord[];
  News: NewsRecord[];
  Orders: OrderRecord[];
}

function getInitialDb(): LocalDbSchema {
  return {
    Roles: [
      {
        id: "role-admin",
        name: "admin",
        description: "Administrator penuh MOKAS",
        permissions: "all",
        is_system: "true",
        created_at: new Date().toISOString(),
      },
      {
        id: "role-user",
        name: "user",
        description: "Pengguna terdaftar MOKAS",
        permissions: "read_news,create_order",
        is_system: "true",
        created_at: new Date().toISOString(),
      },
    ],
    Users: [
      {
        id: "user-admin-root",
        name: "Administrator MOKAS",
        email: "admin@gmail.com",
        // Bcrypt hash dari '123456'
        password_hash: "$2b$10$W4B/ryQG2O4AqVrb27jCi.K4mqlU9kq.XUgCn8AgfeH18R3kA1Fkm",
        role_id: "role-admin",
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    News: [
      {
        id: "news-001",
        title: "5 Hal Wajib Diperiksa Saat Membeli Motor Second Agar Tidak Tertipu Mesin Oplosan",
        slug: "tips-cek-mesin-motor-bekas-bebas-oplosan",
        excerpt: "Mulai dari memeriksa warna asap knalpot, suara rantai keteng, hingga baut blok mesin yang belum cacat bekas bongkaran.",
        content: "Membeli motor second membutuhkan ketelitian ekstra pada bagian ruang bakar dan transmisi. Pastikan mesin dalam kondisi dingin saat pertama dinyalakan untuk mendengarkan ketukan klep yang wajar...",
        thumbnail_path: "/images/news-cek-mesin.svg",
        status: "published",
        author_id: "user-admin-root",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "news-002",
        title: "Panduan Lengkap Memeriksa Keabsahan STNK & BPKB Asli Sebelum Transaksi Motor",
        slug: "cara-cek-keaslian-stnk-bpkb-samsat",
        excerpt: "Ketahui ciri watermark hologram BPKB asli, benang pengaman dokumen, dan cara cek online e-Samsat tanpa harus ke kantor polisi.",
        content: "Legalitas kendaraan bermotor adalah nomor satu. Pastikan nomor rangka dan nomor mesin pada fisik kendaraan cocok 100% dengan yang tertera di lembar STNK dan BPKB tanpa bekas ketokan kasar...",
        thumbnail_path: "/images/news-cek-surat.svg",
        status: "published",
        author_id: "user-admin-root",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "news-003",
        title: "Daftar Rekomendasi Motor Matic Bekas Paling Bandel & Hemat BBM Tahun 2026",
        slug: "rekomendasi-motor-matic-bekas-paling-irit-2026",
        excerpt: "Ulasan perbandingan konsumsi bahan bakar, ketersediaan sparepart, serta harga pasar wajar untuk motor harian komuter.",
        content: "Motor matic kelas 125cc hingga 160cc tetap menjadi primadona di pasar motor second. Model seperti Honda BeAT, Vario, hingga Yamaha NMAX mendominasi penjualan karena efisiensi bahan bakar...",
        thumbnail_path: "/images/news-matic-irit.svg",
        status: "published",
        author_id: "user-admin-root",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    Orders: [],
  };
}

function loadLocalDb(): LocalDbSchema {
  try {
    const dir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      const initial = getInitialDb();
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    const data = fs.readFileSync(LOCAL_DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return getInitialDb();
  }
}

function saveLocalDb(data: LocalDbSchema) {
  try {
    const dir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Gagal menyimpan local DB:", err);
  }
}

/**
 * Pemanggil Google Apps Script Web App
 */
async function callAppsScript(action: string, sheet: string, payload: Record<string, any> = {}) {
  const url = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SECRET;

  if (!url || !secret) {
    return null; // Gunakan mode local database
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        action,
        sheet,
        ...payload,
      }),
      cache: "no-store",
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Gagal memproses permintaan Apps Script.");
    }
    return result.data;
  } catch (err: any) {
    console.warn("Koneksi Apps Script gagal, beralih ke local storage:", err.message);
    return null;
  }
}

export const db = {
  /**
   * Operasi READ
   */
  async findMany<T extends keyof LocalDbSchema>(
    sheet: T,
    filter?: Partial<LocalDbSchema[T][number]>
  ): Promise<LocalDbSchema[T]> {
    const remote = await callAppsScript("read", sheet, { filter });
    if (remote !== null && Array.isArray(remote)) {
      return remote as LocalDbSchema[T];
    }

    const local = loadLocalDb();
    const records = local[sheet] as any[];

    if (!filter) return records as LocalDbSchema[T];

    const filtered = records.filter((rec) => {
      for (const key in filter) {
        if (filter[key] !== undefined && filter[key] !== "") {
          if (String(rec[key]).toLowerCase() !== String(filter[key]).toLowerCase()) {
            return false;
          }
        }
      }
      return true;
    });

    return filtered as LocalDbSchema[T];
  },

  /**
   * Operasi FIND BY ID
   */
  async findById<T extends keyof LocalDbSchema>(
    sheet: T,
    id: string
  ): Promise<LocalDbSchema[T][number] | null> {
    const records = await this.findMany(sheet, { id } as any);
    return (records && records[0]) || null;
  },

  /**
   * Operasi CREATE
   */
  async create<T extends keyof LocalDbSchema>(
    sheet: T,
    record: Omit<LocalDbSchema[T][number], "id" | "created_at" | "updated_at"> & { id?: string }
  ): Promise<LocalDbSchema[T][number]> {
    const newRecord: any = {
      id: record.id || `rec-${crypto.randomUUID()}`,
      ...record,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const remote = await callAppsScript("create", sheet, { record: newRecord });
    if (remote !== null) {
      return remote;
    }

    const local = loadLocalDb();
    (local[sheet] as any[]).push(newRecord);
    saveLocalDb(local);
    return newRecord;
  },

  /**
   * Operasi UPDATE
   */
  async update<T extends keyof LocalDbSchema>(
    sheet: T,
    id: string,
    updates: Partial<LocalDbSchema[T][number]>
  ): Promise<LocalDbSchema[T][number]> {
    const remote = await callAppsScript("update", sheet, { id, record: updates });
    if (remote !== null) {
      return remote;
    }

    const local = loadLocalDb();
    const records = local[sheet] as any[];
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Data dengan id ${id} tidak ditemukan.`);
    }

    records[index] = {
      ...records[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    saveLocalDb(local);
    return records[index];
  },

  /**
   * Operasi DELETE
   */
  async delete<T extends keyof LocalDbSchema>(sheet: T, id: string): Promise<boolean> {
    const remote = await callAppsScript("delete", sheet, { id });
    if (remote !== null) {
      return true;
    }

    const local = loadLocalDb();
    const records = local[sheet] as any[];
    const initialLen = records.length;
    local[sheet] = records.filter((r) => r.id !== id) as any;

    if (local[sheet].length === initialLen) {
      throw new Error(`Data dengan id ${id} tidak ditemukan.`);
    }

    saveLocalDb(local);
    return true;
  },
};

