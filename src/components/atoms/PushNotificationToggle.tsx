"use client";

import { useEffect, useState } from "react";

type Status = "unsupported" | "denied" | "subscribed" | "unsubscribed" | "loading";

export default function PushNotificationToggle() {
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    }).catch((e) => {
      setErrorMsg("SW準備エラー: " + String(e));
      setStatus("unsubscribed");
    });
  }, []);

  const subscribe = async () => {
    setStatus("loading");
    setErrorMsg(null);
    try {
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        setErrorMsg("VAPIDキーが設定されていません（Vercel環境変数を確認してください）");
        setStatus("unsubscribed");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
      const res = await fetch("/api/push-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint, subscription: sub.toJSON() }),
      });
      if (!res.ok) {
        throw new Error("サーバー登録失敗: " + res.status);
      }
      setStatus("subscribed");
    } catch (e) {
      setErrorMsg("エラー: " + String(e));
      setStatus("unsubscribed");
    }
  };

  const unsubscribe = async () => {
    setStatus("loading");
    setErrorMsg(null);
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
    } catch (e) {
      setErrorMsg("エラー: " + String(e));
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
      {errorMsg && (
        <p className="push-notification-toggle__error">{errorMsg}</p>
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
