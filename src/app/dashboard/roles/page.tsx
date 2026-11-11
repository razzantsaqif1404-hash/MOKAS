"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  ShieldPlus,
  Lock,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  X,
  Check,
} from "lucide-react";

interface RoleItem {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: "true" | "false";
  created_at: string;
}

const AVAILABLE_PERMISSIONS = [
  { id: "read_news", label: "Membaca Berita & Tips" },
  { id: "write_news", label: "Menulis & CRUD Berita" },
  { id: "manage_users", label: "Kelola Pengguna Sistem" },
  { id: "manage_orders", label: "Kelola Pesanan & Reservasi" },
];

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [roleName, setRoleName] = useState("");
  const [roleDesc, setRoleDesc] = useState("");
  const [selectedPerms, setSelectedPerms] = useState<string[]>(["read_news"]);
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [roleToDelete, setRoleToDelete] = useState<RoleItem | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/roles");
      const data = await res.json();
      if (data.success) {
        setRoles(data.data);
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: "Gagal memuat peran: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const togglePermission = (permId: string) => {
    setSelectedPerms((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const handleOpenAddModal = () => {
    setRoleName("");
    setRoleDesc("");
    setSelectedPerms(["read_news"]);
    setEditingRole(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (role: RoleItem) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDesc(role.description);
    setSelectedPerms(role.permissions === "all" ? AVAILABLE_PERMISSIONS.map((p) => p.id) : role.permissions.split(","));
    setIsAddModalOpen(true);
  };

  const handleSubmitRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingRole) {
        // Edit mode
        const res = await fetch(`/api/roles/${editingRole.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: roleDesc,
            permissions: selectedPerms.join(","),
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setFeedback({ type: "error", message: data.message || "Gagal memperbarui role." });
          setSubmitting(false);
          return;
        }
        setFeedback({ type: "success", message: "Peran berhasil diperbarui!" });
      } else {
        // Create mode
        const res = await fetch("/api/roles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: roleName,
            description: roleDesc,
            permissions: selectedPerms.join(","),
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setFeedback({ type: "error", message: data.message || "Gagal membuat role." });
          setSubmitting(false);
          return;
        }
        setFeedback({ type: "success", message: "Peran kustom baru berhasil ditambahkan!" });
      }

      setIsAddModalOpen(false);
      fetchRoles();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!roleToDelete) return;
    try {
      const res = await fetch(`/api/roles/${roleToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.message || "Gagal menghapus role." });
        setRoleToDelete(null);
        return;
      }
      setFeedback({ type: "success", message: "Peran berhasil dihapus." });
      setRoleToDelete(null);
      fetchRoles();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
      setRoleToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline font-black text-2xl sm:text-3xl text-on-surface">
            Manajemen Peran & Hak Akses
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Atur hierarki akses dan izin pengguna ke fitur-fitur website MOKAS
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 self-start sm:self-auto"
        >
          <ShieldPlus className="w-4 h-4" />
          <span>Tambah Peran Kustom</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-sm ${
            feedback.type === "success"
              ? "bg-tertiary-container/20 text-tertiary border border-tertiary/30"
              : "bg-error-container/40 text-error border border-error/30"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="p-1 hover:bg-black/10 rounded-lg text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Roles Grid / Table */}
      <div className="rounded-3xl bg-surface-container-lowest border border-surface-container overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-container bg-surface-container-low/50 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                <th className="py-3.5 px-6">Nama Peran</th>
                <th className="py-3.5 px-6">Deskripsi</th>
                <th className="py-3.5 px-6">Hak Akses (Permissions)</th>
                <th className="py-3.5 px-6">Tipe</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                    Memuat daftar peran...
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-on-surface">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="uppercase">{role.name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-on-surface-variant max-w-xs">
                      {role.description || "-"}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions === "all" ? (
                          <span className="px-2 py-0.5 rounded-md bg-tertiary-container/20 text-tertiary font-bold text-[11px]">
                            Semua Akses (Full Admin)
                          </span>
                        ) : (
                          role.permissions.split(",").map((perm) => (
                            <span
                              key={perm}
                              className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[11px] font-medium"
                            >
                              {perm}
                            </span>
                          ))
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {role.is_system === "true" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                          <Lock className="w-3 h-3" /> Bawaan Sistem
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary text-[11px] font-bold">
                          Kustom
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      {role.is_system === "true" ? (
                        <span className="text-[11px] text-outline font-semibold">Terkunci</span>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(role)}
                            className="p-1.5 rounded-lg text-primary hover:bg-primary/10"
                            title="Edit Role"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setRoleToDelete(role)}
                            className="p-1.5 rounded-lg text-error hover:bg-error-container/30"
                            title="Hapus Role"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit Role */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-surface-container space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <h3 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>{editingRole ? "Edit Peran" : "Tambah Peran Kustom Baru"}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-surface-container"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRole} className="space-y-4">
              {!editingRole && (
                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                    Nama Peran (Huruf kecil tanpa spasi)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="contoh: editor, marketing"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan tugas peran ini..."
                  value={roleDesc}
                  onChange={(e) => setRoleDesc(e.target.value)}
                  className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                  Hak Akses (Pilih satu atau lebih)
                </label>
                <div className="space-y-2">
                  {AVAILABLE_PERMISSIONS.map((perm) => (
                    <label
                      key={perm.id}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPerms.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                        className="rounded text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="text-xs font-semibold text-on-surface">
                        {perm.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-surface-container text-xs font-bold hover:bg-surface-container"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Peran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {roleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-surface rounded-3xl p-6 shadow-2xl border border-surface-container space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface">
              Hapus Peran Ini?
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Apakah Anda yakin ingin menghapus peran <strong>{roleToDelete.name}</strong>? Peran yang sedang digunakan oleh pengguna tidak dapat dihapus.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setRoleToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-surface-container text-xs font-bold hover:bg-surface-container"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteRole}
                className="px-5 py-2.5 rounded-xl bg-error hover:bg-red-700 text-white text-xs font-bold shadow-md"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

