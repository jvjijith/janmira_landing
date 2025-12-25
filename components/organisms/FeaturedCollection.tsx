"use client";

import { SectionTitle } from "@/components/atoms/SectionTitle";
import { ProductCard } from "@/components/molecules/ProductCard";

export function FeaturedCollection() {
    const products = [
        { title: "Eclipse Ring", price: "Coming Soon", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop" },
        { title: "Lunar Pendant", price: "Coming Soon", image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop" },
        { title: "Solaris Cuff", price: "Coming Soon", image: "https://images.unsplash.com/photo-1602751584552-8ba731f0e535?q=80&w=800&auto=format&fit=crop" },
    ];

    return (
        <section className="py-24 px-6 md:px-12 bg-[#020202]">
            <div className="max-w-7xl mx-auto">
                <SectionTitle
                    title="Signature Collection"
                    subtitle="Preview"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <ProductCard key={index} {...product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
