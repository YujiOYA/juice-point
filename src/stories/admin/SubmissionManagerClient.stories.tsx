import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SubmissionManagerClient from "@app/admin/SubmissionManagerClient";
import { mockUsers, mockSubmissions } from "../mockData";
import { SubmissionType } from "@type/submission";

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
      description: "**サーバー取得 → TanStack Query**｜`admin/page.tsx` が DynamoDB から取得し、`useSubmissions(initialSubmissions)` の `initialData` として渡す。ミューテーション後に自動再フェッチ。",
    },
    users: {
      description: "**サーバー取得**｜`admin/page.tsx` が DynamoDB から取得。申請者名の解決に使用。TanStack Query は使用しない。",
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
