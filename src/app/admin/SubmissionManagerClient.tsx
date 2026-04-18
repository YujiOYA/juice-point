"use client";

import ManagerPanel from "@organism/ManagerPanel";
import { useSubmissions } from "@hook/queries/useSubmissions";
import { useBadge } from "@hook/useBadge";
import { Submission } from "@type/submission";
import { User } from "@type/user";
import { SUBMISSION_STATUS } from "@const/constDefinition";

interface Props {
  initialSubmissions: Submission[];
  users: User[];
}

export default function SubmissionManagerClient({ initialSubmissions, users }: Props) {
  const { data: submissions = [] } = useSubmissions(initialSubmissions);
  const pendingCount = submissions.filter((s) => s.status === SUBMISSION_STATUS.pending).length;
  useBadge(pendingCount);
  return <ManagerPanel submissions={submissions} users={users} />;
}
