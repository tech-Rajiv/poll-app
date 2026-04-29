"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "../supabase/browserClient";

export function useIsLoggedIn(initialIsLoggedIn: boolean) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);

  useEffect(() => {
    let mounted = true;

    // Hydrate client state from the existing session (if any).
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!mounted) return;
        setIsLoggedIn(!!data.user);
      })
      .catch(() => {
        if (!mounted) return;
        setIsLoggedIn(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      if (!mounted) return;
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return isLoggedIn;
}

