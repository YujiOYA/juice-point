"use client";

import { SUBMISSION_STATUS } from "@const/constDefinition";
import { useSubmissions } from "@hook/queries/useSubmissions";
import { useBadge } from "@hook/useBadge";
import ManagerPanel from "@organism/ManagerPanel";
import { Submission } from "@type/submission";
import { User } from "@type/user";

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
