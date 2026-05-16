import React from "react";

type Variant = "primary" | "approve" | "disapprove" | "logout";

const variantClass: Record<Variant, string> = {
    primary: "submit-button",
    approve: "approve-button",
    disapprove: "disapprove-button",
    logout: "logout-button",
};

interface Props {
    variant?: Variant;
    type?: "button" | "submit";
    disabled?: boolean;
    style?: React.CSSProperties;
    onClick?: () => void;
    children: React.ReactNode;
}

export default function Button({ variant = "primary", type = "button", disabled, style, onClick, children }: Props) {
    return (
        <button type={type} className={variantClass[variant]} disabled={disabled} style={style} onClick={onClick}>
            {children}
        </button>
    );
}
