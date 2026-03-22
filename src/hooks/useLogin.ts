import { useState } from "react";
import { useRouter } from "next/navigation";

import { Submission } from "@type/submission";
import { User } from "@type/user";

const calcUserPoint = (userId: string, submissions: Submission[]): number =>
  submissions
    .filter((s) => s.whoDid === userId && s.status === "承認")
    .map((s) => Number(s.point) || 0)
    .reduce((sum, point) => sum + point, 0);

const sessionKey = (id: string) => `pin_${id}`;

interface Args {
  loggedInUser: User | null;
  setLoggedInUser: (user: User | null) => void;
  submissions: Submission[];
}

export function useLogin({ loggedInUser, setLoggedInUser, submissions }: Args) {
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
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pin: pinToUse }),
      });
      if (!res.ok) {
        try { sessionStorage.removeItem(sessionKey(id)); } catch { /* ignore */ }
        return false;
      }
      const user: User = await res.json();
      try { sessionStorage.setItem(sessionKey(id), pinToUse); } catch { /* ignore */ }
      setLoggedInUser(user);
      if (user.authority === "admin") router.push("/admin");
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedId(id);
    setPin("");
    setError("");

    // セッションに保存済みPINがあれば自動ログイン
    try {
      const savedPin = sessionStorage.getItem(sessionKey(id));
      if (savedPin) {
        loginWithPin(id, savedPin);
        // 失敗時はsessionStorageが削除され、PIN入力欄がそのまま表示される
      }
    } catch {
      // Safari プライベートブラウズ等でsessionStorageが使えない場合は無視
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !pin) return;
    setError("");
    const ok = await loginWithPin(selectedId, pin);
    if (!ok) setError("PINが違います");
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setSelectedId("");
    setPin("");
    setError("");
    // sessionStorageは維持（セッション内で再選択時に自動ログインできるようにするため）
  };

  return { selectedId, pin, setPin, error, isLoading, userPoint, handleSelectChange, handleLogin, handleLogout };
}
