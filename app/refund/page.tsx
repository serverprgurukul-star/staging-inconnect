import { Metadata } from "next";
import Link from "next/link";
import {
    RefreshCw,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Package,
    CreditCard,
    HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Refund Policy",
    description:
        "Learn about our refund and return policy for Instant Connect products.",
};

const refundEligible = [
    "Product received is damaged or defective",
    "Wrong product delivered",
    "Product significantly different from description",
    "NFC chip not functioning properly",
    "Order cancelled before shipping",
];

const refundNotEligible = [
    "Change of mind after customization is complete",
    "Products damaged due to misuse",
    "Requests made after 7 days of delivery",
    "Products without original packaging",
    "Digital profile setup issues (we offer free support instead)",
];

const refundProcess = [
    {
        step: "1",
        title: "Initiate Request",
        description:
            "Contact our support team via email or phone within 7 days of receiving your order.",
        icon: HelpCircle,
    },
    {
        step: "2",
        title: "Provide Details",
        description:
            "Share your order number, photos of the issue, and a brief description of the problem.",
        icon: Package,
    },
    {
        step: "3",
        title: "Review & Approval",
        description:
            "Our team will review your request within 24-48 hours and notify you of the decision.",
        icon: Clock,
    },
    {
        step: "4",
        title: "Refund Processing",
        description:
            "Once approved, refunds are processed within 5-7 business days to your original payment method.",
        icon: CreditCard,
    },
];

export default function RefundPolicyPage() {
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
                            backgroundImage: `url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6">
                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[10px] bg-white/10 backdrop-blur-sm mb-4 mt-24">
                            <RefreshCw className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            Refund Policy
                        </h1>
                        <p className="mt-3 text-center text-xs sm:text-sm md:text-base text-white/70 max-w-xs sm:max-w-md md:max-w-2xl">
                            We want you to be completely satisfied with your
                            purchase.
                        </p>
                    </div>
                </div>
            </section>

            {/* Key Info */}
            <section className="pt-6 sm:pt-8 lg:pt-10">
                <div className="mx-auto w-[95%]">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="rounded-[10px] bg-white p-4 sm:p-5 text-center">
                            <Clock className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-blue-600" />
                            <p className="mt-2 text-lg sm:text-xl font-bold text-zinc-900">
                                7 Days
                            </p>
                            <p className="text-xs sm:text-sm text-zinc-500">
                                Return Window
                            </p>
                        </div>
                        <div className="rounded-[10px] bg-white p-4 sm:p-5 text-center">
                            <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-blue-600" />
                            <p className="mt-2 text-lg sm:text-xl font-bold text-zinc-900">
                                5-7 Days
                            </p>
                            <p className="text-xs sm:text-sm text-zinc-500">
                                Refund Processing
                            </p>
                        </div>
                        <div className="rounded-[10px] bg-white p-4 sm:p-5 text-center">
                            <RefreshCw className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-blue-600" />
                            <p className="mt-2 text-lg sm:text-xl font-bold text-zinc-900">
                                100%
                            </p>
                            <p className="text-xs sm:text-sm text-zinc-500">
                                Money Back Guarantee
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Eligibility */}
            <section className="pt-6 sm:pt-8 lg:pt-10">
                <div className="mx-auto w-[95%]">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                        {/* Eligible */}
                        <div className="w-full lg:w-1/2 rounded-[10px] bg-white p-5 sm:p-6 lg:p-8">
                            <div className="flex items-center gap-3 mb-4 sm:mb-5">
                                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[10px] bg-green-100">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-zinc-900">
                                    Eligible for Refund
                                </h2>
                            </div>
                            <ul className="space-y-3">
                                {refundEligible.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-3"
                                    >
                                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-xs sm:text-sm text-zinc-600">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Not Eligible */}
                        <div className="w-full lg:w-1/2 rounded-[10px] bg-white p-5 sm:p-6 lg:p-8">
                            <div className="flex items-center gap-3 mb-4 sm:mb-5">
                                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[10px] bg-red-100">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                </div>
                                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-zinc-900">
                                    Not Eligible for Refund
                                </h2>
                            </div>
                            <ul className="space-y-3">
                                {refundNotEligible.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-3"
                                    >
                                        <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-xs sm:text-sm text-zinc-600">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Refund Process */}
            <section className="py-6 sm:py-8 lg:py-10">
                <div className="mx-auto w-[95%]">
                    <div
                        className="rounded-[10px] p-5 sm:p-8 lg:p-10"
                        style={{ backgroundColor: "#38bdf8" }}
                    >
                        <div className="text-center mb-6 sm:mb-8">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                                How to Request a Refund
                            </h2>
                            <p className="mt-2 text-xs sm:text-sm text-white/70">
                                Follow these simple steps to initiate your
                                refund
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {refundProcess.map((step) => (
                                <div
                                    key={step.step}
                                    className="rounded-[10px] bg-white/10 p-4 sm:p-5"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-[10px] bg-white text-xs sm:text-sm font-bold text-blue-600">
                                            {step.step}
                                        </span>
                                        <step.icon className="h-5 w-5 text-white/70" />
                                    </div>
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

            {/* Replacements */}
            <section className="pb-6 sm:pb-8">
                <div className="mx-auto w-[95%]">
                    <div className="rounded-[10px] bg-white p-5 sm:p-6 lg:p-8">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[10px] bg-blue-100 flex-shrink-0">
                                <Package className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-zinc-900">
                                    Replacements
                                </h2>
                                <p className="mt-2 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                                    In many cases, we can offer a replacement
                                    instead of a refund. If your product is
                                    defective or damaged, we&apos;ll ship a
                                    replacement at no additional cost.
                                    Replacements are typically processed faster
                                    than refunds and ensure you get the product
                                    you ordered.
                                </p>
                                <p className="mt-3 text-xs sm:text-sm text-zinc-600">
                                    <strong>Note:</strong> For customized
                                    products, replacements will be made with the
                                    same design specifications.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Important Note */}
            <section className="pb-6 sm:pb-8">
                <div className="mx-auto w-[95%]">
                    <div className="rounded-[10px] bg-amber-50 border border-amber-200 p-5 sm:p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-amber-900">
                                    Important Information
                                </h3>
                                <ul className="mt-2 space-y-1 text-xs sm:text-sm text-amber-800">
                                    <li>
                                        • Refunds are credited to the original
                                        payment method only
                                    </li>
                                    <li>
                                        • Shipping charges are non-refundable
                                        unless the error was on our end
                                    </li>
                                    <li>
                                        • COD orders will be refunded via bank
                                        transfer (NEFT/IMPS)
                                    </li>
                                    <li>
                                        • Please keep the original packaging
                                        until your refund is processed
                                    </li>
                                </ul>
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
                            Need to Request a Refund?
                        </h2>
                        <p className="mt-2 text-xs sm:text-sm text-black/70 max-w-lg mx-auto">
                            Our customer support team is ready to help you with
                            your refund request.
                        </p>
                        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                              prefetch={false}
                                href="/contact"
                                className="rounded-[10px] bg-black px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-black/90"
                            >
                                Contact Support
                            </Link>
                            <Link
                              prefetch={false}
                                href="/track-order"
                                className="rounded-[10px] bg-black/20 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-black hover:bg-black/30"
                            >
                                Track Your Order
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
