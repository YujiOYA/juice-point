import UserManagerClient from "@app/admin/UserManagerClient";

import { mockUsers, mockRegularUser } from "../mockData";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof UserManagerClient> = {
    title: "Admin/UserManagerClient",
    component: UserManagerClient,
    tags: ["autodocs"],
    parameters: {
        containerClass: "container container--wide",
        docs: {
            description: {
                component: `
ユーザーの追加・編集・削除を行う管理画面コンポーネント。

**データ取得方法**
- \`admin/page.tsx\`（Server Component）が DynamoDB からデータを取得し、propsとして渡す
- ユーザー一覧（\`initialUsers\`）は内部で **TanStack Query**（\`useUsers\`）の \`initialData\` として使用される
- ミューテーション（追加・更新・削除）成功後、\`invalidateQueries\` により自動再フェッチされる
        `.trim(),
            },
        },
    },
    argTypes: {
        initialUsers: {
            description:
                "**サーバー取得 → TanStack Query**｜`admin/page.tsx` が DynamoDB から取得し、`useUsers(initialUsers)` の `initialData` として渡す。ミューテーション後に自動再フェッチ。",
        },
    },
};

export default meta;
type Story = StoryObj<typeof UserManagerClient>;

export const Default: Story = {
    args: { initialUsers: mockUsers },
};

export const SingleUser: Story = {
    args: { initialUsers: [mockRegularUser] },
};

export const Empty: Story = {
    args: { initialUsers: [] },
};
