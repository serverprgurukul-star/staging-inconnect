"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    Smartphone,
    Globe,
    CheckCircle,
    Zap,
    Users,
    BarChart3,
    Leaf,
    Shield,
    CreditCard,
    ArrowRight,
    X,
} from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { BookDemoCTA } from "@/components/home/book-demo-cta";

const steps = [
    {
        number: "01",
        icon: CreditCard,
        title: "Choose Your Product",
        description:
            "Select from our range of NFC cards, QR codes, standees, keychains, or table tents.",
        image: "https://souhaygiitgemoplvwnl.supabase.co/storage/v1/object/public/other%20images/Photo_1_pglrg1.jpg",
    },
    {
        number: "02",
        icon: Smartphone,
        title: "Set Up Your Profile",
        description:
            "Create your digital profile with contact details, social links, portfolio, and more.",
        image: "/setup.jpg",
    },
    {
        number: "03",
        icon: Globe,
        title: "Share Instantly",
        description:
            "Tap your NFC product against any smartphone to instantly share your profile.",
        image: "tap.jpg",
    },
];

const features = [
    {
        icon: Zap,
        title: "Instant Sharing",
        description: "Share your contact in under a second with a simple tap.",
    },
    {
        icon: Smartphone,
        title: "No App Required",
        description: "Works with all modern smartphones out of the box.",
    },
    {
        icon: Users,
        title: "Unlimited Contacts",
        description: "Share with as many people as you want, no limits.",
    },
    {
        icon: BarChart3,
        title: "Analytics Dashboard",
        description: "Track views, taps, and engagement with detailed analytics.",
    },
    {
        icon: Leaf,
        title: "Eco-Friendly",
        description: "Replace hundreds of paper cards with one NFC card.",
    },
    {
        icon: Shield,
        title: "Secure & Private",
        description: "Your data is encrypted and you control what's shared.",
    },
];

const traditionalProblems = [
    "Get lost or thrown away",
    "Can't be updated once printed",
    "Wasteful and not eco-friendly",
    "Limited information space",
    "No analytics or tracking",
];

const instantConnectBenefits = [
    "Always with you, never lost",
    "Update anytime, instantly reflected",
    "Eco-friendly, one card forever",
    "Unlimited info: links, portfolio, videos",
    "Full analytics and insights",
];

const faqs = [
    {
        question: "What is Instant Connect?",
        answer: "Instant Connect is an NFC-based digital solution that allows you to instantly share your business details, contact information, social media links, payment links, and more by simply tapping the card or scanning a QR code.",
    },
    {
        question: "Which devices support Instant Connect?",
        answer: "Instant Connect works on all NFC-enabled Android phones and iPhones (XR and above). For devices without NFC, the QR code on the product can be scanned to access the details.",
    },
    {
        question: "Can I update my information after purchase?",
        answer: "Yes, your digital information can be updated even after purchase. Updates depend on the plan selected and may be free or chargeable as per the service terms.",
    },
    {
        question: "Do I need an internet connection to use Instant Connect?",
        answer: "Internet is required only to open the digital profile. The NFC card itself does not require charging, battery, or any app installation.",
    },
    {
        question: "Is the NFC card reusable and shareable?",
        answer: "Yes, the NFC card is reusable and long-lasting. You can tap it unlimited times and share your details with anyone without any physical wear for digital data.",
    },
    {
        question: "What happens if my card gets damaged or lost?",
        answer: "Physical damage or loss is not covered under warranty. However, you can reorder a replacement card and link it to your existing digital profile.",
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

export function HowItWorksAnimatedContent() {
    return (
        <div className="overflow-x-hidden bg-slate-100">
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
                            backgroundImage: `url('https://souhaygiitgemoplvwnl.supabase.co/storage/v1/object/public/other%20images/Photo_1_pglrg1.jpg')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/90 to-black/40" />

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6">
                       

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-3 sm:mt-4 text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white max-w-xs sm:max-w-lg md:max-w-2xl"
                        >
                            How NFC Business Cards Work | Instant Connect India
                        </motion.h1>
                         <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center mt-4 text-xs sm:text-sm md:text-base text-white/70 max-w-xs sm:max-w-md md:max-w-2xl"
                        >
                            Share your contact details, social links and portfolio with one tap. Works on all NFC-enabled smartphones — no app needed.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-5 sm:mt-6 md:mt-8 flex flex-wrap justify-center gap-3"
                        >
                            <Link
                                href="/shop"
                                className="rounded-[10px] bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
                            >
                                Shop Now
                            </Link>
                            <Link
                                href="/book-demo"
                                className="rounded-[10px] bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                            >
                                Book a Demo
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Steps Section with Images - Overlapping Hero (same as FeaturedProducts on homepage) */}
            <div className="-mt-24 sm:-mt-24 relative z-10">
                <div className="flex justify-center">
                    <section className="w-[95%] rounded-[12px] bg-white px-4 py-6 sm:px-6 sm:py-8 shadow-xl">
                    {/* Section Header */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        transition={{ duration: 0.5 }}
                        className="mb-10 sm:mb-12"
                    >
                        <span className="text-xs sm:text-sm font-medium text-sky-400 uppercase tracking-wide">
                            Getting Started
                        </span>
                        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tighter">
                            Three simple <span className="text-zinc-400">steps.</span>
                        </h2>
                    </motion.div>

                    {/* Steps with Images */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                        className="grid lg:grid-cols-3 gap-4"
                    >
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                transition={{ duration: 0.5 }}
                                whileHover={{ y: -5 }}
                                className="group relative bg-white rounded-[10px] overflow-hidden"
                            >
                                {/* Image */}
                                <div className="relative h-40 sm:h-48 overflow-hidden">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.4 }}
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url('${step.image}')` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <span className="absolute bottom-3 left-4 text-5xl font-black text-white/30">
                                        {step.number}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-5 sm:p-6 group-hover:bg-black transition-colors duration-300">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-sky-100 group-hover:bg-sky-400 transition-colors">
                                        <step.icon className="h-5 w-5 text-sky-500 group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="mt-3 text-lg font-bold text-zinc-900 group-hover:text-white transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="mt-1.5 text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                    </section>
                </div>
            </div>

            {/* Comparison Section - Old vs New */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="mx-auto w-[95%]">
                    {/* Section Header */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-10 sm:mb-12"
                    >
                        <span className="text-xs sm:text-sm font-medium text-sky-400 uppercase tracking-wide">
                            Comparison
                        </span>
                        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tighter">
                            Old vs <span className="text-zinc-400">New.</span>
                        </h2>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-4">
                        {/* Traditional */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="rounded-[10px] bg-white p-6 sm:p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-[10px] bg-red-100 flex items-center justify-center">
                                    <X className="h-5 w-5 text-red-500" />
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900">
                                    Traditional Cards
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {traditionalProblems.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
                                        <span className="text-sm text-zinc-600">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Instant Connect */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="rounded-[10px] bg-black p-6 sm:p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-[10px] bg-sky-400 flex items-center justify-center">
                                    <CheckCircle className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white">
                                    Instant Connect
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {instantConnectBenefits.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="h-1.5 w-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                                        <span className="text-sm text-zinc-300">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Visual Break - Full Width Image Section */}
            <section className="py-6 sm:py-8">
                <div className="mx-auto w-[95%]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative h-[200px] sm:h-[280px] lg:h-[350px] rounded-[10px] overflow-hidden"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.03, 1],
                            }}
                            transition={{
                                duration: 15,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `url('https://res.cloudinary.com/dem0bqs8e/image/upload/v1767860730/Photo_2_akc6vz.jpg')`,
                            }}
                        />
                        <div className="absolute inset-0 bg-black/80" />
                        <div className="relative z-10 flex h-full items-center justify-center text-center p-6">
                            <div>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight"
                                >
                                    One card. <span className="text-sky-400">Infinite</span> connections.
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-3 text-sm sm:text-base text-zinc-400"
                                >
                                    Share your digital identity with anyone, anywhere
                                </motion.p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section - Why Choose Us */}
            <section className="py-12 sm:py-16 lg:py-20 bg-white">
                <div className="mx-auto w-[95%]">
                    {/* Section Header */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-10 sm:mb-12"
                    >
                        <span className="text-xs sm:text-sm font-medium text-sky-400 uppercase tracking-wide">
                            Features
                        </span>
                        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tighter">
                            Why choose <span className="text-zinc-400">us?</span>
                        </h2>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                transition={{ duration: 0.4 }}
                                whileHover={{ scale: 1.02 }}
                                className="flex items-start gap-4 p-5 sm:p-6 rounded-[10px] bg-slate-50"
                            >
                                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[10px] bg-black">
                                    <feature.icon className="h-5 w-5 text-sky-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-900">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-zinc-500">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-white">
                <div className="mx-auto w-[95%] max-w-3xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-10 sm:mb-12"
                    >
                        {/* <span className="text-xs sm:text-sm font-medium text-sky-400 uppercase tracking-wide">
                            FAQ
                        </span> */}
                        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tighter">
                            Frequently Asked Questions <span className="text-zinc-400"></span>
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
                            <motion.div key={index} variants={fadeInUp} transition={{ duration: 0.3 }}>
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
