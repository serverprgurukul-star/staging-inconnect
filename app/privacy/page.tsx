import { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description:
        "Learn how Instant Connect collects, uses, and protects your personal information.",
};

const sections = [
    {
        icon: Database,
        title: "Information We Collect",
        content: [
            {
                subtitle: "Personal Information",
                text: "When you create an account, place an order, or contact us, we may collect your name, email address, phone number, shipping address, and payment information.",
            },
            {
                subtitle: "Usage Data",
                text: "We automatically collect information about how you interact with our website, including your IP address, browser type, pages visited, and time spent on our site.",
            },
            {
                subtitle: "NFC Card Data",
                text: "When you use our NFC products, we collect analytics data such as the number of taps, location (city-level only), and device types of people who scan your card.",
            },
        ],
    },
    {
        icon: Eye,
        title: "How We Use Your Information",
        content: [
            {
                subtitle: "Order Processing",
                text: "We use your personal information to process orders, send shipping updates, and provide customer support.",
            },
            {
                subtitle: "Product Improvement",
                text: "Usage data helps us improve our website, products, and services to better meet your needs.",
            },
            {
                subtitle: "Communication",
                text: "With your consent, we may send promotional emails about new products, special offers, or other information we think you may find interesting.",
            },
        ],
    },
    {
        icon: Lock,
        title: "Data Security",
        content: [
            {
                subtitle: "Encryption",
                text: "All data transmitted between your browser and our servers is encrypted using SSL/TLS technology.",
            },
            {
                subtitle: "Secure Storage",
                text: "Your personal information is stored on secure servers with restricted access and regular security audits.",
            },
            {
                subtitle: "Payment Security",
                text: "We do not store your complete payment card details. All payments are processed through PCI-DSS compliant payment gateways.",
            },
        ],
    },
    {
        icon: UserCheck,
        title: "Your Rights",
        content: [
            {
                subtitle: "Access & Correction",
                text: "You can access and update your personal information through your account dashboard at any time.",
            },
            {
                subtitle: "Data Deletion",
                text: "You may request deletion of your account and associated data by contacting our support team.",
            },
            {
                subtitle: "Opt-Out",
                text: "You can unsubscribe from marketing communications at any time by clicking the unsubscribe link in our emails.",
            },
        ],
    },
];

export default function PrivacyPolicyPage() {
    return (
        <div
            className="overflow-x-hidden"
            style={{ backgroundColor: "#F4F4F4" }}
        >
            {/* Hero */}
            <section className="px-[6px] pb-0">
                <div className="relative h-[35vh] sm:h-[40vh] md:h-[45vh] overflow-hidden rounded-b-[10px]">
                    {/* Background */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1633265486064-086b219458ec?q=80&w=2070&auto=format&fit=crop')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6">
                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[10px] bg-white/10 backdrop-blur-sm mb-4 mt-24">
                            <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            Privacy Policy
                        </h1>
                        <p className="mt-3 text-center text-xs sm:text-sm md:text-base text-white/70 max-w-xs sm:max-w-md md:max-w-2xl">
                            Your privacy is important to us. This policy
                            explains how we handle your data.
                        </p>
                    </div>
                </div>
            </section>

            {/* Last Updated */}
            <section className="pt-6 sm:pt-8 lg:pt-10">
                <div className="mx-auto w-[95%]">
                    <div className="rounded-[10px] bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <p className="text-xs sm:text-sm text-zinc-500">
                            Last Updated:{" "}
                            <span className="font-medium text-zinc-900">
                                December 27, 2025
                            </span>
                        </p>
                        <p className="text-xs sm:text-sm text-zinc-500">
                            Effective Date:{" "}
                            <span className="font-medium text-zinc-900">
                                January 1, 2025
                            </span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Introduction */}
            <section className="pt-6 sm:pt-8">
                <div className="mx-auto w-[95%]">
                    <div className="rounded-[10px] bg-white p-5 sm:p-6 lg:p-8">
                        <h2 className="text-lg sm:text-xl font-bold text-zinc-900">
                            Introduction
                        </h2>
                        <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed">
                            Instant Connect (&quot;we,&quot; &quot;our,&quot; or
                            &quot;us&quot;) is committed to protecting your
                            privacy. This Privacy Policy explains how we
                            collect, use, disclose, and safeguard your
                            information when you visit our website, use our
                            products, or interact with our services. Please read
                            this policy carefully. If you do not agree with the
                            terms of this privacy policy, please do not access
                            our site or use our services.
                        </p>
                    </div>
                </div>
            </section>

            {/* Policy Sections */}
            <section className="py-6 sm:py-8 lg:py-10">
                <div className="mx-auto w-[95%]">
                    <div className="space-y-4 sm:space-y-6">
                        {sections.map((section) => (
                            <div
                                key={section.title}
                                className="rounded-[10px] bg-white p-5 sm:p-6 lg:p-8"
                            >
                                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[10px] bg-blue-100">
                                        <section.icon className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-base sm:text-lg lg:text-xl font-bold text-zinc-900">
                                        {section.title}
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    {section.content.map((item, index) => (
                                        <div key={index}>
                                            <h3 className="text-sm sm:text-base font-semibold text-zinc-900">
                                                {item.subtitle}
                                            </h3>
                                            <p className="mt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                                                {item.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cookies */}
            <section className="pb-6 sm:pb-8">
                <div className="mx-auto w-[95%]">
                    <div
                        className="rounded-[10px] p-5 sm:p-6 lg:p-8"
                        style={{ backgroundColor: "#38bdf8" }}
                    >
                        <h2 className="text-lg sm:text-xl font-bold text-white">
                            Cookies & Tracking
                        </h2>
                        <p className="mt-3 text-sm sm:text-base text-white/80 leading-relaxed">
                            We use cookies and similar tracking technologies to
                            enhance your browsing experience, analyze site
                            traffic, and understand where our visitors come
                            from. You can control cookies through your browser
                            settings. Disabling cookies may affect some features
                            of our website.
                        </p>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="rounded-[10px] bg-white/10 p-3 sm:p-4">
                                <p className="text-xs sm:text-sm font-medium text-white">
                                    Essential Cookies
                                </p>
                                <p className="mt-1 text-xs text-white/60">
                                    Required for site functionality
                                </p>
                            </div>
                            <div className="rounded-[10px] bg-white/10 p-3 sm:p-4">
                                <p className="text-xs sm:text-sm font-medium text-white">
                                    Analytics Cookies
                                </p>
                                <p className="mt-1 text-xs text-white/60">
                                    Help us improve our service
                                </p>
                            </div>
                            <div className="rounded-[10px] bg-white/10 p-3 sm:p-4">
                                <p className="text-xs sm:text-sm font-medium text-white">
                                    Marketing Cookies
                                </p>
                                <p className="mt-1 text-xs text-white/60">
                                    Used for targeted advertising
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="pb-8 sm:pb-12 lg:pb-16">
                <div className="mx-auto w-[95%]">
                    <div
                        className="rounded-[10px] p-5 sm:p-8 lg:p-10 text-center"
                        style={{ backgroundColor: "#F5A623" }}
                    >
                        <Mail className="h-8 w-8 sm:h-10 sm:w-10 text-black mx-auto" />
                        <h2 className="mt-4 text-lg sm:text-xl lg:text-2xl font-bold text-black">
                            Questions About Our Privacy Policy?
                        </h2>
                        <p className="mt-2 text-xs sm:text-sm text-black/70 max-w-lg mx-auto">
                            If you have any questions or concerns about this
                            Privacy Policy, please contact our Data Protection
                            Officer.
                        </p>
                        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                              prefetch={false}
                                href="/contact"
                                className="rounded-[10px] bg-black px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-black/90"
                            >
                                Contact Us
                            </Link>
                            <a
                                href="mailto:Pr.gurukul1@gmail.com"
                                className="rounded-[10px] bg-black/20 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-black hover:bg-black/30"
                            >
                                Pr.gurukul1@gmail.com
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
