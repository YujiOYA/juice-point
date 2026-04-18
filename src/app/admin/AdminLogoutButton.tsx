"use client";

import { useRouter } from "next/navigation";
import Button from "@atom/Button";
import { API } from "@const/apiEndpoint";
import { ROUTES } from "@const/routesConfig";

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch(API.auth.logout.path, { method: API.auth.logout.method });
    router.push(ROUTES.home);
  };

  return (
    <Button variant="logout" onClick={handleLogout}>
      ログアウト
    </Button>
  );
}
