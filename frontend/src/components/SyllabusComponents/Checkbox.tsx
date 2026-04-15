import React from "react";

export interface CheckboxProps {
    id?: string;
    label?: string;
    checked?: boolean;
    className?: string;
    onChange: (checked: boolean) => void;
}

export default function Checkbox ({
    id,
    label,
    checked = false,
    className = "",
    onChange}: CheckboxProps ) {
    return (
        <label className = {`flex items-center gap-2 current-pointer {$className}` }>
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => (onChange(e.target.checked))}
                className ="h-5 w-5 rounded-sm border-2 focus:ring-2"
            />
            {label && <span className="font-medium text-gray-800"> {label}</span>}
        </label>
    );
}