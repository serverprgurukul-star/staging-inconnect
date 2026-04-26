"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    ArrowRight,
    Tag,
    Home,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
    const {
        items,
        updateQuantity,
        removeItem,
        subtotal,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        total,
        isApplyingCoupon,
    } = useCart();
    const [couponCode, setCouponCode] = useState("");

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
                        Looks like you haven&apos;t added anything to your cart
                        yet.
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
        <div className="min-h-screen" style={{ backgroundColor: "#F4F4F4" }}>
            {/* Header */}
            <div className="pt-28 sm:pt-32 lg:pt-36 pb-4 sm:pb-6">
                <div className="mx-auto w-[95%]">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-zinc-500 mb-3 sm:mb-4">
                        <Link prefetch={false} href="/" className="hover:text-zinc-700">
                            <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Link>
                        <span>/</span>
                        <span className="font-medium text-zinc-900">Cart</span>
                    </nav>

                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900">
                        Shopping Cart
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        {items.length} {items.length === 1 ? "item" : "items"}{" "}
                        in your cart
                    </p>
                </div>
            </div>

            {/* Cart Content - extra padding on mobile for sticky footer */}
            <div className="pb-36 sm:pb-8">
                <div className="mx-auto w-[95%]">
                    <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.productId}
                                    className="flex gap-3 sm:gap-4 rounded-[10px] bg-white p-3 sm:p-4"
                                >
                                    {/* Product Image */}
                                    <Link
                                      prefetch={false}
                                        href={`/product/${item.slug}`}
                                        className="relative h-20 w-20 sm:h-28 sm:w-28 flex-shrink-0 overflow-hidden rounded-[10px] bg-zinc-100"
                                    >
                                        <Image
                                            src={
                                                item.image ||
                                                "/placeholder-product.jpg"
                                            }
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </Link>

                                    {/* Product Info */}
                                    <div className="flex flex-1 flex-col min-w-0">
                                        <div className="flex justify-between gap-2">
                                            <div className="min-w-0">
                                                <Link
                                                  prefetch={false}
                                                    href={`/product/${item.slug}`}
                                                    className="font-medium text-sm sm:text-base text-zinc-900 hover:text-zinc-700 line-clamp-2"
                                                >
                                                    {item.name}
                                                </Link>
                                                <p className="mt-0.5 text-xs sm:text-sm text-zinc-500">
                                                    {formatPrice(item.price)}{" "}
                                                    each
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    removeItem(item.productId)
                                                }
                                                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px] text-zinc-400 hover:bg-red-50 hover:text-red-500 active:bg-red-100"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-2 sm:pt-3">
                                            {/* Quantity */}
                                            <div className="flex items-center rounded-[10px] border border-zinc-200">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.productId,
                                                            item.quantity - 1,
                                                        )
                                                    }
                                                    className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center hover:bg-zinc-50 active:bg-zinc-100 rounded-l-full"
                                                >
                                                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </button>
                                                <span className="w-8 sm:w-10 text-center text-sm font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.productId,
                                                            item.quantity + 1,
                                                        )
                                                    }
                                                    className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center hover:bg-zinc-50 active:bg-zinc-100 rounded-r-full"
                                                >
                                                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </button>
                                            </div>

                                            {/* Item Total */}
                                            <p className="font-bold text-zinc-900 text-sm sm:text-base">
                                                {formatPrice(
                                                    item.price * item.quantity,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Clear Cart */}
                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={clearCart}
                                    className="text-xs sm:text-sm text-red-500 hover:text-red-600 active:text-red-700"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>

                        {/* Order Summary - Desktop */}
                        <div className="hidden sm:block lg:col-span-1">
                            <div className="sticky top-24 rounded-[10px] bg-white p-4 sm:p-6">
                                <h2 className="text-lg font-bold text-zinc-900">
                                    Order Summary
                                </h2>

                                {/* Coupon Code */}
                                <div className="mt-5">
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
                                                    style={{ color: "#38bdf8" }}
                                                />
                                                <span
                                                    className="font-medium"
                                                    style={{ color: "#38bdf8" }}
                                                >
                                                    {appliedCoupon.code}
                                                </span>
                                            </div>
                                            <button
                                                onClick={handleRemoveCoupon}
                                                className="text-sm hover:underline"
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
                                                    setCouponCode(
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex-1 rounded-[10px] border border-zinc-200 px-3 py-2.5 text-sm focus:border-zinc-400 focus:outline-none"
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={isApplyingCoupon}
                                                className="rounded-[10px] border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                                            >
                                                {isApplyingCoupon
                                                    ? "..."
                                                    : "Apply"}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Price Breakdown */}
                                <div className="mt-5 space-y-2.5 border-t border-zinc-100 pt-5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">
                                            Subtotal
                                        </span>
                                        <span className="font-medium text-zinc-900">
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

                                {/* Total */}
                                <div className="mt-5 border-t border-zinc-100 pt-5">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-semibold text-zinc-900">
                                            Total
                                        </span>
                                        <span className="text-lg font-bold text-zinc-900">
                                            {formatPrice(total)}
                                        </span>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <Link
                                  prefetch={false}
                                    href="/checkout"
                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-[10px] py-3.5 text-sm font-semibold text-white"
                                    style={{ backgroundColor: "#38bdf8" }}
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="h-4 w-4" />
                                </Link>

                                {/* Continue Shopping */}
                                <Link
                                  prefetch={false}
                                    href="/shop"
                                    className="mt-3 flex w-full items-center justify-center rounded-[10px] border border-zinc-200 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile spacer for sticky footer - ensures footer content isn't hidden */}
            <div className="h-32 sm:hidden" aria-hidden="true" />

            {/* Mobile Sticky Checkout Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-200 p-4 sm:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-xs text-zinc-500">
                            Total ({items.length} items)
                        </p>
                        <p className="text-lg font-bold text-zinc-900">
                            {formatPrice(total)}
                        </p>
                    </div>
                    {appliedCoupon && (
                        <div
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] text-xs font-medium"
                            style={{
                                backgroundColor: "rgba(104, 91, 199, 0.1)",
                                color: "#38bdf8",
                            }}
                        >
                            <Tag className="h-3 w-3" />
                            {appliedCoupon.code}
                        </div>
                    )}
                </div>
                <Link
                  prefetch={false}
                    href="/checkout"
                    className="flex w-full items-center justify-center gap-2 rounded-[10px] py-3.5 text-sm font-semibold text-white active:opacity-90"
                    style={{ backgroundColor: "#38bdf8" }}
                >
                    Checkout • {formatPrice(total)}
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
