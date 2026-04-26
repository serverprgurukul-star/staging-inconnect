"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import {
    Home,
    Lock,
    CreditCard,
    Smartphone,
    Building,
    Check,
    ChevronDown,
    ChevronUp,
    ShoppingBag,
    Tag,
    User,
    Building2,
    Phone,
    Mail,
    Globe,
    MessageSquare,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { formatPrice, generateOrderNumber } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill: {
        name: string;
        email: string;
        contact: string;
    };
    theme: {
        color: string;
    };
    modal?: {
        ondismiss?: () => void;
    };
}

interface RazorpayInstance {
    open: () => void;
    close: () => void;
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

const steps = [
    { id: 1, name: "Contact" },
    { id: 2, name: "Shipping" },
    { id: 3, name: "Card Details" },
    { id: 4, name: "Payment" },
];

export default function CheckoutPage() {
    const router = useRouter();
    const {
        items,
        subtotal,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        total,
        isApplyingCoupon,
    } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [showOrderSummary, setShowOrderSummary] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">(
        "cod",
    );
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    const handleApplyCoupon = async () => {
        const success = await applyCoupon(couponCode);
        if (success) {
            setCouponCode("");
        }
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponCode("");
    };

    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        billingAddress: "",
        billingCity: "",
        billingState: "",
        billingPincode: "",
        notes: "",
    });

    // Card details form
    const [cardDetails, setCardDetails] = useState({
        name: "",
        designation: "",
        companyName: "",
        phone: "",
        email: "",
        website: "",
        socialLinks: "",
        additionalNotes: "",
    });

    // Validation errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Validation functions
    const validatePhone = (phone: string) => {
        const cleaned = phone.replace(/\D/g, "");
        return cleaned.length === 10;
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePincode = (pincode: string) => {
        const cleaned = pincode.replace(/\D/g, "");
        return cleaned.length === 6;
    };

    const createOrder = async () => {
        const supabase = createClient();

        // Check stock for all items first
        for (const item of items) {
            const { data: product, error: productError } = await supabase
                .from("products")
                .select("stock_quantity, name")
                .eq("id", item.productId)
                .single();

            if (productError || !product) {
                throw new Error(`Failed to verify stock for ${item.name}`);
            }

            if (product.stock_quantity < item.quantity) {
                throw new Error(
                    `Insufficient stock for ${item.name}. Available: ${product.stock_quantity}`
                );
            }
        }

        // Create or find customer (existing logic)
        const { data: customer, error: customerError } = await supabase
            .from("customers")
            .insert([
                {
                    email: formData.email,
                    phone: formData.phone,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                },
            ])
            .select()
            .single();

        if (customerError) {
            console.error("Customer creation error:", customerError);
            throw new Error(
                `Customer creation failed: ${customerError.message}`,
            );
        }

        const orderNumber = generateOrderNumber();
        const shippingAddress = {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
        };
        const billingAddress = sameAsShipping
            ? shippingAddress
            : {
                  address: formData.billingAddress,
                  city: formData.billingCity,
                  state: formData.billingState,
                  pincode: formData.billingPincode,
              };

        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert([
                {
                    order_number: orderNumber,
                    customer_id: customer.id,
                    status: paymentMethod === "cod" ? "confirmed" : "pending",
                    subtotal: subtotal,
                    discount: discountAmount,
                    coupon_code: appliedCoupon?.code || null,
                    shipping: 0,
                    total: total,
                    shipping_address: shippingAddress,
                    billing_address: billingAddress,
                    notes: formData.notes,
                },
            ])
            .select()
            .single();

        if (orderError) {
            console.error("Order creation error:", orderError);
            throw new Error(`Order creation failed: ${orderError.message}`);
        }

        const orderItems = items.map((item) => ({
            order_id: order.id,
            product_id: item.productId,
            product_name: item.name,
            product_image: item.image,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity,
        }));

        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItems);
        if (itemsError) {
            console.error("Order items error:", itemsError);
            throw new Error(`Order items failed: ${itemsError.message}`);
        }

        // Decrement stock for each product
        for (const item of items) {
            const { data: product } = await supabase
                .from("products")
                .select("stock_quantity")
                .eq("id", item.productId)
                .single();

            if (product) {
                await supabase
                    .from("products")
                    .update({
                        stock_quantity: Math.max(
                            0,
                            product.stock_quantity - item.quantity,
                        ),
                    })
                    .eq("id", item.productId);
            }
        }

        // Save card details (mandatory)
        const { error: cardDetailsError } = await supabase.from("post_payment_details").insert([
            {
                order_id: order.id,
                detail_type: "card_details",
                detail_data: cardDetails,
                status: "pending",
            },
        ]);
        if (cardDetailsError) {
            console.error("Card details error:", cardDetailsError);
            // Don't throw - order is already created, just log the error
        }

        return { order, orderNumber, customer };
    };

    const handleRazorpayPayment = async (
        orderId: string,
        orderNumber: string,
    ) => {
        try {
            // Create Razorpay order
            const response = await fetch("/api/razorpay/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: total,
                    currency: "INR",
                    receipt: orderNumber,
                    notes: { order_id: orderId },
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || "Failed to create payment order");
            }

            // Initialize Razorpay
            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: data.order.amount,
                currency: data.order.currency,
                name: "Instant Connect",
                description: `Order ${orderNumber}`,
                order_id: data.order.id,
                handler: async (response: RazorpayResponse) => {
                    try {
                        // Verify payment
                        const verifyResponse = await fetch(
                            "/api/razorpay/verify-payment",
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    razorpay_order_id:
                                        response.razorpay_order_id,
                                    razorpay_payment_id:
                                        response.razorpay_payment_id,
                                    razorpay_signature:
                                        response.razorpay_signature,
                                    order_id: orderId,
                                }),
                            },
                        );

                        const verifyData = await verifyResponse.json();

                        if (verifyData.success) {
                            clearCart();
                            toast.success("Payment successful!");
                            router.push(`/order-success?order=${orderNumber}`);
                        } else {
                            toast.error(
                                "Payment verification failed. Please contact support.",
                            );
                        }
                    } catch {
                        toast.error(
                            "Payment verification failed. Please contact support.",
                        );
                    }
                },
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: "#38bdf8",
                },
                modal: {
                    ondismiss: () => {
                        setIsLoading(false);
                        toast.error("Payment cancelled");
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Razorpay error:", error);
            toast.error("Failed to initiate payment. Please try again.");
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const supabase = createClient();
            const { order, orderNumber } = await createOrder();

            if (paymentMethod === "cod") {
                // COD payment
                const { error: paymentError } = await supabase
                    .from("payments")
                    .insert([
                        {
                            order_id: order.id,
                            amount: total,
                            status: "pending",
                            method: "cod",
                        },
                    ]);

                if (paymentError) {
                    console.error("Payment record error:", paymentError);
                    throw new Error(
                        `Payment record failed: ${paymentError.message}`,
                    );
                }

                clearCart();
                toast.success("Order placed successfully!");
                router.push(`/order-success?order=${orderNumber}`);
            } else {
                // Online payment via Razorpay
                const { error: paymentError } = await supabase
                    .from("payments")
                    .insert([
                        {
                            order_id: order.id,
                            amount: total,
                            status: "pending",
                            method: "razorpay",
                        },
                    ]);

                if (paymentError) {
                    console.error("Payment record error:", paymentError);
                    throw new Error(
                        `Payment record failed: ${paymentError.message}`,
                    );
                }

                await handleRazorpayPayment(order.id, orderNumber);
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred";
            console.error("Checkout error:", errorMessage, error);
            toast.error(
                errorMessage || "Failed to place order. Please try again.",
            );
            setIsLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div
                className="min-h-screen pt-28 sm:pt-32 lg:pt-36"
                style={{ backgroundColor: "#F4F4F4" }}
            >
                <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
                    <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-[10px] bg-zinc-200">
                        <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-zinc-400" />
                    </div>
                    <h1 className="mt-6 text-xl sm:text-2xl font-bold text-zinc-900">
                        Your cart is empty
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-zinc-500">
                        Add some products to checkout.
                    </p>
                    <Link
                      prefetch={false}
                        href="/shop"
                        className="mt-6 rounded-[10px] px-6 py-3 text-sm font-semibold text-white"
                        style={{ backgroundColor: "#38bdf8" }}
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                onLoad={() => setRazorpayLoaded(true)}
            />
            <div
                className="min-h-screen"
                style={{ backgroundColor: "#F4F4F4" }}
            >
                {/* Header */}
                <div className="pt-28 sm:pt-32 lg:pt-36 pb-4 sm:pb-6">
                    <div className="mx-auto w-[95%]">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-zinc-500 mb-4 sm:mb-6">
                            <Link prefetch={false} href="/" className="hover:text-zinc-700">
                                <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Link>
                            <span>/</span>
                            <Link prefetch={false} href="/cart" className="hover:text-zinc-700">
                                Cart
                            </Link>
                            <span>/</span>
                            <span className="font-medium text-zinc-900">
                                Checkout
                            </span>
                        </nav>

                        {/* Step Indicator */}
                        <div className="flex items-center justify-center">
                            {steps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className="flex items-center"
                                >
                                    <div
                                        className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 ${currentStep >= step.id ? "text-zinc-900" : "text-zinc-400"}`}
                                    >
                                        <div
                                            className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-[10px] text-xs sm:text-sm font-medium ${
                                                currentStep > step.id
                                                    ? "text-white"
                                                    : currentStep === step.id
                                                      ? "text-white"
                                                      : "bg-zinc-200 text-zinc-500"
                                            }`}
                                            style={{
                                                backgroundColor:
                                                    currentStep > step.id
                                                        ? "#10B981"
                                                        : currentStep ===
                                                            step.id
                                                          ? "#38bdf8"
                                                          : undefined,
                                            }}
                                        >
                                            {currentStep > step.id ? (
                                                <Check className="h-4 w-4" />
                                            ) : (
                                                step.id
                                            )}
                                        </div>
                                        <span
                                            className={`text-[10px] sm:text-sm font-medium ${currentStep >= step.id ? "text-zinc-900" : "text-zinc-400"}`}
                                        >
                                            {step.name}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`mx-2 sm:mx-4 h-px w-6 sm:w-12 lg:w-20 ${currentStep > step.id ? "bg-emerald-500" : "bg-zinc-200"}`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Order Summary Toggle */}
                <div className="lg:hidden mx-auto w-[95%] mb-4">
                    <button
                        type="button"
                        onClick={() => setShowOrderSummary(!showOrderSummary)}
                        className="w-full rounded-[10px] bg-white px-4 py-3"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-zinc-500 flex-shrink-0" />
                                <div className="text-left">
                                    <span className="font-semibold text-zinc-900">
                                        Order Summary
                                    </span>
                                    <span className="text-xs text-zinc-500 ml-1">
                                        ({items.length}{" "}
                                        {items.length === 1 ? "item" : "items"})
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-zinc-900">
                                    {formatPrice(total)}
                                </span>
                                {showOrderSummary ? (
                                    <ChevronUp className="h-4 w-4 text-zinc-400" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-zinc-400" />
                                )}
                            </div>
                        </div>
                        {appliedCoupon && (
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-100">
                                <Tag
                                    className="h-3.5 w-3.5 flex-shrink-0"
                                    style={{ color: "#38bdf8" }}
                                />
                                <span
                                    className="text-xs font-medium"
                                    style={{ color: "#38bdf8" }}
                                >
                                    {appliedCoupon.code} applied
                                </span>
                                <span className="text-xs text-zinc-400">
                                    • Save {formatPrice(discountAmount)}
                                </span>
                            </div>
                        )}
                    </button>

                    {/* Collapsible Order Summary */}
                    {showOrderSummary && (
                        <div className="mt-2 rounded-[10px] bg-white p-4">
                            <div className="max-h-48 space-y-3 overflow-y-auto">
                                {items.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="flex gap-3"
                                    >
                                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-[10px] bg-zinc-100">
                                            <Image
                                                src={
                                                    item.image ||
                                                    "/placeholder-product.jpg"
                                                }
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-[10px] bg-zinc-900 text-xs text-white">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-zinc-900 truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-zinc-500">
                                                {formatPrice(
                                                    item.price * item.quantity,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Code - Mobile */}
                            <div className="mt-3 pt-3 border-t border-zinc-100">
                                <label className="text-xs font-medium text-zinc-700">
                                    Coupon Code
                                </label>
                                {appliedCoupon ? (
                                    <div
                                        className="mt-2 flex items-center justify-between rounded-[10px] px-3 py-2.5"
                                        style={{
                                            backgroundColor:
                                                "rgba(104, 91, 199, 0.1)",
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Tag
                                                className="h-4 w-4"
                                                style={{ color: "#38bdf8" }}
                                            />
                                            <span
                                                className="text-sm font-medium"
                                                style={{ color: "#38bdf8" }}
                                            >
                                                {appliedCoupon.code}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="text-xs hover:underline"
                                            style={{ color: "#38bdf8" }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-2 flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter code"
                                            value={couponCode}
                                            onChange={(e) =>
                                                setCouponCode(e.target.value)
                                            }
                                            className="flex-1 rounded-[10px] border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={isApplyingCoupon}
                                            className="rounded-[10px] border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                                        >
                                            {isApplyingCoupon ? "..." : "Apply"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 pt-3 border-t border-zinc-100 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">
                                        Subtotal
                                    </span>
                                    <span className="text-zinc-900">
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>
                                {appliedCoupon && (
                                    <div
                                        className="flex justify-between text-sm"
                                        style={{ color: "#38bdf8" }}
                                    >
                                        <span>
                                            Discount ({appliedCoupon.code})
                                        </span>
                                        <span>
                                            -{formatPrice(discountAmount)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">
                                        Shipping
                                    </span>
                                    <span style={{ color: "#38bdf8" }}>
                                        Free
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Checkout Content */}
                <form id="checkout-form" onSubmit={handleSubmit}>
                    <div className="pb-8">
                        <div className="mx-auto w-[95%]">
                            <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                                {/* Form Sections */}
                                <div className="space-y-3 sm:space-y-4 lg:col-span-2">
                                    {/* Contact Information */}
                                    <div className="rounded-[10px] bg-white p-4 sm:p-6">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                                                Contact Information
                                            </h2>
                                            {currentStep > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setCurrentStep(1)
                                                    }
                                                    className="text-xs sm:text-sm font-medium"
                                                    style={{ color: "#38bdf8" }}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                        {currentStep === 1 ? (
                                            <div className="mt-4 grid gap-3 sm:gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-medium text-zinc-700">
                                                        Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        placeholder="john@example.com"
                                                        value={formData.email}
                                                        onChange={(e) => {
                                                            setFormData({
                                                                ...formData,
                                                                email: e.target.value,
                                                            });
                                                            if (errors.email) {
                                                                setErrors({ ...errors, email: "" });
                                                            }
                                                        }}
                                                        required
                                                        className={`mt-1.5 w-full rounded-[10px] border px-3 py-2.5 sm:py-3 text-sm focus:outline-none ${
                                                            errors.email
                                                                ? "border-red-500 focus:border-red-500"
                                                                : "border-zinc-200 focus:border-zinc-400"
                                                        }`}
                                                    />
                                                    {errors.email && (
                                                        <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-medium text-zinc-700">
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        placeholder="9876543210"
                                                        value={formData.phone}
                                                        onChange={(e) => {
                                                            // Only allow digits
                                                            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                            setFormData({
                                                                ...formData,
                                                                phone: value,
                                                            });
                                                            if (errors.phone) {
                                                                setErrors({ ...errors, phone: "" });
                                                            }
                                                        }}
                                                        required
                                                        className={`mt-1.5 w-full rounded-[10px] border px-3 py-2.5 sm:py-3 text-sm focus:outline-none ${
                                                            errors.phone
                                                                ? "border-red-500 focus:border-red-500"
                                                                : "border-zinc-200 focus:border-zinc-400"
                                                        }`}
                                                    />
                                                    {errors.phone && (
                                                        <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                                                    )}
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newErrors: Record<string, string> = {};

                                                            if (!formData.email) {
                                                                newErrors.email = "Email is required";
                                                            } else if (!validateEmail(formData.email)) {
                                                                newErrors.email = "Please enter a valid email";
                                                            }

                                                            if (!formData.phone) {
                                                                newErrors.phone = "Phone number is required";
                                                            } else if (!validatePhone(formData.phone)) {
                                                                newErrors.phone = "Please enter a valid 10-digit phone number";
                                                            }

                                                            setErrors(newErrors);

                                                            if (Object.keys(newErrors).length > 0) {
                                                                toast.error("Please fix the errors");
                                                                return;
                                                            }
                                                            setCurrentStep(2);
                                                        }}
                                                        className="w-full rounded-[10px] py-3 sm:py-3.5 text-sm font-semibold text-white"
                                                        style={{
                                                            backgroundColor:
                                                                "#38bdf8",
                                                        }}
                                                    >
                                                        Continue to Shipping
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
                                                {formData.email || "No email"} •{" "}
                                                {formData.phone || "No phone"}
                                            </p>
                                        )}
                                    </div>

                                    {/* Shipping Address */}
                                    {currentStep >= 2 && (
                                        <div className="rounded-[10px] bg-white p-4 sm:p-6">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                                                    Shipping Address
                                                </h2>
                                                {currentStep > 2 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setCurrentStep(2)
                                                        }
                                                        className="text-xs sm:text-sm font-medium"
                                                        style={{
                                                            color: "#38bdf8",
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </div>
                                            {currentStep === 2 ? (
                                                <div className="mt-4 grid gap-3 sm:gap-4 sm:grid-cols-2">
                                                    <div>
                                                        <label className="block text-xs sm:text-sm font-medium text-zinc-700">
                                                            First Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="John"
                                                            value={
                                                                formData.firstName
                                                            }
                                                            onChange={(e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    firstName:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            required
                                                            className="mt-1.5 w-full rounded-[10px] border border-zinc-200 px-3 py-2.5 sm:py-3 text-sm focus:border-zinc-400 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs sm:text-sm font-medium text-zinc-700">
                                                            Last Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Doe"
                                                            value={
                                                                formData.lastName
                                                            }
                                                            onChange={(e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    lastName:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            required
                                                            className="mt-1.5 w-full rounded-[10px] border border-zinc-200 px-3 py-2.5 sm:py-3 text-sm focus:border-zinc-400 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <label className="block text-xs sm:text-sm font-medium text-zinc-700">
                                                            Address
                                                        </label>
                                                        <textarea
                                                            placeholder="House/Flat No., Street, Landmark"
                                                            value={
                                                                formData.address
                                                            }
                                                            onChange={(e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    address:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            required
                                                            className="mt-1.5 w-full rounded-[10px] border border-zinc-200 px-3 py-2.5 sm:py-3 text-sm focus:border-zinc-400 focus:outline-none resize-none"
                                                            rows={2}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs sm:text-sm font-medium text-zinc-700">
                                                            City
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Mumbai"
                                                            value={
                                                                formData.city
                                                            }
                                                            onChange={(e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    city: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            }
                                                            required
                                                            className="mt-1.5 w-full rounded-[10px] border border-zinc-200 px-3 py-2.5 sm:py-3 text-sm focus:border-zinc-400 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs sm:text-sm font-medium text-zinc-700">
                                                            State
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Maharashtra"
                                                            value={
                                                                formData.state
                                                            }
                                                            onChange={(e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    state: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            }
                                                            required
                                                            className="mt-1.5 w-full rounded-[10px] border border-zinc-200 px-3 py-2.5 sm:py-3 text-sm focus:border-zinc-400 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="sm:col-span-2 sm:w-1/2">
                                                        <label className="block text-xs sm:text-sm font-medium text-zinc-700">
                                                            PIN Code
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="400001"
                                                            value={formData.pincode}
                                                            onChange={(e) => {
                                                                // Only allow digits, max 6
                                                                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                                                                setFormData({
                                                                    ...formData,
                                                                    pincode: value,
                                                                });
                                                                if (errors.pincode) {
                                                                    setErrors({ ...errors, pincode: "" });
                                                                }
                                                            }}
                                                            required
                                                            className={`mt-1.5 w-full rounded-[10px] border px-3 py-2.5 sm:py-3 text-sm focus:outline-none ${
                                                                errors.pincode
                                                                    ? "border-red-500 focus:border-red-500"
                                                                    : "border-zinc-200 focus:border-zinc-400"
                                                            }`}
                                                        />
                                                        {errors.pincode && (
                                                            <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>
                                                        )}
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <label className="flex items-center gap-3 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    sameAsShipping
                                                                }
                                                                onChange={(e) =>
                                                                    setSameAsShipping(
                                                                        e.target
                                                                            .checked,
                                                                    )
                                                                }
                                                                className="h-4 w-4 rounded border-zinc-300"
                                                                style={{
                                                                    accentColor:
                                                                        "#38bdf8",
                                                                }}
                                                            />
                                                            <span className="text-xs sm:text-sm text-zinc-600">
                                                                Billing address
                                                                same as shipping
                                                            </span>
                                                        </label>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newErrors: Record<string, string> = {};

                                                                if (!formData.firstName) {
                                                                    newErrors.firstName = "First name is required";
                                                                }
                                                                if (!formData.lastName) {
                                                                    newErrors.lastName = "Last name is required";
                                                                }
                                                                if (!formData.address) {
                                                                    newErrors.address = "Address is required";
                                                                }
                                                                if (!formData.city) {
                                                                    newErrors.city = "City is required";
                                                                }
                                                                if (!formData.state) {
                                                                    newErrors.state = "State is required";
                                                                }
                                                                if (!formData.pincode) {
                                                                    newErrors.pincode = "PIN code is required";
                                                                } else if (!validatePincode(formData.pincode)) {
                                                                    newErrors.pincode = "Please enter a valid 6-digit PIN code";
                                                                }

                                                                setErrors(newErrors);

                                                                if (Object.keys(newErrors).length > 0) {
                                                                    toast.error("Please fix the errors");
                                                                    return;
                                                                }
                                                                setCurrentStep(3);
                                                            }}
                                                            className="w-full rounded-[10px] py-3 sm:py-3.5 text-sm font-semibold text-white"
                                                            style={{
                                                                backgroundColor:
                                                                    "#38bdf8",
                                                            }}
                                                        >
                                                            Continue to Card Details
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="mt-2 text-xs sm:text-sm text-zinc-500">
                                                    {formData.firstName ||
                                                    formData.lastName
                                                        ? `${formData.firstName} ${formData.lastName}`.trim()
                                                        : "No name"}
                                                    ,{" "}
                                                    {formData.address ||
                                                        "No address"}
                                                    ,{" "}
                                                    {formData.city || "No city"}
                                                    ,{" "}
                                                    {formData.state ||
                                                        "No state"}{" "}
                                                    -{" "}
                                                    {formData.pincode || "N/A"}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Card Details - Step 3 (Mandatory) */}
                                    {currentStep >= 3 && (
                                        <div className="rounded-[10px] bg-white p-4 sm:p-6">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                                                    Card/Product Details
                                                </h2>
                                                {currentStep > 3 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setCurrentStep(3)}
                                                        className="text-xs sm:text-sm font-medium"
                                                        style={{ color: "#38bdf8" }}
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </div>
                                            {currentStep === 3 ? (
                                                <>
                                                    <p className="mt-1 text-xs sm:text-sm text-zinc-500">
                                                        Provide details for your NFC card or product personalization.
                                                    </p>
                                                    <div className="mt-4 space-y-3 sm:space-y-4">
                                                        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                                                            <div>
                                                                <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-zinc-700">
                                                                    Full Name (for card) <span className="text-red-500">*</span>
                                                                </label>
                                                                <div className="relative">
                                                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                                                    <input
                                                                        type="text"
                                                                        placeholder="John Doe"
                                                                        value={cardDetails.name}
                                                                        onChange={(e) =>
                                                                            setCardDetails({
                                                                                ...cardDetails,
                                                                                name: e.target.value,
                                                                            })
                                                                        }
                                                                        required
                                                                        className="w-full rounded-[10px] border border-zinc-200 py-2.5 sm:py-3 pl-10 pr-4 text-sm focus:border-zinc-400 focus:outline-none"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-zinc-700">
                                                                    Designation/Title
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Marketing Manager"
                                                                    value={cardDetails.designation}
                                                                    onChange={(e) =>
                                                                        setCardDetails({
                                                                            ...cardDetails,
                                                                            designation: e.target.value,
                                                                        })
                                                                    }
                                                                    className="w-full rounded-[10px] border border-zinc-200 px-4 py-2.5 sm:py-3 text-sm focus:border-zinc-400 focus:outline-none"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                                                            <div>
                                                                <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-zinc-700">
                                                                    Company Name
                                                                </label>
                                                                <div className="relative">
                                                                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Acme Inc."
                                                                        value={cardDetails.companyName}
                                                                        onChange={(e) =>
                                                                            setCardDetails({
                                                                                ...cardDetails,
                                                                                companyName: e.target.value,
                                                                            })
                                                                        }
                                                                        className="w-full rounded-[10px] border border-zinc-200 py-2.5 sm:py-3 pl-10 pr-4 text-sm focus:border-zinc-400 focus:outline-none"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-zinc-700">
                                                                    Phone (for card) <span className="text-red-500">*</span>
                                                                </label>
                                                                <div className="relative">
                                                                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                                                    <input
                                                                        type="tel"
                                                                        placeholder="+91 87646 31130"
                                                                        value={cardDetails.phone}
                                                                        onChange={(e) =>
                                                                            setCardDetails({
                                                                                ...cardDetails,
                                                                                phone: e.target.value,
                                                                            })
                                                                        }
                                                                        required
                                                                        className="w-full rounded-[10px] border border-zinc-200 py-2.5 sm:py-3 pl-10 pr-4 text-sm focus:border-zinc-400 focus:outline-none"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                                                            <div>
                                                                <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-zinc-700">
                                                                    Email (for card)
                                                                </label>
                                                                <div className="relative">
                                                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                                                    <input
                                                                        type="email"
                                                                        placeholder="john@example.com"
                                                                        value={cardDetails.email}
                                                                        onChange={(e) =>
                                                                            setCardDetails({
                                                                                ...cardDetails,
                                                                                email: e.target.value,
                                                                            })
                                                                        }
                                                                        className="w-full rounded-[10px] border border-zinc-200 py-2.5 sm:py-3 pl-10 pr-4 text-sm focus:border-zinc-400 focus:outline-none"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-zinc-700">
                                                                    Website URL
                                                                </label>
                                                                <div className="relative">
                                                                    <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                                                    <input
                                                                        type="url"
                                                                        placeholder="https://yourwebsite.com"
                                                                        value={cardDetails.website}
                                                                        onChange={(e) =>
                                                                            setCardDetails({
                                                                                ...cardDetails,
                                                                                website: e.target.value,
                                                                            })
                                                                        }
                                                                        className="w-full rounded-[10px] border border-zinc-200 py-2.5 sm:py-3 pl-10 pr-4 text-sm focus:border-zinc-400 focus:outline-none"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-zinc-700">
                                                                Social Media Links
                                                            </label>
                                                            <textarea
                                                                placeholder="LinkedIn: linkedin.com/in/johndoe&#10;Instagram: @johndoe&#10;Twitter: @johndoe"
                                                                value={cardDetails.socialLinks}
                                                                onChange={(e) =>
                                                                    setCardDetails({
                                                                        ...cardDetails,
                                                                        socialLinks: e.target.value,
                                                                    })
                                                                }
                                                                rows={3}
                                                                className="w-full rounded-[10px] border border-zinc-200 px-4 py-2.5 sm:py-3 text-sm focus:border-zinc-400 focus:outline-none resize-none"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-zinc-700">
                                                                Additional Notes
                                                            </label>
                                                            <div className="relative">
                                                                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                                                <textarea
                                                                    placeholder="Any specific requests or instructions..."
                                                                    value={cardDetails.additionalNotes}
                                                                    onChange={(e) =>
                                                                        setCardDetails({
                                                                            ...cardDetails,
                                                                            additionalNotes: e.target.value,
                                                                        })
                                                                    }
                                                                    rows={2}
                                                                    className="w-full rounded-[10px] border border-zinc-200 py-2.5 sm:py-3 pl-10 pr-4 text-sm focus:border-zinc-400 focus:outline-none resize-none"
                                                                />
                                                            </div>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (!cardDetails.name.trim()) {
                                                                    toast.error("Please enter name for the card");
                                                                    return;
                                                                }
                                                                if (!cardDetails.phone.trim()) {
                                                                    toast.error("Please enter phone number for the card");
                                                                    return;
                                                                }
                                                                setCurrentStep(4);
                                                            }}
                                                            className="w-full rounded-[10px] py-3 sm:py-3.5 text-sm font-semibold text-white"
                                                            style={{ backgroundColor: "#38bdf8" }}
                                                        >
                                                            Continue to Payment
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="mt-2 text-xs sm:text-sm text-zinc-500">
                                                    {cardDetails.name || "No name"} • {cardDetails.phone || "No phone"}
                                                    {cardDetails.companyName && ` • ${cardDetails.companyName}`}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Payment - Step 4 */}
                                    {currentStep >= 4 && (
                                        <div className="rounded-[10px] bg-white p-4 sm:p-6">
                                            <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                                                Payment Method
                                            </h2>
                                            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
                                                Choose your preferred payment method
                                            </p>
                                            <div className="mt-4 grid grid-cols-2 gap-3">
                                                {/* Online Payment - Coming Soon */}
                                                <div
                                                    className="relative flex flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-zinc-200 p-4 sm:p-5 min-h-[100px] opacity-60 cursor-not-allowed"
                                                >
                                                    <div className="absolute top-2 right-2">
                                                        <span className="rounded-[6px] bg-amber-100 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-amber-700">
                                                            Coming Soon
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard className="h-6 w-6 sm:h-7 sm:w-7 text-zinc-400" />
                                                        <Smartphone className="h-6 w-6 sm:h-7 sm:w-7 text-zinc-400" />
                                                    </div>
                                                    <span className="text-xs sm:text-sm font-semibold text-zinc-400">
                                                        Pay Online
                                                    </span>
                                                    <span className="text-[10px] sm:text-xs text-zinc-300">
                                                        UPI / Card / Netbanking
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod("cod")}
                                                    className={`flex flex-col items-center justify-center gap-2 rounded-[10px] border-2 p-4 sm:p-5 transition-all min-h-[100px] ${
                                                        paymentMethod === "cod"
                                                            ? ""
                                                            : "border-zinc-200 hover:border-zinc-300 active:bg-zinc-50"
                                                    }`}
                                                    style={
                                                        paymentMethod === "cod"
                                                            ? {
                                                                  borderColor: "#38bdf8",
                                                                  backgroundColor: "rgba(104, 91, 199, 0.05)",
                                                              }
                                                            : {}
                                                    }
                                                >
                                                    <Building
                                                        className="h-6 w-6 sm:h-7 sm:w-7"
                                                        style={{
                                                            color: paymentMethod === "cod" ? "#38bdf8" : "#71717a",
                                                        }}
                                                    />
                                                    <span
                                                        className={`text-xs sm:text-sm font-semibold ${paymentMethod === "cod" ? "" : "text-zinc-600"}`}
                                                        style={paymentMethod === "cod" ? { color: "#38bdf8" } : {}}
                                                    >
                                                        Cash on Delivery
                                                    </span>
                                                    <span className="text-[10px] sm:text-xs text-zinc-400">
                                                        Pay when delivered
                                                    </span>
                                                </button>
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-xs sm:text-sm font-medium text-zinc-700">
                                                    Order Notes (Optional)
                                                </label>
                                                <textarea
                                                    placeholder="Any special instructions..."
                                                    value={formData.notes}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            notes: e.target.value,
                                                        })
                                                    }
                                                    className="mt-1.5 w-full rounded-[10px] border border-zinc-200 px-3 py-2.5 sm:py-3 text-sm focus:border-zinc-400 focus:outline-none resize-none"
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Order Summary - Desktop */}
                                <div className="hidden lg:block lg:col-span-1">
                                    <div className="sticky top-24 rounded-[10px] bg-white p-6">
                                        <h2 className="text-lg font-bold text-zinc-900">
                                            Order Summary
                                        </h2>
                                        <div className="mt-4 max-h-48 space-y-3 overflow-y-auto">
                                            {items.map((item) => (
                                                <div
                                                    key={item.productId}
                                                    className="flex gap-3"
                                                >
                                                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-[10px] bg-zinc-100">
                                                        <Image
                                                            src={
                                                                item.image ||
                                                                "/placeholder-product.jpg"
                                                            }
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-[10px] bg-zinc-900 text-xs text-white">
                                                            {item.quantity}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-zinc-900 truncate">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-sm text-zinc-500">
                                                            {formatPrice(
                                                                item.price *
                                                                    item.quantity,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Coupon Code - Desktop */}
                                        <div className="mt-4 pt-4 border-t border-zinc-100">
                                            <label className="text-sm font-medium text-zinc-700">
                                                Coupon Code
                                            </label>
                                            {appliedCoupon ? (
                                                <div
                                                    className="mt-2 flex items-center justify-between rounded-[10px] px-4 py-3"
                                                    style={{
                                                        backgroundColor:
                                                            "rgba(104, 91, 199, 0.1)",
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Tag
                                                            className="h-4 w-4"
                                                            style={{
                                                                color: "#38bdf8",
                                                            }}
                                                        />
                                                        <span
                                                            className="font-medium"
                                                            style={{
                                                                color: "#38bdf8",
                                                            }}
                                                        >
                                                            {appliedCoupon.code}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleRemoveCoupon
                                                        }
                                                        className="text-sm hover:underline"
                                                        style={{
                                                            color: "#38bdf8",
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="mt-2 flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter code"
                                                        value={couponCode}
                                                        onChange={(e) =>
                                                            setCouponCode(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="flex-1 rounded-[10px] border border-zinc-200 px-3 py-2.5 text-sm focus:border-zinc-400 focus:outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleApplyCoupon
                                                        }
                                                        disabled={
                                                            isApplyingCoupon
                                                        }
                                                        className="rounded-[10px] border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                                                    >
                                                        {isApplyingCoupon
                                                            ? "..."
                                                            : "Apply"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 space-y-2 border-t border-zinc-100 pt-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-zinc-500">
                                                    Subtotal
                                                </span>
                                                <span className="text-zinc-900">
                                                    {formatPrice(subtotal)}
                                                </span>
                                            </div>
                                            {appliedCoupon && (
                                                <div
                                                    className="flex justify-between text-sm"
                                                    style={{ color: "#38bdf8" }}
                                                >
                                                    <span>
                                                        Discount (
                                                        {appliedCoupon.code})
                                                    </span>
                                                    <span>
                                                        -
                                                        {formatPrice(
                                                            discountAmount,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-sm">
                                                <span className="text-zinc-500">
                                                    Shipping
                                                </span>
                                                <span
                                                    style={{ color: "#38bdf8" }}
                                                >
                                                    Free
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-between border-t border-zinc-100 pt-4">
                                            <span className="text-lg font-semibold text-zinc-900">
                                                Total
                                            </span>
                                            <span className="text-lg font-bold text-zinc-900">
                                                {formatPrice(total)}
                                            </span>
                                        </div>
                                        {currentStep === 4 && (
                                            <button
                                                type="submit"
                                                disabled={
                                                    isLoading ||
                                                    (paymentMethod ===
                                                        "online" &&
                                                        !razorpayLoaded)
                                                }
                                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-[10px] py-3.5 text-sm font-semibold text-white disabled:opacity-50"
                                                style={{
                                                    backgroundColor: "#38bdf8",
                                                }}
                                            >
                                                <Lock className="h-4 w-4" />
                                                {isLoading
                                                    ? "Processing..."
                                                    : paymentMethod === "online"
                                                      ? "Pay Now"
                                                      : "Place Order (COD)"}
                                            </button>
                                        )}
                                        <p className="mt-4 text-center text-xs text-zinc-500">
                                            By placing this order, you agree to
                                            our Terms of Service.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Mobile spacer for sticky footer */}
                {currentStep === 4 && (
                    <div className="h-32 lg:hidden" aria-hidden="true" />
                )}

                {/* Mobile Sticky Footer */}
                {currentStep === 4 && (
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-xs text-zinc-500">
                                    Total Amount
                                </p>
                                <p className="text-lg font-bold text-zinc-900">
                                    {formatPrice(total)}
                                </p>
                            </div>
                            {appliedCoupon && (
                                <span
                                    className="flex items-center gap-1 px-2 py-1 rounded-[10px] text-xs font-medium"
                                    style={{
                                        backgroundColor:
                                            "rgba(104, 91, 199, 0.1)",
                                        color: "#38bdf8",
                                    }}
                                >
                                    <Tag className="h-3 w-3" />
                                    {appliedCoupon.code} applied
                                </span>
                            )}
                        </div>
                        <button
                            type="submit"
                            form="checkout-form"
                            disabled={
                                isLoading ||
                                (paymentMethod === "online" && !razorpayLoaded)
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-[10px] py-4 text-sm font-semibold text-white disabled:opacity-50 active:opacity-90"
                            style={{ backgroundColor: "#38bdf8" }}
                            onClick={handleSubmit}
                        >
                            <Lock className="h-4 w-4" />
                            {isLoading
                                ? "Processing..."
                                : paymentMethod === "online"
                                  ? "Pay Now"
                                  : "Place Order (COD)"}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
