"use client";

import { useEffect } from "react";
import { Toaster, toast, useSonner } from "sonner";

function Backdrop() {
  const { toasts } = useSonner();
  const isActive = toasts.some((t) => !t.delete);

  const dismissAll = () => {
    toasts.forEach((t) => toast.dismiss(t.id));
  };

  useEffect(() => {
    if (!isActive) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        dismissAll();
      }
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
