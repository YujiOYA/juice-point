import { useState } from "react";

import { Submission } from "@type/submission";

export function useSubmissions(initialSubmissions: Submission[]) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);

  const refreshSubmissions = () =>
    fetch("/api/submissions")
      .then((r) => r.json())
      .then(setSubmissions)
      .catch(() => {});

  return { submissions, refreshSubmissions };
}
