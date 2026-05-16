"use client";

import { useRef } from "react";
import Button from "@atom/Button";
import SelectInput from "@atom/SelectInput";
import PointsBadge from "@molecule/PointsBadge";
import { useLogin } from "@hook/useLogin";
import { Submission } from "@type/submission";
import { User } from "@type/user";
import { AUTHORITY } from "@const/constDefinition";
import { LABELS } from "@const/labels";

const L = LABELS.login;

interface Props {
    users: User[];
    loggedInUser: User | null;
    setLoggedInUser: (user: User | null) => void;
    submissions: Submission[];
    next?: string | null;
}

export default function LoginForm({ users, loggedInUser, setLoggedInUser, submissions, next }: Props) {
    const { selectedId, pin, setPin, error, isLoading, userPoint, handleSelectChange, handleLogin, handleLogout } =
        useLogin({ loggedInUser, setLoggedInUser, submissions, next });

    const pinRef = useRef<HTMLInputElement>(null);

    if (!loggedInUser) {
        return (
            <div>
                <label className="login-label">{L.labelWho}</label>
                <SelectInput className="login-select" value={selectedId} onChange={handleSelectChange}>
                    <option value="" disabled>
                        {L.placeholderSelect}
                    </option>
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.user}
                        </option>
                    ))}
                </SelectInput>

                {selectedId && (
                    <form onSubmit={handleLogin}>
                        <div style={{ marginTop: "1rem" }}>
                            <label className="login-label">{L.labelPin}</label>
                            <input
                                ref={pinRef}
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="input"
                                placeholder={L.placeholderPin}
                                inputMode="numeric"
                            />
                        </div>

                        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

                        <div style={{ marginTop: "1rem" }}>
                            <Button type="submit" variant="primary" disabled={isLoading || !pin}>
                                {L.buttonLogin}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        );
    }

    return (
        <div className="user-info">
            <p className="user-name">{L.loggedInAs(loggedInUser.user)}</p>
            {loggedInUser.authority !== AUTHORITY.admin && <PointsBadge points={userPoint} />}
            <Button variant="logout" onClick={handleLogout}>
                {L.buttonLogout}
            </Button>
        </div>
    );
}
