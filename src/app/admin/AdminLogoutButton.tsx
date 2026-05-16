"use client";

import Button from "@atom/Button";
import { API } from "@const/apiEndpoint";

export default function AdminLogoutButton() {
    const handleLogout = () => {
        // GETエンドポイントでセッションクリア＋リダイレクトをサーバー側で処理
        // awaitなし・同期呼び出し → iOS PWAでのユーザージェスチャー消失を回避
        location.replace(API.auth.logout.path);
    };

    return (
        <Button variant="logout" onClick={handleLogout}>
            ログアウト
        </Button>
    );
}
