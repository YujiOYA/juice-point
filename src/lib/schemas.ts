import { z } from "zod";

// ===== 共通 =====

const id = z.string().min(1);
const nonEmpty = z.string().min(1);
const positivePoint = z.string().refine((v) => Number.isInteger(Number(v)) && Number(v) > 0, {
  message: "1以上の整数を入力してください",
});

// ===== auth =====

export const authLoginSchema = z.object({
  id,
  pin: nonEmpty,
});

// ===== setup =====

export const setupSchema = z.object({
  user: nonEmpty,
  pin:  nonEmpty,
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
  z.object({ type: z.literal("create"), user: nonEmpty, pin: nonEmpty, authority: nonEmpty }),
  z.object({ type: z.literal("update"), id, user: nonEmpty, pin: z.string().optional(), authority: nonEmpty }),
  z.object({ type: z.literal("delete"), id }),
]);

// ===== submissions =====

const submissionRegisterBase = z.object({
  whatYouDid:  nonEmpty,
  point:       nonEmpty,
  whoDidName:  z.string().optional(),
});

export const submissionPostSchema = z.discriminatedUnion("type", [
  submissionRegisterBase.extend({ type: z.literal("register") }),
  submissionRegisterBase.extend({ type: z.literal("registerOneTimeTask") }),
  submissionRegisterBase.extend({ type: z.literal("requestTask") }),
  z.object({ type: z.literal("approveOneTimeTask"),  id, newPoint: nonEmpty }),
  z.object({ type: z.literal("approveTaskRequest"),  id, taskName: nonEmpty, point: nonEmpty, whoDid: nonEmpty }),
  z.object({ type: z.literal("approve"),             id }),
  z.object({ type: z.literal("disapprove"),          id }),
  z.object({ type: z.literal("restore"),             id }),
  z.object({ type: z.literal("delete"),              id }),
  z.object({ type: z.literal("updatePoint"),         id, newPoint: nonEmpty }),
  z.object({ type: z.literal("usePoints"), userId: nonEmpty, point: z.number() }),
  z.object({ type: z.literal("remind"), id, whatYouDid: nonEmpty, point: nonEmpty, whoDidName: z.string().optional(), submissionType: z.string().optional() }),
]);

// ===== push-subscription =====

export const pushSubscriptionPostSchema = z.object({
  endpoint:     nonEmpty,
  subscription: z.record(z.string(), z.unknown()),
});

export const pushSubscriptionDeleteSchema = z.object({
  endpoint: nonEmpty,
});
