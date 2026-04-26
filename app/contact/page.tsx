"use client";

import { useState } from "react";
import Link from "next/link";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    MessageSquare,
    Users,
    Building2,
} from "lucide-react";
import toast from "react-hot-toast";

const contactInfo = [
    {
        icon: MapPin,
        title: "Visit Us",
        details: [
            "Siddharth Nagar, Opp. Miraj Malhar Apartment",
            "New Bhupalpura, Udaipur",
            "Rajasthan 313001",
        ],
    },
    {
        icon: Phone,
        title: "Call Us",
        details: ["+91 87646 31130"],
    },
    {
        icon: Mail,
        title: "Email Us",
        details: ["Pr.gurukul1@gmail.com"],
    },
    {
        icon: Clock,
        title: "Business Hours",
        details: ["Mon - Fri: 9 AM - 6 PM", "Saturday: 10 AM - 4 PM"],
    },
];

const inquiryTypes = [
    { value: "general", label: "General Inquiry", icon: MessageSquare },
    { value: "bulk", label: "Bulk Order", icon: Users },
    { value: "support", label: "Technical Support", icon: Building2 },
];

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedType, setSelectedType] = useState("general");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise((r) => setTimeout(r, 1500));
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({
            name: "",
            email: "",
            phone: "",
            company: "",
            subject: "",
            message: "",
        });
        setIsSubmitting(false);
    };

    return (
        <div
            className="overflow-x-hidden"
            style={{ backgroundColor: "#F4F4F4" }}
        >
            {/* Hero */}
            <section className="px-[6px] pb-0">
                <div className="relative h-[40vh] sm:h-[50vh] md:h-[55vh] overflow-hidden rounded-b-[10px]">
                    {/* Background */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074&auto=format&fit=crop')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6">
                        <p className="text-center text-xs sm:text-sm md:text-base text-white/70 max-w-xs sm:max-w-md md:max-w-2xl">
                            Have a question or need help? We&apos;re here to
                            assist you.
                        </p>
                        <h1 className="mt-3 sm:mt-4 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            Get in Touch
                        </h1>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="pt-10 pb-6 sm:pt-14 sm:pb-8 lg:pt-16 lg:pb-10">
                <div className="mx-auto w-[95%]">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        {contactInfo.map((info) => (
                            <div
                                key={info.title}
                                className="rounded-[10px] bg-white p-4 sm:p-5"
                            >
                                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[10px] bg-blue-100">
                                    <info.icon className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="mt-3 text-sm sm:text-base font-semibold text-zinc-900">
                                    {info.title}
                                </h3>
                                <div className="mt-1.5 space-y-0.5">
                                    {info.details.map((detail, i) => (
                                        <p
                                            key={i}
                                            className="text-xs sm:text-sm text-zinc-500"
                                        >
                                            {detail}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-6 sm:py-8 lg:py-10">
                <div className="mx-auto w-[95%]">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                        {/* Form */}
                        <div className="w-full lg:w-2/3">
                            <div className="rounded-[10px] bg-white p-5 sm:p-6 lg:p-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="hidden sm:block h-px w-8 bg-sky-400" />
                                    <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-sky-400">
                                        We&apos;ll respond within 24 hours
                                    </span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tighter leading-[0.9]">
                                    Send us a{" "}
                                    <span className="text-zinc-400">message.</span>
                                </h2>

                                {/* Inquiry Type */}
                                <div className="mt-5 sm:mt-6">
                                    <label className="mb-2 block text-xs sm:text-sm font-medium text-zinc-700">
                                        What can we help you with?
                                    </label>
                                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                        {inquiryTypes.map((type) => (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedType(type.value)
                                                }
                                                className={`flex flex-col items-center gap-1 sm:gap-2 rounded-[10px] border-2 p-3 sm:p-4 transition-all ${
                                                    selectedType === type.value
                                                        ? "border-blue-500 bg-blue-50"
                                                        : "border-zinc-200 hover:border-zinc-300"
                                                }`}
                                            >
                                                <type.icon
                                                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                                        selectedType ===
                                                        type.value
                                                            ? "text-blue-600"
                                                            : "text-zinc-400"
                                                    }`}
                                                />
                                                <span
                                                    className={`text-[10px] sm:text-xs font-medium ${
                                                        selectedType ===
                                                        type.value
                                                            ? "text-blue-700"
                                                            : "text-zinc-600"
                                                    }`}
                                                >
                                                    {type.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-5 sm:mt-6 space-y-4"
                                >
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-xs sm:text-sm font-medium text-zinc-700">
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
                                                className="w-full rounded-[10px] border border-zinc-200 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:border-zinc-400 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs sm:text-sm font-medium text-zinc-700">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        email: e.target.value,
                                                    })
                                                }
                                                required
                                                className="w-full rounded-[10px] border border-zinc-200 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:border-zinc-400 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-xs sm:text-sm font-medium text-zinc-700">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                placeholder="+91 87646 31130"
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        phone: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-[10px] border border-zinc-200 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:border-zinc-400 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs sm:text-sm font-medium text-zinc-700">
                                                Company Name
                                            </label>
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
                                                className="w-full rounded-[10px] border border-zinc-200 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:border-zinc-400 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs sm:text-sm font-medium text-zinc-700">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="How can we help you?"
                                            value={formData.subject}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    subject: e.target.value,
                                                })
                                            }
                                            required
                                            className="w-full rounded-[10px] border border-zinc-200 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:border-zinc-400 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs sm:text-sm font-medium text-zinc-700">
                                            Message *
                                        </label>
                                        <textarea
                                            placeholder="Tell us more about your inquiry..."
                                            value={formData.message}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    message: e.target.value,
                                                })
                                            }
                                            required
                                            rows={4}
                                            className="w-full rounded-[10px] border border-zinc-200 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:border-zinc-400 focus:outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-zinc-900 px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            "Sending..."
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="w-full lg:w-1/3 space-y-4">
                            {/* Quick Links */}
                            <div className="rounded-[10px] bg-white p-5 sm:p-6">
                                <h3 className="text-sm sm:text-base font-semibold text-zinc-900">
                                    Quick Links
                                </h3>
                                <div className="mt-3 space-y-2">
                                    <Link
                                      prefetch={false}
                                        href="/faqs"
                                        className="flex items-center gap-3 rounded-[10px] bg-zinc-50 p-3 text-xs sm:text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                                    >
                                        <MessageSquare className="h-4 w-4 text-zinc-400" />
                                        Browse FAQs
                                    </Link>
                                    <Link
                                      prefetch={false}
                                        href="/track-order"
                                        className="flex items-center gap-3 rounded-[10px] bg-zinc-50 p-3 text-xs sm:text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                                    >
                                        <MapPin className="h-4 w-4 text-zinc-400" />
                                        Track Your Order
                                    </Link>
                                    <Link
                                      prefetch={false}
                                        href="/book-demo"
                                        className="flex items-center gap-3 rounded-[10px] bg-zinc-50 p-3 text-xs sm:text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                                    >
                                        <Users className="h-4 w-4 text-zinc-400" />
                                        Book a Demo
                                    </Link>
                                </div>
                            </div>

                            {/* Bulk Orders */}
                            <div
                                className="rounded-[10px] p-5 sm:p-6"
                                style={{ backgroundColor: "#F5A623" }}
                            >
                                <h3 className="text-sm sm:text-base font-semibold text-black">
                                    Need Bulk Orders?
                                </h3>
                                <p className="mt-2 text-xs sm:text-sm text-black/70">
                                    Get special pricing for orders of 50+ units.
                                    Our team will create a custom quote.
                                </p>
                                <button
                                    onClick={() => setSelectedType("bulk")}
                                    className="mt-4 w-full rounded-[10px] bg-black/20 px-4 py-2.5 text-xs sm:text-sm font-semibold text-black hover:bg-black/30"
                                >
                                    Get Bulk Quote
                                </button>
                            </div>

                            {/* Response Time */}
                            <div className="rounded-[10px] bg-zinc-900 p-5 sm:p-6 text-white">
                                <h3 className="text-sm sm:text-base font-semibold">
                                    Response Time
                                </h3>
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs sm:text-sm text-zinc-400">
                                            Email
                                        </span>
                                        <span className="text-xs sm:text-sm font-medium">
                                            Within 24 hrs
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs sm:text-sm text-zinc-400">
                                            Phone
                                        </span>
                                        <span className="text-xs sm:text-sm font-medium">
                                            Instant
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs sm:text-sm text-zinc-400">
                                            WhatsApp
                                        </span>
                                        <span className="text-xs sm:text-sm font-medium">
                                            Within 2 hrs
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map */}
            <section className="pb-8">
                <div className="mx-auto w-[95%]">
                    <div className="overflow-hidden rounded-[10px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d906.9171317887766!2d73.70457195584814!3d24.60063329914682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sSiddharth%20nagar%2C%20%20opposite%20of%20Miraj%20Malhar%20appartment%2C%20%20New%20Bhupalpura%2C%20Udaipur%2C%20Rajasthan%20313001!5e0!3m2!1sen!2sin!4v1766568498695!5m2!1sen!2sin"
                            width="100%"
                            height="350"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
