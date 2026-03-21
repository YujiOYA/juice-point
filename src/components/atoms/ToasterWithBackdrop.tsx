"use client";

import { Toaster, useSonner } from "sonner";

function Backdrop() {
  const { toasts } = useSonner();
  const isActive = toasts.some((t) => !t.delete);

  return (
    <div
      className={`toast-backdrop${isActive ? " toast-backdrop--visible" : ""}`}
      aria-hidden="true"
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
