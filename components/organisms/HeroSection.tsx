"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/atoms/Button";
import { ArrowDown } from "lucide-react";

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, 100]);

    const scrollToCollection = () => {
        const instagramSection = document.getElementById("instagram-gallery");
        if (instagramSection) {
            instagramSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div ref={containerRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
            {/* Background with Parallax */}
            <motion.div
                style={{ y: y1 }}
                className="absolute inset-0 z-0"
            >
                {/* Fallback Image - Visible only when video hasn't loaded */}
                <div className={`absolute inset-0 transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-0' : 'opacity-100'}`}>
                    <Image
                        src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amV3ZWxsZXJ5fGVufDB8fDB8fHww"
                        alt="Luxury Background"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                </div>

                {/* Video Layer */}
                <video
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-60' : 'opacity-0'}`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onLoadedData={() => setIsVideoLoaded(true)}
                >
                    {/* Primary source based on user instruction (even if currently empty in dir listing, prioritization) */}
                    <source src="/video/hero.mp4" type="video/mp4" />
                    {/* Secondary source found in public root */}
                    <source src="/14766445_1920_1080_24fps.mp4" type="video/mp4" />
                </video>

                {/* Dark Gradient Overlay for text readability */}
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="mt-8"
                >
                    <Button
                        variant="outline"
                        className="gap-3 group px-8 py-4 text-base"
                        onClick={scrollToCollection}
                    >
                        <span>View Our Collection</span>
                        <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                    </Button>
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
