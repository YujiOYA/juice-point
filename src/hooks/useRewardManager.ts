import { useRewards, useRewardMutations } from "@hook/queries/useRewards";
import { Reward } from "@type/reward";
import { useTableManager } from "@hook/useTableManager";
import { LABELS } from "@const/labels";

const T = LABELS.toast;

type RewardSortKey = "name" | "point";

const emptyForm = { name: "", point: "", whose: "" };

const sortKeyExtractor = (r: Reward, key: RewardSortKey): string | number =>
  key === "point" ? Number(r[key]) : r[key];

const startEditForm = (r: Reward) => ({ name: r.name, point: r.point, whose: r.whose });

export function useRewardManager(initialRewards: Reward[]) {
  const { data: rewards = [] } = useRewards(initialRewards);
  const mutations = useRewardMutations();

  const { items, ...rest } = useTableManager<Reward, RewardSortKey, typeof emptyForm>({
    items: rewards,
    mutations,
    defaultSortKey: "name",
    sortKeyExtractor,
    emptyForm,
    startEditForm,
    messages: {
      addSuccess:    T.rewardAddSuccess,
      addError:      T.rewardAddError,
      editSuccess:   T.rewardEditSuccess,
      editError:     T.rewardEditError,
      deleteConfirm: T.rewardDeleteConfirm,
      deleteSuccess: T.rewardDeleteSuccess,
    },
  });

  return { rewards: items, ...rest };
}
