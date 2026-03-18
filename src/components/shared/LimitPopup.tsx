"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

interface DailyTask {
  id: string;
  title: string;
  description: string;
  promoUrl: string;
  promoLabel: string;
  timerDuration: number;
  isLoop: boolean;
  position: number;
  total: number;
}

interface LimitPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isGuest: boolean;
  used: number;
  limit: number;
  onTaskComplete: () => Promise<boolean>;
}

export default function LimitPopup({
  isOpen,
  onClose,
  isGuest,
  used,
  limit,
  onTaskComplete,
}: LimitPopupProps) {
  const router = useRouter();
  const [task, setTask] = useState<DailyTask | null>(null);
  const [timer, setTimer] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [loadingTask, setLoadingTask] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const startTimeRef = useRef<number>(0);

  const fetchTask = useCallback(async () => {
    if (isGuest) return;
    setLoadingTask(true);
    try {
      const res = await fetch("/api/daily-task");
      if (res.ok) {
        const data = await res.json();
        setTask(data.task);
      }
    } catch (err) {
      console.error("Failed to fetch task:", err);
    }
    setLoadingTask(false);
  }, [isGuest]);

  useEffect(() => {
    if (isOpen && !isGuest) {
      setTimerStarted(false);
      setTimerDone(false);
      setTimer(0);
      fetchTask();
    }
  }, [isOpen, isGuest, fetchTask]);

  // Countdown timer — runs every second, verifies against real elapsed time
  useEffect(() => {
    if (!timerStarted || timerDone || !task) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, task.timerDuration - elapsed);
      setTimer(remaining);

      if (remaining <= 0) {
        setTimerDone(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerStarted, timerDone, task]);

  async function handleStartTask() {
    if (!task) return;
    // Register start time on server FIRST
    try {
      await fetch("/api/daily-task", { method: "PUT" });
    } catch {
      // Continue anyway — server will reject completion if not registered
    }
    // Open promo URL in new tab
    if (task.promoUrl) {
      window.open(task.promoUrl, "_blank");
    }
    // Start verified timer
    startTimeRef.current = Date.now();
    setTimer(task.timerDuration);
    setTimerStarted(true);
    setTimerDone(false);
  }

  async function handleClaimBonus() {
    if (!task || !timerDone) return;

    // Client-side verify: enough real time has passed
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    if (elapsed < task.timerDuration - 1) {
      // Cheating detected — reset
      setTimerStarted(false);
      setTimerDone(false);
      setTimer(0);
      return;
    }

    setClaiming(true);
    const success = await onTaskComplete();
    setClaiming(false);
    if (success) {
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          &times;
        </button>

        {/* GUEST: Sign up prompt */}
        {isGuest && (
          <div className="text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Free Limit Reached
            </h3>
            <p className="text-gray-600 mb-1">
              You&apos;ve used <span className="font-bold text-red-500">{used}/{limit}</span> free generations today.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Sign up for free to get more daily generations + save your work!
            </p>
            <button
              onClick={() => router.push("/register?callbackUrl=" + encodeURIComponent(window.location.pathname))}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition mb-3"
            >
              Sign Up Free — Get More Generations
            </button>
            <button
              onClick={() => router.push("/login?callbackUrl=" + encodeURIComponent(window.location.pathname))}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2"
            >
              Already have an account? Log in
            </button>
          </div>
        )}

        {/* LOGGED IN: Daily task */}
        {!isGuest && (
          <div className="text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Get More Generations!
            </h3>
            <p className="text-gray-600 mb-4">
              You&apos;ve used <span className="font-bold text-red-500">{used}/{limit}</span> generations today.
              Complete today&apos;s quick task to unlock more!
            </p>

            {loadingTask && (
              <div className="py-8 text-gray-400">Loading today&apos;s task...</div>
            )}

            {/* Already completed task AND used all bonus — truly done for today */}
            {!loadingTask && !task && (
              <div className="py-4">
                <div className="text-4xl mb-3">😴</div>
                <p className="font-semibold text-gray-700 mb-1">
                  You&apos;ve used all {limit} generations today!
                </p>
                <p className="text-gray-500 text-sm">
                  Come back tomorrow for a fresh batch.
                </p>
              </div>
            )}

            {/* Task ready — not started yet */}
            {!loadingTask && task && !timerStarted && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🎯</span>
                  <span className="font-semibold text-gray-900">{task.title}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{task.description}</p>
                <button
                  onClick={handleStartTask}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition"
                >
                  {task.promoLabel || "Check it out"} — Wait {task.timerDuration}s
                </button>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  A page will open. Wait {task.timerDuration} seconds to unlock.
                </p>
              </div>
            )}

            {/* Timer running */}
            {!loadingTask && task && timerStarted && !timerDone && (
              <div className="bg-red-50 rounded-xl p-6 mb-4">
                <div className="text-6xl font-bold text-red-500 mb-2 tabular-nums">{timer}s</div>
                <p className="text-sm text-gray-600 mb-3">
                  Checking out the recommendation...
                </p>
                <div className="bg-red-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full transition-all duration-1000 ease-linear"
                    style={{
                      width: `${((task.timerDuration - timer) / task.timerDuration) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Do not close this popup
                </p>
              </div>
            )}

            {/* Timer done — claim bonus */}
            {!loadingTask && task && timerDone && (
              <div className="bg-green-50 rounded-xl p-6 mb-4">
                <div className="text-4xl mb-2">🎉</div>
                <p className="font-bold text-green-700 text-lg mb-1">Task Complete!</p>
                <p className="text-sm text-green-600 mb-4">You&apos;ve earned bonus generations</p>
                <button
                  onClick={handleClaimBonus}
                  disabled={claiming}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-3 px-6 rounded-xl transition"
                >
                  {claiming ? "Unlocking..." : "Claim Bonus Generations"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Referral option for logged-in users */}
        {!isGuest && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500 mb-2">Or get unlimited for a day!</p>
            <button
              onClick={() => { onClose(); router.push("/referral"); }}
              className="text-sm font-medium text-brand-600 hover:text-brand-700 transition"
            >
              🎁 Refer a Friend — Get 1 Day Unlimited
            </button>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-4">
          Resets daily at midnight
        </p>
      </div>
    </div>
  );
}
