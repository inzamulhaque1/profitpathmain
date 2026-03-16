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

interface Settings {
  guestLimit: number;
  userLimit: number;
  taskBonus: number;
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

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<"stats" | "users" | "promos" | "settings">("stats");

  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [settings, setSettings] = useState<Settings>({ guestLimit: 2, userLimit: 4, taskBonus: 11 });
  const [settingsSaved, setSettingsSaved] = useState(false);

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

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/admin/stats");
    if (res.ok) { setStats(await res.json()); }
  }, []);

  useEffect(() => {
    if (!authorized) return;
    if (activeTab === "promos") fetchPromos();
    if (activeTab === "settings") fetchSettings();
    if (activeTab === "stats") fetchStats();
    if (activeTab === "users") fetchUsers();
  }, [activeTab, authorized, fetchPromos, fetchSettings, fetchStats, fetchUsers]);

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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-500 mb-6">Manage promos, limits, and monitor usage</p>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit flex-wrap">
          {(["stats", "users", "promos", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "stats" && "📊 Stats"}
              {tab === "users" && "👥 Users"}
              {tab === "promos" && "🎯 Promos"}
              {tab === "settings" && "⚙️ Settings"}
            </button>
          ))}
        </div>

        {/* STATS */}
        {activeTab === "stats" && stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Total Users" value={stats.totalUsers} icon="👥" />
            <StatCard label="New Today" value={stats.newUsersToday} icon="🆕" />
            <StatCard label="Generations Today" value={stats.generationsToday} icon="⚡" />
            <StatCard label="Promos Watched Today" value={stats.tasksCompletedToday} icon="🎯" />
            <StatCard label="Total Saved" value={stats.totalSaved} icon="💾" />
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Gen Today</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Promos</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Next Promo</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          user.role === "admin" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                        }`}>{user.role}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {user.lastGenerationDate === today ? user.dailyGenerations : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {user.lastTaskDate === today ? `${user.tasksCompletedToday} watched` : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">#{user.nextPromoIndex + 1}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No users yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t bg-gray-50 text-xs text-gray-500">
              Showing {users.length} users (max 200)
            </div>
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
          <div className="bg-white rounded-xl border p-6 space-y-6">
            <h2 className="font-semibold text-lg text-gray-900">Generation Limits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Guest Limit (no account)</label>
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
                <label className="text-sm font-medium text-gray-600 block mb-1">Bonus Per Promo Watch</label>
                <input type="number" value={settings.taskBonus}
                  onChange={(e) => setSettings({ ...settings, taskBonus: parseInt(e.target.value) || 11 })}
                  className="w-full border rounded-lg px-3 py-2" min={0} max={100} />
                <p className="text-xs text-gray-400 mt-1">Default: 11 (each promo watch gives +{settings.taskBonus})</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={saveSettings}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-lg transition">
                Save Settings
              </button>
              {settingsSaved && <span className="text-green-600 text-sm font-medium">Saved!</span>}
            </div>
          </div>
        )}
      </div>
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
      {/* Form */}
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

      {/* Live Preview — Compact phone mockup */}
      <div className="flex flex-col items-center">
        <p className="text-[10px] font-medium text-gray-400 mb-1">LIVE PREVIEW</p>
        <div className="w-[220px] bg-black rounded-[1.5rem] p-2 shadow-xl scale-100">
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
              <div className="bg-red-50 rounded-lg p-1.5 mb-2">
                <div className="text-lg font-bold text-red-500">{form.timerDuration}s</div>
                <div className="bg-red-200 rounded-full h-1 overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full w-1/3" />
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-1.5">
                <p className="font-bold text-green-700 text-[8px]">🎉 Task Complete!</p>
                <div className="w-full bg-green-500 text-white text-[8px] font-semibold py-1 rounded-lg text-center mt-1">
                  Claim Bonus
                </div>
              </div>
              <p className="text-[7px] text-gray-400 mt-1">Resets daily at midnight</p>
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

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
