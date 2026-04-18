"use client";

import Button from "@atom/Button";
import { API } from "@const/apiEndpoint";
import { ROUTES } from "@const/routesConfig";

export default function AdminLogoutButton() {
  const handleLogout = async () => {
    await fetch(API.auth.logout.path, { method: API.auth.logout.method });
    // router.push は iOS PWA で非同期fetch後に失敗するため location.replace を使用
    location.replace(ROUTES.home);
  };

  return (
    <Button variant="logout" onClick={handleLogout}>
      ログアウト
    </Button>
  );
}
