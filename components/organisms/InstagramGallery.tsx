"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { InstagramIcon } from "@/components/atoms/InstagramIcon";
import { Button } from "@/components/atoms/Button";
import { ChevronLeft, ChevronRight, ExternalLink, MessageCircle } from "lucide-react";

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
                // Autoplay might be blocked or failed
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
            {/* Thumbnail/poster image - only hide when actually playing */}
            <div className={`absolute inset-0 z-10 transition-opacity duration-300 ${isPlaying ? "opacity-0" : "opacity-100"}`}>
                <Image
                    src={post.thumbnail_url || post.media_url}
                    alt={post.caption || "Instagram video"}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Video element */}
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
    const controls = useAnimationControls();
    const sliderRef = useRef<HTMLDivElement>(null);
    const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);

    // Card dimensions
    const cardWidth = 320; // w-80 = 20rem = 320px
    const cardGap = 24; // gap-6 = 1.5rem = 24px
    const cardTotalWidth = cardWidth + cardGap;

    // Fetch gallery items from Google Drive
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

    // Duplicate posts for seamless infinite scroll
    const duplicatedPosts = [...posts, ...posts];
    const totalWidth = posts.length * cardTotalWidth;

    // Auto-scroll animation
    useEffect(() => {
        if (isLoading || posts.length === 0) return;

        const startAutoScroll = () => {
            if (autoScrollInterval.current) {
                clearInterval(autoScrollInterval.current);
            }

            if (!isPaused) {
                autoScrollInterval.current = setInterval(() => {
                    setSliderPosition((prev) => {
                        const newPos = prev + 1;
                        // Reset when we've scrolled through the first set
                        if (newPos >= totalWidth) {
                            return 0;
                        }
                        return newPos;
                    });
                }, 30); // Smooth auto-scroll
            }
        };

        startAutoScroll();

        return () => {
            if (autoScrollInterval.current) {
                clearInterval(autoScrollInterval.current);
            }
        };
    }, [isPaused, isLoading, posts.length, totalWidth]);

    // Manual navigation
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

    return (
        <section id="instagram-gallery" className="py-24 bg-[#030303] overflow-hidden">
            {/* Header with View All */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
                <div className="flex items-start justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <SectionTitle
                            title="Follow Our Journey"
                            subtitle="@janmira.in"
                            centered={false}
                        />
                    </motion.div>

                    {/* View All Link */}
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

            {/* Slider Container */}
            <div
                className="relative"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Navigation Arrows */}
                {!isLoading && (
                    <>
                        <button
                            onClick={scrollLeft}
                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/80 hover:border-gold/50 transition-all group"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-6 h-6 group-hover:text-gold transition-colors" />
                        </button>

                        <button
                            onClick={scrollRight}
                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/80 hover:border-gold/50 transition-all group"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-6 h-6 group-hover:text-gold transition-colors" />
                        </button>
                    </>
                )}

                {/* Gradient Edges */}
                <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#030303] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#030303] to-transparent z-10 pointer-events-none" />

                {/* Slider Track */}
                <div
                    ref={sliderRef}
                    className="flex gap-6 px-12 md:px-24"
                    style={{
                        transform: !isLoading ? `translateX(-${sliderPosition}px)` : "none",
                        transition: isPaused ? "transform 0.3s ease-out" : "none",
                    }}
                >
                    {isLoading ? (
                        // Skeleton Loading State
                        Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={`skeleton-${i}`}
                                className="flex-shrink-0 w-64 md:w-80 aspect-[4/5] rounded-xl bg-white/5 animate-pulse border border-white/10 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />
                                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                                    <div className="h-4 bg-white/10 rounded w-3/4" />
                                    <div className="h-3 bg-white/10 rounded w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : (
                        duplicatedPosts.map((post, index) => (
                            <motion.a
                                key={`${post.id}-${index}`}
                                href={post.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative flex-shrink-0 w-64 md:w-80 aspect-[4/5] overflow-hidden rounded-xl group cursor-pointer"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.5 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02, y: -8 }}
                            >
                                {/* Image or Video */}
                                {post.media_type === "VIDEO" ? (
                                    <VideoPost post={post} onHover={setIsPaused} />
                                ) : (
                                    <Image
                                        src={post.media_url}
                                        alt={post.caption || "Instagram post"}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                                {/* Content on Hover */}
                                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                    <div className="bg-white/10 backdrop-blur-md rounded-full p-3 mb-4 border border-white/20">
                                        <InstagramIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-white text-sm font-light tracking-wide px-4 text-center line-clamp-2">
                                        {post.caption || "View on Instagram"}
                                    </p>
                                </div>

                                {/* Corner Instagram Badge */}
                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                    <InstagramIcon className="w-4 h-4 text-white" />
                                </div>

                                {/* Video indicator */}
                                {post.media_type === "VIDEO" && (
                                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-white text-xs">Video</span>
                                    </div>
                                )}
                            </motion.a>
                        ))
                    )}
                </div>
            </div>

            {/* DM to Buy Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                viewport={{ once: true }}
                className="flex justify-center mt-12"
            >
                <a href={INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-3 group px-8 py-3">
                        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>DM to Buy</span>
                    </Button>
                </a>
            </motion.div>
        </section>
    );
}
