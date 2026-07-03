import { fn } from "storybook/test";

import LoginForm from "@organism/LoginForm";

import { mockUsers, mockSubmissions, mockRegularUser, mockAdminUser } from "../mockData";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof LoginForm> = {
    title: "Organisms/LoginForm",
    component: LoginForm,
    tags: ["autodocs"],
    parameters: {
        containerClass: "container",
        docs: {
            description: {
                component: `
ユーザー選択・PIN入力によるログイン、およびログアウトを行うコンポーネント。

**データ取得方法**
- \`users\` と \`submissions\` は \`page.tsx\`（Server Component）が DynamoDB から取得し、propsとして渡す。TanStack Query は使用しない。
- \`loggedInUser\` は \`PageClient\` の \`useState\` が管理するクライアント状態。
- ログイン処理（PIN照合・セッション発行）は API への fetch を直接行う。TanStack Query は使用しない。
        `.trim(),
            },
        },
    },
    args: {
        users: mockUsers,
        submissions: mockSubmissions,
        setLoggedInUser: fn(),
    },
    argTypes: {
        users: {
            description:
                "**サーバー取得**｜`page.tsx` が DynamoDB から取得。ログインユーザーの選択肢として表示。TanStack Query は使用しない。",
        },
        submissions: {
            description:
                "**サーバー取得**｜`page.tsx` が DynamoDB から取得。ログイン中ユーザーの未使用ポイント計算に使用。TanStack Query は使用しない。",
        },
        loggedInUser: {
            description:
                "**クライアント状態**｜`PageClient` の `useState` が管理。`null` のときログインフォームを表示。",
        },
        setLoggedInUser: {
            description:
                "**クライアント状態セッター**｜ログイン成功・ログアウト時に `PageClient` の state を更新する。",
        },
        next: {
            description: "ログイン後のリダイレクト先パス。省略時はリダイレクトなし。",
        },
    },
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const LoggedOut: Story = {
    args: { loggedInUser: null },
};

export const LoggedIn: Story = {
    args: { loggedInUser: mockRegularUser },
};

export const LoggedInAdmin: Story = {
    args: { loggedInUser: mockAdminUser },
};
