import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@type/user";
import { API } from "@const/apiEndpoint";

export const USERS_KEY = ["users"] as const;

const { path, method, action } = API.users;

const post = (body: unknown) =>
  fetch(path, {
    method: method.POST,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((r) => (r.ok ? r.json() : r.text().then((t) => Promise.reject(t))));

export function useUsers(initialData?: User[]) {
  return useQuery<User[]>({
    queryKey: USERS_KEY,
    queryFn: () => fetch(path).then((r) => r.json()),
    initialData,
  });
}

export function useUserMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: USERS_KEY });

  const create = useMutation({
    mutationFn: (data: { user: string; pin: string; authority: string }) =>
      post({ type: action.create, ...data }),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: (data: { id: string; user: string; pin: string; authority: string }) =>
      post({ type: action.update, ...data }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => post({ type: action.delete, id }),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
