import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ManagerPanel from "@organism/ManagerPanel";
import { mockUsers, mockSubmissions } from "../mockData";
import { SubmissionType } from "@type/submission";

const meta: Meta<typeof ManagerPanel> = {
  title: "Organisms/ManagerPanel",
  component: ManagerPanel,
  tags: ["autodocs"],
  args: { users: mockUsers },
  parameters: {
    containerClass: "container container--wide",
    docs: {
      description: {
        component: `
申請の承認・却下・削除、およびユーザー別ポイント集計を表示するパネル。

**データ取得方法**
- \`submissions\` と \`users\` は親コンポーネントから渡される。クエリを自身では持たない。
  - 管理画面では \`SubmissionManagerClient\` が **TanStack Query**（\`useSubmissions\`）で管理した値を渡す
  - メインページでは \`PageClient\` がサーバー取得の初期値を渡す
- 内部では **TanStack Query**（\`useMutation\`）で承認・却下・削除のミューテーションのみを実行する。ミューテーション成功後、親の \`useSubmissions\` が \`invalidateQueries\` で再フェッチする。
        `.trim(),
      },
    },
  },
  argTypes: {
    submissions: {
      description: "**親から渡される**｜管理画面では `SubmissionManagerClient` の TanStack Query（`useSubmissions`）が管理。メインページではサーバー取得の初期値。自身はクエリを持たない。",
    },
    users: {
      description: "**サーバー取得**｜申請者名の解決・ポイント集計に使用。TanStack Query は使用しない。",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ManagerPanel>;

export const WithPending: Story = {
  args: {
    submissions: mockSubmissions.filter((s) => s.status === "未承認" && !s.submissionType),
  },
};

export const WithRejected: Story = {
  args: {
    submissions: mockSubmissions.filter((s) => s.status === "却下"),
  },
};

export const WithOneTimeTasks: Story = {
  args: {
    submissions: mockSubmissions.filter((s) => s.submissionType === SubmissionType.OneTimeTask),
  },
};

export const WithTaskRequests: Story = {
  args: {
    submissions: mockSubmissions.filter((s) => s.submissionType === SubmissionType.TaskRequest),
  },
};

export const AllSubmissions: Story = {
  args: { submissions: mockSubmissions },
};

export const Empty: Story = {
  args: { submissions: [] },
};
