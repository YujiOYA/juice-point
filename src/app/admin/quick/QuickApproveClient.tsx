"use client";

import { useState } from "react";

import Button from "@atom/Button";
import { Submission, SubmissionType } from "@type/submission";
import { User } from "@type/user";
import { API } from "@const/apiEndpoint";
import { LABELS } from "@const/labels";

interface Props {
    submission: Submission;
    users: User[];
}

export default function QuickApproveClient({ submission, users }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const userName = users.find((u) => u.id === submission.whoDid)?.user ?? submission.whoDid;
    const isTaskRequest = submission.submissionType === SubmissionType.TaskRequest;

    const handleAction = async (action: "approve" | "disapprove") => {
        setIsLoading(true);
        try {
            const body =
                action === "approve" && isTaskRequest
                    ? {
                          type: "approveTaskRequest",
                          id: submission.id,
                          taskName: submission.whatYouDid,
                          point: submission.point,
                          whoDid: submission.whoDid,
                      }
                    : { type: action, id: submission.id };
            await fetch(API.submissions.path, {
                method: API.submissions.method.POST,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
        } finally {
            location.replace("/admin");
        }
    };

    return (
        <div className="container" style={{ maxWidth: "480px", paddingTop: "2rem" }}>
            <h1 className="page-title" style={{ fontSize: "1.4rem" }}>
                {isTaskRequest ? LABELS.manager.titleTaskRequests : LABELS.manager.titlePending}
            </h1>

            <div className="card" style={{ marginBottom: "2rem", padding: "1.5rem" }}>
                <p style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.5rem" }}>{userName}</p>
                <p style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>「{submission.whatYouDid}」</p>
                <p style={{ color: "#ff9800", fontWeight: "bold", fontSize: "1.2rem" }}>
                    {isTaskRequest ? `希望ポイント: ${submission.point}pt` : `${submission.point}pt`}
                </p>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
                <Button
                    variant="approve"
                    disabled={isLoading}
                    onClick={() => handleAction("approve")}
                    style={{ flex: 1, padding: "1rem", fontSize: "1.1rem" }}
                >
                    {isTaskRequest ? "タスクとして登録" : LABELS.common.approve}
                </Button>
                <Button
                    variant="disapprove"
                    disabled={isLoading}
                    onClick={() => handleAction("disapprove")}
                    style={{ flex: 1, padding: "1rem", fontSize: "1.1rem" }}
                >
                    {LABELS.common.reject}
                </Button>
            </div>
        </div>
    );
}
