import { useState, useMemo } from "react";
import { toast } from "sonner";

import { useUsers, useUserMutations } from "@hook/queries/useUsers";
import { User } from "@type/user";
import { AUTHORITY } from "@const/constDefinition";
import { LABELS } from "@const/labels";

const T = LABELS.toast;
const C = LABELS.common;

const emptyForm: { user: string; pin: string; authority: string } = { user: "", pin: "", authority: AUTHORITY.user };
const emptyEditForm: { user: string; pin: string; authority: string } = { user: "", pin: "", authority: AUTHORITY.user };

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
      toast.success(T.userAddSuccess);
    } catch (e) {
      toast.error(T.userAddError(e));
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
      toast.success(T.userEditSuccess);
    } catch (e) {
      toast.error(T.userEditError(e));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    toast(T.userDeleteConfirm, {
      action: { label: C.delete, onClick: () => performDelete(id) },
      cancel: { label: C.cancel, onClick: () => {} },
    });
  };

  const performDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await remove.mutateAsync(id);
      toast.success(T.userDeleteSuccess);
    } catch {
      toast.error(T.deleteError);
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
