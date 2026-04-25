"use client";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";
import type { Testimonial } from "@/types/database";

interface TestimonialsSectionClientProps {
    testimonials: Testimonial[];
}

export function TestimonialsSectionClient({ testimonials }: TestimonialsSectionClientProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo =
                direction === "left"
                    ? scrollLeft - clientWidth
                    : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    return (
        <section className="bg-white py-12 sm:py-14 pb-0 md:pb-12 overflow-hidden">
            <div className="mx-auto w-[95%]">
                {/* Header Section */}
                <div className="mb-10 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center sm:justify-start gap-2 mb-3"
                        >
                            <span className="hidden sm:block h-px w-8 bg-sky-400" />
                            <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] text-sky-400">
                                Real Reviews from India
                            </span>
                        </motion.div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tighter leading-[0.9]">
                            What Our Customers Say
                        </h2>
                    </div>

                    {/* Navigation Controls */}
                    <div className="mt-8 flex gap-3 sm:mt-0">
                        <button
                            onClick={() => scroll("left")}
                            className="group flex h-14 w-14 items-center justify-center rounded-[10px] border border-zinc-100 bg-white hover:border-sky-400 transition-all"
                        >
                            <ChevronLeft className="h-6 w-6 text-zinc-400 group-hover:text-sky-400" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="group flex h-14 w-14 items-center justify-center rounded-[10px] bg-black hover:bg-sky-400 transition-all shadow-xl shadow-sky-400/10"
                        >
                            <ChevronRight className="h-6 w-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Testimonials Slider */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-10"
                >
                    {testimonials.map((testimonial) => (
                        <motion.div
                            key={testimonial.id}
                            className="relative flex-none w-[85%] sm:w-[45%] lg:w-[30.5%] aspect-[3/4] sm:aspect-square snap-center overflow-hidden rounded-[10px] group"
                        >
                            {/* Image with Darkening Overlay */}
                            <Image
                                src={testimonial.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop"}
                                alt={testimonial.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Sophisticated Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                            {/* Content Overlay */}
                            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between z-10">
                                <div className="flex justify-between items-start">
                                    <div className="bg-sky-400 p-1.5 sm:p-2 rounded-[10px]">
                                        <Quote size={14} className="text-white fill-white sm:w-4 sm:h-4" />
                                    </div>
                                </div>

                                <div>
                                    {/* <p className="text-sm sm:text-lg lg:text-md font-medium text-white leading-snug tracking-tight mb-3 sm:mb-4 line-clamp-5 sm:line-clamp-none">
                                        &ldquo;{testimonial.content}&rdquo;
                                    </p> */}

                                    <div className="pt-3 sm:pt-4 border-t pr-2 backdrop-blur-xl border-none rounded-[10px] pb-1 sm:pb-2 flex items-center gap-2 sm:gap-3">
                                        <div className="w-1 h-6 sm:h-8 bg-sky-400 rounded-[10px]" />
                                        <div>
                                            <div className="flex justify-between items-center ">
                                            <p className="text-xs sm:text-sm font-bold text-white uppercase tracking-widest">
                                                {testimonial.name}
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-zinc-200">
                                                {testimonial.role || testimonial.company || "Customer"}
                                            </p>
                                        </div>
                                            <p className="text-[10px] mt-1 sm:text-xs  font-semibold text-zinc-200">
                                                {testimonial.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
