import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Card from "@atom/Card";

const meta: Meta<typeof Card> = {
  title: "Atoms/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { containerClass: false },
  argTypes: {
    variant: { control: "select", options: ["default", "add"] },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    variant: "default",
    children: "カードのコンテンツがここに入ります",
  },
};

export const AddVariant: Story = {
  args: {
    variant: "add",
    children: "+ 新しいタスクを追加",
  },
};
