import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Tabs from "@atom/Tabs";

const meta: Meta<typeof Tabs> = {
    title: "Atoms/Tabs",
    component: Tabs,
    tags: ["autodocs"],
    parameters: { containerClass: false },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
    args: {
        items: [
            { id: "tab1", label: "タスク申請", content: <p>タスク申請のコンテンツ</p> },
            { id: "tab2", label: "ポイント交換", content: <p>ポイント交換のコンテンツ</p> },
            { id: "tab3", label: "履歴", content: <p>履歴のコンテンツ</p> },
        ],
        defaultId: "tab1",
    },
};

export const ManyTabs: Story = {
    args: {
        items: Array.from({ length: 8 }, (_, i) => ({
            id: `tab${i + 1}`,
            label: `タブ${i + 1}`,
            content: <p>タブ {i + 1} のコンテンツ</p>,
        })),
    },
};
