"use client";

import { ReactNode } from "react";

export interface Column {
    key: string;
    label: string;
    sortable?: boolean;
}

interface Props {
    columns: Column[];
    sortKey?: string;
    sortDir?: "asc" | "desc";
    sortKey2?: string | null;
    sortDir2?: "asc" | "desc";
    onSort?: (key: string) => void;
    onSort2?: (key: string) => void;
    children: ReactNode;
}

export default function AdminTable({
    columns,
    sortKey,
    sortDir,
    sortKey2,
    sortDir2,
    onSort,
    onSort2,
    children,
}: Props) {
    const sortIcon = (key: string) => {
        if (sortKey === key) return ` ¹${sortDir === "asc" ? "↑" : "↓"}`;
        if (sortKey2 === key) return ` ²${sortDir2 === "asc" ? "↑" : "↓"}`;
        return " ↕";
    };

    return (
        <table className="task-table">
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th
                            key={col.key}
                            onClick={
                                col.sortable && onSort
                                    ? (e) => (e.shiftKey ? onSort2?.(col.key) : onSort(col.key))
                                    : undefined
                            }
                            style={col.sortable ? { cursor: "pointer", userSelect: "none" } : undefined}
                            title={col.sortable ? "クリック: 第1優先 / Shift+クリック: 第2優先" : undefined}
                        >
                            {col.label}
                            {col.sortable ? sortIcon(col.key) : ""}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>{children}</tbody>
        </table>
    );
}
