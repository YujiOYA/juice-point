import { useState } from "react";

import { API } from "@const/apiEndpoint";
import { AUTHORITY, SUBMISSION_STATUS } from "@const/constDefinition";
import { LABELS } from "@const/labels";
import { ROUTES } from "@const/routesConfig";
import { Submission } from "@type/submission";
import { User } from "@type/user";

type LoginResult = "ok" | "invalid" | "locked";

/** ログイン後の遷移先。オープンリダイレクト・javascript: URL を防ぐため同一オリジンの相対パスのみ許可 */
const safeNextPath = (next: string | null | undefined): string =>
    next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : ROUTES.admin;

const calcUserPoint = (userId: string, submissions: Submission[]): number =>
    submissions
        .filter((s) => s.whoDid === userId && s.status === SUBMISSION_STATUS.approved)
        .map((s) => Number(s.point) || 0)
        .reduce((sum, point) => sum + point, 0);

interface Args {
    loggedInUser: User | null;
    setLoggedInUser: (user: User | null) => void;
    submissions: Submission[];
    next?: string | null;
}

export function useLogin({ loggedInUser, setLoggedInUser, submissions, next }: Args) {
    const [selectedId, setSelectedId] = useState("");
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const userPoint = loggedInUser ? calcUserPoint(loggedInUser.id, submissions) : 0;

    /** PIN でログインし、結果を返す */
    const loginWithPin = async (id: string, pinToUse: string): Promise<LoginResult> => {
        setIsLoading(true);
        try {
            const res = await fetch(API.auth.login.path, {
                method: API.auth.login.method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, pin: pinToUse }),
            });
            if (res.status === 429) return "locked";
            if (!res.ok) return "invalid";
            const user: User = await res.json();
            // 管理者の場合は setLoggedInUser を呼ばずにナビゲーション
            // (React再レンダリングとナビゲーションの競合を避ける: iOS PWA対策)
            if (user.authority === AUTHORITY.admin) {
                location.replace(safeNextPath(next));
                return "ok";
            }
            setLoggedInUser(user);
            return "ok";
        } catch {
            return "invalid";
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedId(e.target.value);
        setPin("");
        setError("");
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedId || !pin) return;
        setError("");
        const result = await loginWithPin(selectedId, pin);
        if (result === "locked") setError(LABELS.login.errorLocked);
        else if (result === "invalid") setError(LABELS.login.errorWrongPin);
    };

    const handleLogout = async () => {
        setLoggedInUser(null);
        setSelectedId("");
        setPin("");
        setError("");
        await fetch(API.auth.logout.path, { method: API.auth.logout.method });
    };

    return { selectedId, pin, setPin, error, isLoading, userPoint, handleSelectChange, handleLogin, handleLogout };
}
