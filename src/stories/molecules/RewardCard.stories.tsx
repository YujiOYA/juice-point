import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import RewardCard from "@molecule/RewardCard";
import { mockRewards, mockUsers } from "../mockData";

const meta: Meta<typeof RewardCard> = {
    title: "Molecules/RewardCard",
    component: RewardCard,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RewardCard>;

export const View: Story = {
    args: {
        isEditing: false,
        reward: mockRewards[0],
        users: mockUsers,
        isLoading: false,
        onEdit: fn(),
        onDelete: fn(),
    },
};

export const Editing: Story = {
    args: {
        isEditing: true,
        reward: mockRewards[0],
        editForm: { name: "ジュース1本", point: "5", whose: "user-1" },
        users: mockUsers,
        isLoading: false,
        onChangeForm: fn(),
        onSave: fn(),
        onCancel: fn(),
    },
};

export const Loading: Story = {
    args: {
        isEditing: false,
        reward: mockRewards[1],
        users: mockUsers,
        isLoading: true,
        onEdit: fn(),
        onDelete: fn(),
    },
};
