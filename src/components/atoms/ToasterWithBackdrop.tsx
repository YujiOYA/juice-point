"use client";

import { useEffect, useState } from "react";
import { Toaster, toast, useSonner } from "sonner";

function Backdrop() {
  const { toasts } = useSonner();
  // SSR と初回クライアントレンダリングを一致させるため、
  // isActive は useEffect で更新する（初期値は false）
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(toasts.some((t) => !t.delete));
  }, [toasts]);

  const dismissAll = () => {
    toasts.forEach((t) => toast.dismiss(t.id));
  };

  useEffect(() => {
    if (!isActive) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") dismissAll();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isActive, toasts]);

  return (
    <div
      className={`toast-backdrop${isActive ? " toast-backdrop--visible" : ""}`}
      onClick={dismissAll}
    />
  );
}

export default function ToasterWithBackdrop() {
  return (
    <>
      <Backdrop />
      <Toaster position="top-center" richColors />
    </>
  );
}
