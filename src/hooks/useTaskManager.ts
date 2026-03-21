import { useState, useMemo } from "react";

import { Task } from "@type/task";

const emptyForm = { task: "", point: "", whose: "" };

type SortKey = "task" | "point" | "whose";
type SortDir = "asc" | "desc";

export function useTaskManager(initialTasks: Task[]) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("task");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [sortKey2, setSortKey2] = useState<SortKey | null>(null);
  const [sortDir2, setSortDir2] = useState<SortDir>("asc");

  const sortedTasks = useMemo(() => {
    const val = (t: Task, key: SortKey) => key === "point" ? Number(t[key]) : t[key];
    return [...tasks].sort((a, b) => {
      const av = val(a, sortKey), bv = val(b, sortKey);
      if (av !== bv) return (av < bv ? -1 : 1) * (sortDir === "asc" ? 1 : -1);
      if (!sortKey2) return 0;
      const av2 = val(a, sortKey2), bv2 = val(b, sortKey2);
      if (av2 !== bv2) return (av2 < bv2 ? -1 : 1) * (sortDir2 === "asc" ? 1 : -1);
      return 0;
    });
  }, [tasks, sortKey, sortDir, sortKey2, sortDir2]);

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

  const refreshTasks = async () => {
    const res = await fetch("/api/tasks");
    setTasks(await res.json());
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.task || !form.point || !form.whose) return;
    setIsLoading(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "create", ...form }),
      });
      setForm(emptyForm);
      await refreshTasks();
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditForm({ task: task.task, point: task.point, whose: task.whose });
  };

  const handleUpdate = async (id: string) => {
    setIsLoading(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "update", id, ...editForm }),
      });
      setEditingId(null);
      await refreshTasks();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このタスクを削除しますか？")) return;
    setIsLoading(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "delete", id }),
      });
      await refreshTasks();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tasks: sortedTasks,
    sortKey,
    sortDir,
    handleSort,
    sortKey2,
    sortDir2,
    handleSort2,
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
