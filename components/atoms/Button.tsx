import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "ghost";
    children: ReactNode;
}

export function Button({ className, variant = "primary", children, ...props }: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-300 rounded-none tracking-widest uppercase disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-gold text-black hover:bg-white hover:text-black",
        outline: "border border-gold text-gold hover:bg-gold hover:text-black",
        ghost: "text-gold hover:text-white",
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
}
