"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Button from "@atom/Button";
import Card from "@atom/Card";
import TextInput from "@atom/TextInput";

export default function InitialSetupClient() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pin) return;
    if (pin !== pinConfirm) {
      toast.error("PINが一致しません");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "create", user: name, pin, authority: "admin" }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("管理者アカウントを作成しました！管理画面へ移動します");
      setTimeout(() => router.push("/admin"), 1500);
    } catch (e) {
      toast.error(`作成に失敗しました: ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">⭐ ポイント管理アプリ ⭐</h1>
      <Card>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "22px", fontWeight: 800, marginBottom: "0.5rem" }}>🛠️ 初期設定</p>
          <p style={{ color: "#757575", fontSize: "15px" }}>
            最初の管理者アカウントを作成してください
          </p>
        </div>
        <form onSubmit={handleSubmit} className="task-form">
          <div>
            <label className="task-label">👤 管理者名</label>
            <TextInput
              placeholder="名前を入力"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="task-label">🔑 PIN</label>
            <TextInput
              type="password"
              placeholder="PINを入力"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
          <div>
            <label className="task-label">🔑 PIN（確認）</label>
            <TextInput
              type="password"
              placeholder="PINをもう一度入力"
              value={pinConfirm}
              onChange={(e) => setPinConfirm(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" disabled={isLoading || !name || !pin || !pinConfirm}>
            管理者アカウントを作成
          </Button>
        </form>
      </Card>
    </div>
  );
}
