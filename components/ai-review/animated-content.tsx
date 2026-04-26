"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Check,
    X,
    Smartphone,
    MessageSquare,
    Star,
    TrendingUp,
    Sparkles,
    Zap,
} from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { ProductCard } from "@/components/products/product-card";
import { BookDemoCTA } from "@/components/home/book-demo-cta";
import type { Product } from "@/types/database";

interface AIReviewAnimatedContentProps {
    products: Product[];
}

const problems = [
    "Customers forget to leave reviews",
    "Review links are ignored",
    "Feedback is short or low quality",
    "Hard to get consistent reviews",
];

const solutions = [
    "One tap opens AI-powered review",
    "Smart prompts guide customers",
    "AI writes detailed, helpful reviews",
    "Automatic follow-ups boost response",
];

const howItWorksSteps = [
    {
        number: "01",
        icon: Smartphone,
        title: "Customer Taps Card",
        description: "Place the AI Review Card at checkout. Customer taps with their phone.",
    },
    {
        number: "02",
        icon: MessageSquare,
        title: "AI Guides Review",
        description: "Smart prompts help customers express their experience in detail.",
    },
    {
        number: "03",
        icon: Star,
        title: "Review Goes Live",
        description: "One click posts the AI-crafted review directly to Google.",
    },
    {
        number: "04",
        icon: TrendingUp,
        title: "Business Grows",
        description: "More reviews mean better visibility and customer trust.",
    },
];

const benefits = [
    {
        icon: Sparkles,
        title: "AI-Powered",
        description: "Smart AI crafts authentic, detailed reviews from simple prompts.",
    },
    {
        icon: Zap,
        title: "Instant Setup",
        description: "Ready to use in minutes. No technical knowledge required.",
    },
    {
        icon: Star,
        title: "5-Star Reviews",
        description: "Guide happy customers to leave glowing, detailed reviews.",
    },
    {
        icon: TrendingUp,
        title: "Business Growth",
        description: "More reviews = better Google ranking = more customers.",
    },
];

const faqs = [
    {
        question: "What is an AI Review Card?",
        answer: "An AI Review Card is an NFC-enabled card that customers tap to instantly open an AI-powered review interface. The AI helps them write detailed, authentic reviews based on their experience.",
    },
    {
        question: "How does the AI help write reviews?",
        answer: "When customers tap the card, they answer a few simple questions about their experience. The AI then generates a detailed, natural-sounding review that they can edit and post with one click.",
    },
    {
        question: "Which devices support the AI Review Card?",
        answer: "All NFC-enabled smartphones work - that includes iPhone XR and newer, plus most Android phones from the last 5 years. For older phones, there's also a QR code option.",
    },
    {
        question: "Can I customize the review prompts?",
        answer: "Yes! You can customize the questions and prompts to focus on aspects of your business that matter most - service quality, specific products, ambiance, and more.",
    },
    {
        question: "Where do the reviews get posted?",
        answer: "Reviews are posted directly to your Google Business Profile, helping you rank higher on Google Maps and local search.",
    },
    {
        question: "How quickly can I start collecting reviews?",
        answer: "Once you receive your AI Review Card, setup takes less than 10 minutes. You can start collecting reviews the same day.",
    },
];

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export function AIReviewAnimatedContent({ products }: AIReviewAnimatedContentProps) {
    return (
      <div className="overflow-x-hidden" style={{ backgroundColor: "#F4F4F4" }}>
         {/* Hero - Same style as homepage and AI Review */}
            <section className="px-[6px] pb-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden rounded-b-[10px]"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://souhaygiitgemoplvwnl.supabase.co/storage/v1/object/public/other%20images/IMG_0303_e6l9fd.jpg')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/90 to-black/40" />

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6">
                       

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-3 sm:mt-4 text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white max-w-xs sm:max-w-lg md:max-w-3xl"
                        >
                            Stop Losing Customers — Get More Google Reviews with AI
                        </motion.h1>
                         <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center mt-4 text-xs sm:text-sm md:text-base text-white/70 max-w-xs sm:max-w-md md:max-w-2xl"
                        >
                            The Old Way / The AI Way" Section Heading : Why Traditional Reviews Don't Work
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-5 sm:mt-6 md:mt-8 flex flex-wrap justify-center gap-3"
                        >
                            <Link
                              prefetch={false}
                                href="/shop"
                                className="rounded-[10px] bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
                            >
                                Shop Now
                            </Link>
                            <Link
                              prefetch={false}
                                href="/book-demo"
                                className="rounded-[10px] bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                            >
                                Book a Demo
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

        {/* Problem vs Solution - Redesigned */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto w-[95%]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="text-center mb-10 sm:mb-12"
            >
              <span className="text-xs sm:text-sm font-medium text-sky-400 uppercase tracking-wide">
                The Problem & Solution
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tighter">
                Reviews are <span className="text-zinc-400">broken.</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-zinc-500 max-w-xl mx-auto">
                Traditional review collection doesn&apos;t work. Here&apos;s how AI
                changes everything.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-4">
              {/* Problems */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-[10px] bg-zinc-200 p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <h3 className="text-lg font-bold text-zinc-900">
                    The Old Way
                  </h3>
                </div>
                <div className="space-y-3">
                  {problems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 bg-white/50 rounded-[10px] px-4 py-3"
                    >
                      <X className="h-4 w-4 text-red-500 shrink-0" />
                      <span className="text-sm text-zinc-700">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Solutions */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-[10px] bg-black p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-3 w-3 rounded-full bg-sky-400" />
                  <h3 className="text-lg font-bold text-white">The AI Way</h3>
                </div>
                <div className="space-y-3">
                  {solutions.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 bg-white/10 rounded-[10px] px-4 py-3"
                    >
                      <Check className="h-4 w-4 text-sky-400 shrink-0" />
                      <span className="text-sm text-zinc-300">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works - Redesigned */}
        <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="mx-auto w-[95%]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="mb-10 sm:mb-12"
            >
              <span className="text-xs sm:text-sm font-medium text-sky-400 uppercase tracking-wide">
                How It Works
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tighter">
                Four simple <span className="text-zinc-400">steps.</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="group relative bg-slate-50 rounded-[10px] p-6 hover:bg-black transition-colors duration-300"
                >
                  <span className="text-5xl sm:text-6xl font-black text-black group-hover:text-zinc-800 transition-colors">
                    {step.number}
                  </span>
                  <div className="mt-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-sky-100 group-hover:bg-sky-400 transition-colors">
                      <step.icon className="h-5 w-5 text-sky-500 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="mt-3 text-base sm:text-lg font-bold text-zinc-900 group-hover:text-white transition-colors">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {products.length > 0 && (
          <section id="products" className="py-12 sm:py-16 lg:py-20 bg-white">
            <div className="mx-auto w-[95%]">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10"
              >
                <div>
                  <span className="text-xs sm:text-sm font-medium text-sky-400 uppercase tracking-wide">
                    Featured Products
                  </span>
                  <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tighter">
                    You might <span className="text-zinc-400">also like.</span>
                  </h2>
                </div>
                <Link
                  prefetch={false}
                  href="/shop"
                  className="group flex items-center gap-3 rounded-[10px] bg-black px-6 py-3 sm:px-8 sm:py-4 text-sm font-bold text-white transition-all hover:bg-sky-500 w-fit"
                >
                  View All
                </Link>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6"
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={fadeInUp}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} noBg tag="Featured" />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* Benefits Grid */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto w-[95%]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="text-center mb-10 sm:mb-12"
            >
              <span className="text-xs sm:text-sm font-medium text-sky-400 uppercase tracking-wide">
                Benefits
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tighter">
                Why businesses <span className="text-zinc-400">love it.</span>
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  transition={{ duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-[10px] p-5 sm:p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-black">
                    <benefit.icon className="h-5 w-5 text-sky-400" />
                  </div>
                  <h3 className="mt-4 font-semibold text-zinc-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-zinc-500">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto w-[95%] max-w-3xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="text-center mb-10 sm:mb-12"
            >
              <span className="text-xs sm:text-sm font-medium text-sky-400 uppercase tracking-wide">
                FAQ
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tighter">
                Frequently Asked Questions <span className="text-zinc-400">- NFC Cards India
.</span>
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-3"
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  transition={{ duration: 0.3 }}
                >
                  <Accordion title={faq.question}>
                    <p className="text-sm text-zinc-600">{faq.answer}</p>
                  </Accordion>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Footer CTA */}
        <BookDemoCTA />
      </div>
    );
}
