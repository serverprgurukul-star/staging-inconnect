"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    CheckCircle,
    Package,
    Truck,
    CreditCard,
    Copy,
    Check,
    ArrowRight,
    Phone,
    Mail,
} from "lucide-react";
import toast from "react-hot-toast";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("order");
    const [copied, setCopied] = useState(false);

    const copyOrderNumber = () => {
        if (orderNumber) {
            navigator.clipboard.writeText(orderNumber);
            setCopied(true);
            toast.success("Order number copied!");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!orderNumber) {
        return (
            <div className="min-h-screen bg-slate-100 pt-20 sm:pt-28 lg:pt-32">
                <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-[10px] bg-zinc-200">
                        <Package className="h-8 w-8 sm:h-10 sm:w-10 text-zinc-400" />
                    </div>
                    <h1 className="mt-5 sm:mt-6 text-xl sm:text-2xl font-bold text-zinc-900">
                        No order found
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-zinc-500">
                        Please check your order confirmation email.
                    </p>
                    <Link
                      prefetch={false}
                        href="/"
                        className="mt-5 sm:mt-6 rounded-[10px] bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    const timelineSteps = [
        {
            icon: CheckCircle,
            title: "Order Confirmed",
            description: "Your order has been placed",
            status: "completed",
        },
        {
            icon: CreditCard,
            title: "Processing",
            description: "Design team will connect in 24 hrs",
            status: "current",
        },
        {
            icon: Truck,
            title: "Shipped",
            description: "Tracking details via email",
            status: "pending",
        },
        {
            icon: Package,
            title: "Delivered",
            description: "5-7 business days",
            status: "pending",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Hero Section */}
            <section className="pt-20 sm:pt-28 lg:pt-32 px-[6px] pb-0">
                <div className="mx-auto w-[95%]">
                    <div className="rounded-[10px] bg-black p-6 sm:p-10 md:p-14">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            {/* Left Side */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-emerald-500">
                                        <Check className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-emerald-400 uppercase tracking-wide">
                                        Order Confirmed
                                    </span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter leading-[0.95]">
                                    Thank you for<br />
                                    <span className="text-zinc-500">your order.</span>
                                </h1>
                                <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-md">
                                    Our design team will connect with you in 24 hrs to finalize your card details.
                                </p>
                            </div>

                            {/* Right Side - Order Number */}
                            <div className="lg:text-right">
                                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">
                                    Order Number
                                </p>
                                <div className="inline-flex items-center gap-3 bg-zinc-900 rounded-[10px] px-4 py-3">
                                    <span className="font-mono text-lg sm:text-xl font-bold text-white">
                                        {orderNumber}
                                    </span>
                                    <button
                                        onClick={copyOrderNumber}
                                        className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-6 sm:py-8">
                <div className="mx-auto w-[95%]">
                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* Timeline */}
                        <div className="lg:col-span-2 rounded-[10px] bg-white p-5 sm:p-6">
                            <h2 className="text-lg font-bold text-zinc-900 mb-6">
                                What happens next?
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {timelineSteps.map((step) => {
                                    const Icon = step.icon;
                                    return (
                                        <div
                                            key={step.title}
                                            className={`flex items-start gap-3 p-4 rounded-[10px] ${
                                                step.status === "completed"
                                                    ? "bg-emerald-50"
                                                    : step.status === "current"
                                                      ? "bg-sky-50"
                                                      : "bg-zinc-50"
                                            }`}
                                        >
                                            <div
                                                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] ${
                                                    step.status === "completed"
                                                        ? "bg-emerald-500 text-white"
                                                        : step.status === "current"
                                                          ? "bg-sky-500 text-white"
                                                          : "bg-zinc-200 text-zinc-400"
                                                }`}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-zinc-900">
                                                    {step.title}
                                                </h3>
                                                <p className="text-xs text-zinc-500 mt-0.5">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4">
                            {/* Actions */}
                            <div className="rounded-[10px] bg-white p-5">
                                <div className="space-y-3">
                                    <Link
                                      prefetch={false}
                                        href={`/track-order?order=${orderNumber}`}
                                        className="flex w-full items-center justify-between rounded-[10px] bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
                                    >
                                        Track Order
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <Link
                                      prefetch={false}
                                        href="/shop"
                                        className="flex w-full items-center justify-center rounded-[10px] border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="rounded-[10px] bg-white p-5">
                                <h3 className="text-sm font-bold text-zinc-900 mb-3">
                                    Need Help?
                                </h3>
                                <div className="space-y-2.5">
                                    <a
                                        href="mailto:Pr.gurukul1@gmail.com"
                                        className="flex items-center gap-2.5 text-sm text-zinc-600 hover:text-zinc-900"
                                    >
                                        <Mail className="h-4 w-4" />
                                        Pr.gurukul1@gmail.com
                                    </a>
                                    <a
                                        href="tel:+918764631130"
                                        className="flex items-center gap-2.5 text-sm text-zinc-600 hover:text-zinc-900"
                                    >
                                        <Phone className="h-4 w-4" />
                                        +91 87646 31130
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-slate-100">
                    <div className="h-8 w-8 animate-spin rounded-[10px] border-4 border-zinc-300 border-t-zinc-900" />
                </div>
            }
        >
            <OrderSuccessContent />
        </Suspense>
    );
}
