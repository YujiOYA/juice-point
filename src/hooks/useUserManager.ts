import { useState, useMemo } from "react";
import { toast } from "sonner";

import { useUsers, useUserMutations } from "@hook/queries/useUsers";
import { User } from "@type/user";

const emptyForm = { user: "", pin: "", authority: "user" };
const emptyEditForm = { user: "", pin: "", authority: "user" };

type SortKey = "user" | "authority";
type SortDir = "asc" | "desc";

export function useUserManager(initialUsers: User[]) {
  const { data: users = [] } = useUsers(initialUsers);
  const { create, update, remove } = useUserMutations();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [isLoading, setIsLoading] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("user");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (av !== bv) return (av < bv ? -1 : 1) * (sortDir === "asc" ? 1 : -1);
      return 0;
    });
  }, [users, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.user || !form.pin || !form.authority) return;
    setIsLoading(true);
    try {
      await create.mutateAsync(form);
      setForm(emptyForm);
      toast.success("ユーザーを追加しました");
    } catch (e) {
      toast.error(`追加に失敗しました: ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm({ user: user.user, pin: "", authority: user.authority });
  };

  const handleUpdate = async (id: string) => {
    if (!editForm.user || !editForm.authority) return;
    setIsLoading(true);
    try {
      await update.mutateAsync({ id, ...editForm });
      setEditingId(null);
      toast.success("ユーザーを更新しました");
    } catch (e) {
      toast.error(`更新に失敗しました: ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    toast("このユーザーを削除しますか？", {
      action: { label: "削除", onClick: () => performDelete(id) },
      cancel: { label: "キャンセル", onClick: () => {} },
    });
  };

  const performDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await remove.mutateAsync(id);
      toast.success("ユーザーを削除しました");
    } catch {
      toast.error("削除に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users: sortedUsers,
    sort: { key: sortKey, dir: sortDir, handle: handleSort },
    newForm: { values: form, setValues: setForm, onCreate: handleCreate },
    editForm: { id: editingId, setId: setEditingId, values: editForm, setValues: setEditForm, start: startEdit, onUpdate: handleUpdate },
    isLoading,
    handleDelete,
  };
}
