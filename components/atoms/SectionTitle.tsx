import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionTitleProps {
    title: string;
    subtitle?: string;
    className?: string;
    centered?: boolean;
}

export function SectionTitle({ title, subtitle, className, centered = true }: SectionTitleProps) {
    return (
        <div className={cn("flex flex-col gap-2 mb-12", centered && "items-center text-center", className)}>
            {subtitle && (
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-gold text-sm tracking-[0.2em] uppercase font-sans"
                >
                    {subtitle}
                </motion.span>
            )}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-5xl font-serif text-white tracking-wide"
            >
                {title}
            </motion.h2>
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="h-[1px] w-24 bg-gold/50 mt-4"
            />
        </div>
    );
}
