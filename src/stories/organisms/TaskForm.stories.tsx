import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TaskForm from "@organism/TaskForm";
import { mockRegularUser, mockTasks, mockSubmissions, mockRewards } from "../mockData";

const meta: Meta<typeof TaskForm> = {
  title: "Organisms/TaskForm",
  component: TaskForm,
  tags: ["autodocs"],
  parameters: {
    containerClass: "container",
    docs: {
      description: {
        component: `
タスク申請・未登録タスク申請・タスク追加リクエスト・ポイント交換・履歴確認を行うコンポーネント。

**データ取得方法**
- \`user\` 以外の3つの \`initial*\` props は \`page.tsx\`（Server Component）が DynamoDB から取得し、propsとして渡す
- 内部の \`useTaskForm\` がすべて **TanStack Query** に流し込む
  - \`initialTasks\` → \`useTasks(initialTasks)\` の \`initialData\`
  - \`initialSubmissions\` → \`useSubmissions(initialSubmissions)\` の \`initialData\`（申請後に自動再フェッチ）
  - \`initialRewards\` → \`useRewards(initialRewards)\` の \`initialData\`
        `.trim(),
      },
    },
  },
  args: {
    user: mockRegularUser,
    initialTasks: mockTasks.filter((t) => t.whose === "user-1"),
    initialSubmissions: mockSubmissions,
    initialRewards: mockRewards.filter((r) => r.whose === "user-1"),
  },
  argTypes: {
    user: {
      description: "**クライアント状態**｜`PageClient` の `useState` が管理するログイン中ユーザー。",
    },
    initialTasks: {
      description: "**サーバー取得 → TanStack Query**｜`page.tsx` が DynamoDB から取得し、`useTasks(initialTasks)` の `initialData` として渡す。",
    },
    initialSubmissions: {
      description: "**サーバー取得 → TanStack Query**｜`page.tsx` が DynamoDB から取得し、`useSubmissions(initialSubmissions)` の `initialData` として渡す。申請操作後に自動再フェッチされる。",
    },
    initialRewards: {
      description: "**サーバー取得 → TanStack Query**｜`page.tsx` が DynamoDB から取得し、`useRewards(initialRewards)` の `initialData` として渡す。",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TaskForm>;

export const Default: Story = {};

export const WithRewards: Story = {
  args: {
    initialRewards: mockRewards,
  },
};

export const NoTasks: Story = {
  args: {
    initialTasks: [],
    initialRewards: [],
  },
};
