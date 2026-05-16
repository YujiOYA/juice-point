import { useEffect } from "react";

export function useBadge(count: number) {
    useEffect(() => {
        if (!("setAppBadge" in navigator)) return;
        if (count > 0) {
            navigator.setAppBadge(count);
        } else {
            navigator.clearAppBadge();
        }
        return () => {
            navigator.clearAppBadge?.();
        };
    }, [count]);
}
