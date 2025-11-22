import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "ghost";
    fullWidth?: boolean;
    icon?: React.ReactNode;
}

export default function Button({
    children,
    className = "",
    variant = "primary",
    fullWidth = false,
    icon,
    ...props
}: ButtonProps) {
    const baseStyles =
        "font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2";

    const variants = {
        primary:
            "bg-gradient-to-r from-blue-900 to-blue-800 text-white hover:shadow-lg hover:scale-[1.02]",
        outline:
            "border border-gray-200 hover:bg-gray-50 text-gray-700",
        ghost: "hover:bg-gray-100 text-gray-600",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? "w-full" : ""
                } ${className}`}
            {...props}
        >
            {icon && <span>{icon}</span>}
            <span>{children}</span>
        </button>
    );
}
