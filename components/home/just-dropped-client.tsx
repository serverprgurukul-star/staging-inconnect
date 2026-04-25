"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types/database";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

interface JustDroppedClientProps {
    heroProduct: Product | null;
    products: Product[];
}

const announcements = [
    {
        text: "AI Review QR Cards now live in Udaipur",
        badge: "New",
        color: "text-sky-400",
    },
    {
        text: "Custom business profiles updated",
        badge: "Update",
        color: "text-emerald-400",
    },
    {
        text: "NFC Standees shipping nationwide",
        badge: "Live",
        color: "text-sky-400",
    },
];

export function JustDroppedClient({ heroProduct, products }: JustDroppedClientProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scroll = scrollRef.current;
        if (!scroll) return;
        let animationId: number;
        let position = 0;
        const animate = () => {
            position -= 0.8;
            if (position <= -scroll.scrollWidth / 2) position = 0;
            scroll.style.transform = `translateX(${position}px)`;
            animationId = requestAnimationFrame(animate);
        };
        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, []);

    // If no hero product and no products, don't render
    if (!heroProduct && (!products || products.length === 0)) {
        return null;
    }

    // Use hero product for the main card, or fall back to first product
    const mainProduct = heroProduct || products[0];
    // Side products are the passed products (already excludes hero from server)
    const sideProducts = heroProduct ? products.slice(0, 2) : products.slice(1, 3);

    const discount = calculateDiscount(mainProduct.price, mainProduct.compare_at_price);
    const hasVideo = mainProduct.hero_video_url;

    return (
        <section className="bg-slate-100 py-16">
            <div className="mx-auto w-[95%]">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 flex flex-col gap-6 md:flex-row items-center md:items-end md:justify-between"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="md:block hidden h-px w-8 bg-sky-400" />
                            <span className="md:block hidden text-md font-black uppercase tracking-[0.2em] text-sky-400">
                                New Arrivals
                            </span>
                        </div>
                        <h2 className="text-3xl font-black text-black tracking-tighter leading-[0.9] sm:text-5xl">
                           NFC Cards & Smart Products. {" "}
                        
                        </h2>
                    </div>
                    <Link
                        href="/shop"
                        className="group flex items-center gap-3 rounded-[10px] bg-black px-8 py-4 text-sm font-black text-white transition-all hover:bg-sky-500 hover:scale-105"
                    >
                        Explore all products{" "}
                        <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </Link>
                </motion.div>

                {/* Products Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={staggerContainer}
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {/* Large Product Card - Hero with Video */}
                    <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="sm:col-span-2 h-full">
                    <Link
                        href={`/product/${mainProduct.slug}`}
                        className="group relative block aspect-[4/5] lg:aspect-auto h-full overflow-hidden rounded-[10px]"
                    >
                        {/* Video or Image Background */}
                        {hasVideo ? (
                            <video
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="metadata"
                            >
                                <source src={mainProduct.hero_video_url!} type="video/mp4" />
                            </video>
                        ) : (
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{
                                    backgroundImage: `url('${mainProduct.images[0] || "/placeholder-product.jpg"}')`,
                                }}
                            />
                        )}
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {/* Product Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                            <div className="rounded-[10px] bg-black/50 backdrop-blur-md p-4">
                                <h3 className="truncate font-semibold text-white text-md md:text-xl">
                                    {mainProduct.name}
                                </h3>
                                <p className="hidden  text-sm text-white/70 sm:block mt-1">
                                    {mainProduct.short_description}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span className="font-bold text-white text-lg">
                                        ₹{mainProduct.price.toLocaleString()}
                                    </span>
                                    {mainProduct.compare_at_price && (
                                        <span className="text-sm text-white/50 line-through">
                                            ₹{mainProduct.compare_at_price.toLocaleString()}
                                        </span>
                                    )}
                                    {discount > 0 && (
                                        <span className="rounded bg-teal-500 px-2 py-0.5 text-xs font-semibold text-white">
                                            {discount}% OFF
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                    </motion.div>

                    {/* Right Side - Smaller Cards using ProductCard */}
                    {sideProducts.map((product) => (
                        <motion.div key={product.id} variants={fadeInUp} transition={{ duration: 0.5 }} className="h-full">
                            <ProductCard product={product} tag="New" />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Premium Ticker */}
                <div className="mt-12 relative h-16 w-full overflow-hidden rounded-[10px] bg-[#e62e39] border border-none flex items-center shadow-2xl">
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#e62e39] to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#e62e39] to-transparent z-10" />

                    <div
                        ref={scrollRef}
                        className="flex items-center whitespace-nowrap"
                    >
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center">
                                {announcements.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-4 mx-12"
                                    >
                                        <Sparkles
                                            size={16}
                                            className="text-white"
                                        />
                                        <span className="text-[14px] font-black uppercase tracking-[0.2em] text-white">
                                            [{item.badge}]
                                        </span>
                                        <span className="text-md font-black text-white/90 tracking-tight">
                                            {item.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/shop"
                        className="absolute right-0 z-20 h-full flex items-center bg-[#e62e39] px-8 text-sm font-black text-white hover:bg-white hover:text-black transition-all"
                    >
                        VIEW ALL
                    </Link>
                </div>
            </div>
        </section>
    );
}
