import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Reward } from "@type/reward";

export const REWARDS_KEY = ["rewards"] as const;

const post = (body: unknown) =>
  fetch("/api/rewards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((r) => (r.ok ? r.json() : r.text().then((t) => Promise.reject(t))));

export function useRewards(initialData?: Reward[]) {
  return useQuery<Reward[]>({
    queryKey: REWARDS_KEY,
    queryFn: () => fetch("/api/rewards").then((r) => r.json()),
    initialData,
  });
}

export function useRewardMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: REWARDS_KEY });

  const create = useMutation({
    mutationFn: (data: { name: string; point: string; whose: string }) =>
      post({ type: "create", ...data }),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: (data: { id: string; name: string; point: string; whose: string }) =>
      post({ type: "update", ...data }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => post({ type: "delete", id }),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
