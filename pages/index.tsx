import { GetServerSideProps } from "next";
import { NotionAPI } from "../src/NotionAPI";
import React, { useState } from "react";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
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
    users: PageObjectResponse[];
    points: PageObjectResponse[];
    totals: PageObjectResponse[];
}

function getAuthority (user:string, users:PageObjectResponse[]) {
    const authority = users.find(u => u.properties.name.rich_text?.[0]?.plain_text === user)!.properties.authority.rich_text?.[0]?.plain_text
    console.log(authority);
    
    return authority
}

export default function Index({users, points, totals}: Props) {
    const [user, setUser] = useState<string | null>(null);
    const [authority, setAuthority] = useState<string | null>(null);

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
