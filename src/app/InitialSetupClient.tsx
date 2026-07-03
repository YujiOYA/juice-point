"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import Button from "@atom/Button";
import Card from "@atom/Card";
import TextInput from "@atom/TextInput";
import { API } from "@const/apiEndpoint";
import { LABELS } from "@const/labels";
import { ROUTES } from "@const/routesConfig";

const L = LABELS.setup;
const T = LABELS.toast;

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
            toast.error(T.setupPinMismatch);
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch(API.setup.path, {
                method: API.setup.method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: name, pin }),
            });
            if (!res.ok) throw new Error(await res.text());
            toast.success(T.setupSuccess);
            setTimeout(() => router.push(ROUTES.admin), 1500);
        } catch (e) {
            toast.error(T.setupError(e));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <h1 className="page-title">{LABELS.app.title}</h1>
            <Card>
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <p style={{ fontSize: "22px", fontWeight: 800, marginBottom: "0.5rem" }}>{L.heading}</p>
                    <p style={{ color: "#757575", fontSize: "15px" }}>{L.description}</p>
                </div>
                <form onSubmit={handleSubmit} className="task-form">
                    <div>
                        <label className="task-label">{L.labelName}</label>
                        <TextInput
                            placeholder={L.placeholderName}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="task-label">{L.labelPin}</label>
                        <TextInput
                            type="password"
                            placeholder={L.placeholderPin}
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="task-label">{L.labelPinConfirm}</label>
                        <TextInput
                            type="password"
                            placeholder={L.placeholderPinConfirm}
                            value={pinConfirm}
                            onChange={(e) => setPinConfirm(e.target.value)}
                        />
                    </div>
                    <Button type="submit" variant="primary" disabled={isLoading || !name || !pin || !pinConfirm}>
                        {L.buttonSubmit}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
