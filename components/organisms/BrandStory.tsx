"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/atoms/SectionTitle";

export function BrandStory() {
    return (
        <section className="relative w-full min-h-[80vh] flex flex-col md:flex-row bg-zinc-950">
            {/* Left Column: Image */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="w-full md:w-1/2 relative h-[50vh] md:h-auto overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent z-10 pointer-events-none" />
                <Image
                    src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8amV3ZWxsZXJ5fGVufDB8fDB8fHww"
                    alt="Janmira Craftsmanship"
                    fill
                    className="object-cover"
                />
            </motion.div>

            {/* Right Column: Content */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-16 md:py-0">
                <SectionTitle
                    title="The Legacy"
                    subtitle="About Janmira"
                    centered={false}
                    className="mb-8"
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="space-y-6 text-zinc-400 leading-relaxed font-light text-lg"
                >
                    <p>
                        Janmira is more than jewellery; it is an artifact of your personal history.
                        Born from a desire to merge timeless elegance with contemporary edge, we
                        craft pieces that do not just adorn, but empower.
                    </p>
                    <p>
                        Our "Jet Black" aesthetic represents depth, mystery, and infinite potential,
                        while our signature nuances of Champagne Gold illuminate the path of your unique legacy.
                    </p>
                    <p className="text-gold font-serif italic text-xl pt-4 border-l-2 border-gold/30 pl-6">
                        "Wear your story. Shine your legacy."
                    </p>

                    <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3 text-white/90">
                            <span className="w-2 h-2 rounded-full bg-gold" />
                            <span className="uppercase tracking-widest text-sm">Delivery all over India</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/90">
                            <span className="w-2 h-2 rounded-full bg-gold" />
                            <span className="uppercase tracking-widest text-sm">No COD (Cash on Delivery)</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
