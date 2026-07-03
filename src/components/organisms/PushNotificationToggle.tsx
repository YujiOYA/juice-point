"use client";

import { LABELS } from "@const/labels";
import { usePushNotification } from "@hook/usePushNotification";

const L = LABELS.push;

export default function PushNotificationToggle() {
    const { status, errorMsg, subscribe, unsubscribe } = usePushNotification();

    if (status === "unsupported") return null;

    return (
        <div className="push-notification-toggle">
            {status === "denied" && <p className="push-notification-toggle__denied">{L.denied}</p>}
            {status === "subscribed" && (
                <button
                    className="push-notification-toggle__btn push-notification-toggle__btn--on"
                    onClick={unsubscribe}
                >
                    {L.on}
                </button>
            )}
            {status === "unsubscribed" && (
                <button
                    className="push-notification-toggle__btn push-notification-toggle__btn--off"
                    onClick={subscribe}
                >
                    {L.off}
                </button>
            )}
            {status === "loading" && (
                <button className="push-notification-toggle__btn" disabled>
                    {L.loading}
                </button>
            )}
            {errorMsg && <p className="push-notification-toggle__error">{errorMsg}</p>}
        </div>
    );
}
