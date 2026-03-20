export type Submission = {
  id: string;
  whatYouDid: string;
  whoDid: string; // ユーザーの表示名
  point: string;
  status: string; // "未承認" | "承認" | "却下"
  isUsed: string; // "未使用" | "使用済み"
  createdAt: string;
};
