"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Search,
    Package,
    Truck,
    CheckCircle,
    Clock,
    MapPin,
    Calendar,
    ArrowRight,
    HelpCircle,
    Mail,
    Phone,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface OrderDetails {
    id: string;
    order_number: string;
    status: string;
    total: number;
    created_at: string;
    shipping_address: {
        address: string;
        city: string;
        state: string;
        pincode: string;
    };
    items: Array<{
        product_name: string;
        quantity: number;
        unit_price: number;
    }>;
}

const statusSteps = [
    {
        key: "confirmed",
        label: "Confirmed",
        icon: CheckCircle,
        description: "Order placed successfully",
    },
    {
        key: "processing",
        label: "Processing",
        icon: Clock,
        description: "Preparing your order",
    },
    {
        key: "shipped",
        label: "Shipped",
        icon: Truck,
        description: "On the way to you",
    },
    {
        key: "delivered",
        label: "Delivered",
        icon: Package,
        description: "Order delivered",
    },
];

const helpCards = [
    {
        icon: Package,
        title: "Find Order Number",
        description:
            'Check your order confirmation email for your order number starting with "IC-"',
        color: "bg-blue-100",
        iconColor: "text-blue-600",
    },
    {
        icon: Truck,
        title: "Shipping Updates",
        description:
            "Get real-time shipping updates via email and SMS once your order is shipped",
        color: "bg-teal-100",
        iconColor: "text-teal-600",
    },
    {
        icon: Clock,
        title: "Delivery Time",
        description:
            "Standard delivery takes 5-7 business days. Express options available at checkout",
        color: "bg-orange-100",
        iconColor: "text-orange-600",
    },
];

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState("");
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderNumber.trim()) {
            toast.error("Please enter an order number");
            return;
        }

        setIsLoading(true);
        setSearched(true);

        try {
            const supabase = createClient();

            const { data, error } = await supabase
                .from("orders")
                .select(
                    `
          id,
          order_number,
          status,
          total,
          created_at,
          shipping_address,
          order_items (
            product_name,
            quantity,
            unit_price
          )
        `,
                )
                .eq("order_number", orderNumber.trim().toUpperCase())
                .single();

            if (error || !data) {
                setOrder(null);
                toast.error("Order not found");
            } else {
                setOrder({
                    ...data,
                    shipping_address:
                        data.shipping_address as OrderDetails["shipping_address"],
                    items: data.order_items,
                });
            }
        } catch (error) {
            console.error("Error fetching order:", error);
            toast.error("Failed to fetch order. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIndex = (status: string) => {
        const index = statusSteps.findIndex((s) => s.key === status);
        return index >= 0 ? index : 0;
    };

    return (
        <div
            className="overflow-x-hidden"
            style={{ backgroundColor: "#F4F4F4" }}
        >
            {/* Hero */}
            <section className="px-[6px] pb-0">
                <div className="relative h-[55vh] sm:h-[60vh] md:h-[65vh] overflow-hidden rounded-b-[10px]">
                    {/* Background */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6">
                        {/* Icon Badge */}
                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[10px] bg-white/10 backdrop-blur-sm mb-4 sm:mb-5 mt-24">
                            <Package className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>

                        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            Track Your Order
                        </h1>
                        <p className="mt-3 text-center text-xs sm:text-sm md:text-base text-white/70 max-w-xs sm:max-w-md md:max-w-xl">
                            Enter your order number to check the real-time status of your delivery
                        </p>

                        {/* Search Form */}
                        <form
                            onSubmit={handleSearch}
                            className="mt-6 sm:mt-8 w-full max-w-xs sm:max-w-md md:max-w-xl"
                        >
                            <div className="rounded-[10px] bg-white/10 backdrop-blur-sm p-2 sm:p-2.5">
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-zinc-400" />
                                        <input
                                            type="text"
                                            placeholder="Enter order number (e.g., IC-XXXX)"
                                            value={orderNumber}
                                            onChange={(e) =>
                                                setOrderNumber(e.target.value)
                                            }
                                            className="w-full rounded-[10px] border-0 bg-white py-3 sm:py-3.5 pl-10 sm:pl-12 pr-4 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex items-center justify-center gap-2 rounded-[10px] bg-zinc-900 px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                <span className="hidden sm:inline">Searching...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Search className="h-4 w-4" />
                                                <span>Track</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <p className="mt-3 text-center text-[10px] sm:text-xs text-white/50">
                                Find your order number in the confirmation email we sent you
                            </p>
                        </form>
                    </div>
                </div>
            </section>

            {/* Order Details */}
            {searched && (
                <section className="pt-8 pb-6 sm:pt-10 sm:pb-8 lg:pt-12 lg:pb-10">
                    <div className="mx-auto w-[95%]">
                        {order ? (
                            <div className="space-y-4 sm:space-y-6">
                                {/* Order Header Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                    <div className="rounded-[10px] bg-white p-4 sm:p-5">
                                        <p className="text-xs sm:text-sm text-zinc-500">
                                            Order Number
                                        </p>
                                        <p className="mt-1 text-lg sm:text-xl font-bold text-zinc-900">
                                            {order.order_number}
                                        </p>
                                    </div>
                                    <div className="rounded-[10px] bg-white p-4 sm:p-5">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-400" />
                                            <p className="text-xs sm:text-sm text-zinc-500">
                                                Order Date
                                            </p>
                                        </div>
                                        <p className="mt-1 text-lg sm:text-xl font-bold text-zinc-900">
                                            {formatDate(order.created_at)}
                                        </p>
                                    </div>
                                    <div className="rounded-[10px] bg-white p-4 sm:p-5">
                                        <p className="text-xs sm:text-sm text-zinc-500">
                                            Order Total
                                        </p>
                                        <p
                                            className="mt-1 text-lg sm:text-xl font-bold"
                                            style={{ color: "#38bdf8" }}
                                        >
                                            {formatPrice(order.total)}
                                        </p>
                                    </div>
                                </div>

                                {/* Status Timeline */}
                                <div className="rounded-[10px] bg-white p-5 sm:p-6 lg:p-8">
                                    <h3 className="text-base sm:text-lg font-bold text-zinc-900">
                                        Order Status
                                    </h3>
                                    <div className="mt-6 sm:mt-8">
                                        {/* Timeline */}
                                        <div className="relative">
                                            {/* Progress Line */}
                                            <div className="absolute left-4 sm:left-5 top-0 h-full w-0.5 bg-zinc-200" />
                                            <div
                                                className="absolute left-4 sm:left-5 top-0 w-0.5 transition-all duration-500"
                                                style={{
                                                    height: `${(getStatusIndex(order.status) / (statusSteps.length - 1)) * 100}%`,
                                                    backgroundColor: "#38bdf8",
                                                }}
                                            />

                                            {/* Steps */}
                                            <div className="space-y-6 sm:space-y-8">
                                                {statusSteps.map(
                                                    (step, index) => {
                                                        const StatusIcon =
                                                            step.icon;
                                                        const currentIndex =
                                                            getStatusIndex(
                                                                order.status,
                                                            );
                                                        const isCompleted =
                                                            index <=
                                                            currentIndex;
                                                        const isCurrent =
                                                            index ===
                                                            currentIndex;

                                                        return (
                                                            <div
                                                                key={step.key}
                                                                className="relative flex gap-3 sm:gap-4"
                                                            >
                                                                <div
                                                                    className={`relative z-10 flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-[10px] ${
                                                                        isCompleted
                                                                            ? "text-white"
                                                                            : "bg-zinc-100 text-zinc-400"
                                                                    } ${isCurrent ? "ring-4 ring-blue-100" : ""}`}
                                                                    style={
                                                                        isCompleted
                                                                            ? {
                                                                                  backgroundColor:
                                                                                      "#38bdf8",
                                                                              }
                                                                            : {}
                                                                    }
                                                                >
                                                                    <StatusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                                                </div>
                                                                <div className="flex-1 pt-0.5 sm:pt-1">
                                                                    <h4
                                                                        className={`text-sm sm:text-base font-semibold ${
                                                                            isCompleted
                                                                                ? "text-zinc-900"
                                                                                : "text-zinc-400"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            step.label
                                                                        }
                                                                    </h4>
                                                                    <p className="text-xs sm:text-sm text-zinc-500">
                                                                        {
                                                                            step.description
                                                                        }
                                                                    </p>
                                                                </div>
                                                                {isCurrent && (
                                                                    <span
                                                                        className="flex items-center gap-1.5 rounded-[10px] px-2.5 py-1 text-[10px] sm:text-xs font-medium text-white"
                                                                        style={{
                                                                            backgroundColor:
                                                                                "#38bdf8",
                                                                        }}
                                                                    >
                                                                        <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                                        Current
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                                    {/* Order Items */}
                                    <div className="rounded-[10px] bg-white p-5 sm:p-6">
                                        <h3 className="text-sm sm:text-base font-bold text-zinc-900">
                                            Order Items
                                        </h3>
                                        <div className="mt-4 space-y-2 sm:space-y-3">
                                            {order.items.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between rounded-[10px] bg-zinc-50 p-3 sm:p-4"
                                                >
                                                    <div>
                                                        <p className="text-sm sm:text-base font-medium text-zinc-900">
                                                            {item.product_name}
                                                        </p>
                                                        <p className="text-xs sm:text-sm text-zinc-500">
                                                            Qty: {item.quantity}{" "}
                                                            ×{" "}
                                                            {formatPrice(
                                                                item.unit_price,
                                                            )}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm sm:text-base font-semibold text-zinc-900">
                                                        {formatPrice(
                                                            item.quantity *
                                                                item.unit_price,
                                                        )}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 flex justify-between border-t border-zinc-100 pt-4">
                                            <span className="text-sm sm:text-base font-semibold text-zinc-900">
                                                Total
                                            </span>
                                            <span className="text-base sm:text-lg font-bold text-zinc-900">
                                                {formatPrice(order.total)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Shipping Address & Help */}
                                    <div className="space-y-4">
                                        <div className="rounded-[10px] bg-white p-5 sm:p-6">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-400" />
                                                <h3 className="text-sm sm:text-base font-bold text-zinc-900">
                                                    Shipping Address
                                                </h3>
                                            </div>
                                            <div className="mt-4 rounded-[10px] bg-zinc-50 p-3 sm:p-4">
                                                <p className="text-xs sm:text-sm text-zinc-600">
                                                    {
                                                        order.shipping_address
                                                            .address
                                                    }
                                                    <br />
                                                    {
                                                        order.shipping_address
                                                            .city
                                                    }
                                                    ,{" "}
                                                    {
                                                        order.shipping_address
                                                            .state
                                                    }{" "}
                                                    {
                                                        order.shipping_address
                                                            .pincode
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* Need Help */}
                                        <div
                                            className="rounded-[10px] p-5 sm:p-6"
                                            style={{
                                                backgroundColor: "#F5A623",
                                            }}
                                        >
                                            <h3 className="text-sm sm:text-base font-bold text-black">
                                                Need Help?
                                            </h3>
                                            <p className="mt-2 text-xs sm:text-sm text-black/70">
                                                If you have any questions about
                                                your order, our support team is
                                                here to help.
                                            </p>
                                            <Link
                                              prefetch={false}
                                                href="/contact"
                                                className="mt-4 inline-flex items-center gap-2 rounded-[10px] bg-black/20 px-4 py-2.5 text-xs sm:text-sm font-semibold text-black hover:bg-black/30"
                                            >
                                                Contact Support
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-[10px] bg-white p-8 sm:p-12 text-center">
                                <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-[10px] bg-zinc-100">
                                    <Package className="h-7 w-7 sm:h-8 sm:w-8 text-zinc-400" />
                                </div>
                                <h3 className="mt-4 text-base sm:text-lg font-bold text-zinc-900">
                                    Order Not Found
                                </h3>
                                <p className="mt-2 text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
                                    We couldn&apos;t find an order with that
                                    number. Please check and try again.
                                </p>
                                <Link
                                  prefetch={false}
                                    href="/contact"
                                    className="mt-6 inline-flex items-center gap-2 rounded-[10px] bg-zinc-900 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-zinc-800"
                                >
                                    Contact Support
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Help Section */}
            {!searched && (
                <section className="pt-8 pb-6 sm:pt-10 sm:pb-8 lg:pt-12 lg:pb-10">
                    <div className="mx-auto w-[95%]">
                        {/* Section Header */}
                        <div className="text-center pb-5 sm:pb-6 lg:pb-8">
                            <p className="text-xs sm:text-sm text-zinc-500">
                                Everything you need to know about tracking
                            </p>
                            <h2 className="mt-1 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-zinc-900">
                                How to Track Your Order
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                            {helpCards.map((card) => (
                                <div
                                    key={card.title}
                                    className="rounded-[10px] bg-white p-5 sm:p-6 text-center"
                                >
                                    <div
                                        className={`mx-auto flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-[10px] ${card.color}`}
                                    >
                                        <card.icon
                                            className={`h-5 w-5 sm:h-6 sm:w-6 ${card.iconColor}`}
                                        />
                                    </div>
                                    <h3 className="mt-4 text-sm sm:text-base font-bold text-zinc-900">
                                        {card.title}
                                    </h3>
                                    <p className="mt-2 text-xs sm:text-sm text-zinc-500">
                                        {card.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ Section */}
            {!searched && (
                <section className="py-6 sm:py-8 lg:py-10">
                    <div className="mx-auto w-[95%]">
                        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                            {/* FAQ Card */}
                            <div className="w-full lg:w-1/2 rounded-[10px] bg-white p-5 sm:p-6 lg:p-8">
                                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[10px] bg-blue-100">
                                        <HelpCircle className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-zinc-900">
                                        Common Questions
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm sm:text-base font-medium text-zinc-900">
                                            Where can I find my order number?
                                        </h4>
                                        <p className="mt-1 text-xs sm:text-sm text-zinc-500">
                                            Your order number is in your order
                                            confirmation email, starting with
                                            &quot;IC-&quot;.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm sm:text-base font-medium text-zinc-900">
                                            How long does delivery take?
                                        </h4>
                                        <p className="mt-1 text-xs sm:text-sm text-zinc-500">
                                            Standard delivery takes 5-7 business
                                            days across India.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm sm:text-base font-medium text-zinc-900">
                                            Can I change my delivery address?
                                        </h4>
                                        <p className="mt-1 text-xs sm:text-sm text-zinc-500">
                                            Contact our support team before your
                                            order is shipped to update your
                                            address.
                                        </p>
                                    </div>
                                </div>
                                <Link
                                  prefetch={false}
                                    href="/faqs"
                                    className="mt-5 inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    View All FAQs
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {/* Contact Support Card */}
                            <div
                                className="w-full lg:w-1/2 rounded-[10px] p-5 sm:p-6 lg:p-8"
                                style={{ backgroundColor: "#38bdf8" }}
                            >
                                <h3 className="text-lg sm:text-xl font-bold text-white">
                                    Need Assistance?
                                </h3>
                                <p className="mt-2 text-xs sm:text-sm text-white/70">
                                    Our support team is available to help you
                                    with any questions about your order.
                                </p>
                                <div className="mt-5 sm:mt-6 space-y-3">
                                    <div className="flex items-center gap-3 rounded-[10px] bg-white/10 p-3 sm:p-4">
                                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-white/70" />
                                        <div>
                                            <p className="text-xs text-white/50">
                                                Email Us
                                            </p>
                                            <p className="text-sm sm:text-base font-medium text-white">
                                                Pr.gurukul1@gmail.com
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-[10px] bg-white/10 p-3 sm:p-4">
                                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-white/70" />
                                        <div>
                                            <p className="text-xs text-white/50">
                                                Call Us
                                            </p>
                                            <p className="text-sm sm:text-base font-medium text-white">
                                                +91 87646 31130
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                  prefetch={false}
                                    href="/contact"
                                    className="mt-5 sm:mt-6 inline-block rounded-[10px] bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-blue-600 hover:bg-blue-50"
                                >
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Bottom CTA - Only when not searched */}
            {!searched && (
                <section className="py-6 sm:py-8 lg:py-10">
                    <div className="mx-auto w-[95%]">
                        <div
                            className="rounded-[10px] p-5 sm:p-8 lg:p-10 text-center"
                            style={{ backgroundColor: "#F5A623" }}
                        >
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
                                Don&apos;t Have an Order Yet?
                            </h2>
                            <p className="mt-2 text-xs sm:text-sm text-black/70 max-w-lg mx-auto">
                                Explore our range of NFC cards and smart
                                products to start your digital networking
                                journey.
                            </p>
                            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                  prefetch={false}
                                    href="/shop"
                                    className="rounded-[10px] bg-black px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-black/90"
                                >
                                    Shop Now
                                </Link>
                                <Link
                                  prefetch={false}
                                    href="/book-demo"
                                    className="rounded-[10px] bg-black/20 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-black hover:bg-black/30"
                                >
                                    Book a Demo
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
