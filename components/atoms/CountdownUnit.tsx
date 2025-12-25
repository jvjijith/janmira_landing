import { motion, AnimatePresence } from "framer-motion";

interface CountdownUnitProps {
    value: number;
    label: string;
}

export function CountdownUnit({ value, label }: CountdownUnitProps) {
    return (
        <div className="flex flex-col items-center mx-4 md:mx-8">
            <div className="relative flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={value}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-4xl md:text-6xl font-serif text-white block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
                    >
                        {value < 10 ? `0${value}` : value}
                    </motion.span>
                </AnimatePresence>
            </div>
            <span className="text-[10px] md:text-xs text-gold uppercase tracking-[0.3em] mt-2 font-medium">
                {label}
            </span>
        </div>
    );
}
