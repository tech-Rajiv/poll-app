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
      {children}
      <ModalHost />
    </ModalProvider>
  );
}
