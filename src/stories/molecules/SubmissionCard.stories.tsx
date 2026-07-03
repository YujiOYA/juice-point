import { fn } from "storybook/test";

import SubmissionCard from "@molecule/SubmissionCard";

import { mockSubmissions } from "../mockData";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof SubmissionCard> = {
    title: "Molecules/SubmissionCard",
    component: SubmissionCard,
    tags: ["autodocs"],
    args: {
        whoseName: "たろう",
        isDoing: false,
        onApprove: fn(),
        onDisapprove: fn(),
        onRestore: fn(),
        onDelete: fn(),
    },
};

export default meta;
type Story = StoryObj<typeof SubmissionCard>;

export const Pending: Story = {
    args: {
        submission: mockSubmissions[0],
        onRestore: undefined,
        onDelete: undefined,
    },
};

export const Rejected: Story = {
    args: {
        submission: mockSubmissions[3],
        onApprove: undefined,
        onDisapprove: undefined,
    },
};

export const OneTimeTask: Story = {
    args: {
        submission: mockSubmissions[4],
        whoseName: "はなこ",
        editablePoint: "10",
        onPointChange: fn(),
        onRestore: undefined,
        onDelete: undefined,
    },
};

export const Loading: Story = {
    args: {
        submission: mockSubmissions[0],
        isDoing: true,
        onRestore: undefined,
        onDelete: undefined,
    },
};
