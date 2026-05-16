import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "@atom/Button";

const meta: Meta<typeof Button> = {
    title: "Atoms/Button",
    component: Button,
    tags: ["autodocs"],
    parameters: { containerClass: false },
    argTypes: {
        variant: {
            control: "select",
            options: ["primary", "approve", "disapprove", "logout"],
        },
    },
    args: { children: "ボタン" },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: "primary" } };

export const Approve: Story = { args: { variant: "approve", children: "承認" } };

export const Disapprove: Story = { args: { variant: "disapprove", children: "却下" } };

export const Logout: Story = { args: { variant: "logout", children: "ログアウト" } };

export const Disabled: Story = { args: { variant: "primary", disabled: true, children: "送信中…" } };

export const Disabled2: Story = { args: { variant: "disapprove", disabled: true, children: "却下" } };
