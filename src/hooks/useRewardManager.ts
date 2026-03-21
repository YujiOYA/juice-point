import { useState, useMemo } from "react";
import { toast } from "sonner";

import { Reward } from "@type/reward";

const emptyForm = { name: "", point: "", whose: "" };

type SortKey = "name" | "point";
type SortDir = "asc" | "desc";

export function useRewardManager(initialRewards: Reward[]) {
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [sortKey2, setSortKey2] = useState<SortKey | null>(null);
  const [sortDir2, setSortDir2] = useState<SortDir>("asc");
  const [filterWhose, setFilterWhose] = useState<string>("");

  const sortedRewards = useMemo(() => {
    const val = (r: Reward, key: SortKey) => key === "point" ? Number(r[key]) : r[key];
    return [...rewards]
      .filter((r) => !filterWhose || r.whose === filterWhose)
      .sort((a, b) => {
        const av = val(a, sortKey), bv = val(b, sortKey);
        if (av !== bv) return (av < bv ? -1 : 1) * (sortDir === "asc" ? 1 : -1);
        if (!sortKey2) return 0;
        const av2 = val(a, sortKey2), bv2 = val(b, sortKey2);
        if (av2 !== bv2) return (av2 < bv2 ? -1 : 1) * (sortDir2 === "asc" ? 1 : -1);
        return 0;
      });
  }, [rewards, sortKey, sortDir, sortKey2, sortDir2, filterWhose]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleSort2 = (key: SortKey | null) => {
    if (key === null) { setSortKey2(null); return; }
    if (sortKey2 === key) {
      setSortDir2((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey2(key);
      setSortDir2("asc");
    }
  };

  const refreshRewards = async () => {
    const res = await fetch("/api/rewards");
    setRewards(await res.json());
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.point || !form.whose) return;
    setIsLoading(true);
    try {
      await fetch("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "create", ...form }),
      });
      setForm(emptyForm);
      await refreshRewards();
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (reward: Reward) => {
    setEditingId(reward.id);
    setEditForm({ name: reward.name, point: reward.point, whose: reward.whose });
  };

  const handleUpdate = async (id: string) => {
    setIsLoading(true);
    try {
      await fetch("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "update", id, ...editForm }),
      });
      setEditingId(null);
      await refreshRewards();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    toast("この報酬を削除しますか？", {
      action: { label: "削除", onClick: () => performDelete(id) },
      cancel: { label: "キャンセル", onClick: () => {} },
    });
  };

  const performDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await fetch("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "delete", id }),
      });
      await refreshRewards();
      toast.success("報酬を削除しました");
    } catch {
      toast.error("削除に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rewards: sortedRewards,
    sortKey,
    sortDir,
    handleSort,
    sortKey2,
    sortDir2,
    handleSort2,
    filterWhose,
    setFilterWhose,
    form,
    setForm,
    editingId,
    setEditingId,
    editForm,
    setEditForm,
    isLoading,
    handleCreate,
    startEdit,
    handleUpdate,
    handleDelete,
  };
}
