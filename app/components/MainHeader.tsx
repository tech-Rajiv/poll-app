"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { useModal } from "./AuthModalContext";
import { useAuth } from "./AuthProvider";
import { ConfirmDialog } from "./ConfirmDialog";
import { supabase } from "../lib/supabase/browserClient";
import toast from "react-hot-toast";
import sunMode from "../../public/icons/day-mode.png";
import moonMode from "../../public/icons/night-mode.png";
import profileIcon from "../../public/icons/profile-picture.png";
import { LogOutIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function MainHeader() {
  const { openModal } = useModal();
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [themeReady, setThemeReady] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const themeButtonIcon = useMemo(() => {
    return isDark ? (
      <img src={sunMode.src} alt="sun" className="w-6 h-6" />
    ) : (
      <img src={moonMode.src} alt="moon" className="w-6 h-6" />
    );
  }, [isDark]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await toast.promise(
        (async () => {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
        })(),
        {
          loading: "Logging out…",
          success: <b>Logged out</b>,
          error: <b>Could not log out.</b>,
        },
      );
      setProfileOpen(false);
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    if (!profileOpen) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const el = profileRef.current;
      if (!el) return;
      if (e.target instanceof Node && el.contains(e.target)) return;
      setProfileOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [profileOpen]);

  useEffect(() => {
    // Initialize theme once on the client.
    const saved = window.localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = saved ? saved === "dark" : prefersDark;

    document.body.classList.toggle("dark", dark);
    setTimeout(() => {
      setIsDark(dark);
      setThemeReady(true);
    }, 0);
  }, []);

  const toggleTheme = () => {
    const next = !document.body.classList.contains("dark");
    document.body.classList.toggle("dark", next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  };

  const avatarUrl =
    (user?.user_metadata?.avatar_url as string | undefined) ?? profileIcon.src;
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    (user?.user_metadata?.preferred_username as string | undefined) ||
    user?.email ||
    "Account";
  const provider =
    (user?.app_metadata?.provider as string | undefined) ??
    (Array.isArray(user?.app_metadata?.providers)
      ? (user?.app_metadata?.providers?.[0] as string | undefined)
      : undefined);

  const tabs = [
    { href: "/", label: "Home" },
    { href: "/create-poll", label: "Create Poll" },
    { href: "/participated-polls", label: "Participated Polls" },
    { href: "/anonymous-polls", label: "Anonymous Polls" },
  ] as const;

  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur border-b border-[var(--border)]"
      style={{
        backgroundColor: themeReady
          ? isDark
            ? "var(--background)"
            : "rgba(255,255,255,0.8)"
          : "rgba(255,255,255,0.8)",
      }}
    >
      <div className="mx-auto w-full ">
        {/* Mobile: 2-line header */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div
              className="text-xl font-semibold cursor-pointer shrink-0 flex gap-2"
              onClick={() => router.push("/")}
            >
              <img src="/logo.jpg" alt="PiratePolls" className="w-12 h-8" />
              PiratePolls
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="btn btn-secondary cursor-pointer border border-[var(--border)]"
                aria-label="Toggle theme"
                onClick={toggleTheme}
              >
                <span className="flex items-center gap-2">
                  {themeButtonIcon}
                </span>
              </button>

              {isLoggedIn ? (
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    className="btn btn-secondary cursor-pointer"
                    aria-label="Open profile menu"
                    aria-haspopup="menu"
                    aria-expanded={profileOpen}
                    onClick={() => setProfileOpen((v) => !v)}
                  >
                    <img
                      src={avatarUrl}
                      alt="profile"
                      className="w-6 h-6 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>

                  {profileOpen && (
                    <div
                      role="menu"
                      aria-label="Profile menu"
                      className="absolute right-0 mt-3 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-xl overflow-hidden"
                    >
                      <div className="p-4 flex items-center gap-3">
                        <img
                          src={avatarUrl}
                          alt="profile"
                          className="w-11 h-11 rounded-full object-cover border border-[var(--border)]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold truncate">
                            {displayName}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {user?.email ?? "Signed in"}
                            {provider ? ` · ${provider}` : ""}
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-[var(--border)]" />

                      <div className="p-2">
                        <button
                          type="button"
                          role="menuitem"
                          className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-black/5 dark:hover:bg-white/5 transition"
                          onClick={() => {
                            router.push("/profile");
                            setProfileOpen(false);
                          }}
                        >
                          <span className="font-medium cursor-pointer hover:underline underline-offset-4">
                            Profile
                          </span>
                        </button>

                        <button
                          type="button"
                          role="menuitem"
                          className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-black/5 dark:hover:bg-white/5 transition"
                          onClick={() => {
                            setProfileOpen(false);
                          }}
                        >
                          <span className="font-medium disabled:cursor-not-allowed">
                            Settings
                          </span>
                          <span className="text-xs text-gray-500">Soon</span>
                        </button>
                      </div>

                      <div className="h-px bg-[var(--border)]" />

                      <div className="p-2">
                        <button
                          type="button"
                          role="menuitem"
                          className="w-full rounded-xl px-3 py-2 text-left hover:bg-black/5 dark:hover:bg-white/5 transition"
                          onClick={() => {
                            setProfileOpen(false);
                            setLogoutConfirmOpen(true);
                          }}
                          disabled={loggingOut}
                        >
                          <span className="font-medium cursor-pointer flex items-center gap-2">
                            <LogOutIcon className="w-6 h-6" />
                            {loggingOut ? "Logging out..." : "Log out"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    className="btn btn-outline"
                    type="button"
                    onClick={() => openModal("login")}
                  >
                    Login
                  </button>
                  <button
                    className="btn btn-outline"
                    type="button"
                    onClick={() => openModal("signup")}
                  >
                    Signup
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-[var(--border)] px-2 py-3">
            <nav aria-label="Primary" className="w-full">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {tabs.map((t) => {
                  const isActive =
                    (t.href === "/" ? pathname === "/" : pathname === t.href) ||
                    (t.href !== "/" && pathname?.startsWith(t.href + "/"));
                  return (
                    <Link
                      key={t.href}
                      href={t.href}
                      className={[
                        "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition border",
                        isActive
                          ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                          : "bg-[var(--background)] text-[var(--foreground)] border-[var(--border)] hover:bg-black/5 dark:hover:bg-white/5",
                      ].join(" ")}
                    >
                      {t.label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>

        {/* Desktop: keep single-line layout */}
        <div className="hidden sm:flex items-center justify-between gap-3 px-4 py-4">
          <div
            className="text-xl font-semibold cursor-pointer shrink-0 flex gap-2"
            onClick={() => router.push("/")}
          >
            <img src="/logo.jpg" alt="PiratePolls" className="w-12 h-8" />
            PiratePolls
          </div>

          <nav className="flex items-center justify-center flex-1">
            <div className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--background)]/70 p-1 shadow-sm">
              {tabs.map((t) => {
                const isActive =
                  (t.href === "/" ? pathname === "/" : pathname === t.href) ||
                  (t.href !== "/" && pathname?.startsWith(t.href + "/"));
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className={[
                      "px-4 py-2 rounded-full text-sm font-medium transition",
                      isActive
                        ? "bg-[var(--primary)] text-white shadow"
                        : "text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5",
                    ].join(" ")}
                  >
                    {t.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn btn-secondary cursor-pointer border border-[var(--border)]"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              <span className="flex items-center gap-2">{themeButtonIcon}</span>
            </button>

            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  className="btn btn-secondary cursor-pointer"
                  aria-label="Open profile menu"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen((v) => !v)}
                >
                  <img
                    src={avatarUrl}
                    alt="profile"
                    className="w-6 h-6 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              </div>
            ) : (
              <>
                <button
                  className="btn btn-outline"
                  type="button"
                  onClick={() => openModal("login")}
                >
                  Login
                </button>
                <button
                  className="btn btn-outline"
                  type="button"
                  onClick={() => openModal("signup")}
                >
                  Signup
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={logoutConfirmOpen}
        title="Log out?"
        description="You’ll need to log in again to continue."
        cancelText="Cancel"
        confirmText={loggingOut ? "Logging out..." : "Log out"}
        confirmDisabled={loggingOut}
        onCancel={() => setLogoutConfirmOpen(false)}
        onConfirm={async () => {
          await handleLogout();
          setLogoutConfirmOpen(false);
        }}
      />
    </header>
  );
}
