import { Metadata } from "next";
import Link from "next/link";
import {
    AlertTriangle,
    Shield,
    CheckCircle,
    XCircle,
    Globe,
    Lock,
    Mail,
    Phone,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Fraudulent Websites Warning",
    description:
        "Protect yourself from fake websites impersonating Instant Connect. Learn how to identify our official channels.",
};

const officialChannels = [
    { label: "Official Website", value: "www.inconnect.in", icon: Globe },
    { label: "Official Email", value: "Pr.gurukul1@gmail.com", icon: Mail },
    { label: "Customer Support", value: "+91 87646 31130", icon: Phone },
];

const warningSignsReal = [
    "URL exactly matches inconnect.in",
    "Secure padlock icon in browser address bar",
    "Professional design matching our branding",
    "Valid SSL certificate (https://)",
    "Consistent pricing with official rates",
    "Multiple secure payment options",
];

const warningSigns = [
    "Slightly misspelled domain names (e.g., instant-connect.in, instantconect.in)",
    "Unusual domain extensions (.xyz, .online, .shop instead of .in)",
    "Requests for payment via direct bank transfer only",
    "Prices significantly lower than our official rates",
    "Poor grammar and spelling on the website",
    "No customer support contact information",
    "Requests for personal information via email",
    "Social media accounts with few followers or recent creation",
];

const reportSteps = [
    {
        step: "1",
        title: "Document Evidence",
        description:
            "Take screenshots of the fraudulent website, including the URL, pricing, and any communication received.",
    },
    {
        step: "2",
        title: "Report to Us",
        description:
            "Send the evidence to Pr.gurukul1@gmail.com so we can take action against the impersonators.",
    },
    {
        step: "3",
        title: "Report to Authorities",
        description:
            "File a complaint with the Cyber Crime Portal (cybercrime.gov.in) if you have been scammed.",
    },
    {
        step: "4",
        title: "Warn Others",
        description:
            "Share information about the scam on social media to help protect others from falling victim.",
    },
];

export default function FraudulentWebsitesPage() {
    return (
        <div
            className="overflow-x-hidden"
            style={{ backgroundColor: "#F4F4F4" }}
        >
            {/* Hero */}
            <section className="pt-[6px] px-[6px] pb-0">
                <div className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] overflow-hidden rounded-[10px]">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800" />
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6">
                        <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-[10px] bg-white/10 backdrop-blur-sm mb-4 animate-pulse">
                            <AlertTriangle className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                        </div>
                        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            Beware of Fraudulent Websites
                        </h1>
                        <p className="mt-3 text-center text-xs sm:text-sm md:text-base text-white/80 max-w-xs sm:max-w-md md:max-w-2xl">
                            Protect yourself from scammers impersonating Instant
                            Connect. Only trust our official channels.
                        </p>
                    </div>
                </div>
            </section>

            {/* Official Channels */}
            <section className="pt-6 sm:pt-8 lg:pt-10">
                <div className="mx-auto w-[95%]">
                    <div className="rounded-[10px] bg-green-50 border-2 border-green-200 p-5 sm:p-6 lg:p-8">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[10px] bg-green-100">
                                <Shield className="h-5 w-5 text-green-600" />
                            </div>
                            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-green-900">
                                Official Instant Connect Channels
                            </h2>
                        </div>
                        <p className="text-xs sm:text-sm text-green-800 mb-4">
                            These are the ONLY official channels for Instant
                            Connect. Do not trust any other sources.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            {officialChannels.map((channel) => (
                                <div
                                    key={channel.label}
                                    className="rounded-[10px] bg-white p-4 border border-green-200"
                                >
                                    <channel.icon className="h-5 w-5 text-green-600 mb-2" />
                                    <p className="text-xs text-zinc-500">
                                        {channel.label}
                                    </p>
                                    <p className="text-sm sm:text-base font-semibold text-zinc-900">
                                        {channel.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How to Identify */}
            <section className="py-6 sm:py-8 lg:py-10">
                <div className="mx-auto w-[95%]">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                        {/* Legitimate Signs */}
                        <div className="w-full lg:w-1/2 rounded-[10px] bg-white p-5 sm:p-6 lg:p-8">
                            <div className="flex items-center gap-3 mb-4 sm:mb-5">
                                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[10px] bg-green-100">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-zinc-900">
                                    Signs of Our Official Website
                                </h2>
                            </div>
                            <ul className="space-y-3">
                                {warningSignsReal.map((sign, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-3"
                                    >
                                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-xs sm:text-sm text-zinc-600">
                                            {sign}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Warning Signs */}
                        <div className="w-full lg:w-1/2 rounded-[10px] bg-white p-5 sm:p-6 lg:p-8">
                            <div className="flex items-center gap-3 mb-4 sm:mb-5">
                                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[10px] bg-red-100">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                </div>
                                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-zinc-900">
                                    Red Flags to Watch For
                                </h2>
                            </div>
                            <ul className="space-y-3">
                                {warningSigns.map((sign, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-3"
                                    >
                                        <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-xs sm:text-sm text-zinc-600">
                                            {sign}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* What To Do */}
            <section className="pb-6 sm:pb-8">
                <div className="mx-auto w-[95%]">
                    <div
                        className="rounded-[10px] p-5 sm:p-8 lg:p-10"
                        style={{ backgroundColor: "#38bdf8" }}
                    >
                        <div className="text-center mb-6 sm:mb-8">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                                Found a Fraudulent Website?
                            </h2>
                            <p className="mt-2 text-xs sm:text-sm text-white/70">
                                Help us protect others by reporting fake
                                websites
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {reportSteps.map((step) => (
                                <div
                                    key={step.step}
                                    className="rounded-[10px] bg-white/10 p-4 sm:p-5"
                                >
                                    <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-[10px] bg-white text-xs sm:text-sm font-bold text-blue-600 mb-3">
                                        {step.step}
                                    </span>
                                    <h3 className="text-sm sm:text-base font-semibold text-white">
                                        {step.title}
                                    </h3>
                                    <p className="mt-1 text-xs sm:text-sm text-white/70">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Already Scammed */}
            <section className="pb-6 sm:pb-8">
                <div className="mx-auto w-[95%]">
                    <div className="rounded-[10px] bg-red-50 border border-red-200 p-5 sm:p-6 lg:p-8">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 text-red-600 flex-shrink-0" />
                            <div>
                                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-red-900">
                                    Already Been Scammed?
                                </h2>
                                <p className="mt-2 text-xs sm:text-sm text-red-800">
                                    If you have made a payment to a fraudulent
                                    website, take these steps immediately:
                                </p>
                                <ul className="mt-3 space-y-2 text-xs sm:text-sm text-red-800">
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold">1.</span>
                                        Contact your bank immediately to report
                                        the fraudulent transaction and request a
                                        chargeback.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold">2.</span>
                                        File an FIR at your local police station
                                        or online at cybercrime.gov.in
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold">3.</span>
                                        Report the incident to the National
                                        Consumer Helpline: 1800-11-4000
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold">4.</span>
                                        Contact us at Pr.gurukul1@gmail.com
                                        with all details so we can take legal
                                        action.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Security Tips */}
            <section className="pb-6 sm:pb-8">
                <div className="mx-auto w-[95%]">
                    <div className="rounded-[10px] bg-white p-5 sm:p-6 lg:p-8">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[10px] bg-blue-100">
                                <Lock className="h-5 w-5 text-blue-600" />
                            </div>
                            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-zinc-900">
                                Stay Safe Online
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="rounded-[10px] bg-zinc-50 p-4">
                                <h3 className="text-sm sm:text-base font-semibold text-zinc-900">
                                    Verify Before You Pay
                                </h3>
                                <p className="mt-1 text-xs sm:text-sm text-zinc-600">
                                    Always double-check the website URL before
                                    making any payment.
                                </p>
                            </div>
                            <div className="rounded-[10px] bg-zinc-50 p-4">
                                <h3 className="text-sm sm:text-base font-semibold text-zinc-900">
                                    Use Secure Payment
                                </h3>
                                <p className="mt-1 text-xs sm:text-sm text-zinc-600">
                                    Prefer UPI, cards, or COD over direct bank
                                    transfers.
                                </p>
                            </div>
                            <div className="rounded-[10px] bg-zinc-50 p-4">
                                <h3 className="text-sm sm:text-base font-semibold text-zinc-900">
                                    Check SSL Certificate
                                </h3>
                                <p className="mt-1 text-xs sm:text-sm text-zinc-600">
                                    Look for the padlock icon and https:// in
                                    the address bar.
                                </p>
                            </div>
                            <div className="rounded-[10px] bg-zinc-50 p-4">
                                <h3 className="text-sm sm:text-base font-semibold text-zinc-900">
                                    Beware of Deals
                                </h3>
                                <p className="mt-1 text-xs sm:text-sm text-zinc-600">
                                    If a deal seems too good to be true, it
                                    probably is.
                                </p>
                            </div>
                            <div className="rounded-[10px] bg-zinc-50 p-4">
                                <h3 className="text-sm sm:text-base font-semibold text-zinc-900">
                                    Contact Us Directly
                                </h3>
                                <p className="mt-1 text-xs sm:text-sm text-zinc-600">
                                    When in doubt, contact us through official
                                    channels to verify.
                                </p>
                            </div>
                            <div className="rounded-[10px] bg-zinc-50 p-4">
                                <h3 className="text-sm sm:text-base font-semibold text-zinc-900">
                                    Trust Your Instincts
                                </h3>
                                <p className="mt-1 text-xs sm:text-sm text-zinc-600">
                                    If something feels wrong, stop and verify
                                    before proceeding.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="pb-8 sm:pb-12 lg:pb-16">
                <div className="mx-auto w-[95%]">
                    <div
                        className="rounded-[10px] p-5 sm:p-8 lg:p-10 text-center"
                        style={{ backgroundColor: "#F5A623" }}
                    >
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
                            Questions or Concerns?
                        </h2>
                        <p className="mt-2 text-xs sm:text-sm text-black/70 max-w-lg mx-auto">
                            Our team is here to help verify the authenticity of
                            any communication or website claiming to be Instant
                            Connect.
                        </p>
                        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                              prefetch={false}
                                href="/contact"
                                className="rounded-[10px] bg-black px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-black/90"
                            >
                                Contact Support
                            </Link>
                            <a
                                href="mailto:Pr.gurukul1@gmail.com"
                                className="rounded-[10px] bg-black/20 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-black hover:bg-black/30"
                            >
                                Report Fraud
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
