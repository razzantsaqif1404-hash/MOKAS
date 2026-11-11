import fs from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Pastikan folder public/uploads selalu ada
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/svg+xml"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export interface StorageResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

/**
 * Menyimpan file upload ke disk lokal public/uploads/
 * Di Step 4, modul ini dapat dengan mudah dialihkan ke cloud storage (Vercel Blob / Cloudinary)
 */
export async function saveFile(file: File): Promise<StorageResult> {
  try {
    if (!file) {
      return { success: false, error: "File tidak ditemukan." };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `Format file tidak diizinkan (${file.type}). Gunakan JPG, PNG, WEBP, atau SVG.`,
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "Ukuran file terlalu besar. Maksimal ukuran gambar adalah 5 MB.",
      };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ambil ekstensi aman
    const rawExt = path.extname(file.name).toLowerCase();
    const safeExt = rawExt && rawExt.length <= 5 ? rawExt : ".jpg";
    const uniqueFileName = `${Date.now()}-${crypto.randomUUID().substring(0, 8)}${safeExt}`;

    const destinationPath = path.join(UPLOAD_DIR, uniqueFileName);
    fs.writeFileSync(destinationPath, buffer);

    const relativePublicPath = `/uploads/${uniqueFileName}`;
    return {
      success: true,
      filePath: relativePublicPath,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Gagal menyimpan file: ${err.message || String(err)}`,
    };
  }
}

/**
 * Menghapus file lokal jika ada
 */
export async function deleteFile(relativePublicPath: string): Promise<boolean> {
  try {
    if (!relativePublicPath || !relativePublicPath.startsWith("/uploads/")) {
      return false;
    }
    const fileName = path.basename(relativePublicPath);
    const fullPath = path.join(UPLOAD_DIR, fileName);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (err) {
    console.error("Gagal menghapus file:", err);
    return false;
  }
}

