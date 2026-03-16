"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";

interface GenerationStatus {
  isGuest: boolean;
  used: number;
  limit: number;
  baseLimit?: number;
  taskBonus?: number;
  taskCompleted: boolean;
  canGenerate: boolean;
}

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function getGuestCount(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem("pp_gen");
  if (!stored) return 0;
  try {
    const data = JSON.parse(stored);
    if (data.date !== getTodayString()) return 0;
    return data.count || 0;
  } catch {
    return 0;
  }
}

function setGuestCount(count: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem("pp_gen", JSON.stringify({ date: getTodayString(), count }));
}

export function useGenerationLimit() {
  const { data: session, status } = useSession();
  const [genStatus, setGenStatus] = useState<GenerationStatus>({
    isGuest: true,
    used: 0,
    limit: 2,
    taskBonus: 11,
    taskCompleted: false,
    canGenerate: true,
  });
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    if (status === "loading") return;

    if (!session) {
      const count = getGuestCount();
      setGenStatus({
        isGuest: true,
        used: count,
        limit: 2,
        taskBonus: 11,
        taskCompleted: false,
        canGenerate: count < 2,
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/generation");
      if (res.ok) {
        const data = await res.json();
        setGenStatus(data);
      }
    } catch (err) {
      console.error("Failed to fetch generation status:", err);
    }
    setLoading(false);
  }, [session, status]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  async function incrementCount(): Promise<boolean> {
    if (!session) {
      const count = getGuestCount();
      setGuestCount(count + 1);
      const newCount = count + 1;
      setGenStatus((prev) => ({
        ...prev,
        used: newCount,
        canGenerate: newCount < prev.limit,
      }));
      return true;
    }

    try {
      const res = await fetch("/api/generation", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setGenStatus((prev) => ({
          ...prev,
          used: data.used,
          limit: data.limit,
          canGenerate: data.canGenerate,
        }));
        return true;
      }
    } catch (err) {
      console.error("Failed to increment generation:", err);
    }
    return false;
  }

  async function completeTask(): Promise<boolean> {
    if (!session) return false;

    try {
      const res = await fetch("/api/daily-task", { method: "POST" });
      if (res.ok) {
        await fetchStatus();
        return true;
      }
    } catch (err) {
      console.error("Failed to complete task:", err);
    }
    return false;
  }

  return {
    ...genStatus,
    loading,
    isLoggedIn: !!session,
    sessionStatus: status,
    incrementCount,
    completeTask,
    refreshStatus: fetchStatus,
  };
}
