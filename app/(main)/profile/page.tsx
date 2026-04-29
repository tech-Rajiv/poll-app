import { ProfileForm, type Profile } from "./ProfileForm";
import { createSupabaseServerClient } from "@/app/lib/supabase/serverClient";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) {
    return <div>Error: {authError.message}</div>;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .limit(1)
    .maybeSingle();

  if (profileError) {
    return <div>Error: {profileError.message}</div>;
  }

  let ensuredProfile = profile;

  if (!ensuredProfile) {
    const { data: created, error: createError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: auth.user.id,
          full_name:
            (auth.user.user_metadata?.full_name as string | undefined) ??
            (auth.user.user_metadata?.name as string | undefined) ??
            null,
          avatar_url:
            (auth.user.user_metadata?.avatar_url as string | undefined) ?? null,
          role: null,
        },
        { onConflict: "id" },
      )
      .select("*")
      .limit(1)
      .maybeSingle();

    if (createError) return <div>Error: {createError.message}</div>;
    ensuredProfile = created;
  }

  if (!ensuredProfile) return <div>No profile data found</div>;

  return (
    <div className="">
      <ProfileForm initialProfile={ensuredProfile as Profile} />
    </div>
  );
}
