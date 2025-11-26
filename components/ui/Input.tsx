import React, { InputHTMLAttributes, forwardRef } from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: LucideIcon;
    error?: string;
    rightElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", icon: Icon, error, rightElement, ...props }, ref) => {
        return (
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                )}
                <input
                    ref={ref}
                    className={`w-full py-3 bg-gray-50 border ${error
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-200 focus:ring-orange-500 focus:border-transparent'
                        } rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 placeholder:text-gray-400 ${Icon ? "pl-11" : "pl-4"
                        } ${rightElement ? "pr-12" : "pr-4"} ${className}`}
                    {...props}
                />
                {rightElement && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        {rightElement}
                    </div>
                )}
                {error && <p className="text-red-600 text-sm mt-1.5 ml-1">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;

