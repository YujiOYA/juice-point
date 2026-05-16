import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Submission } from "@type/submission";
import { API } from "@const/apiEndpoint";
import { TASKS_KEY } from "@hook/queries/useTasks";

export const SUBMISSIONS_KEY = ["submissions"] as const;

const { path, method, action } = API.submissions;

const post = (body: unknown) =>
    fetch(path, {
        method: method.POST,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).then((r) => (r.ok ? r.json() : r.text().then((t) => Promise.reject(t))));

export function useSubmissions(initialData?: Submission[]) {
    return useQuery<Submission[]>({
        queryKey: SUBMISSIONS_KEY,
        queryFn: () => fetch(path).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
        initialData,
    });
}

export function useSubmissionMutations() {
    const queryClient = useQueryClient();
    const invalidateSubs = () => queryClient.invalidateQueries({ queryKey: SUBMISSIONS_KEY });
    const invalidateTasks = () => queryClient.invalidateQueries({ queryKey: TASKS_KEY });

    const approve = useMutation({
        mutationFn: (id: string) => post({ type: action.approve, id }),
        onSuccess: invalidateSubs,
    });

    const disapprove = useMutation({
        mutationFn: (id: string) => post({ type: action.disapprove, id }),
        onSuccess: invalidateSubs,
    });

    const restore = useMutation({
        mutationFn: (id: string) => post({ type: action.restore, id }),
        onSuccess: invalidateSubs,
    });

    const remove = useMutation({
        mutationFn: (id: string) => post({ type: action.delete, id }),
        onSuccess: invalidateSubs,
    });

    const approveOneTimeTask = useMutation({
        mutationFn: ({ id, newPoint }: { id: string; newPoint: string }) =>
            post({ type: action.approveOneTimeTask, id, newPoint }),
        onSuccess: invalidateSubs,
    });

    const approveTaskRequest = useMutation({
        mutationFn: (submission: Submission) =>
            post({
                type: action.approveTaskRequest,
                id: submission.id,
                taskName: submission.whatYouDid,
                point: submission.point,
                whoDid: submission.whoDid,
            }),
        onSuccess: async () => {
            await invalidateSubs();
            await invalidateTasks();
        },
    });

    const register = useMutation({
        mutationFn: (data: { whatYouDid: string; whoDid: string; whoDidName: string; point: string }) =>
            post({ type: action.register, ...data }),
        onSuccess: invalidateSubs,
    });

    const registerOneTimeTask = useMutation({
        mutationFn: (data: { whatYouDid: string; whoDid: string; whoDidName: string; point: string }) =>
            post({ type: action.registerOneTimeTask, ...data }),
        onSuccess: invalidateSubs,
    });

    const requestTask = useMutation({
        mutationFn: (data: { whatYouDid: string; whoDid: string; whoDidName: string; point: string }) =>
            post({ type: action.requestTask, ...data }),
        onSuccess: invalidateSubs,
    });

    const usePoints = useMutation({
        mutationFn: ({ userId, point }: { userId: string; point: number }) =>
            post({ type: action.usePoints, userId, point }),
        onSuccess: invalidateSubs,
    });

    const updatePoint = useMutation({
        mutationFn: ({ id, newPoint }: { id: string; newPoint: string }) =>
            post({ type: action.updatePoint, id, newPoint }),
        onSuccess: invalidateSubs,
    });

    return {
        approve,
        disapprove,
        restore,
        remove,
        approveOneTimeTask,
        approveTaskRequest,
        register,
        registerOneTimeTask,
        requestTask,
        usePoints,
        updatePoint,
    };
}
