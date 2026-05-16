import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Skeleton from "@atom/Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Atoms/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: { containerClass: false },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: { width: "200px", height: "20px" },
};

export const Circle: Story = {
  args: { width: "48px", height: "48px", borderRadius: "50%" },
};

export const TextLine: Story = {
  args: { width: "300px", height: "1em" },
};

export const MultipleLines: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Skeleton width="80%" height="1em" />
      <Skeleton width="60%" height="1em" />
      <Skeleton width="70%" height="1em" />
    </div>
  ),
};
