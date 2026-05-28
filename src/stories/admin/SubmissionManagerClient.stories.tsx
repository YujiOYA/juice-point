import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SubmissionManagerClient from "@app/admin/SubmissionManagerClient";
import { mockUsers, mockSubmissions } from "../mockData";
import { SubmissionType } from "@type/submission";
import { http, HttpResponse } from "msw";

const meta: Meta<typeof SubmissionManagerClient> = {
    title: "Admin/SubmissionManagerClient",
    component: SubmissionManagerClient,
    tags: ["autodocs"],
    args: { users: mockUsers },
    parameters: {
        containerClass: "container container--wide",
        docs: {
            description: {
                component: `
申請の承認・却下・削除を行う管理画面コンポーネント。

**データ取得方法**
- \`admin/page.tsx\`（Server Component）が DynamoDB からデータを取得し、propsとして渡す
- 申請一覧（\`initialSubmissions\`）は内部で **TanStack Query**（\`useSubmissions\`）の \`initialData\` として使用される
- 承認・却下等のミューテーション成功後、\`invalidateQueries\` により自動再フェッチされる
- \`useBadge\` によりブラウザのバッジ（未承認件数）も連動して更新される
        `.trim(),
            },
        },
    },
    argTypes: {
        initialSubmissions: {
            description:
                "**サーバー取得 → TanStack Query**｜`admin/page.tsx` が DynamoDB から取得し、`useSubmissions(initialSubmissions)` の `initialData` として渡す。ミューテーション後に自動再フェッチ。",
        },
        users: {
            description:
                "**サーバー取得**｜`admin/page.tsx` が DynamoDB から取得。申請者名の解決に使用。TanStack Query は使用しない。",
        },
    },
};

export default meta;
type Story = StoryObj<typeof SubmissionManagerClient>;

export const Default: Story = {
    args: { initialSubmissions: mockSubmissions },
};

export const WithPending: Story = {
    args: {
        initialSubmissions: mockSubmissions.filter((s) => s.status === "未承認" && !s.submissionType),
    },
};

export const WithOneTimeTasks: Story = {
    args: {
        initialSubmissions: mockSubmissions.filter((s) => s.submissionType === SubmissionType.OneTimeTask),
    },
};

export const WithTaskRequests: Story = {
    args: {
        initialSubmissions: mockSubmissions.filter((s) => s.submissionType === SubmissionType.TaskRequest),
    },
};

export const Empty: Story = {
    args: { initialSubmissions: [] },
};

// ── MSW シナリオ ──────────────────────────────────────────
// ボタン操作後のサーバーエラー（500）をシミュレート
export const MutationError: Story = {
    name: "承認操作 → サーバーエラー",
    args: { initialSubmissions: mockSubmissions },
    parameters: {
        msw: {
            handlers: [
                http.post("/api/submissions", () =>
                    HttpResponse.json({ error: "Internal Server Error" }, { status: 500 })
                ),
            ],
        },
    },
};

// ネットワーク切断（fetch 自体が失敗）をシミュレート
export const NetworkError: Story = {
    name: "承認操作 → ネットワークエラー",
    args: { initialSubmissions: mockSubmissions },
    parameters: {
        msw: {
            handlers: [
                http.post("/api/submissions", () => HttpResponse.error()),
            ],
        },
    },
};

// 再フェッチ後のデータが空になるシナリオ（全件処理済みを想定）
export const RefetchEmpty: Story = {
    name: "承認操作 → 再フェッチで空",
    args: { initialSubmissions: mockSubmissions },
    parameters: {
        msw: {
            handlers: [
                http.post("/api/submissions", () => HttpResponse.json({ ok: true })),
                http.get("/api/submissions", () => HttpResponse.json([])),
            ],
        },
    },
};
