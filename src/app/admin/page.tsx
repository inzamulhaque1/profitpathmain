"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Promo {
  _id: string;
  order: number;
  title: string;
  description: string;
  promoUrl: string;
  promoLabel: string;
  timerDuration: number;
  enabled: boolean;
}

interface Coupon {
  code: string;
  discount: number;
  firstMonthOnly: boolean;
  enabled: boolean;
}

interface Settings {
  guestLimit: number;
  userLimit: number;
  taskBonus: number;
  proPrice: number;
  bkashNumber: string;
  coupons: Coupon[];
}

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  dailyGenerations: number;
  lastGenerationDate: string;
  tasksCompletedToday: number;
  lastTaskDate: string;
  nextPromoIndex: number;
  referralCode: string;
  referralCount: number;
  referredBy: string;
  isPro: boolean;
  proExpiry: string | null;
  unlimitedUntil: string | null;
  lastLoginIP: string;
  createdAt: string;
}

interface PaymentReq {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  bkashNumber: string;
  transactionId: string;
  amount: number;
  couponCode: string;
  status: "pending" | "approved" | "rejected";
  adminNote: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  newUsersToday: number;
  totalSaved: number;
  generationsToday: number;
  tasksCompletedToday: number;
}

const emptyPromoForm = {
  title: "",
  description: "",
  promoUrl: "",
  promoLabel: "",
  timerDuration: 15,
  enabled: true,
};

type Tab = "stats" | "users" | "promos" | "payments" | "settings";

const SIDEBAR_ITEMS: { key: Tab; label: string; icon: string }[] = [
  { key: "stats", label: "Overview", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" },
  { key: "users", label: "Users", icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" },
  { key: "payments", label: "Payments", icon: "M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" },
  { key: "promos", label: "Promos", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" },
  { key: "settings", label: "Settings", icon: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" },
];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("stats");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [settings, setSettings] = useState<Settings>({ guestLimit: 2, userLimit: 4, taskBonus: 11, proPrice: 200, bkashNumber: "01728005274", coupons: [] });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [payments, setPayments] = useState<PaymentReq[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [promoForm, setPromoForm] = useState(emptyPromoForm);
  const [promoSaving, setPromoSaving] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        setAuthorized(true);
        setStats(await res.json());
      } else {
        router.push("/");
      }
    } catch {
      router.push("/");
    }
    setChecking(false);
  }, [router]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) { router.push("/login"); return; }
    checkAuth();
  }, [session, status, checkAuth, router]);

  const fetchPromos = useCallback(async () => {
    const res = await fetch("/api/admin/tasks");
    if (res.ok) { const data = await res.json(); setPromos(data.promos || []); }
  }, []);

  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/admin/settings");
    if (res.ok) { const data = await res.json(); setSettings(data.settings); }
  }, []);

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users");
    if (res.ok) { const data = await res.json(); setUsers(data.users); }
  }, []);

  const fetchPayments = useCallback(async () => {
    const res = await fetch("/api/admin/payments");
    if (res.ok) { const data = await res.json(); setPayments(data.requests || []); }
  }, []);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/admin/stats");
    if (res.ok) { setStats(await res.json()); }
  }, []);

  useEffect(() => {
    if (!authorized) return;
    if (activeTab === "promos") fetchPromos();
    if (activeTab === "payments") fetchPayments();
    if (activeTab === "settings") fetchSettings();
    if (activeTab === "stats") fetchStats();
    if (activeTab === "users") fetchUsers();
  }, [activeTab, authorized, fetchPromos, fetchPayments, fetchSettings, fetchStats, fetchUsers]);

  async function saveSettings() {
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) { setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 2000); }
  }

  async function savePromo() {
    setPromoSaving(true);
    const body = editingId ? { id: editingId, ...promoForm } : promoForm;
    const res = await fetch("/api/admin/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      await fetchPromos();
      setEditingId(null);
      setShowNew(false);
      setPromoForm(emptyPromoForm);
    }
    setPromoSaving(false);
  }

  async function deletePromo(id: string) {
    if (!confirm("Delete this promo?")) return;
    await fetch(`/api/admin/tasks?id=${id}`, { method: "DELETE" });
    await fetchPromos();
  }

  async function movePromo(index: number, direction: "up" | "down") {
    const newPromos = [...promos];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newPromos.length) return;
    [newPromos[index], newPromos[swapIndex]] = [newPromos[swapIndex], newPromos[index]];
    const ids = newPromos.map((p) => p._id);
    await fetch("/api/admin/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    await fetchPromos();
  }

  async function handlePayment(requestId: string, action: "approve" | "reject") {
    const adminNote = action === "reject" ? prompt("Rejection reason (optional):") || "" : "";
    await fetch("/api/admin/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, action, adminNote }),
    });
    await fetchPayments();
    if (activeTab === "users") await fetchUsers();
  }

  async function togglePro(userId: string, currentPro: boolean) {
    if (currentPro) {
      if (!confirm("Remove Pro status from this user?")) return;
      await fetch("/api/admin/pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isPro: false }),
      });
    } else {
      const days = prompt("Grant Pro for how many days?", "30");
      if (!days) return;
      await fetch("/api/admin/pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isPro: true, days: parseInt(days) || 30 }),
      });
    }
    await fetchUsers();
  }

  function editPromo(promo: Promo) {
    setEditingId(promo._id);
    setShowNew(false);
    setPromoForm({
      title: promo.title,
      description: promo.description,
      promoUrl: promo.promoUrl,
      promoLabel: promo.promoLabel,
      timerDuration: promo.timerDuration,
      enabled: promo.enabled,
    });
  }

  if (checking || status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Checking access...</p></div>;
  }
  if (!authorized) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-20 left-3 z-50 bg-white border shadow-md rounded-lg p-2"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-56 bg-white border-r border-gray-200 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
          <p className="text-xs text-gray-400 mt-0.5">ProfitPath</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === item.key
                  ? "bg-red-50 text-red-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">
              {session?.user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-800 truncate">{session?.user?.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="p-4 lg:p-8">
          {/* Page header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === "stats" && "Overview"}
              {activeTab === "users" && "Users"}
              {activeTab === "payments" && "Payments"}
              {activeTab === "promos" && "Promos"}
              {activeTab === "settings" && "Settings"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === "stats" && "Monitor your site performance"}
              {activeTab === "users" && `${users.length} registered users`}
              {activeTab === "payments" && "Manage payment requests"}
              {activeTab === "promos" && "Manage promotional tasks"}
              {activeTab === "settings" && "Configure generation limits"}
            </p>
          </div>

          {/* STATS */}
          {activeTab === "stats" && stats && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard label="Total Users" value={stats.totalUsers} color="blue" />
              <StatCard label="New Today" value={stats.newUsersToday} color="green" />
              <StatCard label="Generations Today" value={stats.generationsToday} color="purple" />
              <StatCard label="Promos Watched" value={stats.tasksCompletedToday} color="orange" />
              <StatCard label="Total Saved" value={stats.totalSaved} color="pink" />
            </div>
          )}

          {/* USERS */}
          {activeTab === "users" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gen</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Promos</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Referrals</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Referred By</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">IP</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => {
                      const hasUnlimited = user.unlimitedUntil && new Date(user.unlimitedUntil) > new Date();
                      const isProActive = user.isPro && user.proExpiry && new Date(user.proExpiry) > new Date();
                      const genToday = user.lastGenerationDate === today ? user.dailyGenerations : 0;
                      const promosToday = user.lastTaskDate === today ? user.tasksCompletedToday : 0;
                      return (
                        <tr key={user._id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 truncate">{user.name}</p>
                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              user.role === "admin" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"
                            }`}>{user.role}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-sm font-semibold ${genToday > 0 ? "text-gray-900" : "text-gray-300"}`}>
                              {genToday}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-sm font-semibold ${promosToday > 0 ? "text-orange-600" : "text-gray-300"}`}>
                              {promosToday}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-sm font-semibold ${(user.referralCount || 0) > 0 ? "text-blue-600" : "text-gray-300"}`}>
                              {user.referralCount || 0}
                            </span>
                            {user.referralCode && (
                              <p className="text-[9px] text-gray-400 font-mono">{user.referralCode}</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {user.referredBy ? (
                              <span className="text-xs font-medium text-blue-600">{user.referredBy}</span>
                            ) : (
                              <span className="text-xs text-gray-300">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {isProActive ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-sm">
                                  👑 PRO
                                </span>
                              ) : hasUnlimited ? (
                                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
                                  Unlimited
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-400">
                                  Free
                                </span>
                              )}
                              <button
                                onClick={() => togglePro(user._id, !!isProActive)}
                                className={`text-[9px] px-2 py-1 rounded-full font-semibold transition border ${
                                  isProActive
                                    ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                                    : "border-yellow-200 bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                                }`}
                              >
                                {isProActive ? "Remove Pro" : "Grant Pro"}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-mono text-gray-500">{user.lastLoginIP || "—"}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</span>
                          </td>
                        </tr>
                      );
                    })}
                    {users.length === 0 && (
                      <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-400">No users yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
                Showing {users.length} users
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {activeTab === "payments" && (
            <div className="space-y-4">
              {payments.filter((p) => p.status === "pending").length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-700 font-medium">
                  {payments.filter((p) => p.status === "pending").length} pending payment request(s) need your attention
                </div>
              )}

              {payments.length === 0 && (
                <div className="bg-white rounded-xl border p-12 text-center text-gray-400">No payment requests yet</div>
              )}

              {payments.map((p) => (
                <div key={p._id} className={`bg-white rounded-xl border p-4 ${
                  p.status === "pending" ? "border-orange-200 ring-1 ring-orange-100" : ""
                }`}>
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{p.userName}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          p.status === "pending" ? "bg-orange-100 text-orange-700" :
                          p.status === "approved" ? "bg-green-100 text-green-700" :
                          "bg-red-100 text-red-700"
                        }`}>{p.status}</span>
                      </div>
                      <p className="text-xs text-gray-400">{p.userEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{p.amount} BDT</p>
                      <p className="text-[10px] text-gray-400">{new Date(p.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-[10px] text-gray-400 uppercase">bKash Number</p>
                      <p className="text-sm font-mono font-medium text-gray-800">{p.bkashNumber}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-[10px] text-gray-400 uppercase">Transaction ID</p>
                      <p className="text-sm font-mono font-medium text-gray-800">{p.transactionId}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-[10px] text-gray-400 uppercase">Amount</p>
                      <p className="text-sm font-medium text-gray-800">{p.amount} BDT</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-[10px] text-gray-400 uppercase">Coupon</p>
                      <p className="text-sm font-medium text-gray-800">{p.couponCode || "—"}</p>
                    </div>
                  </div>

                  {p.adminNote && (
                    <p className="text-xs text-gray-500 mb-3">Admin note: {p.adminNote}</p>
                  )}

                  {p.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePayment(p._id, "approve")}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                      >
                        Approve (+30 days Pro)
                      </button>
                      <button
                        onClick={() => handlePayment(p._id, "reject")}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* PROMOS */}
          {activeTab === "promos" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                <strong>How it works:</strong> Promos show in order (#1, #2, #3...). Each user sees the next one in the list.
                The <strong>last promo loops forever</strong> — put your best CPA offer last.
                Users watch a {settings.taskBonus > 0 ? `${settings.taskBonus}` : "N"}-generation bonus promo each time they hit their limit.
              </div>

              {promos.map((promo, index) => {
                const isEditing = editingId === promo._id;
                const isLast = index === promos.length - 1;

                return (
                  <div key={promo._id} className={`bg-white rounded-xl border p-4 ${isLast ? "ring-2 ring-red-200" : ""}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-900 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h3 className="font-semibold text-gray-900">{promo.title}</h3>
                        {isLast && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                            LOOPS FOREVER
                          </span>
                        )}
                        {!promo.enabled && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Disabled</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => movePromo(index, "up")} disabled={index === 0}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30 px-1">↑</button>
                        <button onClick={() => movePromo(index, "down")} disabled={index === promos.length - 1}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30 px-1">↓</button>
                        <button onClick={() => editPromo(promo)} className="text-sm text-blue-500 hover:text-blue-700 px-2">Edit</button>
                        <button onClick={() => deletePromo(promo._id)} className="text-sm text-red-500 hover:text-red-700 px-2">Delete</button>
                      </div>
                    </div>

                    {!isEditing && (
                      <div className="text-sm text-gray-600 space-y-1 ml-8">
                        <p>{promo.description}</p>
                        <p className="text-xs text-gray-400">
                          URL: {promo.promoUrl || "—"} | Button: {promo.promoLabel || "—"} | Timer: {promo.timerDuration}s
                        </p>
                      </div>
                    )}

                    {isEditing && <PromoForm form={promoForm} setForm={setPromoForm} saving={promoSaving} onSave={savePromo} onCancel={() => { setEditingId(null); setPromoForm(emptyPromoForm); }} />}
                  </div>
                );
              })}

              {/* Add new promo */}
              {!showNew ? (
                <button
                  onClick={() => { setShowNew(true); setEditingId(null); setPromoForm(emptyPromoForm); }}
                  className="w-full bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 text-red-500 hover:border-red-300 hover:bg-red-50 font-medium transition"
                >
                  + Add New Promo
                </button>
              ) : (
                <div className="bg-white rounded-xl border p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">New Promo (will be #{promos.length + 1})</h3>
                  <PromoForm form={promoForm} setForm={setPromoForm} saving={promoSaving} onSave={savePromo} onCancel={() => { setShowNew(false); setPromoForm(emptyPromoForm); }} />
                </div>
              )}
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Generation Limits */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-semibold text-lg text-gray-900 mb-4">Generation Limits</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">Guest Limit</label>
                    <input type="number" value={settings.guestLimit}
                      onChange={(e) => setSettings({ ...settings, guestLimit: parseInt(e.target.value) || 2 })}
                      className="w-full border rounded-lg px-3 py-2" min={0} max={100} />
                    <p className="text-xs text-gray-400 mt-1">Default: 2</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">Free Account Limit</label>
                    <input type="number" value={settings.userLimit}
                      onChange={(e) => setSettings({ ...settings, userLimit: parseInt(e.target.value) || 4 })}
                      className="w-full border rounded-lg px-3 py-2" min={0} max={100} />
                    <p className="text-xs text-gray-400 mt-1">Default: 4</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">Bonus Per Promo</label>
                    <input type="number" value={settings.taskBonus}
                      onChange={(e) => setSettings({ ...settings, taskBonus: parseInt(e.target.value) || 11 })}
                      className="w-full border rounded-lg px-3 py-2" min={0} max={100} />
                    <p className="text-xs text-gray-400 mt-1">Default: 11</p>
                  </div>
                </div>
              </div>

              {/* Pro Plan Settings */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-semibold text-lg text-gray-900 mb-4">Pro Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">Monthly Price (BDT)</label>
                    <input type="number" value={settings.proPrice}
                      onChange={(e) => setSettings({ ...settings, proPrice: parseInt(e.target.value) || 200 })}
                      className="w-full border rounded-lg px-3 py-2" min={0} />
                    <p className="text-xs text-gray-400 mt-1">Default: 200</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">bKash Number</label>
                    <input type="text" value={settings.bkashNumber}
                      onChange={(e) => setSettings({ ...settings, bkashNumber: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2" />
                    <p className="text-xs text-gray-400 mt-1">Users send money to this number</p>
                  </div>
                </div>
              </div>

              {/* Coupon Management */}
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg text-gray-900">Coupons</h2>
                  <button
                    onClick={() => setSettings({ ...settings, coupons: [...settings.coupons, { code: "", discount: 50, firstMonthOnly: true, enabled: true }] })}
                    className="text-sm bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg transition"
                  >
                    + Add Coupon
                  </button>
                </div>
                {settings.coupons.length === 0 && (
                  <p className="text-gray-400 text-sm py-4 text-center">No coupons yet. Click + Add Coupon to create one.</p>
                )}
                <div className="space-y-3">
                  {settings.coupons.map((coupon, i) => (
                    <div key={i} className={`border rounded-lg p-4 ${coupon.enabled ? "border-green-200 bg-green-50/50" : "border-gray-200 bg-gray-50"}`}>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="text-[10px] font-medium text-gray-500 uppercase">Code</label>
                          <input type="text" value={coupon.code}
                            onChange={(e) => {
                              const c = [...settings.coupons]; c[i] = { ...c[i], code: e.target.value.toLowerCase() }; setSettings({ ...settings, coupons: c });
                            }}
                            placeholder="e.g. new50"
                            className="w-full border rounded px-2 py-1.5 text-sm font-mono" />
                        </div>
                        <div>
                          <label className="text-[10px] font-medium text-gray-500 uppercase">Discount %</label>
                          <input type="number" value={coupon.discount}
                            onChange={(e) => {
                              const c = [...settings.coupons]; c[i] = { ...c[i], discount: parseInt(e.target.value) || 0 }; setSettings({ ...settings, coupons: c });
                            }}
                            className="w-full border rounded px-2 py-1.5 text-sm" min={1} max={100} />
                        </div>
                        <div className="flex items-end gap-3">
                          <label className="flex items-center gap-1.5 text-xs text-gray-600">
                            <input type="checkbox" checked={coupon.firstMonthOnly}
                              onChange={(e) => {
                                const c = [...settings.coupons]; c[i] = { ...c[i], firstMonthOnly: e.target.checked }; setSettings({ ...settings, coupons: c });
                              }} />
                            1st month only
                          </label>
                        </div>
                        <div className="flex items-end gap-2">
                          <label className="flex items-center gap-1.5 text-xs text-gray-600">
                            <input type="checkbox" checked={coupon.enabled}
                              onChange={(e) => {
                                const c = [...settings.coupons]; c[i] = { ...c[i], enabled: e.target.checked }; setSettings({ ...settings, coupons: c });
                              }} />
                            Enabled
                          </label>
                          <button
                            onClick={() => { const c = [...settings.coupons]; c.splice(i, 1); setSettings({ ...settings, coupons: c }); }}
                            className="text-red-400 hover:text-red-600 text-xs ml-auto"
                          >Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save */}
              <div className="flex items-center gap-3">
                <button onClick={saveSettings}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2.5 rounded-lg transition">
                  Save All Settings
                </button>
                {settingsSaved && <span className="text-green-600 text-sm font-medium">Saved!</span>}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function PromoForm({ form, setForm, saving, onSave, onCancel }: {
  form: typeof emptyPromoForm;
  setForm: (f: typeof emptyPromoForm) => void;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-500">Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Check out Kling AI" className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="e.g. Turn your visual prompts into real AI videos — free to try!"
            className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-500">Promo URL (affiliate link)</label>
            <input value={form.promoUrl} onChange={(e) => setForm({ ...form, promoUrl: e.target.value })}
              placeholder="https://..." className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Button Label</label>
            <input value={form.promoLabel} onChange={(e) => setForm({ ...form, promoLabel: e.target.value })}
              placeholder="e.g. Visit Kling AI" className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-500">Timer Duration (seconds)</label>
            <input type="number" value={form.timerDuration}
              onChange={(e) => setForm({ ...form, timerDuration: parseInt(e.target.value) || 15 })}
              className="w-full border rounded-lg px-3 py-2 text-sm" min={5} max={60} />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
              Enabled
            </label>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onSave} disabled={saving || !form.title || !form.description}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            {saving ? "Saving..." : "Save Promo"}
          </button>
          <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">Cancel</button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="flex flex-col items-center">
        <p className="text-[10px] font-medium text-gray-400 mb-1">LIVE PREVIEW</p>
        <div className="w-[220px] bg-black rounded-[1.5rem] p-2 shadow-xl">
          <div className="bg-white rounded-[1.2rem] overflow-hidden">
            <div className="bg-gray-100 h-4 flex items-center justify-center">
              <div className="w-10 h-2 bg-gray-300 rounded-full" />
            </div>
            <div className="p-3 text-center">
              <div className="text-lg mb-1">⚡</div>
              <h3 className="text-[10px] font-bold text-gray-900 mb-0.5">Get More Generations!</h3>
              <p className="text-[8px] text-gray-500 mb-2">
                Used <span className="font-bold text-red-500">4/4</span> today
              </p>
              <div className="bg-gray-50 rounded-lg p-2 text-left mb-2">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-[8px]">🎯</span>
                  <span className="font-semibold text-gray-900 text-[9px] leading-tight">
                    {form.title || "Promo Title"}
                  </span>
                </div>
                <p className="text-[8px] text-gray-600 mb-1.5 leading-tight">
                  {form.description ? (form.description.length > 60 ? form.description.slice(0, 60) + "..." : form.description) : "Description here..."}
                </p>
                <div className="w-full bg-red-500 text-white text-[8px] font-semibold py-1.5 rounded-lg text-center">
                  {form.promoLabel || "Check it out"} — {form.timerDuration}s
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-1.5">
                <p className="font-bold text-green-700 text-[8px]">🎉 Task Complete!</p>
                <div className="w-full bg-green-500 text-white text-[8px] font-semibold py-1 rounded-lg text-center mt-1">
                  Claim Bonus
                </div>
              </div>
            </div>
            <div className="bg-gray-100 h-3 flex items-center justify-center">
              <div className="w-12 h-0.5 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const STAT_COLORS: Record<string, string> = {
  blue: "bg-blue-50 border-blue-100 text-blue-600",
  green: "bg-green-50 border-green-100 text-green-600",
  purple: "bg-purple-50 border-purple-100 text-purple-600",
  orange: "bg-orange-50 border-orange-100 text-orange-600",
  pink: "bg-pink-50 border-pink-100 text-pink-600",
};

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorClass = STAT_COLORS[color] || STAT_COLORS.blue;
  return (
    <div className={`rounded-xl border p-5 ${colorClass}`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm font-medium mt-1 opacity-80">{label}</div>
    </div>
  );
}
