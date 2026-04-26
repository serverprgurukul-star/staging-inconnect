"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Calendar,
    Clock,
    Users,
    Video,
    Check,
    ArrowRight,
    Building2,
    Phone,
    Mail,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

const benefits = [
    "Personalized product recommendations",
    "Live demonstration of all features",
    "Custom pricing for bulk orders",
    "Q&A with our product experts",
    "Exclusive demo-only discounts",
];

const teamSizes = [
    { value: "1-10", label: "1-10 employees" },
    { value: "11-50", label: "11-50 employees" },
    { value: "51-200", label: "51-200 employees" },
    { value: "200+", label: "200+ employees" },
];

const demoInfo = [
    {
        icon: Video,
        title: "Virtual Demo",
        description: "Join via Google Meet or Zoom from anywhere",
        color: "bg-blue-100 text-blue-600",
    },
    {
        icon: Clock,
        title: "30 Minutes",
        description: "Quick overview of features and Q&A session",
        color: "bg-teal-100 text-teal-600",
    },
    {
        icon: Calendar,
        title: "Flexible Timing",
        description: "Schedule at your convenience",
        color: "bg-orange-100 text-orange-600",
    },
    {
        icon: Users,
        title: "Team Friendly",
        description: "Invite your team members to join",
        color: "bg-rose-100 text-rose-600",
    },
];

export default function BookDemoPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        teamSize: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const supabase = createClient();
            const { error } = await supabase.from("demo_bookings").insert([
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.company,
                    message: `Team Size: ${formData.teamSize}\n\n${formData.message}`,
                    status: "pending",
                },
            ]);

            if (error) throw error;

            setIsSubmitted(true);
            toast.success("Demo request submitted successfully!");
        } catch (error) {
            console.error("Error booking demo:", error);
            toast.error("Failed to submit request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div
                className="min-h-screen overflow-x-hidden"
                style={{ backgroundColor: "#F4F4F4" }}
            >
                <div className="flex min-h-screen items-center justify-center px-4 pt-20">
                    <div className="w-full max-w-md text-center">
                        <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-[10px] bg-teal-100">
                            <Check className="h-8 w-8 sm:h-10 sm:w-10 text-teal-600" />
                        </div>
                        <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-zinc-900">
                            Demo Request Received!
                        </h1>
                        <p className="mt-4 text-sm sm:text-base text-zinc-500">
                            Thank you for your interest! Our team will contact
                            you within 24 hours to schedule your personalized
                            demo.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                              prefetch={false}
                                href="/shop"
                                className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
                            >
                                Browse Products
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                              prefetch={false}
                                href="/"
                                className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-300"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="overflow-x-hidden"
            style={{ backgroundColor: "#F4F4F4" }}
        >
            {/* Hero Section */}
            <section className="px-[6px] pb-0">
                <div className="relative h-[45vh] sm:h-[50vh] md:h-[55vh] overflow-hidden rounded-b-[10px]">
                    {/* Background */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6 pt-16 lg:pt-0">
                        <span className="inline-block rounded-[10px] bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs sm:text-sm font-medium text-white/90 mb-4">
                            Free Consultation
                        </span>
                        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            Book a Free Demo
                        </h1>
                        <p className="mt-3 text-center text-xs sm:text-sm md:text-base text-white/70 max-w-xs sm:max-w-md md:max-w-2xl">
                            See Instant Connect in action. Get a personalized demo tailored to your business needs.
                        </p>
                    </div>
                </div>
            </section>

            {/* Demo Info Cards */}
            <section className="py-6 sm:py-8 lg:py-10">
                <div className="mx-auto w-[95%]">
                    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                        {demoInfo.map((info) => (
                            <div
                                key={info.title}
                                className="rounded-[10px] bg-white p-4 sm:p-6"
                            >
                                <div
                                    className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-[10px] ${info.color}`}
                                >
                                    <info.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <h3 className="mt-3 sm:mt-4 text-sm sm:text-base font-bold text-zinc-900">
                                    {info.title}
                                </h3>
                                <p className="mt-1 text-xs sm:text-sm text-zinc-500">
                                    {info.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="pb-8 sm:pb-12 lg:pb-16">
                <div className="mx-auto w-[95%]">
                    <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                        {/* Form */}
                        <div className="lg:col-span-2">
                            <div className="rounded-[10px] bg-white p-5 sm:p-6 lg:p-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="hidden sm:block h-px w-8 bg-sky-400" />
                                    <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-sky-400">
                                        We&apos;ll respond within 24 hours
                                    </span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tighter leading-[0.9] mb-6">
                                    Request your{" "}
                                    <span className="text-zinc-400">demo.</span>
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                    <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs sm:text-sm font-medium text-zinc-700">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        name: e.target.value,
                                                    })
                                                }
                                                required
                                                className="w-full rounded-[10px] border border-zinc-200 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-zinc-400 focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs sm:text-sm font-medium text-zinc-700">
                                                Work Email *
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                                <input
                                                    type="email"
                                                    placeholder="john@company.com"
                                                    value={formData.email}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            email: e.target.value,
                                                        })
                                                    }
                                                    required
                                                    className="w-full rounded-[10px] border border-zinc-200 py-2.5 sm:py-3 pl-10 pr-3 sm:pr-4 text-xs sm:text-sm focus:border-zinc-400 focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs sm:text-sm font-medium text-zinc-700">
                                                Phone Number *
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                                <input
                                                    type="tel"
                                                    placeholder="+91 98765 43210"
                                                    value={formData.phone}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            phone: e.target.value,
                                                        })
                                                    }
                                                    required
                                                    className="w-full rounded-[10px] border border-zinc-200 py-2.5 sm:py-3 pl-10 pr-3 sm:pr-4 text-xs sm:text-sm focus:border-zinc-400 focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs sm:text-sm font-medium text-zinc-700">
                                                Company Name
                                            </label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Acme Inc."
                                                    value={formData.company}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            company: e.target.value,
                                                        })
                                                    }
                                                    className="w-full rounded-[10px] border border-zinc-200 py-2.5 sm:py-3 pl-10 pr-3 sm:pr-4 text-xs sm:text-sm focus:border-zinc-400 focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs sm:text-sm font-medium text-zinc-700">
                                            Team Size
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4">
                                            {teamSizes.map((size) => (
                                                <button
                                                    key={size.value}
                                                    type="button"
                                                    onClick={() =>
                                                        setFormData({
                                                            ...formData,
                                                            teamSize: size.value,
                                                        })
                                                    }
                                                    className={`rounded-[10px] border-2 px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all ${
                                                        formData.teamSize === size.value
                                                            ? "border-zinc-900 bg-zinc-900 text-white"
                                                            : "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                                                    }`}
                                                >
                                                    {size.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs sm:text-sm font-medium text-zinc-700">
                                            Tell us about your needs
                                        </label>
                                        <textarea
                                            placeholder="What are you looking to achieve with NFC products?"
                                            value={formData.message}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    message: e.target.value,
                                                })
                                            }
                                            rows={4}
                                            className="w-full rounded-[10px] border border-zinc-200 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-zinc-400 focus:outline-none transition-colors resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-zinc-900 px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Submitting...
                                            </div>
                                        ) : (
                                            <>
                                                Request Demo
                                                <ArrowRight className="h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4 sm:space-y-5">
                            {/* What to expect */}
                            <div className="rounded-[10px] bg-white p-5 sm:p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-teal-100">
                                        <Check className="h-4 w-4 text-teal-600" />
                                    </div>
                                    <h3 className="text-sm sm:text-base font-bold text-zinc-900">
                                        What to Expect
                                    </h3>
                                </div>
                                <ul className="space-y-3">
                                    {benefits.map((benefit) => (
                                        <li
                                            key={benefit}
                                            className="flex items-start gap-2.5"
                                        >
                                            <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-teal-100">
                                                <Check className="h-2.5 w-2.5 text-teal-600" />
                                            </div>
                                            <span className="text-xs sm:text-sm text-zinc-600">
                                                {benefit}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Quick contact */}
                            <div
                                className="rounded-[10px] p-5 sm:p-6"
                                style={{ backgroundColor: "#38bdf8" }}
                            >
                                <h3 className="text-sm sm:text-base font-bold text-white">
                                    Need Immediate Assistance?
                                </h3>
                                <p className="mt-2 text-xs sm:text-sm text-white/70">
                                    Our team is available Mon-Fri, 9 AM - 6 PM
                                </p>
                                <div className="mt-4 space-y-2.5">
                                    <a
                                        href="tel:+918764631130"
                                        className="flex items-center gap-2.5 rounded-[10px] bg-white/10 p-3 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                                    >
                                        <Phone className="h-4 w-4" />
                                        +91 87646 31130
                                    </a>
                                    <a
                                        href="mailto:Pr.gurukul1@gmail.com"
                                        className="flex items-center gap-2.5 rounded-[10px] bg-white/10 p-3 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                                    >
                                        <Mail className="h-4 w-4" />
                                        Pr.gurukul1@gmail.com
                                    </a>
                                </div>
                            </div>

                            {/* Testimonial */}
                            <div className="rounded-[10px] bg-zinc-900 p-5 sm:p-6">
                                <p className="text-xs sm:text-sm italic text-zinc-300 leading-relaxed">
                                    &quot;The demo was incredibly helpful. The team understood our needs perfectly and helped us choose the right products for our entire organization.&quot;
                                </p>
                                <div className="mt-4 flex items-center gap-3 pt-4 border-t border-zinc-800">
                                    <div className="h-9 w-9 rounded-[10px] bg-zinc-700 flex items-center justify-center">
                                        <span className="text-sm font-semibold text-white">PS</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            Priya Sharma
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            HR Director, TechCorp
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
