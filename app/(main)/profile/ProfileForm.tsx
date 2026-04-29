"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { http } from "@/app/lib/httpClient";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/app/lib/supabase/browserClient";

export type Profile = {
  id: string;
  avatar_url?: string | null;
  full_name?: string | null;
};

export function ProfileForm({ initialProfile }: { initialProfile: Profile }) {
  const [baseProfile, setBaseProfile] = useState<Profile>(initialProfile);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [avatarErrored, setAvatarErrored] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setBaseProfile(initialProfile);
    setProfile(initialProfile);
    setAvatarFile(null);
    setAvatarErrored(false);
  }, [initialProfile]);

  const isDirty = useMemo(() => {
    const baseName = baseProfile.full_name ?? "";
    const currName = profile.full_name ?? "";
    const baseAvatar = baseProfile.avatar_url ?? "";
    const currAvatar = profile.avatar_url ?? "";
    return (
      avatarFile !== null || currName !== baseName || currAvatar !== baseAvatar
    );
  }, [
    avatarFile,
    baseProfile.avatar_url,
    baseProfile.full_name,
    profile.avatar_url,
    profile.full_name,
  ]);

  async function refetch() {
    const res = await http.get<Profile>("/profile");
    setBaseProfile(res.data);
    setProfile(res.data);
  }

  async function save() {
    setSaving(true);
    const getMessage = (e: any) =>
      e?.response?.data?.error ?? e?.message ?? "Failed to save";

    try {
      await toast.promise(
        (async () => {
          // Upload avatar only when saving.
          if (avatarFile) {
            const form = new FormData();
            form.append("file", avatarFile);
            const res = await http.post<{ avatar_url: string }>(
              "/profile/avatar",
              form,
              { headers: { "Content-Type": "multipart/form-data" } },
            );
            setProfile((p) => ({ ...p, avatar_url: res.data.avatar_url }));
            setAvatarFile(null);

            // Refresh client session so header gets latest user_metadata.
            await supabase.auth.refreshSession();
          }

          await http.put("/profile", {
            full_name: profile.full_name ?? null,
          });

          await refetch();
        })(),
        {
          loading: "Saving…",
          success: "Profile updated",
          error: (e) => getMessage(e),
        },
      );
    } finally {
      setSaving(false);
    }
  }

  function onPickAvatar(file: File) {
    setAvatarErrored(false);

    // Revoke old local preview if we had one.
    const prev = profile.avatar_url;
    if (prev?.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(prev);
      } catch {
        // ignore
      }
    }

    const localUrl = URL.createObjectURL(file);
    setProfile((p) => ({ ...p, avatar_url: localUrl }));
    setAvatarFile(file);
  }

  return (
    <div className="mx-auto w-full">
      <div className="">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Edit profile</div>
            <div className="text-sm" style={{ color: "var(--muted)" }}>
              Update your profile details and avatar.
            </div>
          </div>
        </div>

        {isDirty ? (
          <div className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
            You have unsaved changes.
          </div>
        ) : null}

        <div className="mt-6 flex flex-col items-center text-center">
          <button
            type="button"
            className="group relative h-40 w-40 overflow-hidden rounded-2xl p-3"
            style={{
              border: "1px solid var(--border)",
              background: "var(--secondary)",
            }}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Change avatar"
          >
            {profile.avatar_url && !avatarErrored ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="h-full w-full object-cover"
                onError={() => setAvatarErrored(true)}
                onLoad={() => setAvatarErrored(false)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-xs"
                style={{ color: "var(--muted)" }}
              >
                No avatar
              </div>
            )}

            <div
              className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
              style={{ background: "rgba(0,0,0,0.12)" }}
            />
            <div
              className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full shadow-sm"
              style={{
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
              }}
            >
              <Camera className="h-4 w-4" />
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.currentTarget.value = "";
              if (file) onPickAvatar(file);
            }}
          />

          <div className="mt-3 text-base font-semibold">
            {profile.full_name || "Unnamed"}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2 text-left">
            <label className="block text-sm font-medium">Full name</label>
            <input
              className="input"
              value={profile.full_name ?? ""}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
              placeholder="Your name"
            />
          </div>

          {/* <div className="space-y-2 text-left">
            <label className="block text-sm font-medium">Role</label>
            <input
              className="input"
              value={profile.role ?? ""}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              placeholder="e.g. voter"
            />
          </div> */}
        </div>

        <button
          className="btn btn-primary mt-6 w-full disabled:opacity-60"
          onClick={save}
          disabled={!isDirty || saving}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
