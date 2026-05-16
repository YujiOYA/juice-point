import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PointsBadge from "@molecule/PointsBadge";

const meta: Meta<typeof PointsBadge> = {
    title: "Molecules/PointsBadge",
    component: PointsBadge,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PointsBadge>;

export const Default: Story = { args: { points: 100 } };

export const Zero: Story = { args: { points: 0 } };

export const LargeNumber: Story = { args: { points: 9999 } };
