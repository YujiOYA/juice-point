import { LABELS } from "@const/labels";
import { useTasks, useTaskMutations } from "@hook/queries/useTasks";
import { useTableManager } from "@hook/useTableManager";
import { Task } from "@type/task";

const T = LABELS.toast;

type TaskSortKey = "task" | "point";

const emptyForm = { task: "", point: "", whose: "" };

const sortKeyExtractor = (t: Task, key: TaskSortKey): string | number => (key === "point" ? Number(t[key]) : t[key]);

const startEditForm = (t: Task) => ({ task: t.task, point: t.point, whose: t.whose });

export function useTaskManager(initialTasks: Task[]) {
    const { data: tasks = [], isFetching } = useTasks(initialTasks);
    const mutations = useTaskMutations();

    const { items, ...rest } = useTableManager<Task, TaskSortKey, typeof emptyForm>({
        items: tasks,
        mutations,
        defaultSortKey: "point",
        sortKeyExtractor,
        emptyForm,
        startEditForm,
        messages: {
            addSuccess: T.taskAddSuccess,
            addError: T.taskAddError,
            editSuccess: T.taskEditSuccess,
            editError: T.taskEditError,
            deleteConfirm: T.taskDeleteConfirm,
            deleteSuccess: T.taskDeleteSuccess,
        },
    });

    return { tasks: items, isFetching, ...rest };
}
