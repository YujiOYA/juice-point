import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import UserPointsSummary from "@molecule/UserPointsSummary";
import { mockUsers, mockSubmissions } from "../mockData";

const nonAdminUsers = mockUsers.filter((u) => u.authority !== "admin");

const meta: Meta<typeof UserPointsSummary> = {
  title: "Molecules/UserPointsSummary",
  component: UserPointsSummary,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof UserPointsSummary>;

export const Default: Story = {
  args: {
    users: nonAdminUsers,
    submissions: mockSubmissions,
  },
};

export const Empty: Story = {
  args: {
    users: [],
    submissions: [],
  },
};

export const SingleUser: Story = {
  args: {
    users: [mockUsers[0]],
    submissions: mockSubmissions.filter((s) => s.whoDid === "user-1"),
  },
};
