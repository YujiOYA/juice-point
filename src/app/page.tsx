import { redirect } from "next/navigation";
import PageClient from "@app/PageClient";
import InitialSetupClient from "@app/InitialSetupClient";
import { getUsers, getTasks, getSubmissions, getRewards } from "@lib/dynamoDbApi";
import { getSessionUser } from "@lib/authGuard";
import { AUTHORITY } from "@const/constDefinition";
import { ROUTES } from "@const/routesConfig";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
    const { next } = await searchParams;
    const users = await getUsers();

    if (users.length === 0) {
        return <InitialSetupClient />;
    }

    const sessionUser = await getSessionUser();

    // 管理者セッションが有効な場合は管理画面へリダイレクト
    if (sessionUser?.authority === AUTHORITY.admin) {
        redirect(ROUTES.admin);
    }

    const [tasks, submissions, rewards] = sessionUser
        ? await Promise.all([getTasks(), getSubmissions(), getRewards()])
        : [[], [], []];

    return (
        <PageClient
            users={users}
            tasks={tasks}
            submissions={submissions}
            rewards={rewards}
            sessionUser={sessionUser ?? null}
            next={next ?? null}
        />
    );
}
