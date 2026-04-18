"use client";

import { usePushNotification } from "@hook/usePushNotification";

export default function PushNotificationToggle() {
  const { status, errorMsg, subscribe, unsubscribe } = usePushNotification();

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
