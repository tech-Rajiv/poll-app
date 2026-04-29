"use client";

import React, { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText,
  cancelText,
  confirmDisabled,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmText: string;
  cancelText: string;
  confirmDisabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const portalTarget = useMemo(() => {
    if (typeof document === "undefined") return null;
    return document.body;
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open || !portalTarget) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="w-full max-w-sm bg-[var(--background)] text-[var(--foreground)] rounded-2xl shadow-lg p-6 space-y-4 border border-[var(--border)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <div className="text-lg font-semibold">{title}</div>
          {description ? (
            <div className="text-sm text-gray-500">{description}</div>
          ) : null}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-outline flex-1"
            onClick={onCancel}
            disabled={confirmDisabled}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="btn btn-primary flex-1"
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    portalTarget,
  );
}
