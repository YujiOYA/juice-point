import webpush from "web-push";
import { ENV } from "@const/constDefinition";

export async function sendPushNotification(
  subscription: webpush.PushSubscription,
  payload: { title: string; body: string },
): Promise<void> {
  webpush.setVapidDetails(
    ENV.vapidSubject,
    ENV.vapidPublicKey!,
    ENV.vapidPrivateKey,
  );
  await webpush.sendNotification(subscription, JSON.stringify(payload));
}
