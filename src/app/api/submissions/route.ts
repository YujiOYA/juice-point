import { NextRequest, NextResponse } from "next/server";

import { AUTHORITY } from "@const/constDefinition";
import { forbidden, getSessionUser, unauthorized } from "@lib/authGuard";
import {
    createSubmission,
    createTask,
    deleteSubmission,
    getPushSubscriptions,
    getSubmissions,
    updateSubmissionPoint,
    updateSubmissionStatus,
} from "@lib/dynamoDbApi";
import { submissionPostSchema } from "@lib/schemas";
import { sendPushNotification } from "@lib/webPush";
import { SubmissionType } from "@type/submission";

const ADMIN_ONLY_TYPES = new Set([
    "approve",
    "approveOneTimeTask",
    "approveTaskRequest",
    "disapprove",
    "restore",
    "delete",
    "updatePoint",
]);

async function notifyAdmins(title: string, body: string, data?: Record<string, string>): Promise<void> {
    try {
        const subscriptions = await getPushSubscriptions();
        await Promise.allSettled(subscriptions.map((s) => sendPushNotification(JSON.parse(s), { title, body, data })));
    } catch {
        // 通知失敗は申請処理をブロックしない
    }
}

export async function GET() {
    const user = await getSessionUser();
    if (!user) return unauthorized();
    try {
        const submissions = await getSubmissions();
        return NextResponse.json(submissions);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const user = await getSessionUser();
    if (!user) return unauthorized();

    const parsed = submissionPostSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const body = parsed.data;

    if (ADMIN_ONLY_TYPES.has(body.type) && user.authority !== AUTHORITY.admin) return forbidden();

    try {
        if (body.type === "register") {
            const submissionId = await createSubmission({
                whatYouDid: body.whatYouDid,
                whoDid: user.id,
                point: body.point,
            });
            const userName = body.whoDidName ?? user.user;
            await notifyAdmins(
                "📋 お手伝い申請が届きました",
                `${userName} が「${body.whatYouDid}」（${body.point}pt）を申請しました`,
                { submissionId },
            );
            return NextResponse.json({ ok: true });
        }

        if (body.type === "registerOneTimeTask") {
            const submissionId = await createSubmission({
                whatYouDid: body.whatYouDid,
                whoDid: user.id,
                point: body.point,
                submissionType: SubmissionType.OneTimeTask,
            });
            const userName = body.whoDidName ?? user.user;
            await notifyAdmins(
                "📋 一度きりタスクの申請が届きました",
                `${userName} が「${body.whatYouDid}」（${body.point}pt）を申請しました`,
                { submissionId },
            );
            return NextResponse.json({ ok: true });
        }

        if (body.type === "requestTask") {
            const submissionId = await createSubmission({
                whatYouDid: body.whatYouDid,
                whoDid: user.id,
                point: body.point,
                submissionType: SubmissionType.TaskRequest,
            });
            const userName = body.whoDidName ?? user.user;
            await notifyAdmins(
                "💡 タスク追加リクエストが届きました",
                `${userName} が「${body.whatYouDid}」のタスク登録をリクエストしました`,
                { submissionId },
            );
            return NextResponse.json({ ok: true });
        }

        if (body.type === "approveOneTimeTask") {
            await updateSubmissionPoint(body.id, Number(body.newPoint));
            await updateSubmissionStatus(body.id, "承認");
            return NextResponse.json({ ok: true });
        }

        if (body.type === "approveTaskRequest") {
            await createTask({ task: body.taskName, point: body.point, whose: body.whoDid });
            // タスクリクエストはタスク登録依頼のため、ポイント付与せず申請を削除
            await deleteSubmission(body.id);
            return NextResponse.json({ ok: true });
        }

        if (body.type === "approve") {
            await updateSubmissionStatus(body.id, "承認");
            return NextResponse.json({ ok: true });
        }

        if (body.type === "disapprove") {
            await updateSubmissionStatus(body.id, "却下");
            return NextResponse.json({ ok: true });
        }

        if (body.type === "restore") {
            await updateSubmissionStatus(body.id, "未承認");
            return NextResponse.json({ ok: true });
        }

        if (body.type === "delete") {
            await deleteSubmission(body.id);
            return NextResponse.json({ ok: true });
        }

        if (body.type === "updatePoint") {
            await updateSubmissionPoint(body.id, Number(body.newPoint));
            return NextResponse.json({ ok: true });
        }

        if (body.type === "remind") {
            const userName = body.whoDidName ?? user.user;
            const isTaskRequest = body.submissionType === SubmissionType.TaskRequest;
            const title = isTaskRequest
                ? "⏰ リマインド：タスク追加リクエストが承認待ちです"
                : "⏰ リマインド：承認待ちのお手伝いがあります";
            const notifyBody = isTaskRequest
                ? `${userName} が「${body.whatYouDid}」のタスク登録を待っています`
                : `${userName} が「${body.whatYouDid}」（${body.point}pt）の承認を待っています`;
            await notifyAdmins(title, notifyBody, { submissionId: body.id });
            return NextResponse.json({ ok: true });
        }

        if (body.type === "usePoints") {
            const all = await getSubmissions();
            const usable = all
                .filter((s) => s.whoDid === body.userId && s.status === "承認")
                .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

            let remaining = body.point;
            const toDelete: string[] = [];
            let toUpdate: { id: string; newPoint: number } | null = null;

            for (const s of usable) {
                if (remaining <= 0) break;
                const sPoint = Number(s.point);
                if (sPoint <= remaining) {
                    toDelete.push(s.id);
                    remaining -= sPoint;
                } else {
                    toUpdate = { id: s.id, newPoint: sPoint - remaining };
                    remaining = 0;
                }
            }

            if (remaining > 0) {
                return NextResponse.json({ error: "ポイントが足りません" }, { status: 400 });
            }

            await Promise.all([
                ...toDelete.map((id) => deleteSubmission(id)),
                ...(toUpdate ? [updateSubmissionPoint(toUpdate.id, toUpdate.newPoint)] : []),
            ]);
            return NextResponse.json({ ok: true });
        }
        return NextResponse.json({ error: "Unknown type" }, { status: 400 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
