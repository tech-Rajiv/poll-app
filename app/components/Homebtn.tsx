"use client";

import { useRouter } from "next/navigation";

export function Homebtn() {
  const router = useRouter();

  return (
    <button className="btn btn-primary" onClick={() => router.push("/")}>
      Home
    </button>
  );
}
