export const SubmissionType = {
    OneTimeTask: "oneTimeTask",
    TaskRequest: "taskRequest",
} as const;

export type SubmissionType = (typeof SubmissionType)[keyof typeof SubmissionType];

export type Submission = {
    id: string;
    whatYouDid: string;
    whoDid: string;
    point: string;
    status: string;
    createdAt: string;
    submissionType?: SubmissionType;
};
