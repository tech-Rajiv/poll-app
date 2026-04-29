import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabase/serverClient";

// Expects multipart/form-data: { file: File }
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "png";
  const path = `${auth.user.id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, {
      contentType: file.type || "image/*",
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  const { data: publicUrl } = supabase.storage.from("avatars").getPublicUrl(path);
  const avatar_url = publicUrl.publicUrl;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url })
    .eq("id", auth.user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  // Keep header (user_metadata) in sync too.
  const { error: authUpdateError } = await supabase.auth.updateUser({
    data: { avatar_url },
  });
  if (authUpdateError) {
    return NextResponse.json({ error: authUpdateError.message }, { status: 400 });
  }

  return NextResponse.json({ avatar_url });
}

