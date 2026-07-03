import { useState } from "react";
import { toast } from "sonner";

import { SUBMISSION_STATUS } from "@const/constDefinition";
import { LABELS } from "@const/labels";
import { useRewards } from "@hook/queries/useRewards";
import { useSubmissions, useSubmissionMutations } from "@hook/queries/useSubmissions";
import { useTasks } from "@hook/queries/useTasks";
import { Reward } from "@type/reward";
import { Submission } from "@type/submission";
import { Task } from "@type/task";
import { User } from "@type/user";

const T = LABELS.toast;

export function useTaskForm(
    user: User,
    initialTasks: Task[],
    initialSubmissions: Submission[],
    initialRewards: Reward[],
) {
    const { data: tasks = [] } = useTasks(initialTasks);
    const { data: submissions = [] } = useSubmissions(initialSubmissions);
    const { data: rewards = [] } = useRewards(initialRewards);
    const mutations = useSubmissionMutations();

    const [point, setPoint] = useState("");
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedTaskIds, setSubmittedTaskIds] = useState<Set<string>>(new Set());
    const [requestTaskName, setRequestTaskName] = useState("");
    const [requestPoint, setRequestPoint] = useState("");
    const [isRequesting, setIsRequesting] = useState(false);
    const [registerTaskAlso, setRegisterTaskAlso] = useState(false);

    const userTasks = tasks.filter((t) => t.whose === user.id);
    const userRewards = rewards.filter((r) => r.whose === user.id).sort((a, b) => Number(a.point) - Number(b.point));
    const userPoint = submissions
        .filter((s) => s.whoDid === user.id && s.status === SUBMISSION_STATUS.approved)
        .reduce((sum, s) => sum + (Number(s.point) || 0), 0);

    const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const task = tasks.find((t) => t.id === e.target.value) ?? null;
        setSelectedTask(task);
        setPoint(task?.point ?? "");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedTask) {
            toast.warning(T.taskRequired);
            return;
        }
        setIsSubmitting(true);
        try {
            await mutations.register.mutateAsync({
                whatYouDid: selectedTask.task,
                point: selectedTask.point,
                whoDid: user.id,
                whoDidName: user.user,
            });
            setSubmittedTaskIds((prev) => new Set(prev).add(selectedTask.id));
            toast.success(T.submitSuccess);
        } catch {
            toast.error(T.submitError);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUsePoints = async (reward: Reward) => {
        if (userPoint < Number(reward.point)) return;
        setIsSubmitting(true);
        try {
            await mutations.usePoints.mutateAsync({ userId: user.id, point: Number(reward.point) });
            toast.success(T.exchangeSuccess(reward.name));
        } catch {
            toast.error(T.exchangeError);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRequestSubmit = async () => {
        if (!requestTaskName.trim() || !requestPoint) {
            toast.warning(T.taskNameRequired);
            return;
        }
        setIsRequesting(true);
        try {
            const ops: Promise<unknown>[] = [
                mutations.registerOneTimeTask.mutateAsync({
                    whatYouDid: requestTaskName.trim(),
                    point: requestPoint,
                    whoDid: user.id,
                    whoDidName: user.user,
                }),
            ];
            if (registerTaskAlso) {
                ops.push(
                    mutations.requestTask.mutateAsync({
                        whatYouDid: requestTaskName.trim(),
                        point: requestPoint,
                        whoDid: user.id,
                        whoDidName: user.user,
                    }),
                );
            }
            await Promise.all(ops);
            setRequestTaskName("");
            setRequestPoint("");
            setRegisterTaskAlso(false);
            toast.success(registerTaskAlso ? T.requestWithTaskSuccess : T.requestSuccess);
        } catch {
            toast.error(T.requestError);
        } finally {
            setIsRequesting(false);
        }
    };

    return {
        data: { userTasks, userPoint, rewards: userRewards, submittedTaskIds },
        taskForm: { selectedTask, point, onChange: handleChangeSelect, onSubmit: handleSubmit },
        requestForm: {
            taskName: requestTaskName,
            point: requestPoint,
            registerTaskAlso,
            setTaskName: setRequestTaskName,
            setPoint: setRequestPoint,
            setRegisterTaskAlso,
            onSubmit: handleRequestSubmit,
        },
        isSubmitting,
        isRequesting,
        handleUsePoints,
    };
}
