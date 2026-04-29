import { createSupabaseServerClient } from "@/app/lib/supabase/serverClient";

export async function getServerIsLoggedIn(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.getUser();
  if (error) return false;
  return !!data.user;
}

