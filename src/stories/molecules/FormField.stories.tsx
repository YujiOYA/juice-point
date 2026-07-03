import SelectInput from "@atom/SelectInput";
import TextInput from "@atom/TextInput";
import FormField from "@molecule/FormField";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof FormField> = {
    title: "Molecules/FormField",
    component: FormField,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const WithTextInput: Story = {
    args: { label: "お手伝い内容", htmlFor: "task-input" },
    render: (args) => (
        <FormField {...args}>
            <TextInput id="task-input" placeholder="例: 皿洗い" />
        </FormField>
    ),
};

export const WithSelectInput: Story = {
    args: { label: "担当者", htmlFor: "user-select" },
    render: (args) => (
        <FormField {...args}>
            <SelectInput id="user-select" value="" onChange={() => {}}>
                <option value="">選択してください</option>
                <option value="user-1">たろう</option>
                <option value="user-2">はなこ</option>
            </SelectInput>
        </FormField>
    ),
};
