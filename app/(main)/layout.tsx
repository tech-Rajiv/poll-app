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
      <div className="w-full min-h-screen">
        <div className="mx-auto w-full ">
          <main className="mx-auto w-full  px-4 py-6">{children}</main>
        </div>
      </div>
      <ModalHost />
    </ModalProvider>
  );
}
