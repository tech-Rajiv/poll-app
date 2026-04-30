"use client";

import React, { useEffect } from "react";
import { useModal } from "../../components/AuthModalContext";

export default function Page() {
  const { openModal } = useModal();

  useEffect(() => {
    openModal("login");
  }, [openModal]);

  return <div className="flex-1" />;
}
