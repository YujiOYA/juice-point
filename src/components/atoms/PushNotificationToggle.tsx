"use client";

import { useEffect, useState } from "react";

type Status = "unsupported" | "denied" | "subscribed" | "unsubscribed" | "loading";

export default function PushNotificationToggle() {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }
    navigator.serviceWorker.ready.then(async (reg) => {
      const existing = await reg.pushManager.getSubscription();
      setStatus(existing ? "subscribed" : "unsubscribed");
    });
  }, []);

  const subscribe = async () => {
    setStatus("loading");
    try {
      const reg = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      });
      await fetch("/api/push-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint, subscription: sub.toJSON() }),
      });
      setStatus("subscribed");
    } catch {
      setStatus("unsubscribed");
    }
  };

  const unsubscribe = async () => {
    setStatus("loading");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push-subscription", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setStatus("unsubscribed");
    } catch {
      setStatus("subscribed");
    }
  };

  if (status === "unsupported") return null;

  return (
    <div className="push-notification-toggle">
      {status === "denied" && (
        <p className="push-notification-toggle__denied">
          🔕 通知がブロックされています。ブラウザの設定から許可してください。
        </p>
      )}
      {status === "subscribed" && (
        <button
          className="push-notification-toggle__btn push-notification-toggle__btn--on"
          onClick={unsubscribe}
        >
          🔔 申請通知: オン（タップでオフ）
        </button>
      )}
      {status === "unsubscribed" && (
        <button
          className="push-notification-toggle__btn push-notification-toggle__btn--off"
          onClick={subscribe}
        >
          🔕 申請通知: オフ（タップでオン）
        </button>
      )}
      {status === "loading" && (
        <button className="push-notification-toggle__btn" disabled>
          ...
        </button>
      )}
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
