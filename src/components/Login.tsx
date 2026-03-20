import React, { useState } from "react";

import { User } from "../types/api/user";
import { Submission } from "../types/api/submission";

interface LoginProps {
  users: User[];
  loggedInUser: User | null;
  setLoggedInUser: (user: User | null) => void;
  submissions: Submission[];
}

const calcUserPoint = (userName: string, submissions: Submission[]): number => {
  return submissions
    .filter(
      (s) =>
        s.whoDid === userName &&
        s.status === "承認" &&
        s.isUsed === "未使用",
    )
    .map((s) => Number(s.point) || 0)
    .reduce((sum, point) => sum + point, 0);
};

export default function Login({
  users,
  loggedInUser,
  setLoggedInUser,
  submissions,
}: LoginProps) {
  const [userPoint, setUserPoint] = useState(0);

  const handleOnchangeUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = users.find((u) => u.id === e.target.value) || null;
    setLoggedInUser(selected);
    if (selected) {
      setUserPoint(calcUserPoint(selected.user, submissions));
    }
  };

  return (
    <div>
      {!loggedInUser ? (
        <div>
          <label className="login-label">👤 だれがつかうの？</label>
          <select
            onChange={handleOnchangeUser}
            className="login-select"
            defaultValue=""
          >
            <option value="" disabled>
              えらんでね
            </option>
            {users.map((u) => (
              <option value={u.id} key={u.id}>
                {u.user}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="user-info">
          <p className="user-name">👤 {loggedInUser.user} でログイン中</p>
          {loggedInUser.authority !== "admin" && (
            <div className="points-badge">
              💰 {userPoint} <span className="points-label">ポイント</span>
            </div>
          )}
          <button
            onClick={() => setLoggedInUser(null)}
            className="logout-button"
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}
