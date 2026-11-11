"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  UserPlus,
  ShieldCheck,
  Trash2,
  AlertCircle,
  CheckCircle,
  X,
  Lock,
} from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role_id: string;
  role_name: string;
  status: "active" | "inactive";
  created_at: string;
}

interface RoleItem {
  id: string;
  name: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal Tambah User State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRoleId, setNewRoleId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Modal Konfirmasi Hapus
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [uRes, rRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/roles"),
      ]);

      const uData = await uRes.json();
      const rData = await rRes.json();

      if (uData.success) setUsers(uData.data);
      if (rData.success) {
        setRoles(rData.data);
        if (rData.data.length > 0 && !newRoleId) {
          const userRole = rData.data.find((r: RoleItem) => r.name === "user") || rData.data[0];
          setNewRoleId(userRole.id);
        }
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: "Gagal memuat data pengguna: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, targetRoleId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role_id: targetRoleId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.message || "Gagal mengubah role." });
        return;
      }
      setFeedback({ type: "success", message: "Role pengguna berhasil diperbarui." });
      fetchUsers();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: "active" | "inactive") => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.message || "Gagal mengubah status akun." });
        return;
      }
      setFeedback({
        type: "success",
        message: `Status akun berhasil diubah menjadi ${nextStatus.toUpperCase()}.`,
      });
      fetchUsers();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`/api/users/${userToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.message || "Gagal menghapus pengguna." });
        setUserToDelete(null);
        return;
      }
      setFeedback({ type: "success", message: "Pengguna berhasil dihapus." });
      setUserToDelete(null);
      fetchUsers();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
      setUserToDelete(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          role_id: newRoleId,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.message || "Gagal membuat pengguna." });
        setSubmitting(false);
        return;
      }

      setFeedback({ type: "success", message: "Pengguna baru berhasil ditambahkan!" });
      setIsAddModalOpen(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      fetchUsers();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline font-black text-2xl sm:text-3xl text-on-surface">
            Manajemen Pengguna
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Kelola akun, peran, dan status keaktifan pengguna yang terdaftar di sistem MOKAS
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
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

      {/* Search Bar */}
      <div className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-container flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nama, email, atau role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
          />
        </div>
        <div className="text-xs text-on-surface-variant self-end sm:self-center">
          Menampilkan <strong className="text-on-surface">{filteredUsers.length}</strong> pengguna
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-surface-container-lowest border border-surface-container overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-container bg-surface-container-low/50 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                <th className="py-3.5 px-6">Pengguna</th>
                <th className="py-3.5 px-6">Peran (Role)</th>
                <th className="py-3.5 px-6">Status Akun</th>
                <th className="py-3.5 px-6">Terdaftar Sejak</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                    Memuat data pengguna...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                    Tidak ada pengguna yang cocok dengan pencarian &quot;{search}&quot;.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-container-low/40 transition-colors">
                    {/* User Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-on-surface truncate">{user.name}</p>
                          <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role Dropdown */}
                    <td className="py-4 px-6">
                      <select
                        value={user.role_id}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="h-8 px-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Status Toggle Button */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleStatusToggle(user.id, user.status)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          user.status === "active"
                            ? "bg-tertiary-container/20 text-tertiary hover:bg-tertiary-container/30"
                            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.status === "active" ? "bg-tertiary" : "bg-outline"
                          }`}
                        />
                        <span>{user.status === "active" ? "Aktif" : "Nonaktif"}</span>
                      </button>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-on-surface-variant whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Delete Action */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => setUserToDelete(user)}
                        title="Hapus Pengguna"
                        className="p-2 rounded-xl text-error hover:bg-error-container/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah User */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-surface-container space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <h3 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                <span>Tambah Pengguna Baru</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-surface-container"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                  Alamat Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                  Kata Sandi Sementara
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                  Peran (Role)
                </label>
                <select
                  value={newRoleId}
                  onChange={(e) => setNewRoleId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name.toUpperCase()}
                    </option>
                  ))}
                </select>
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
                  {submitting ? "Menyimpan..." : "Simpan Pengguna"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-surface rounded-3xl p-6 shadow-2xl border border-surface-container space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface">
              Hapus Pengguna Ini?
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Apakah Anda yakin ingin menghapus akun <strong>{userToDelete.name}</strong> ({userToDelete.email})? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-surface-container text-xs font-bold hover:bg-surface-container"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteUser}
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

