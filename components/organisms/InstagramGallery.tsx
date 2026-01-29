"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { InstagramIcon } from "@/components/atoms/InstagramIcon";
import { Button } from "@/components/atoms/Button";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ExternalLink, MessageCircle, X } from "lucide-react";

// Instagram configuration
const INSTAGRAM_USERNAME = "janmira.in";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_USERNAME}/`;
const INSTAGRAM_DM_URL = `https://ig.me/m/${INSTAGRAM_USERNAME}`;

// Type for Instagram post
interface InstagramPost {
    id: string;
    media_url: string;
    media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
    permalink: string;
    caption?: string;
    thumbnail_url?: string;
    timestamp: string;
}

// Video Post Component with autoplay on hover
function VideoPost({ post, onHover }: { post: InstagramPost; onHover: (hovering: boolean) => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleMouseEnter = () => {
        onHover(true);
        if (videoRef.current) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
                setIsPlaying(false);
            });
        }
    };

    const handleMouseLeave = () => {
        onHover(false);
        setIsPlaying(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <div
            className="relative w-full h-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`absolute inset-0 z-10 transition-opacity duration-300 ${isPlaying ? "opacity-0" : "opacity-100"}`}>
                <Image
                    src={post.thumbnail_url || post.media_url}
                    alt={post.caption || "Instagram video"}
                    fill
                    className="object-cover"
                />
            </div>
            <video
                ref={videoRef}
                src={post.media_url}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                loop
                playsInline
                controls={false}
                preload="metadata"
            />
        </div>
    );
}

export function InstagramGallery() {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [sliderPosition, setSliderPosition] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const controls = useAnimationControls();
    const sliderRef = useRef<HTMLDivElement>(null);
    const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);
    const touchStart = useRef<number>(0);

    // Card dimensions
    const cardWidth = 320;
    const cardGap = 24;
    const cardTotalWidth = cardWidth + cardGap;

    // Fetch items
    useEffect(() => {
        async function fetchItems() {
            try {
                const response = await fetch("/api/gallery");
                const data = await response.json();
                setPosts(data.items || []);
            } catch (error) {
                console.error("Error fetching gallery items:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchItems();
    }, []);

    const duplicatedPosts = [...posts, ...posts];
    const totalWidth = posts.length * cardTotalWidth;

    // Auto-scroll
    useEffect(() => {
        if (isLoading || posts.length === 0) return;

        const startAutoScroll = () => {
            if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);
            // Pause if modal is open (selectedIndex !== null)
            if (!isPaused && selectedIndex === null) {
                autoScrollInterval.current = setInterval(() => {
                    setSliderPosition((prev) => {
                        const newPos = prev + 1;
                        if (newPos >= totalWidth) return 0;
                        return newPos;
                    });
                }, 30);
            }
        };

        startAutoScroll();
        return () => { if (autoScrollInterval.current) clearInterval(autoScrollInterval.current); };
    }, [isPaused, isLoading, posts.length, totalWidth, selectedIndex]);

    // Slider Navigation
    const scrollLeft = useCallback(() => {
        setSliderPosition((prev) => {
            const newPos = prev - cardTotalWidth;
            return newPos < 0 ? totalWidth + newPos : newPos;
        });
    }, [cardTotalWidth, totalWidth]);

    const scrollRight = useCallback(() => {
        setSliderPosition((prev) => {
            const newPos = prev + cardTotalWidth;
            return newPos >= totalWidth ? newPos - totalWidth : newPos;
        });
    }, [cardTotalWidth, totalWidth]);

    // Modal Navigation
    const handleNext = useCallback(() => {
        setSelectedIndex((prev) => (prev !== null ? (prev + 1) % posts.length : null));
    }, [posts.length]);

    const handlePrev = useCallback(() => {
        setSelectedIndex((prev) => (prev !== null ? (prev - 1 + posts.length) % posts.length : null));
    }, [posts.length]);

    // Swipe Handling
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const diff = touchStart.current - e.changedTouches[0].clientY;
        if (Math.abs(diff) > 50) { // Threshold 50px
            if (diff > 0) handleNext(); // Swipe Up -> Next Post
            else handlePrev(); // Swipe Down -> Prev Post
        }
    };

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            if (e.key === "ArrowUp" || e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowDown" || e.key === "ArrowLeft") handlePrev();
            if (e.key === "Escape") setSelectedIndex(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, handleNext, handlePrev]);

    const currentPost = selectedIndex !== null ? posts[selectedIndex] : null;
    const nextPost = selectedIndex !== null ? posts[(selectedIndex + 1) % posts.length] : null;

    return (
        <section id="instagram-gallery" className="py-24 bg-[#030303] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
                <div className="flex items-start justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <SectionTitle title="Follow Our Journey" subtitle="@janmira.in" centered={false} />
                    </motion.div>
                    <motion.a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 text-gold hover:text-gold/80 transition-colors group mt-4"
                    >
                        <span className="text-sm uppercase tracking-wider font-light">View All</span>
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </motion.a>
                </div>
            </div>

            <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
                {!isLoading && (
                    <>
                        <button onClick={scrollLeft} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/80 hover:border-gold/50 transition-all group">
                            <ChevronLeft className="w-6 h-6 group-hover:text-gold transition-colors" />
                        </button>
                        <button onClick={scrollRight} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/80 hover:border-gold/50 transition-all group">
                            <ChevronRight className="w-6 h-6 group-hover:text-gold transition-colors" />
                        </button>
                    </>
                )}
                <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#030303] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#030303] to-transparent z-10 pointer-events-none" />
                <div
                    ref={sliderRef}
                    className="flex gap-6 px-12 md:px-24"
                    style={{ transform: !isLoading ? `translateX(-${sliderPosition}px)` : "none", transition: isPaused ? "transform 0.3s ease-out" : "none" }}
                >
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={`skeleton-${i}`} className="flex-shrink-0 w-64 md:w-80 aspect-[4/5] rounded-xl bg-white/5 animate-pulse border border-white/10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />
                            </div>
                        ))
                    ) : (
                        duplicatedPosts.map((post, index) => (
                            <motion.div
                                key={`${post.id}-${index}`}
                                onClick={() => setSelectedIndex(index % posts.length)}
                                className="relative flex-shrink-0 w-64 md:w-80 aspect-[4/5] overflow-hidden rounded-xl group cursor-pointer"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.5 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02, y: -8 }}
                            >
                                {post.media_type === "VIDEO" ? <VideoPost post={post} onHover={setIsPaused} /> : (
                                    <Image src={post.media_url} alt={post.caption || "Instagram post"} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                    <div className="bg-white/10 backdrop-blur-md rounded-full p-3 mb-4 border border-white/20"><InstagramIcon className="w-6 h-6 text-white" /></div>
                                    <p className="text-white text-sm font-light tracking-wide px-4 text-center line-clamp-2">{post.caption || "View on Instagram"}</p>
                                </div>
                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300"><InstagramIcon className="w-4 h-4 text-white" /></div>
                                {post.media_type === "VIDEO" && (
                                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-white text-xs">Video</span>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} viewport={{ once: true }} className="flex justify-center mt-12">
                <a href={INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer"><Button variant="outline" className="gap-3 group px-8 py-3"><MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" /><span>DM to Buy</span></Button></a>
            </motion.div>

            <AnimatePresence>
                {currentPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-0 md:p-8"
                        onClick={() => setSelectedIndex(null)}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Close Button */}
                        <button className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors z-[110]" onClick={() => setSelectedIndex(null)}>
                            <X className="w-8 h-8 md:w-10 md:h-10" />
                        </button>

                        {/* Desktop Right Side Controls */}
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-[110] hidden md:flex flex-col items-center gap-8">
                            <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors">
                                <ChevronUp className="w-8 h-8" />
                            </button>

                            <a href={currentPost.permalink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group flex flex-col items-center gap-2">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-orange-500 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center group-hover:bg-transparent transition-colors">
                                        <InstagramIcon className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <span className="text-white/60 text-xs tracking-widest uppercase">Open</span>
                            </a>

                            <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors">
                                <ChevronDown className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Content Container */}
                        <motion.div
                            key={currentPost.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full h-full md:max-w-xl md:aspect-[9/16] rounded-none md:rounded-xl overflow-hidden bg-black shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {currentPost.media_type === "VIDEO" ? (
                                <video src={currentPost.media_url} className="w-full h-full object-contain" autoPlay loop playsInline controls={false} />
                            ) : (
                                <Image src={currentPost.media_url} alt={currentPost.caption || "Instagram Media"} fill className="object-contain" priority />
                            )}

                            {/* Mobile Only: Bottom Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 md:hidden">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-white/60 text-xs">Swipe Up/Down to browse</span>
                                    </div>
                                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-white text-sm">
                                        <InstagramIcon className="w-4 h-4" />
                                        <span>View on App</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Preload Next Item logic */}
                        <div className="hidden">
                            {nextPost && (
                                nextPost.media_type === 'VIDEO'
                                    ? <video src={nextPost.media_url} preload="auto" />
                                    : <Image src={nextPost.media_url} alt="preload" width={1} height={1} priority />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
