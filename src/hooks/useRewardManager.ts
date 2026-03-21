import { useState } from "react";

import { Reward } from "@type/reward";

const emptyForm = { name: "", point: "" };

export function useRewardManager(initialRewards: Reward[]) {
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);

  const refreshRewards = async () => {
    const res = await fetch("/api/rewards");
    setRewards(await res.json());
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.point) return;
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
    setEditForm({ name: reward.name, point: reward.point });
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

  const handleDelete = async (id: string) => {
    if (!confirm("この報酬を削除しますか？")) return;
    setIsLoading(true);
    try {
      await fetch("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "delete", id }),
      });
      await refreshRewards();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rewards,
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
