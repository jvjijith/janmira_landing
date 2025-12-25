"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { CountdownTimer } from "@/components/molecules/CountdownTimer";
import { Button } from "@/components/atoms/Button";
import { InstagramIcon } from "@/components/atoms/InstagramIcon";

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, 100]);

    // Set launch date to 10 days from now for demo
    const launchDate = new Date('2025-12-25T23:59:59');
    launchDate.setDate(launchDate.getDate() + 10);

    return (
        <div ref={containerRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent">
            {/* Background with Parallax */}
            <motion.div
                style={{ y: y1 }}
                className="absolute inset-0 z-0"
            >
                <Image
                    src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amV3ZWxsZXJ5fGVufDB8fDB8fHww"
                    alt="Luxury Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-green-950/20 to-black z-10" />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ y: y2 }}
                    className="mb-12"
                >
                    <div className="relative w-72 h-32 md:w-96 md:h-40 mx-auto mb-8">
                        <Image
                            src="/janmira-logo.png"
                            alt="JANMIRA"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1 className="sr-only">JANMIRA</h1>
                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "0.1em" }}
                        animate={{ opacity: 1, letterSpacing: "0.3em" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="text-lg md:text-xl text-gold/80 font-sans uppercase font-light"
                    >
                        Shine Your Legacy
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-8"
                >
                    <p className="text-white uppercase tracking-[0.2em] text-xs mb-8">Launching In</p>
                    <CountdownTimer targetDate={launchDate.toISOString()} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="mt-12"
                >
                    <a href="https://www.instagram.com/janmira.in/" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-3 group">
                            <InstagramIcon className="w-4 h-4" />
                            Follow Our Journey
                        </Button>
                    </a>
                </motion.div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-[1px] h-16 bg-gradient-to-b from-transparent via-gold to-transparent opacity-50"
                />
            </div>
        </div>
    );
}
