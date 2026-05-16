import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SelectInput from "@atom/SelectInput";

const meta: Meta<typeof SelectInput> = {
    title: "Atoms/SelectInput",
    component: SelectInput,
    tags: ["autodocs"],
    parameters: { containerClass: false },
    render: (args) => (
        <SelectInput {...args}>
            <option value="">選択してください</option>
            <option value="user-1">たろう</option>
            <option value="user-2">はなこ</option>
        </SelectInput>
    ),
};

export default meta;
type Story = StoryObj<typeof SelectInput>;

export const Default: Story = {
    args: { value: "" },
};

export const WithSelectedValue: Story = {
    args: { value: "user-1" },
};
