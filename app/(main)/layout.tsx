import React from "react";

import { ModalProvider } from "../components/AuthModalContext";
import { ModalHost } from "../components/ModalHost";
import { MainHeader } from "../components/MainHeader";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModalProvider>
      <MainHeader />
      <div
        className="w-full min-h-screen"
        style={{ background: "var(--secondary)" }}
      >
        <div
          className="mx-auto w-full max-w-7xl min-h-screen"
          style={{
            background: "var(--background)",
            borderLeft:
              "1px solid color-mix(in oklab, var(--border) 65%, transparent)",
            borderRight:
              "1px solid color-mix(in oklab, var(--border) 65%, transparent)",
          }}
        >
          <main className="mx-auto w-full max-w-5xl min-h-screen px-4 py-6">
            {children}
          </main>
        </div>
      </div>
      <ModalHost />
    </ModalProvider>
  );
}
