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
