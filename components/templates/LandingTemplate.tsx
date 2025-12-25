"use client";

import { Navbar } from "@/components/molecules/Navbar";
import { HeroSection } from "@/components/organisms/HeroSection";
import { FeaturesSection } from "@/components/organisms/FeaturesSection";
import { BrandStory } from "@/components/organisms/BrandStory";
import { Footer } from "@/components/organisms/Footer";

export function LandingTemplate() {
    return (
        <div className="flex flex-col min-h-screen bg-black text-white selection:bg-gold/30 selection:text-gold">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <BrandStory />
            <Footer />
        </div>
    );
}
