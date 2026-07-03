import { SubmissionType } from "@type/submission";

import type { Reward } from "@type/reward";
import type { Submission } from "@type/submission";
import type { Task } from "@type/task";
import type { User } from "@type/user";

export const mockUsers: User[] = [
    { id: "user-1", user: "たろう", authority: "user" },
    { id: "user-2", user: "はなこ", authority: "user" },
    { id: "user-admin", user: "お父さん", authority: "admin" },
];

export const mockAdminUser = mockUsers[2];
export const mockRegularUser = mockUsers[0];

export const mockTasks: Task[] = [
    { id: "task-1", task: "皿洗い", point: "3", whose: "user-1" },
    { id: "task-2", task: "掃除機がけ", point: "5", whose: "user-1" },
    { id: "task-3", task: "洗濯物たたむ", point: "2", whose: "user-2" },
];

export const mockSubmissions: Submission[] = [
    {
        id: "sub-1",
        whatYouDid: "皿洗い",
        whoDid: "user-1",
        point: "3",
        status: "未承認",
        createdAt: "2026-05-15T10:00:00.000Z",
    },
    {
        id: "sub-2",
        whatYouDid: "掃除機がけ",
        whoDid: "user-1",
        point: "5",
        status: "承認",
        createdAt: "2026-05-14T09:00:00.000Z",
    },
    {
        id: "sub-3",
        whatYouDid: "洗濯物たたむ",
        whoDid: "user-2",
        point: "2",
        status: "承認",
        createdAt: "2026-05-13T15:00:00.000Z",
    },
    {
        id: "sub-4",
        whatYouDid: "お風呂掃除",
        whoDid: "user-1",
        point: "4",
        status: "却下",
        createdAt: "2026-05-12T11:00:00.000Z",
    },
    {
        id: "sub-5",
        whatYouDid: "庭の草むしり",
        whoDid: "user-2",
        point: "10",
        status: "未承認",
        createdAt: "2026-05-15T12:00:00.000Z",
        submissionType: SubmissionType.OneTimeTask,
    },
    {
        id: "sub-6",
        whatYouDid: "犬の散歩",
        whoDid: "user-1",
        point: "5",
        status: "未承認",
        createdAt: "2026-05-15T14:00:00.000Z",
        submissionType: SubmissionType.TaskRequest,
    },
];

export const mockRewards: Reward[] = [
    { id: "reward-1", name: "ジュース1本", point: "5", whose: "user-1" },
    { id: "reward-2", name: "ゲーム30分", point: "10", whose: "user-1" },
    { id: "reward-3", name: "アイスクリーム", point: "8", whose: "user-2" },
];
