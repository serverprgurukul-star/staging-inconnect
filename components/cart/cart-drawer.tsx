"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    X,
    Plus,
    Minus,
    ShoppingBag,
    Trash2,
    ArrowRight,
    Truck,
    Sparkles,
    Tag,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";

const FREE_SHIPPING_THRESHOLD = 999;

export function CartDrawer() {
    const {
        items,
        isOpen,
        closeCart,
        removeItem,
        updateQuantity,
        subtotal,
        itemCount,
        appliedCoupon,
        discountAmount,
        total,
    } = useCart();

    const shippingProgress = Math.min(
        (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
        100,
    );
    const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0",
                )}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div
                className={cn(
                    "fixed right-0 top-0 z-50 flex h-full w-full sm:w-[400px] sm:max-w-[90vw] flex-col shadow-2xl transition-transform duration-300 ease-out",
                    isOpen ? "translate-x-0" : "translate-x-full",
                )}
                style={{ backgroundColor: "#F4F4F4" }}
            >
                {/* Header */}
                <div className="bg-white px-4 sm:px-5 py-4 safe-area-top">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-[10px]"
                                style={{ backgroundColor: "#38bdf8" }}
                            >
                                <ShoppingBag className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-zinc-900">
                                    Your Cart
                                </h2>
                                <p className="text-xs text-zinc-500">
                                    {itemCount}{" "}
                                    {itemCount === 1 ? "item" : "items"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={closeCart}
                            className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-zinc-100 text-zinc-500 hover:bg-zinc-200 active:bg-zinc-300"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Free Shipping Progress */}
                    {items.length > 0 && (
                        <div className="mt-4">
                            {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                                <div
                                    className="flex items-center gap-3 rounded-[10px] px-4 py-3"
                                    style={{
                                        backgroundColor:
                                            "rgba(104, 91, 199, 0.1)",
                                    }}
                                >
                                    <div
                                        className="flex h-8 w-8 items-center justify-center rounded-[10px]"
                                        style={{ backgroundColor: "#38bdf8" }}
                                    >
                                        <Truck className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p
                                            className="text-sm font-medium"
                                            style={{ color: "#38bdf8" }}
                                        >
                                            Free shipping unlocked!
                                        </p>
                                        <p
                                            className="text-xs"
                                            style={{
                                                color: "#38bdf8",
                                                opacity: 0.8,
                                            }}
                                        >
                                            Your order qualifies for free
                                            delivery
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-[10px] bg-zinc-100 px-4 py-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-600">
                                            Add{" "}
                                            {formatPrice(amountToFreeShipping)}{" "}
                                            for free shipping
                                        </span>
                                        <Truck className="h-4 w-4 text-zinc-400" />
                                    </div>
                                    <div className="mt-2 h-1.5 overflow-hidden rounded-[10px] bg-zinc-200">
                                        <div
                                            className="h-full rounded-[10px] transition-all duration-500"
                                            style={{
                                                width: `${shippingProgress}%`,
                                                backgroundColor: "#38bdf8",
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center px-4">
                            <div className="flex h-20 w-20 items-center justify-center rounded-[10px] bg-zinc-200">
                                <ShoppingBag className="h-10 w-10 text-zinc-400" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold text-zinc-900">
                                Your cart is empty
                            </h3>
                            <p className="mt-2 text-sm text-zinc-500">
                                Looks like you haven&apos;t added anything yet
                            </p>
                            <button
                                onClick={closeCart}
                                className="mt-6 flex items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-semibold text-white"
                                style={{ backgroundColor: "#38bdf8" }}
                            >
                                Start Shopping
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div
                                    key={item.productId}
                                    className="overflow-hidden rounded-[10px] bg-white p-3 sm:p-4"
                                >
                                    <div className="flex gap-3 sm:gap-4">
                                        {/* Product Image */}
                                        <Link
                                          prefetch={false}
                                            href={`/product/${item.slug}`}
                                            onClick={closeCart}
                                            className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-[10px] bg-zinc-100"
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
                                            <div className="flex items-start justify-between gap-2">
                                                <Link
                                                  prefetch={false}
                                                    href={`/product/${item.slug}`}
                                                    onClick={closeCart}
                                                    className="font-medium text-sm sm:text-base text-zinc-900 hover:text-zinc-700 line-clamp-2"
                                                >
                                                    {item.name}
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        removeItem(
                                                            item.productId,
                                                        )
                                                    }
                                                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px] text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 active:bg-red-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <p className="mt-0.5 text-xs sm:text-sm text-zinc-500">
                                                {formatPrice(item.price)} each
                                            </p>

                                            <div className="mt-auto flex items-center justify-between pt-2 sm:pt-3">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center rounded-[10px] bg-zinc-100">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.productId,
                                                                item.quantity -
                                                                    1,
                                                            )
                                                        }
                                                        className="flex h-8 w-8 items-center justify-center rounded-[10px] text-zinc-600 hover:bg-zinc-200 active:bg-zinc-300"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-semibold text-zinc-900">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.productId,
                                                                item.quantity +
                                                                    1,
                                                            )
                                                        }
                                                        className="flex h-8 w-8 items-center justify-center rounded-[10px] text-zinc-600 hover:bg-zinc-200 active:bg-zinc-300"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <p className="text-base sm:text-lg font-bold text-zinc-900">
                                                    {formatPrice(
                                                        item.price *
                                                            item.quantity,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="bg-white px-4 sm:px-5 py-4 sm:py-5 safe-area-bottom">
                        {/* Promo Banner */}
                        <div
                            className="mb-4 flex items-center gap-3 rounded-[10px] px-4 py-3 text-white"
                            style={{ backgroundColor: "#38bdf8" }}
                        >
                            <Sparkles className="h-5 w-5 flex-shrink-0" />
                            <p className="text-xs sm:text-sm">
                                <span className="font-semibold">10% OFF</span>{" "}
                                on your first order! Use code{" "}
                                <span className="font-mono font-bold">
                                    WELCOME10
                                </span>
                            </p>
                        </div>

                        {/* Summary */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500">Subtotal</span>
                                <span className="font-medium text-zinc-900">
                                    {formatPrice(subtotal)}
                                </span>
                            </div>
                            {appliedCoupon && (
                                <div
                                    className="flex items-center justify-between text-sm"
                                    style={{ color: "#38bdf8" }}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <Tag className="h-3.5 w-3.5" />
                                        <span>{appliedCoupon.code}</span>
                                    </div>
                                    <span>-{formatPrice(discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500">Shipping</span>
                                <span
                                    style={{
                                        color:
                                            subtotal >= FREE_SHIPPING_THRESHOLD
                                                ? "#38bdf8"
                                                : undefined,
                                    }}
                                    className={
                                        subtotal >= FREE_SHIPPING_THRESHOLD
                                            ? "font-medium"
                                            : "text-zinc-900"
                                    }
                                >
                                    {subtotal >= FREE_SHIPPING_THRESHOLD
                                        ? "FREE"
                                        : "Calculated at checkout"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                                <span className="font-semibold text-zinc-900">
                                    Total
                                </span>
                                <span className="text-xl font-bold text-zinc-900">
                                    {formatPrice(total)}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 space-y-2 sm:space-y-3">
                            <Link
                              prefetch={false}
                                href="/checkout"
                                onClick={closeCart}
                                className="flex w-full items-center justify-center gap-2 rounded-[10px] py-3.5 sm:py-4 text-sm font-semibold text-white active:opacity-90"
                                style={{ backgroundColor: "#38bdf8" }}
                            >
                                Checkout • {formatPrice(total)}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                              prefetch={false}
                                href="/cart"
                                onClick={closeCart}
                                className="flex w-full items-center justify-center rounded-[10px] border border-zinc-200 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 active:bg-zinc-100"
                            >
                                View Full Cart
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
