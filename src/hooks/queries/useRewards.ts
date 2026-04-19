import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Reward } from "@type/reward";
import { API } from "@const/apiEndpoint";

export const REWARDS_KEY = ["rewards"] as const;

const { path, method, action } = API.rewards;

const post = (body: unknown) =>
  fetch(path, {
    method: method.POST,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((r) => (r.ok ? r.json() : r.text().then((t) => Promise.reject(t))));

export function useRewards(initialData?: Reward[]) {
  return useQuery<Reward[]>({
    queryKey: REWARDS_KEY,
    queryFn: () => fetch(path).then((r) => r.ok ? r.json() : Promise.reject(r.status)),
    initialData,
  });
}

export function useRewardMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: REWARDS_KEY });

  const create = useMutation({
    mutationFn: (data: { name: string; point: string; whose: string }) =>
      post({ type: action.create, ...data }),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: (data: { id: string; name: string; point: string; whose: string }) =>
      post({ type: action.update, ...data }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => post({ type: action.delete, id }),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
