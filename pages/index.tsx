import { GetServerSideProps } from "next";
import { NotionAPI } from "../src/NotionAPI";
import React, { useState } from "react";
import Login from "../components/Login";
import TaskForm from "../components/TaskForm";
import Manager from "../components/Manager";

export const getServerSideProps: GetServerSideProps = async () => {
    const users = await NotionAPI("user");
    const points = await NotionAPI("point");
    const totals = await NotionAPI("totalling");

    return {
        props: { users, points, totals },
    };
};

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    users: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    points: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    totals: any[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAuthority (user:string, users:any[]) {
    const authority = users.find(u => u.properties.name.rich_text?.[0]?.plain_text === user)!.properties.authority.rich_text?.[0]?.plain_text
    console.log(authority);
    
    return authority
}

export default function Index({users, points, totals}: Props) {
    const [user, setUser] = useState<string | null>(null);

        return (
            <div className="container">
                <h1>⭐ ポイント管理アプリ ⭐</h1>

                {/* ログイン機能 */}
                <Login users={users} user={user} setUser={setUser} totals={totals}/>

                {/* ユーザーログインしたらフォームを表示 */}
                {user && (getAuthority(user, users) === "ユーザー") && <TaskForm user={user} points={points} />}
                {/* ユーザーが管理者の場合したらフォームを表示 */}
                {user && (getAuthority(user, users) === "マネージャー") && <Manager totals={totals}>管理者ページ</Manager>}
            </div>
        );
    }
