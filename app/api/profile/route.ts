import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabase/serverClient";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const supabase = await createSupabaseServerClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        avatar_url?: string | null;
        full_name?: string | null;
        role?: string | null;
        email?: string | null;
      }
    | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { avatar_url, full_name, role, email } = body;

  const profileUpdate: Record<string, unknown> = {};
  if (avatar_url !== undefined) profileUpdate.avatar_url = avatar_url;
  if (full_name !== undefined) profileUpdate.full_name = full_name;
  if (role !== undefined) profileUpdate.role = role;

  if (Object.keys(profileUpdate).length > 0) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update(profileUpdate)
      .eq("id", auth.user.id);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }
  }

  if (email !== undefined) {
    if (email === null) {
      return NextResponse.json({ error: "email cannot be null" }, { status: 400 });
    }

    const { error: emailError } = await supabase.auth.updateUser({ email });
    if (emailError) {
      return NextResponse.json({ error: emailError.message }, { status: 400 });
    }
  }

  return NextResponse.json({ ok: true });
}