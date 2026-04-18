/**
 * 環境変数
 * NEXT_PUBLIC_* はクライアント・サーバー両方で使用可。
 * それ以外はサーバーサイド専用（クライアントでは undefined になる）。
 */
export const ENV = {
  // --- 認証 ---
  sessionSecret: process.env.SESSION_SECRET!,
  isProduction:  process.env.NODE_ENV === "production",

  // --- Web Push ---
  vapidPublicKey:  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY!,
  vapidSubject:    process.env.VAPID_SUBJECT!,

  // --- AWS ---
  awsRegion:  process.env.AWS_REGION!,
  awsRoleArn: process.env.AWS_ROLE_ARN ?? "",
  isVercel:   !!process.env.VERCEL,

  // --- DynamoDB テーブル名 ---
  tableUser:          process.env.TABLE_MASTER_USER!,
  tableTask:          process.env.TABLE_MASTER_TASK!,
  tableSubmissions:   process.env.TABLE_SUBMISSIONS!,
  tableReward:        process.env.TABLE_MASTER_REWARD!,
  tablePushSubs:      process.env.TABLE_PUSH_SUBSCRIPTIONS!,
};

/** ユーザー権限 */
export const AUTHORITY = {
  admin: "admin",
  user:  "user",
} as const;

/** 申請ステータス */
export const SUBMISSION_STATUS = {
  approved: "承認",
  pending:  "未承認",
  rejected: "却下",
} as const;

/** sessionStorage キー生成 */
export const sessionStorageKey = (userId: string) => `pin_${userId}`;
