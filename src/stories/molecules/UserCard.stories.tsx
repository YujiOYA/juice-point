import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import UserCard from "@molecule/UserCard";
import { mockRegularUser, mockAdminUser } from "../mockData";

const meta: Meta<typeof UserCard> = {
    title: "Molecules/UserCard",
    component: UserCard,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof UserCard>;

export const View: Story = {
    args: {
        isEditing: false,
        user: mockRegularUser,
        isLoading: false,
        onEdit: fn(),
        onDelete: fn(),
    },
};

export const ViewAdmin: Story = {
    args: {
        isEditing: false,
        user: mockAdminUser,
        isLoading: false,
        onEdit: fn(),
        onDelete: fn(),
    },
};

export const Editing: Story = {
    args: {
        isEditing: true,
        user: mockRegularUser,
        editForm: { user: "たろう", pin: "", authority: "user" },
        isLoading: false,
        onChangeForm: fn(),
        onSave: fn(),
        onCancel: fn(),
    },
};
