import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { useSubmissionMutations, SUBMISSIONS_KEY } from "@hook/queries/useSubmissions";
import { Submission, SubmissionType } from "@type/submission";
import { SUBMISSION_STATUS } from "@const/constDefinition";
import { API } from "@const/apiEndpoint";
import { LABELS } from "@const/labels";

const T = LABELS.toast;

export function useManagerPanel(submissions: Submission[]) {
  const [isDoing, setIsDoing] = useState(false);
  const [editedPoints, setEditedPoints] = useState<Map<string, string>>(new Map());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const queryClient = useQueryClient();

  const getEditedPoint = (id: string, defaultPoint: string) => editedPoints.get(id) ?? defaultPoint;
  const setEditedPoint = (id: string, point: string) => {
    setEditedPoints((prev) => new Map(prev).set(id, point));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (ids: string[]) => {
    const allSelected = ids.every((id) => selectedIds.has(id));
    setSelectedIds(allSelected ? new Set() : new Set(ids));
  };

  const clearSelection = () => setSelectedIds(new Set());

  const byDateDesc = (a: Submission, b: Submission) => b.createdAt.localeCompare(a.createdAt);

  const pending = submissions.filter((s) => s.status === SUBMISSION_STATUS.pending && s.submissionType !== SubmissionType.TaskRequest).sort(byDateDesc);
  const rejected = submissions.filter((s) => s.status === SUBMISSION_STATUS.rejected && s.submissionType !== SubmissionType.TaskRequest).sort(byDateDesc);
  const pendingTaskRequests = submissions.filter((s) => s.status === SUBMISSION_STATUS.pending && s.submissionType === SubmissionType.TaskRequest).sort(byDateDesc);
  const rejectedTaskRequests = submissions.filter((s) => s.status === SUBMISSION_STATUS.rejected && s.submissionType === SubmissionType.TaskRequest).sort(byDateDesc);

  const mutations = useSubmissionMutations();

  const handleApprove = async (id: string) => {
    setIsDoing(true);
    try {
      await mutations.approve.mutateAsync(id);
      toast.success(T.approveSuccess);
    } catch {
      toast.error(T.approveError);
    } finally {
      setIsDoing(false);
    }
  };

  const handleDisapprove = async (id: string) => {
    setIsDoing(true);
    try {
      await mutations.disapprove.mutateAsync(id);
      toast.success(T.disapproveSuccess);
    } catch {
      toast.error(T.disapproveError);
    } finally {
      setIsDoing(false);
    }
  };

  const handleRestore = async (id: string) => {
    setIsDoing(true);
    try {
      await mutations.restore.mutateAsync(id);
      toast.success(T.restoreSuccess);
    } catch {
      toast.error(T.restoreError);
    } finally {
      setIsDoing(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDoing(true);
    try {
      await mutations.remove.mutateAsync(id);
      toast.success(T.deleteSuccess);
    } catch {
      toast.error(T.deleteError);
    } finally {
      setIsDoing(false);
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (!ids.length) return;
    setIsDoing(true);
    try {
      await Promise.allSettled(
        ids.map((id) =>
          fetch(API.submissions.path, {
            method: API.submissions.method.POST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "delete", id }),
          })
        )
      );
      await queryClient.invalidateQueries({ queryKey: SUBMISSIONS_KEY });
      clearSelection();
      toast.success(T.deleteSuccess);
    } catch {
      toast.error(T.deleteError);
    } finally {
      setIsDoing(false);
    }
  };

  const handleApproveOneTimeTask = async (id: string, newPoint: string) => {
    setIsDoing(true);
    try {
      await mutations.approveOneTimeTask.mutateAsync({ id, newPoint });
      toast.success(T.approveSuccess);
    } catch {
      toast.error(T.approveError);
    } finally {
      setIsDoing(false);
    }
  };

  const handleApproveTaskRequest = async (submission: Submission) => {
    setIsDoing(true);
    try {
      await mutations.approveTaskRequest.mutateAsync(submission);
      toast.success(T.taskApproveSuccess);
    } catch {
      toast.error(T.approveError);
    } finally {
      setIsDoing(false);
    }
  };

  return {
    isDoing,
    data: { pending, rejected, pendingTaskRequests, rejectedTaskRequests },
    editPoint: { get: getEditedPoint, set: setEditedPoint },
    selection: { selectedIds, toggleSelect, toggleSelectAll, clearSelection },
    actions: {
      approve: handleApprove,
      approveOneTimeTask: handleApproveOneTimeTask,
      disapprove: handleDisapprove,
      restore: handleRestore,
      delete: handleDelete,
      bulkDelete: handleBulkDelete,
      approveTaskRequest: handleApproveTaskRequest,
    },
  };
}
