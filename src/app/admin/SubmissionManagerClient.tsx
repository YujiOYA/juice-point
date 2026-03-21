"use client";

import ManagerPanel from "@organism/ManagerPanel";
import { useSubmissions } from "@hook/useSubmissions";
import { Submission } from "@type/submission";

interface Props {
  initialSubmissions: Submission[];
}

export default function SubmissionManagerClient({ initialSubmissions }: Props) {
  const { submissions, refreshSubmissions } = useSubmissions(initialSubmissions);
  return <ManagerPanel submissions={submissions} onRefresh={refreshSubmissions} />;
}
