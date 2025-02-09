import React, { useState } from "react";

interface LoginProps {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
users: any[];
user: string | null;
setUser: (user: string | null) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
totals: any[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const calcUserPoint = (user: string, totals: any[]): number => {
    return totals
        .filter(p => 
            {                
                return(
                    p.properties.whoDid?.rich_text?.[0]?.plain_text === user &&
                    p.properties.status?.rich_text?.[0]?.plain_text === "承認" &&
                    p.properties.isUsed.status.name === "未使用"
               )
            }
        ) 
        .map(p => Number(p.properties.point?.rich_text?.[0]?.plain_text) || 0) // 数値に変換
        .reduce((sum, point) => sum + point, 0); // 合計を計算
};

export default function Login({ users, user, setUser, totals }: LoginProps) {
    const [userPoint, setUserPoint] = useState(0);

    const handleOnchangeUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUser = e.target.value;
        setUser(selectedUser);
        setUserPoint(calcUserPoint(selectedUser, totals)); // `selectedUser` を直接使う
    };

    const familyNames = users.map(u => u.properties.name.rich_text?.[0]?.plain_text);

    return (
        <div>
            {!user ? (
                <div>
                    <h2>👤 ログイン</h2>
                    <select onChange={handleOnchangeUser} className="input" defaultValue="">
                        <option value="" disabled>ユーザーを選んでね</option>
                        {familyNames.map(name => (
                            <option value={name} key={name}>{name}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <div>
                    <h2>👤 {user} としてログイン中</h2>
                    {user !== "おかあさん" && <h2>💰️ {userPoint}</h2>}
                    <button onClick={() => setUser(null)} className="logout-button">ログアウト</button>
                </div>
            )}
        </div>
    );
}
