import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "@type/task";
import { API } from "@const/apiEndpoint";

export const TASKS_KEY = ["tasks"] as const;

const { path, method, action } = API.tasks;

const post = (body: unknown) =>
  fetch(path, {
    method: method.POST,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((r) => (r.ok ? r.json() : r.text().then((t) => Promise.reject(t))));

export function useTasks(initialData?: Task[]) {
  return useQuery<Task[]>({
    queryKey: TASKS_KEY,
    queryFn: () => fetch(path).then((r) => r.ok ? r.json() : Promise.reject(r.status)),
    initialData,
  });
}

export function useTaskMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: TASKS_KEY });

  const create = useMutation({
    mutationFn: (data: { task: string; point: string; whose: string }) =>
      post({ type: action.create, ...data }),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: (data: { id: string; task: string; point: string; whose: string }) =>
      post({ type: action.update, ...data }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => post({ type: action.delete, id }),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
