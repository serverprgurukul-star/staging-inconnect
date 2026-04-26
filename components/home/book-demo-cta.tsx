"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { motion, Variants } from "framer-motion";

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
};

export function BookDemoCTA() {
    return (
        <section className="bg-white py-8 md:py-8 flex justify-center overflow-hidden">
            {/* Container forced to 95% to match your Nav and Product Grids */}
            <div className="w-[95%] max-w-[1440px] mx-auto">
                {/* --- MAIN HERO CTA --- */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={cardVariants}
                    className="relative group w-full overflow-hidden rounded-[10px] bg-sky-700 px-6 py-16 sm:py-28 md:py-40 text-center border border-white/5 shadow-2xl shadow-sky-950/20"
                >
                    {/* Creative Background: Adaptive for Tablet/Mobile */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/footerheroctabg.png"
                            alt=""
                            fill
                            sizes="95vw"
                            className="object-cover opacity-40 mix-blend-overlay scale-105 group-hover:scale-100 transition-transform duration-1000"
                            loading="lazy"
                        />

                        {/* Pulsing Glow - Centered for all screen sizes */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] md:w-[60%] bg-sky-500/30 rounded-[10px] blur-[80px] md:blur-[120px] animate-pulse pointer-events-none" />
                    </div>

                    <div className="relative z-10 max-w-5xl mx-auto px-2">
                        {/* Top Badge - Responsive Text Size */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-white/5 border border-sky-400/50 text-white text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-[0.2em] mb-6 md:mb-8"
                        >
                            <Sparkles size={14} className="text-sky-400" />{" "}
                            Ready to scale?
                        </motion.div>

                        {/* Main Heading - Highly Responsive tracking and leading */}
                        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.85] md:leading-[0.9] mb-8 md:mb-12">
                            One tap is <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-sky-400  font-light pb-2 inline-block">
                                all it takes
                            </span>
                        </h2>

                        {/* CTA Buttons - Vertical on Mobile, Horizontal on Tablet/Laptop */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                            <Link
                                href="/shop"
                                className="group w-full sm:w-auto flex items-center justify-center gap-3 rounded-[10px] bg-white px-8 md:px-12 py-5 text-sm md:text-md font-black text-black transition-all hover:bg-sky-400 hover:text-white hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                            >
                                Get Started{" "}
                                <ArrowRight
                                    size={20}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>

                            <Link
                                href="/book-demo"
                                className="group w-full sm:w-auto flex items-center justify-center gap-3 rounded-[10px] bg-black/40 backdrop-blur-xl border border-white/10 px-8 md:px-12 py-5 text-sm md:text-md font-bold text-white transition-all hover:bg-white/10 hover:border-white/20"
                            >
                                <Calendar size={18} className="text-sky-400" />{" "}
                                Book a Demo
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* --- OPTIONAL: MARQUEE OR LOGO STRIP COULD GO HERE TO MATCH YOUR SCREENSHOTS --- */}
            </div>
        </section>
    );
}
