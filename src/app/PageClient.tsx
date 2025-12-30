"use client";
import { User } from "../types/api/user";

interface Props {
  users: User[];
}

export default function PageClient({ users }: Props) {
 
  return (  
    <div className="container">
      <h1>⭐ ポイント管理アプリ ⭐</h1>
      <h2>ユーザー一覧</h2>
      <ul>
        {users.map((user, i) => (
          <li key={i}>
            {user.user} ({user.authority})
          </li>
        ))}
      </ul>
    </div>
  );
}
