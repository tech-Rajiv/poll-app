"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import toast from "react-hot-toast";

import { useAuthState } from "../lib/auth/useAuthState";

type AuthContextValue = {
  isLoggedIn: boolean;
  user: User | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  initialIsLoggedIn,
  children,
}: {
  initialIsLoggedIn: boolean;
  children: React.ReactNode;
}) {
  const { isLoggedIn, user } = useAuthState(initialIsLoggedIn);

  const wasLoggedInRef = useRef<boolean>(initialIsLoggedIn);
  const welcomeShownRef = useRef(false);

  useEffect(() => {
    const wasLoggedIn = wasLoggedInRef.current;
    wasLoggedInRef.current = isLoggedIn;

    if (!isLoggedIn) return;
    if (welcomeShownRef.current) return;

    // Show welcome after OAuth redirect too (server sets a short-lived cookie).
    const flash =
      typeof document !== "undefined"
        ? document.cookie
            .split("; ")
            .find((c) => c.startsWith("pp_flash_toast="))
            ?.split("=")[1]
        : undefined;

    const shouldWelcome = flash === "welcome" || !wasLoggedIn;
    if (!shouldWelcome) return;

    // Wait until we have user details so the toast shows a real name/email.
    if (!user?.email) return;

    const displayName =
      (user?.user_metadata?.full_name as string | undefined) ||
      (user?.user_metadata?.name as string | undefined) ||
      user?.email;

    welcomeShownRef.current = true;

    if (flash === "welcome") {
      document.cookie = "pp_flash_toast=; Max-Age=0; path=/";
    }

    toast(`Welcome, ${displayName}!`, {
      icon: (
        <img
          src="/icons/toasts/welcome.png"
          alt="welcome"
          className="w-6 h-6"
        />
      ),
      style: {
        border: "1px solid var(--primary)",
        background: "var(--background)",
        color: "var(--foreground)",
      },
    });
  }, [isLoggedIn, user]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
