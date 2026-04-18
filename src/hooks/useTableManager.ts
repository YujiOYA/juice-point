import { useState, useMemo } from "react";
import { toast } from "sonner";

import { LABELS } from "@const/labels";

const C = LABELS.common;
const T = LABELS.toast;

type SortDir = "asc" | "desc";

interface Mutations<F extends Record<string, string>> {
  create: { mutateAsync: (data: F) => Promise<unknown> };
  update: { mutateAsync: (data: { id: string } & F) => Promise<unknown> };
  remove: { mutateAsync: (id: string) => Promise<unknown> };
}

interface Options<
  Item extends { id: string; whose: string },
  SK extends string,
  F extends Record<string, string>,
> {
  items: Item[];
  mutations: Mutations<F>;
  defaultSortKey: SK;
  sortKeyExtractor: (item: Item, key: SK) => string | number;
  emptyForm: F;
  startEditForm: (item: Item) => F;
  messages: {
    addSuccess: string;
    addError: (e: unknown) => string;
    editSuccess: string;
    editError: (e: unknown) => string;
    deleteConfirm: string;
    deleteSuccess: string;
  };
}

export function useTableManager<
  Item extends { id: string; whose: string },
  SK extends string,
  F extends Record<string, string>,
>(opts: Options<Item, SK, F>) {
  const { items, mutations, defaultSortKey, sortKeyExtractor, emptyForm, startEditForm, messages: msg } = opts;

  const [form, setForm] = useState<F>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<F>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [sortKey, setSortKey] = useState<SK>(defaultSortKey);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [sortKey2, setSortKey2] = useState<SK | null>(null);
  const [sortDir2, setSortDir2] = useState<SortDir>("asc");
  const [filterWhose, setFilterWhose] = useState<string>("");

  const sortedItems = useMemo(() => {
    return [...items]
      .filter((item) => !filterWhose || item.whose === filterWhose)
      .sort((a, b) => {
        const av = sortKeyExtractor(a, sortKey), bv = sortKeyExtractor(b, sortKey);
        if (av !== bv) return (av < bv ? -1 : 1) * (sortDir === "asc" ? 1 : -1);
        if (!sortKey2) return 0;
        const av2 = sortKeyExtractor(a, sortKey2), bv2 = sortKeyExtractor(b, sortKey2);
        if (av2 !== bv2) return (av2 < bv2 ? -1 : 1) * (sortDir2 === "asc" ? 1 : -1);
        return 0;
      });
  }, [items, sortKey, sortDir, sortKey2, sortDir2, filterWhose, sortKeyExtractor]);

  const handleSort = (key: SK) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleSort2 = (key: SK | null) => {
    if (key === null) { setSortKey2(null); return; }
    if (sortKey2 === key) setSortDir2((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey2(key); setSortDir2("asc"); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(form).some((v) => !v)) return;
    setIsLoading(true);
    try {
      await mutations.create.mutateAsync(form);
      setForm(emptyForm);
      toast.success(msg.addSuccess);
    } catch (e) {
      toast.error(msg.addError(e));
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (item: Item) => {
    setEditingId(item.id);
    setEditForm(startEditForm(item));
  };

  const handleUpdate = async (id: string) => {
    setIsLoading(true);
    try {
      await mutations.update.mutateAsync({ id, ...editForm } as { id: string } & F);
      setEditingId(null);
      toast.success(msg.editSuccess);
    } catch (e) {
      toast.error(msg.editError(e));
    } finally {
      setIsLoading(false);
    }
  };

  const performDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await mutations.remove.mutateAsync(id);
      toast.success(msg.deleteSuccess);
    } catch {
      toast.error(T.deleteError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    toast(msg.deleteConfirm, {
      action: { label: C.delete, onClick: () => performDelete(id) },
      cancel: { label: C.cancel, onClick: () => {} },
    });
  };

  return {
    items: sortedItems,
    sortKey, sortDir, handleSort,
    sortKey2, sortDir2, handleSort2,
    filterWhose, setFilterWhose,
    form, setForm,
    editingId, setEditingId,
    editForm, setEditForm,
    isLoading,
    handleCreate, startEdit, handleUpdate, handleDelete,
  };
}
