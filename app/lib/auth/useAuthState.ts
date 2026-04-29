"use client";

import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "../supabase/browserClient";

export function useAuthState(initialIsLoggedIn: boolean) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!mounted) return;
        setUser(data.user ?? null);
        setIsLoggedIn(!!data.user);
      })
      .catch(() => {
        if (!mounted) return;
        setUser(null);
        setIsLoggedIn(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isLoggedIn, user };
}

