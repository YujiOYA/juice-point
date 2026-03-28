"use client";

import ManagerPanel from "@organism/ManagerPanel";
import { useSubmissions } from "@hook/queries/useSubmissions";
import { Submission } from "@type/submission";
import { User } from "@type/user";

interface Props {
  initialSubmissions: Submission[];
  users: User[];
}

export default function SubmissionManagerClient({ initialSubmissions, users }: Props) {
  const { data: submissions = [] } = useSubmissions(initialSubmissions);
  return <ManagerPanel submissions={submissions} users={users} />;
}
