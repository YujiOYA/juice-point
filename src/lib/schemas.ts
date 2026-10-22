import { z } from "zod";

// ===== 共通 =====

const id = z.string().min(1);
const nonEmpty = z.string().min(1);
const positivePoint = z.string().refine((v) => Number.isInteger(Number(v)) && Number(v) > 0, {
    message: "1以上の整数を入力してください",
});
// bcrypt は 72 バイトを超える入力を切り捨てるため上限を設ける
const pin = z.string().min(1).max(64);
const authority = z.enum(["admin", "user"]);

// ===== auth =====

export const authLoginSchema = z.object({
    id,
    pin,
});

// ===== setup =====

export const setupSchema = z.object({
    user: nonEmpty,
    pin,
});

// ===== tasks =====

export const taskPostSchema = z.discriminatedUnion("type", [
    z.object({ type: z.literal("create"), task: nonEmpty, point: positivePoint, whose: nonEmpty }),
    z.object({ type: z.literal("update"), id, task: nonEmpty, point: positivePoint, whose: nonEmpty }),
    z.object({ type: z.literal("delete"), id }),
]);

// ===== rewards =====

export const rewardPostSchema = z.discriminatedUnion("type", [
    z.object({ type: z.literal("create"), name: nonEmpty, point: positivePoint, whose: nonEmpty }),
    z.object({ type: z.literal("update"), id, name: nonEmpty, point: positivePoint, whose: nonEmpty }),
    z.object({ type: z.literal("delete"), id }),
]);

// ===== users =====

export const userPostSchema = z.discriminatedUnion("type", [
    z.object({ type: z.literal("create"), user: nonEmpty, pin, authority }),
    z.object({ type: z.literal("update"), id, user: nonEmpty, pin: pin.optional().or(z.literal("")), authority }),
    z.object({ type: z.literal("delete"), id }),
]);

// ===== submissions =====

const submissionRegisterBase = z.object({
    whatYouDid: nonEmpty,
    point: positivePoint,
});

export const submissionPostSchema = z.discriminatedUnion("type", [
    submissionRegisterBase.extend({ type: z.literal("register") }),
    submissionRegisterBase.extend({ type: z.literal("registerOneTimeTask") }),
    submissionRegisterBase.extend({ type: z.literal("requestTask") }),
    z.object({ type: z.literal("approveOneTimeTask"), id, newPoint: positivePoint }),
    z.object({ type: z.literal("approveTaskRequest"), id, taskName: nonEmpty, point: positivePoint, whoDid: nonEmpty }),
    z.object({ type: z.literal("approve"), id }),
    z.object({ type: z.literal("disapprove"), id }),
    z.object({ type: z.literal("restore"), id }),
    z.object({ type: z.literal("delete"), id }),
    z.object({ type: z.literal("updatePoint"), id, newPoint: positivePoint }),
    z.object({ type: z.literal("usePoints"), userId: nonEmpty, point: z.number().int().positive() }),
    // 通知の文面はサーバー側で申請データから組み立てる
    z.object({ type: z.literal("remind"), id }),
]);

// ===== push-subscription =====

// web-push はサーバーから endpoint へ POST するため、既知のプッシュサービス以外は受け付けない（SSRF 対策）
const PUSH_SERVICE_HOST_SUFFIXES = [
    "fcm.googleapis.com",
    "push.services.mozilla.com",
    "push.apple.com",
    "notify.windows.com",
];

const pushEndpoint = z.url({ protocol: /^https$/ }).refine(
    (v) => {
        const host = new URL(v).hostname;
        return PUSH_SERVICE_HOST_SUFFIXES.some((suffix) => host === suffix || host.endsWith(`.${suffix}`));
    },
    { message: "Unsupported push service" },
);

export const pushSubscriptionPostSchema = z
    .object({
        endpoint: pushEndpoint,
        subscription: z.object({
            endpoint: pushEndpoint,
            expirationTime: z.number().nullable().optional(),
            keys: z.object({ p256dh: nonEmpty, auth: nonEmpty }),
        }),
    })
    .refine((v) => v.endpoint === v.subscription.endpoint, { message: "endpoint mismatch" });

export const pushSubscriptionDeleteSchema = z.object({
    endpoint: nonEmpty,
});
