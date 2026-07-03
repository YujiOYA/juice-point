import { fn } from "storybook/test";

import AdminTable, { type Column } from "@molecule/AdminTable";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const columns: Column[] = [
    { key: "task", label: "タスク名", sortable: true },
    { key: "point", label: "ポイント", sortable: true },
    { key: "whose", label: "担当者", sortable: false },
    { key: "action", label: "操作", sortable: false },
];

const SampleRows = () => (
    <>
        <tr>
            <td>皿洗い</td>
            <td>3pt</td>
            <td>たろう</td>
            <td>編集 / 削除</td>
        </tr>
        <tr>
            <td>掃除機がけ</td>
            <td>5pt</td>
            <td>たろう</td>
            <td>編集 / 削除</td>
        </tr>
        <tr>
            <td>洗濯物たたむ</td>
            <td>2pt</td>
            <td>はなこ</td>
            <td>編集 / 削除</td>
        </tr>
    </>
);

const meta: Meta<typeof AdminTable> = {
    title: "Molecules/AdminTable",
    component: AdminTable,
    tags: ["autodocs"],
    args: {
        columns,
        children: <SampleRows />,
    },
};

export default meta;
type Story = StoryObj<typeof AdminTable>;

export const Default: Story = {};

export const WithSort: Story = {
    args: {
        sortKey: "point",
        sortDir: "desc",
        onSort: fn(),
        onSort2: fn(),
    },
};
