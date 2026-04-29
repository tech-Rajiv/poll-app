"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

function ToastIcon({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="w-6 h-6" />;
}

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      containerStyle={{ zIndex: 20000 }}
      toastOptions={{
        style: {
          border: "1px solid var(--primary)",
          padding: "14px 16px",
          color: "var(--foreground)",
          background: "var(--background)",
          borderRadius: "14px",
        },
        success: {
          icon: <ToastIcon src="/icons/toasts/success.png" alt="success" />,
          style: {
            border: "1px solid var(--primary)",
          },
        },
        error: {
          icon: <ToastIcon src="/icons/toasts/error.png" alt="error" />,
          style: {
            border: "1px solid var(--error)",
            color: "var(--error)",
          },
        },
        loading: {
          style: {
            border: "1px solid var(--primary)",
          },
        },
        blank: {
          icon: <ToastIcon src="/icons/toasts/info.png" alt="info" />,
          style: {
            border: "1px solid var(--primary)",
            background: "#FFFAEE",
            color: "#713200",
          },
        },
      }}
    />
  );
}
