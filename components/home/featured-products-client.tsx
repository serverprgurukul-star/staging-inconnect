"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types/database";

interface FeaturedProductsClientProps {
    products: Product[];
}

export function FeaturedProductsClient({
    products,
}: FeaturedProductsClientProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const mobileSliderRef = useRef<HTMLDivElement>(null);

    const totalItems = products.length + 1; // +1 for promo card
    const showArrows = totalItems > 3;
    const maxIndex = Math.max(0, totalItems - 3);

    const scrollToIndex = (index: number) => {
        if (sliderRef.current) {
            const cardWidth =
                sliderRef.current.scrollWidth / (products.length + 1);
            sliderRef.current.scrollTo({
                left: cardWidth * index,
                behavior: "smooth",
            });
        }
        setCurrentIndex(index);
    };

    const handlePrev = () => {
        const newIndex = Math.max(0, currentIndex - 1);
        scrollToIndex(newIndex);
    };

    const handleNext = () => {
        const newIndex = Math.min(maxIndex, currentIndex + 1);
        scrollToIndex(newIndex);
    };

    const scrollMobile = (direction: "left" | "right") => {
        if (mobileSliderRef.current) {
            const scrollAmount = mobileSliderRef.current.clientWidth * 0.85;
            mobileSliderRef.current.scrollBy({
                left: direction === "right" ? scrollAmount : -scrollAmount,
                behavior: "smooth",
            });
        }
    };

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="bg-white -mt-24 sm:-mt-24">
            <div className="flex justify-center">
                <section className="relative z-10 w-[95%] rounded-t-[12px] bg-white px-4 py-6 sm:px-6 sm:py-8">
                    {/* HEADER */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 flex flex-col text-center gap-2 sm:flex-row sm:items-end sm:justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                                <span className="hidden sm:block h-px w-8 bg-sky-400" />
                                <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] text-sky-400">
                                    Our most popular smart products
                                </span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tighter leading-[0.9]">
                                This week&apos;s{" "}
                                <span className="text-zinc-400">hot deals.</span>
                            </h2>
                        </div>

                        <div className="hidden sm:flex items-center gap-3">
                            {showArrows && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrev}
                                        disabled={currentIndex === 0}
                                        className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-zinc-300 bg-white text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        disabled={currentIndex >= maxIndex}
                                        className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-zinc-300 bg-white text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            )}

                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 rounded-[10px] bg-zinc-900 px-5 py-2.5 text-lg md:text-lg font-medium text-white hover:bg-zinc-800"
                            >
                                Explore all products
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* DESKTOP SLIDER - Fixed 280px card width */}
                    <div className="hidden sm:block relative">
                        <div
                            ref={sliderRef}
                            className="flex items-stretch gap-4 overflow-x-auto scroll-smooth no-scrollbar"
                            style={{
                                scrollSnapType: showArrows ? "none" : "x mandatory",
                            }}
                        >
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="w-[280px] lg:w-[300px] xl:w-[320px] flex-shrink-0"
                                    style={{ scrollSnapAlign: "start" }}
                                >
                                    <ProductCard product={product} tag="Featured" />
                                </div>
                            ))}

                            {/* Promo Banner */}
                            <div className="w-[280px] lg:w-[300px] xl:w-[320px] flex-shrink-0">
                                <PromoCard />
                            </div>
                        </div>
                    </div>

                    {/* MOBILE SLIDER */}
                    <div className="sm:hidden relative">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <button
                                onClick={() => scrollMobile("left")}
                                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-zinc-300 bg-white text-zinc-700 transition active:bg-zinc-100"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => scrollMobile("right")}
                                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-zinc-300 bg-white text-zinc-700 transition active:bg-zinc-100"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>

                        <div
                            ref={mobileSliderRef}
                            className="flex items-stretch gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 no-scrollbar"
                        >
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="w-[85vw] snap-center flex-shrink-0"
                                >
                                    <ProductCard product={product} tag="Featured" />
                                </div>
                            ))}

                            <div className="w-[85vw] snap-center flex-shrink-0">
                                <PromoCard />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 rounded-[10px] bg-zinc-900 px-6 py-3 text-base font-medium text-white"
                            >
                                Explore all products
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

function PromoCard() {
    return (
        <div className="relative w-full h-full overflow-hidden rounded-[20px]">
            {/* Background Image */}
            <Image
                src="/PROMOCARDBG.png"
                alt=""
                fill
                sizes="(max-width: 640px) 85vw, 320px"
                className="object-cover"
                loading="lazy"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
                <div className="leading-none flex justify-end items-end">
                    <span className="text-[60px] lg:text-[80px] font-extrabold tracking-tight">
                        33
                    </span>
                    <div className="flex flex-col items-start mb-2">
                        <span className="align-top text-2xl lg:text-3xl font-bold">%</span>
                        <div className="-mt-2 text-3xl lg:text-4xl font-extrabold">OFF</div>
                    </div>
                </div>

                <h3 className="mt-4 text-2xl lg:text-3xl font-extrabold">Instant</h3>
                <h3 className="mt-1 text-2xl lg:text-3xl font-extrabold">Discount</h3>

                <button className="mt-6 rounded-[10px] bg-white px-8 py-2.5 text-base font-semibold text-zinc-900 transition hover:bg-zinc-100">
                    Shop now
                </button>
            </div>
        </div>
    );
}
