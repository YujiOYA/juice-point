import { useState } from "react";
import { useRouter } from "next/navigation";

import { Submission } from "@type/submission";
import { User } from "@type/user";
import { API } from "@const/apiEndpoint";
import { AUTHORITY, SUBMISSION_STATUS } from "@const/constDefinition";
import { ROUTES } from "@const/routesConfig";
import { LABELS } from "@const/labels";

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
  const router = useRouter();
  const [selectedId, setSelectedId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userPoint = loggedInUser ? calcUserPoint(loggedInUser.id, submissions) : 0;

  /** PIN でログイン。成功時は true、失敗時は false を返す */
  const loginWithPin = async (id: string, pinToUse: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(API.auth.login.path, {
        method: API.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pin: pinToUse }),
      });
      if (!res.ok) return false;
      const user: User = await res.json();
      setLoggedInUser(user);
      if (user.authority === AUTHORITY.admin) router.push(next ?? ROUTES.admin);
      return true;
    } catch {
      return false;
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
    const ok = await loginWithPin(selectedId, pin);
    if (!ok) setError(LABELS.login.errorWrongPin);
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
