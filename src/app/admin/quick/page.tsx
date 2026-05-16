import { redirect } from "next/navigation";

import { getSubmissionById, getUsers } from "@lib/dynamoDbApi";
import { getSessionUser } from "@lib/authGuard";
import { AUTHORITY, SUBMISSION_STATUS } from "@const/constDefinition";
import QuickApproveClient from "./QuickApproveClient";

export const dynamic = "force-dynamic";

export default async function QuickApprovePage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
    const { id } = await searchParams;
    if (!id) redirect("/admin");

    const sessionUser = await getSessionUser();
    if (!sessionUser) redirect(`/?next=/admin/quick?id=${id}`);
    if (sessionUser.authority !== AUTHORITY.admin) redirect("/");

    const [submission, users] = await Promise.all([getSubmissionById(id), getUsers()]);
    if (!submission || submission.status !== SUBMISSION_STATUS.pending) redirect("/admin");

    return <QuickApproveClient submission={submission} users={users} />;
}
