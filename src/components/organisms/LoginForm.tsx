"use client";

import { useRef, useEffect } from "react";
import Button from "@atom/Button";
import SelectInput from "@atom/SelectInput";
import PointsBadge from "@molecule/PointsBadge";
import { useLogin } from "@hook/useLogin";
import { Submission } from "@type/submission";
import { User } from "@type/user";

interface Props {
  users: User[];
  loggedInUser: User | null;
  setLoggedInUser: (user: User | null) => void;
  submissions: Submission[];
}

export default function LoginForm({ users, loggedInUser, setLoggedInUser, submissions }: Props) {
  const { selectedId, pin, setPin, error, isLoading, userPoint, handleSelectChange, handleLogin, handleLogout } =
    useLogin({ loggedInUser, setLoggedInUser, submissions });

  const pinRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!selectedId) return;
    const timer = setTimeout(() => pinRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, [selectedId]);

  if (!loggedInUser) {
    return (
      <form onSubmit={handleLogin}>
        <label className="login-label">👤 だれがつかうの？</label>
        <SelectInput className="login-select" defaultValue="" onChange={handleSelectChange}>
          <option value="" disabled>えらんでね</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.user}</option>
          ))}
        </SelectInput>

        {selectedId && (
          <div style={{ marginTop: "1rem" }}>
            <label className="login-label">🔑 PIN</label>
            <input
              ref={pinRef}
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="input"
              placeholder="PINを入力"
              inputMode="numeric"
            />
          </div>
        )}

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

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
      {loggedInUser.authority !== "admin" && <PointsBadge points={userPoint} />}
      <Button variant="logout" onClick={handleLogout}>
        ログアウト
      </Button>
    </div>
  );
}
