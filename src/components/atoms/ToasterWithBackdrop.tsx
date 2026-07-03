"use client";

import { useEffect } from "react";
import { Toaster, toast, useSonner } from "sonner";

const dismissAll = () => {
    toast.dismiss();
};

function Backdrop() {
    const { toasts } = useSonner();
    const isActive = toasts.some((t) => !t.delete);

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
    }, [isActive]);

    return <div className={`toast-backdrop${isActive ? " toast-backdrop--visible" : ""}`} onClick={dismissAll} />;
}

export default function ToasterWithBackdrop() {
    return (
        <>
            <Backdrop />
            <Toaster position="top-center" richColors />
        </>
    );
}
