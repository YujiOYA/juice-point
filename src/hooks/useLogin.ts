import { useState } from "react";
import { useRouter } from "next/navigation";

import { Submission } from "@type/submission";
import { User } from "@type/user";

const calcUserPoint = (userName: string, submissions: Submission[]): number =>
  submissions
    .filter((s) => s.whoDid === userName && s.status === "承認")
    .map((s) => Number(s.point) || 0)
    .reduce((sum, point) => sum + point, 0);

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

  const userPoint = loggedInUser ? calcUserPoint(loggedInUser.user, submissions) : 0;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(e.target.value);
    setPin("");
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !pin) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, pin }),
      });
      if (!res.ok) {
        setError("PINが違います");
        return;
      }
      const user = await res.json();
      setLoggedInUser(user);
      if (user.authority === "admin") router.push("/admin");
    } catch {
      setError("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setSelectedId("");
    setPin("");
    setError("");
  };

  return { selectedId, pin, setPin, error, isLoading, userPoint, handleSelectChange, handleLogin, handleLogout };
}
