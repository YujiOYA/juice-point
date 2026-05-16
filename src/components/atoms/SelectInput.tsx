import React from "react";

interface Props {
    id?: string;
    className?: string;
    defaultValue?: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
}

export default function SelectInput({ id, className = "input", defaultValue, value, onChange, children }: Props) {
    return (
        <select
            id={id}
            className={className}
            defaultValue={defaultValue}
            value={value}
            onChange={onChange}
            onInput={(e) => onChange(e as unknown as React.ChangeEvent<HTMLSelectElement>)}
        >
            {children}
        </select>
    );
}
