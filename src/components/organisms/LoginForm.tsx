"use client";
import { useState } from "react";

import Button from "@/components/atoms/Button";
import SelectInput from "@/components/atoms/SelectInput";
import PointsBadge from "@/components/molecules/PointsBadge";
import { Submission } from "@/types/submission";
import { User } from "@/types/user";

interface Props {
  users: User[];
  loggedInUser: User | null;
  setLoggedInUser: (user: User | null) => void;
  submissions: Submission[];
}

const calcUserPoint = (userName: string, submissions: Submission[]): number =>
  submissions
    .filter(
      (s) =>
        s.whoDid === userName &&
        s.status === "承認" &&
        s.isUsed === "未使用",
    )
    .map((s) => Number(s.point) || 0)
    .reduce((sum, point) => sum + point, 0);

export default function LoginForm({
  users,
  loggedInUser,
  setLoggedInUser,
  submissions,
}: Props) {
  const [selectedId, setSelectedId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userPoint = loggedInUser
    ? calcUserPoint(loggedInUser.user, submissions)
    : 0;

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

  if (!loggedInUser) {
    return (
      <form onSubmit={handleLogin}>
        <label className="login-label">👤 だれがつかうの？</label>
        <SelectInput
          className="login-select"
          defaultValue=""
          onChange={handleSelectChange}
        >
          <option value="" disabled>えらんでね</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.user}</option>
          ))}
        </SelectInput>

        {selectedId && (
          <div style={{ marginTop: "1rem" }}>
            <label className="login-label">🔑 PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="input"
              placeholder="PINを入力"
              inputMode="numeric"
              autoFocus
            />
          </div>
        )}

        {error && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
        )}

        {selectedId && (
          <div style={{ marginTop: "1rem" }}>
            <Button type="submit" variant="primary" disabled={isLoading || !pin}>
              ログイン
            </Button>
          </div>
        )}
      </form>
    );
  }

  return (
    <div className="user-info">
      <p className="user-name">👤 {loggedInUser.user} でログイン中</p>
      {loggedInUser.authority !== "admin" && (
        <PointsBadge points={userPoint} />
      )}
      <Button variant="logout" onClick={handleLogout}>
        ログアウト
      </Button>
    </div>
  );
}
