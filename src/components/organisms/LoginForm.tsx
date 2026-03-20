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
  const [userPoint, setUserPoint] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = users.find((u) => u.id === e.target.value) ?? null;
    setLoggedInUser(selected);
    if (selected) setUserPoint(calcUserPoint(selected.user, submissions));
  };

  if (!loggedInUser) {
    return (
      <div>
        <label className="login-label">👤 だれがつかうの？</label>
        <SelectInput
          className="login-select"
          defaultValue=""
          onChange={handleChange}
        >
          <option value="" disabled>
            えらんでね
          </option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.user}
            </option>
          ))}
        </SelectInput>
      </div>
    );
  }

  return (
    <div className="user-info">
      <p className="user-name">👤 {loggedInUser.user} でログイン中</p>
      {loggedInUser.authority !== "admin" && (
        <PointsBadge points={userPoint} />
      )}
      <Button variant="logout" onClick={() => setLoggedInUser(null)}>
        ログアウト
      </Button>
    </div>
  );
}
