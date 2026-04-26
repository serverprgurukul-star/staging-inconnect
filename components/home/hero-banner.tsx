"use client";
import Link from "next/link";
import Image from "next/image";
import { Smartphone, MessageSquare, Share2, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  { icon: Smartphone, label: "Tap card" }, // Shortened for mobile
  { icon: MessageSquare, label: "AI writes" },
  { icon: Share2, label: "Publish" },
];

export function HeroBanner() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <section
      ref={containerRef}
      className="relative flex justify-center bg-slate-100 overflow-hidden"
    >
      {/* Container: Adjusted margin and min-height for mobile */}
      <motion.div className="relative w-full md:w-[95%] mx-2 md:mx-6 my-4 min-h-[auto] md:min-h-[750px] rounded-3xl overflow-hidden bg-[#592fe5] flex flex-col justify-center">
        {/* --- PREMIUM MESH BACKGROUND --- */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-sky-400/20 rounded-[10px] blur-[120px] md:blur-[190px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-blue-400/40 rounded-[10px] blur-[80px] md:blur-[100px]" />

          <motion.div
            style={{ y: y2 }}
            className="absolute bottom-10 left-[5%] opacity-10"
          >
            <img
              src="/Group.svg"
              alt=""
              className="w-48 h-48 md:w-96 md:h-96 blur-xs"
            />
          </motion.div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center h-full py-12 md:py-20">
          {/* --- LEFT CONTENT --- */}
          <div className="flex-[1.2] px-6 sm:px-12 lg:pl-16 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center justify-center lg:justify-start gap-3 mb-6"
            >
              <span className="hidden sm:block w-12 h-[1px] bg-white" />
              <span className="text-white font-bold tracking-[0.2em] md:tracking-[0.3em] text-sm md:text-lg uppercase">
                Future of Reviews
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9]"
            >
              instant{" "}
              <span className="italic font-light text-indigo-200">UP!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 md:mt-8 text-lg md:text-xl text-white/90 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              The AI review engine that turns a{" "}
              <span className="text-white">simple tap</span> into a{" "}
              <span className="text-white">digital legacy.</span>
            </motion.p>

            {/* Steps: Responsive Grid/Flex */}
            <div className="mt-10 md:mt-12 flex flex-wrap justify-center lg:justify-start gap-6 md:gap-10">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="group flex flex-col items-center gap-2 md:gap-3"
                >
                  <div className="relative h-14 w-14 md:h-18 md:w-18 rounded-[10px] border-2 md:border-4 border-white/20 flex items-center justify-center bg-white text-black transition-all group-hover:border-indigo-400">
                    <step.icon size={20} className="md:w-6 md:h-6" />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/80">
                    {step.label}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 md:mt-16"
            >
              <Link
                href="/ai-review-card"
                className="group relative inline-flex items-center justify-center gap-4 bg-white text-black px-8 md:px-10 py-4 md:py-5 rounded-[10px] font-black text-xs md:text-sm uppercase tracking-widest transition-all hover:bg-sky-400 hover:text-white w-full sm:w-auto"
              >
                Start Growing
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </div>

          {/* --- RIGHT CONTENT: IMAGE --- */}
          <motion.div
            className="flex-1 relative flex justify-center items-center mt-12 lg:mt-0 w-full px-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <div className="relative w-full max-w-[320px] md:max-w-[450px] aspect-square">
              {/* Glow effect slightly smaller on mobile */}
              <div className="absolute inset-0 bg-sky-500/20 blur-[80px] md:blur-[150px] rounded-[10px]" />

              <Image
                src="/hero-mockup.png"
                alt="AI Review Mockup"
                fill
                priority
                sizes="(max-width: 768px) 320px, 450px"
                className="object-contain z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
