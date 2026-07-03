import { fn } from "storybook/test";

import TaskCard from "@molecule/TaskCard";

import { mockTasks, mockUsers } from "../mockData";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof TaskCard> = {
    title: "Molecules/TaskCard",
    component: TaskCard,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

export const View: Story = {
    args: {
        isEditing: false,
        task: mockTasks[0],
        users: mockUsers,
        isLoading: false,
        onEdit: fn(),
        onDelete: fn(),
    },
};

export const Editing: Story = {
    args: {
        isEditing: true,
        task: mockTasks[0],
        editForm: { task: "皿洗い", point: "3", whose: "user-1" },
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
        task: mockTasks[0],
        users: mockUsers,
        isLoading: true,
        onEdit: fn(),
        onDelete: fn(),
    },
};
