import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TextInput from "@atom/TextInput";

const meta: Meta<typeof TextInput> = {
  title: "Atoms/TextInput",
  component: TextInput,
  tags: ["autodocs"],
  parameters: { containerClass: false },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: { placeholder: "入力してください" },
};

export const WithValue: Story = {
  args: { value: "たろう", placeholder: "名前" },
};

export const Password: Story = {
  args: { type: "password", placeholder: "PINコード" },
};

export const NumberInput: Story = {
  args: { type: "number", value: 10, step: 1, min: 0, placeholder: "ポイント" },
};

export const ReadOnly: Story = {
  args: { value: "編集不可", readOnly: true },
};
