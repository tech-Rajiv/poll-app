"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ModalId = "login" | "signup";

type ModalContextValue = {
  activeModal: ModalId | null;
  openModal: (modal: ModalId) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalContextValue["activeModal"]>(null);

  const openModal = useCallback((modal: ModalId) => {
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const value = useMemo(
    () => ({
      activeModal,
      openModal,
      closeModal,
    }),
    [activeModal, openModal, closeModal],
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return ctx;
}

