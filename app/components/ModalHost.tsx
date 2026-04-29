"use client";

import React, { useEffect } from "react";
import { LoginModal } from "./modals/LoginModal";
import { SignupModal } from "./modals/SignupModal";
import { useModal } from "./AuthModalContext";

export function ModalHost() {
  const { activeModal, closeModal } = useModal();

  useEffect(() => {
    if (!activeModal) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeModal, closeModal]);

  if (!activeModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div
        className="w-full max-w-md bg-[var(--background)] text-[var(--foreground)] outline-1 rounded-2xl shadow-lg p-6 space-y-6 border border-[var(--border)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {activeModal === "login" && <LoginModal />}
        {activeModal === "signup" && <SignupModal />}
      </div>
    </div>
  );
}

