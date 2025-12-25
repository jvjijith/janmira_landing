import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/atoms/Button";

interface ProductCardProps {
    title: string;
    price: string;
    image: string;
}

export function ProductCard({ title, price, image }: ProductCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-[#050505] overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-500"
        >
            <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />

                {/* Shimmer effect overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:animate-shimmer" />
            </div>

            <div className="p-6 text-center z-10 relative">
                <h3 className="font-serif text-xl mb-2 text-white group-hover:text-gold transition-colors">{title}</h3>
                <p className="font-sans text-stone-400 text-sm tracking-widest mb-4">{price}</p>
                <Button variant="outline" className="w-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    View Detail
                </Button>
            </div>
        </motion.div>
    );
}
