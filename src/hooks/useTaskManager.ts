import { useState } from "react";

import { Task } from "@type/task";

const emptyForm = { task: "", point: "", whose: "" };

export function useTaskManager(initialTasks: Task[]) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);

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
    tasks,
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
