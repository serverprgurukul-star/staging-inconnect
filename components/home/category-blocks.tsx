"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const categories = [
    {
        id: 1,
        name: "NFC Cards",
        tagline: "Tap once. Share everything.",
        href: "/shop?category=nfc-cards",
        cta: "Explore All",
        bgColor: "bg-[#6243CC]",
        image: "/card1.png",
    },
    {
        id: 2,
        name: "AI Review QR & Cards",
        tagline: "More reviews. More trust.",
        href: "/ai-review-card",
        cta: "Boost Reviews",
        bgColor: "bg-[#FF8026]",
        image: "https://souhaygiitgemoplvwnl.supabase.co/storage/v1/object/public/other%20images/Untitled_design_1_yl75yn.svg",
    },
    {
        id: 3,
        name: "The Smart Standees",
        tagline: "Turn footfall into connections.",
        href: "/shop?category=standees",
        cta: "View Designs",
        bgColor: "bg-[#FFBD40]",
        image: "https://souhaygiitgemoplvwnl.supabase.co/storage/v1/object/public/other%20images/Untitled_design_kcs0mj.svg",
        
    },
    {
        id: 4,
        name: "3D NFC Products",
        tagline: "Next-gen networking in 3D.",
        href: "/shop?category=3d-nfc-products",
        cta: "Shop Now",
        bgColor: "bg-[#01A48D]",
        image: "https://souhaygiitgemoplvwnl.supabase.co/storage/v1/object/public/other%20images/Untitled_design_4_uh4pmf.svg",
    },
];

export function CategoryBlocks() {
    return (
        <section className="py-8 sm:py-12 md:py-16 lg:py-20 w-full bg-white flex justify-center">
            <div className="w-[95%]">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6"
                >
                    {/* Item 1: NFC Cards */}
                    <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <Link
                            href={categories[0].href}
                            prefetch={false}
                            className={`group relative flex items-end overflow-hidden rounded-[10px] ${categories[0].bgColor} p-5 sm:p-8 lg:p-12 min-h-[180px] sm:min-h-[280px] lg:min-h-[400px] transition-all hover:shadow-2xl hover:shadow-indigo-500/20`}
                        >
                            <div className="relative z-10 max-w-[55%] sm:max-w-[50%] lg:max-w-[280px]">
                                <p className="text-white/90 font-black text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.15em] lg:tracking-[0.2em] mb-1 sm:mb-2 lg:mb-3">
                                    {categories[0].tagline}
                                </p>
                                <h3 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white leading-[0.9] tracking-tighter">
                                    {categories[0].name}
                                </h3>
                                <div className="mt-3 sm:mt-5 lg:mt-8 flex items-center gap-2 text-white font-black group-hover:gap-4 transition-all uppercase text-xs sm:text-sm tracking-widest">
                                    <span className="inline-block bg-white text-black px-4 sm:px-4 lg:px-6 py-2 sm:py-2 lg:py-3 rounded-[10px] lg:rounded-[10px] text-[9px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-widest shadow-lg transition-all hover:bg-black hover:text-white">
                                        {categories[1].cta}
                                    </span>
                                </div>
                            </div>
                            <div
                                className="absolute right-0 top-1/2 -translate-y-1/2 sm:top-auto sm:bottom-0 sm:translate-y-0 w-[45%] sm:w-[50%] lg:w-1/2 h-[80%] sm:h-[85%] lg:h-4/5 bg-contain bg-center sm:bg-right-bottom bg-no-repeat transition-transform duration-700 hover:scale-110 hover:-rotate-2"
                                style={{
                                    backgroundImage: `url('${categories[0].image}')`,
                                }}
                            />
                        </Link>
                    </motion.div>

                    {/* Item 2: AI Review */}
                    <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="col-span-1 lg:col-span-2">
                        <Link
                            href={categories[1].href}
                            prefetch={false}
                            className={`group relative flex flex-col justify-end overflow-hidden rounded-[10px] ${categories[1].bgColor} p-5 sm:p-5 lg:p-10 min-h-[180px] sm:min-h-[220px] lg:min-h-[400px] transition-all hover:shadow-2xl hover:shadow-orange-500/20`}
                        >
                            <div
                                className="absolute right-2 top-1/2 -translate-y-1/2 md:-top-8 md:translate-y-0 2xl:top-auto 2xl:bottom-16 w-[48%] sm:w-[42%] lg:w-[60%] 2xl:w-[90%] h-[72%] sm:h-[60%] lg:h-[66%] 2xl:h-[60%] bg-contain bg-center md:bg-right-top 2xl:bg-right bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                                style={{
                                    backgroundImage: `url('${categories[1].image}')`,
                                }}
                            />
                            <div className="relative z-10 max-w-[55%] sm:max-w-[60%] lg:max-w-none">
                                <p className="text-white/90 font-black text-[9px] sm:text-[9px] lg:text-xs uppercase tracking-[0.15em] lg:tracking-[0.2em] mb-1 lg:mb-3">
                                    {categories[1].tagline}
                                </p>
                                <h3 className="text-2xl sm:text-xl lg:text-4xl font-black text-white leading-[0.9] tracking-tighter">
                                    AI Review <br /> QR & Cards
                                </h3>
                            </div>
                            <div className="relative z-10 mt-3 sm:mt-3 lg:mt-6">
                                <span className="inline-block bg-white text-black px-4 sm:px-4 lg:px-6 py-2 sm:py-2 lg:py-3 rounded-[10px] lg:rounded-[10px] text-[9px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-widest shadow-lg transition-all hover:bg-black hover:text-white">
                                    {categories[1].cta}
                                </span>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Item 3: Standees */}
                    <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="col-span-1 lg:col-span-2">
                        <Link
                            href={categories[2].href}
                            prefetch={false}
                            className={`group relative flex flex-col justify-end overflow-hidden rounded-[10px] ${categories[2].bgColor} p-5 sm:p-5 lg:p-10 min-h-[180px] sm:min-h-[220px] lg:min-h-[400px] transition-all hover:shadow-2xl hover:shadow-yellow-500/20`}
                        >
                            <div
                                className="absolute right-2 top-1/2 -translate-y-1/2 md:-top-4 md:translate-y-0 2xl:top-auto 2xl:bottom-12 w-[48%] sm:w-[36%] lg:w-[54%] 2xl:w-[80%] h-[72%] sm:h-[60%] lg:h-[66%] 2xl:h-[60%] bg-contain bg-center md:bg-right-top 2xl:bg-right bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                                style={{
                                    backgroundImage: `url('${categories[2].image}')`,
                                }}
                            />
                            <div className="relative z-10 max-w-[55%] sm:max-w-[65%] lg:max-w-none">
                                <p className="text-white font-black text-[9px] sm:text-[9px] lg:text-xs uppercase tracking-[0.15em] lg:tracking-[0.2em] mb-1 lg:mb-3">
                                    {categories[2].tagline}
                                </p>
                                <h3 className="text-2xl sm:text-xl lg:text-4xl font-black text-white leading-[0.9] tracking-tighter">
                                    {categories[2].name}
                                </h3>
                            </div>
                            <div className="relative z-10 mt-3 sm:mt-3 lg:mt-6">
                                <span className="inline-block bg-white text-black px-4 sm:px-4 lg:px-6 py-2 sm:py-2 lg:py-3 rounded-[10px] lg:rounded-[10px] text-[9px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-widest shadow-lg transition-all hover:bg-black hover:text-white">
                                    {categories[2].cta}
                                </span>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Item 4: Keychains */}
                    <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <Link
                            href={categories[3].href}
                            prefetch={false}
                            className={`group relative flex items-end overflow-hidden rounded-[10px] ${categories[3].bgColor} p-5 sm:p-8 lg:p-12 min-h-[180px] sm:min-h-[280px] lg:min-h-[400px] transition-all hover:shadow-2xl hover:shadow-teal-500/20`}
                        >
                            <div className="relative z-10 max-w-[55%] sm:max-w-[50%] lg:max-w-[300px]">
                                <p className="text-white/90 font-black text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.15em] lg:tracking-[0.2em] mb-1 sm:mb-2 lg:mb-3">
                                    {categories[3].tagline}
                                </p>
                                <h3 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white leading-[0.9] tracking-tighter">
                                    {categories[3].name}
                                </h3>
                                <div className="mt-3 sm:mt-5 lg:mt-8">
                                    <span className="inline-block bg-white text-black px-5 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-[10px] lg:rounded-[10px] text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg transition-all hover:bg-black hover:text-white">
                                        {categories[3].cta}
                                    </span>
                                </div>
                            </div>
                            <div
                                className="absolute right-0 top-1/2 -translate-y-1/2 sm:top-auto sm:bottom-0 sm:translate-y-0 w-[45%] sm:w-[50%] lg:w-1/2 h-[80%] sm:h-[75%] lg:h-3/5 bg-contain bg-center sm:bg-right-bottom bg-no-repeat transition-transform duration-700 group-hover:scale-125"
                                style={{
                                    backgroundImage: `url('${categories[3].image}')`,
                                }}
                            />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
