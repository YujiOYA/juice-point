import TaskManagerClient from "@app/admin/TaskManagerClient";

import { mockUsers, mockTasks } from "../mockData";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof TaskManagerClient> = {
    title: "Admin/TaskManagerClient",
    component: TaskManagerClient,
    tags: ["autodocs"],
    args: { users: mockUsers },
    parameters: {
        containerClass: "container container--wide",
        docs: {
            description: {
                component: `
タスクの追加・編集・削除を行う管理画面コンポーネント。

**データ取得方法**
- \`admin/page.tsx\`（Server Component）が DynamoDB からデータを取得し、propsとして渡す
- タスク一覧（\`initialTasks\`）は内部で **TanStack Query**（\`useTasks\`）の \`initialData\` として使用される
- ミューテーション（追加・更新・削除）成功後、\`invalidateQueries\` により自動再フェッチされる
        `.trim(),
            },
        },
    },
    argTypes: {
        users: {
            description:
                "**サーバー取得**｜`admin/page.tsx` が DynamoDB から取得。担当者の選択肢として使用。TanStack Query は使用しない。",
        },
        initialTasks: {
            description:
                "**サーバー取得 → TanStack Query**｜`admin/page.tsx` が DynamoDB から取得し、`useTasks(initialTasks)` の `initialData` として渡す。ミューテーション後に自動再フェッチ。",
        },
    },
};

export default meta;
type Story = StoryObj<typeof TaskManagerClient>;

export const Default: Story = {
    args: { initialTasks: mockTasks },
};

export const Empty: Story = {
    args: { initialTasks: [] },
};
