import RewardManagerClient from "@app/admin/RewardManagerClient";

import { mockUsers, mockRewards } from "../mockData";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof RewardManagerClient> = {
    title: "Admin/RewardManagerClient",
    component: RewardManagerClient,
    tags: ["autodocs"],
    args: { users: mockUsers },
    parameters: {
        containerClass: "container container--wide",
        docs: {
            description: {
                component: `
報酬の追加・編集・削除を行う管理画面コンポーネント。

**データ取得方法**
- \`admin/page.tsx\`（Server Component）が DynamoDB からデータを取得し、propsとして渡す
- 報酬一覧（\`initialRewards\`）は内部で **TanStack Query**（\`useRewards\`）の \`initialData\` として使用される
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
        initialRewards: {
            description:
                "**サーバー取得 → TanStack Query**｜`admin/page.tsx` が DynamoDB から取得し、`useRewards(initialRewards)` の `initialData` として渡す。ミューテーション後に自動再フェッチ。",
        },
    },
};

export default meta;
type Story = StoryObj<typeof RewardManagerClient>;

export const Default: Story = {
    args: { initialRewards: mockRewards },
};

export const Empty: Story = {
    args: { initialRewards: [] },
};
