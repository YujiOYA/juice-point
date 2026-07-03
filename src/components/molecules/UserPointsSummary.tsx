"use client";

import { useState, Fragment } from "react";
import { toast } from "sonner";

import Button from "@atom/Button";
import { useSubmissionMutations } from "@hook/queries/useSubmissions";
import { Submission } from "@type/submission";
import { User } from "@type/user";

interface Props {
    users: User[];
    submissions: Submission[];
}

type SortKey = "user" | "point";
type SortDir = "asc" | "desc";

interface SortBtnProps {
    k: SortKey;
    label: string;
    sortKey: SortKey;
    sortDir: SortDir;
    onSort: (key: SortKey) => void;
}

const SortBtn = ({ k, label, sortKey, sortDir, onSort }: SortBtnProps) => (
    <button
        type="button"
        onClick={() => onSort(k)}
        style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: sortKey === k ? 700 : 400,
            color: sortKey === k ? "#e65100" : "#757575",
            display: "flex",
            alignItems: "center",
            gap: "0.2rem",
            fontSize: "inherit",
            padding: 0,
        }}
    >
        {label}
        {sortKey === k && <span>{sortDir === "asc" ? "↑" : "↓"}</span>}
    </button>
);

export default function UserPointsSummary({ users, submissions }: Props) {
    const [sortKey, setSortKey] = useState<SortKey>("user");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [openUserId, setOpenUserId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editPoint, setEditPoint] = useState("");

    const { updatePoint, remove } = useSubmissionMutations();

    const handleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    const startEdit = (s: Submission) => {
        setEditingId(s.id);
        setEditPoint(s.point);
    };

    const handleSave = async (id: string) => {
        try {
            await updatePoint.mutateAsync({ id, newPoint: editPoint });
            setEditingId(null);
            toast.success("ポイントを更新しました");
        } catch {
            toast.error("更新に失敗しました");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await remove.mutateAsync(id);
            toast.success("削除しました");
        } catch {
            toast.error("削除に失敗しました");
        }
    };

    const rows = users
        .map((u) => {
            const approved = submissions
                .filter((s) => s.whoDid === u.id && s.status === "承認")
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
            return {
                user: u,
                point: approved.reduce((sum, s) => sum + (Number(s.point) || 0), 0),
                approved,
            };
        })
        .sort((a, b) => {
            const av = sortKey === "user" ? a.user.user : a.point;
            const bv = sortKey === "user" ? b.user.user : b.point;
            if (av < bv) return sortDir === "asc" ? -1 : 1;
            if (av > bv) return sortDir === "asc" ? 1 : -1;
            return 0;
        });

    const toggle = (id: string) => {
        setEditingId(null);
        setOpenUserId((prev) => (prev === id ? null : id));
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
    };

    const BreakdownItem = ({ s }: { s: Submission }) => {
        const isEditing = editingId === s.id;
        return (
            <li
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.85rem",
                    color: "#555",
                    padding: "0.3rem 0 0.3rem 0.75rem",
                    borderLeft: "2px solid #ffe0b2",
                }}
            >
                {isEditing ? (
                    <>
                        <span
                            style={{
                                flex: 1,
                                minWidth: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {s.whatYouDid}
                        </span>
                        <input
                            type="number"
                            value={editPoint}
                            onChange={(e) => setEditPoint(e.target.value)}
                            step={0.5}
                            style={{
                                width: "4.5rem",
                                padding: "0.1rem 0.3rem",
                                border: "1px solid #d1d5db",
                                borderRadius: "4px",
                                fontSize: "0.85rem",
                            }}
                        />
                        <Button
                            variant="approve"
                            disabled={updatePoint.isPending}
                            onClick={() => handleSave(s.id)}
                            style={{ padding: "0.1rem 0.4rem", fontSize: "0.7rem", flex: "none", width: "auto" }}
                        >
                            保存
                        </Button>
                        <Button
                            variant="logout"
                            onClick={() => setEditingId(null)}
                            style={{ padding: "0.1rem 0.4rem", fontSize: "0.7rem", flex: "none" }}
                        >
                            キャンセル
                        </Button>
                    </>
                ) : (
                    <>
                        <span
                            style={{
                                flex: 1,
                                minWidth: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {s.whatYouDid}
                        </span>
                        <span style={{ color: "#9e9e9e", fontSize: "0.8rem", whiteSpace: "nowrap", flexShrink: 0 }}>
                            {formatDate(s.createdAt)}
                        </span>
                        <span style={{ color: "#f59e0b", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                            {s.point}pt
                        </span>
                        <Button
                            variant="primary"
                            disabled={remove.isPending}
                            onClick={() => startEdit(s)}
                            style={{ padding: "0.1rem 0.4rem", fontSize: "0.7rem", flex: "none", width: "auto" }}
                        >
                            編集
                        </Button>
                        <Button
                            variant="disapprove"
                            disabled={remove.isPending}
                            onClick={() => handleDelete(s.id)}
                            style={{ padding: "0.1rem 0.4rem", fontSize: "0.7rem", flex: "none" }}
                        >
                            削除
                        </Button>
                    </>
                )}
            </li>
        );
    };

    const BreakdownList = ({ approved }: { approved: Submission[] }) => (
        <ul
            style={{
                listStyle: "none",
                padding: "0.5rem 0 0",
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
            }}
        >
            {approved.map((s) => (
                <BreakdownItem key={s.id} s={s} />
            ))}
        </ul>
    );

    return (
        <div>
            {/* ソートバー */}
            <div className="task-sort-bar">
                <span className="task-sort-label">並び替え</span>
                <SortBtn k="user" label="担当者" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <SortBtn k="point" label="ポイント" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
            </div>

            {/* スマホ: カード */}
            <div className="submission-list">
                {rows.map(({ user, point, approved }) => (
                    <div key={user.id} className="submission-card">
                        <button
                            type="button"
                            onClick={() => toggle(user.id)}
                            style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 600 }}>
                                <span
                                    style={{
                                        display: "inline-block",
                                        transition: "transform 0.2s",
                                        transform: openUserId === user.id ? "rotate(90deg)" : "rotate(0deg)",
                                        color: "#9e9e9e",
                                    }}
                                >
                                    ▶
                                </span>
                                {user.user}
                            </span>
                            <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: "1.1rem" }}>{point}pt</span>
                        </button>
                        {openUserId === user.id && <BreakdownList approved={approved} />}
                    </div>
                ))}
            </div>

            {/* PC: テーブル */}
            <table className="manager-table">
                <thead>
                    <tr>
                        <th>
                            <SortBtn k="user" label="担当者" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                        </th>
                        <th>
                            <SortBtn k="point" label="未使用ポイント" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                        </th>
                        <th>内訳</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(({ user, point, approved }) => (
                        <Fragment key={user.id}>
                            <tr style={{ cursor: "pointer" }} onClick={() => toggle(user.id)}>
                                <td style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            transition: "transform 0.2s",
                                            transform: openUserId === user.id ? "rotate(90deg)" : "rotate(0deg)",
                                            color: "#9e9e9e",
                                        }}
                                    >
                                        ▶
                                    </span>
                                    {user.user}
                                </td>
                                <td style={{ fontWeight: 700, color: "#f59e0b" }}>{point}pt</td>
                                <td style={{ color: "#9e9e9e", fontSize: "0.8rem" }}>{approved.length}件</td>
                            </tr>
                            {openUserId === user.id && (
                                <tr>
                                    <td colSpan={3} style={{ padding: "0.25rem 1rem 0.75rem" }}>
                                        <BreakdownList approved={approved} />
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
