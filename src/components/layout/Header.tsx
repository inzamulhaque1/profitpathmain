"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { TOOLS } from "@/lib/constants";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const userInitial = session?.user?.name?.charAt(0).toUpperCase() || "U";
  const [genUsed, setGenUsed] = useState(0);
  const [genLimit, setGenLimit] = useState(0);
  const [hasUnlimited, setHasUnlimited] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/generation")
        .then((r) => r.json())
        .then((d) => {
          setGenUsed(d.used || 0);
          setGenLimit(d.limit || 0);
          setHasUnlimited(d.hasUnlimited || false);
        })
        .catch(() => {});
    }
  }, [status]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold text-brand-600">
            Profit<span className="text-surface-900">Path</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          <div className="relative group">
            <button className="text-sm font-medium text-gray-600 hover:text-surface-900 transition-colors">
              Tools ▾
            </button>
            <div className="absolute top-full right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl border border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 transition-colors"
                >
                  <span className="text-lg">{tool.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{tool.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {status === "loading" && (
            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
          )}

          {status === "unauthenticated" && (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-lg transition-colors">
                Login
              </Link>
              <Link href="/register" className="text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 px-4 py-1.5 rounded-lg transition-colors">
                Sign Up
              </Link>
            </div>
          )}

          {status === "authenticated" && session?.user && (
            <div className="relative flex items-center gap-2">
              {/* Generation counter */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-xs">
                <svg className="w-3.5 h-3.5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {hasUnlimited ? (
                  <span className="font-semibold text-green-600">Unlimited</span>
                ) : (
                  <span className="font-semibold text-gray-700">{genUsed}<span className="text-gray-400">/{genLimit}</span></span>
                )}
              </div>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-8 h-8 rounded-full bg-brand-500 text-white text-sm font-bold flex items-center justify-center cursor-pointer hover:bg-brand-600 transition-colors"
              >
                {userInitial}
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 w-52 sm:w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-50 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800 truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                    </div>
                    <Link
                      href="/saved"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Saved Generations
                    </Link>
                    <Link
                      href="/referral"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Refer &amp; Earn
                    </Link>
                    <Link
                      href="/pro"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-yellow-600 hover:bg-yellow-50 transition-colors"
                    >
                      <span className="text-sm">👑</span>
                      Upgrade to Pro
                    </Link>
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-surface-50 transition-colors"
            >
              <span className="text-lg">{tool.icon}</span>
              <span className="text-sm font-medium text-gray-700">{tool.title}</span>
            </Link>
          ))}

          <div className="border-t border-gray-100 mt-3 pt-3">
            {status === "unauthenticated" && (
              <div className="flex gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-medium text-gray-600 border border-gray-200 px-3 py-2 rounded-lg">
                  Login
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-medium text-white bg-brand-500 px-3 py-2 rounded-lg">
                  Sign Up
                </Link>
              </div>
            )}
            {status === "authenticated" && session?.user && (
              <div className="space-y-1">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-800">{session.user.name}</p>
                  <p className="text-xs text-gray-400">{session.user.email}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <svg className="w-3.5 h-3.5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {hasUnlimited ? (
                      <span className="text-xs font-semibold text-green-600">Unlimited</span>
                    ) : (
                      <span className="text-xs font-semibold text-gray-600">{genUsed}/{genLimit} generations</span>
                    )}
                  </div>
                </div>
                <Link href="/saved" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                  Saved Generations
                </Link>
                <Link href="/referral" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                  Refer &amp; Earn
                </Link>
                <Link href="/pro" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-yellow-600 hover:bg-yellow-50 rounded-lg">
                  👑 Upgrade to Pro
                </Link>
                <button onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
