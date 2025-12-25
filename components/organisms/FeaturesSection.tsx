"use client";

import { SectionTitle } from "@/components/atoms/SectionTitle";
import { motion } from "framer-motion";
import { Gem, ShieldCheck, Stars } from "lucide-react";

export function FeaturesSection() {
    const features = [
        {
            icon: Gem,
            title: "Artisan Precision",
            description: "Each piece is meticulously hand-finished, ensuring a level of detail that mass production cannot replicate.",
        },
        {
            icon: Stars,
            title: "Contemporary Heritage",
            description: "Blending modern aesthetics with timeless design principles to create future heirlooms.",
        },
        {
            icon: ShieldCheck,
            title: "Enduring Value",
            description: "Crafted from premium materials designed to stand the test of time and trends.",
        },
    ];

    return (
        <section className="py-24 px-6 md:px-12 bg-[#050505]">
            <div className="max-w-7xl mx-auto">
                <SectionTitle
                    title="The Janmira Touch"
                    subtitle="Why Choose Us"
                    centered={true}
                    className="mb-16"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.8 }}
                            className="flex flex-col items-center text-center p-8 border border-white/5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                        >
                            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6 text-gold">
                                <feature.icon size={32} strokeWidth={1} />
                            </div>
                            <h3 className="font-serif text-xl mb-4 text-white">{feature.title}</h3>
                            <p className="text-zinc-400 font-sans leading-relaxed text-sm tracking-wide">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
