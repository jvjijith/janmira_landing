"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { InstagramIcon } from "@/components/atoms/InstagramIcon";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-500",
                scrolled ? "bg-black/90 backdrop-blur-md py-3 border-b border-white/10" : "bg-transparent"
            )}
        >
            <Link href="/" className="relative z-10 block">
                {/* Placeholder for small logo if needed, or just text if main logo is in hero */}
                <div className={cn("relative w-32 h-10 transition-opacity duration-300", scrolled ? "opacity-100" : "opacity-0 invisible")}>
                    <Image
                        src="/janmira-logo.png"
                        alt="JANMIRA"
                        fill
                        className="object-contain"
                    />
                </div>
            </Link>

            <div className="flex items-center gap-4">
                <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gold transition-colors duration-300"
                >
                    <InstagramIcon className="w-6 h-6" />
                </a>
            </div>
        </nav>
    );
}
