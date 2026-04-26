"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types/database";
import type { CartItem } from "@/contexts/cart-context";

interface ProductCardProps {
    product: Product;
    categorySlug?: string;
    noBg?: boolean;
    tag?: "Featured" | "Popular" | "New" | "Bestseller";
}

export function ProductCard({ product, categorySlug, noBg, tag }: ProductCardProps) {
    const { addItem, items } = useCart();
    const discount = calculateDiscount(product.price, product.compare_at_price);
    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const isOutOfStock = product.stock_quantity <= 0;
    const isInCart = items.some((i: CartItem) => i.productId === product.id);
    // Block if this featured product is already in cart, OR if any other featured product is in cart
    const anyFeaturedInCart = items.some((i: CartItem) => i.isFeatured);
    const isFeaturedBlocked = product.is_featured && anyFeaturedInCart;
    const cartDisabled = isOutOfStock || isFeaturedBlocked;

    const productUrl = `/product/${product.slug}`;

    const images = product.images.length > 0 ? product.images : ["/placeholder-product.jpg"];
    const hasMultipleImages = images.length > 1;

    useEffect(() => {
        if (isHovered && hasMultipleImages) {
            intervalRef.current = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            setCurrentImageIndex(0);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isHovered, hasMultipleImages, images.length]);

    const displayTag = tag || (product.is_featured ? "Bestseller" : "New");

    const tagColors: Record<string, string> = {
        Featured: "bg-sky-500",
        Popular: "bg-purple-500",
        New: "bg-emerald-500",
        Bestseller: "bg-red-500",
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (cartDisabled) return;
        addItem({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            compareAtPrice: product.compare_at_price,
            image: images[0],
            isFeatured: product.is_featured,
            stockQuantity: product.stock_quantity,
        });
    };

    return (
        <Link href={productUrl} className="block h-full">
            <div
                className="group h-full flex flex-col rounded-[10px] p-3 sm:p-4 transition"
                style={{ background: noBg ? "#f4f4f4" : "#ebebeb" }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* IMAGE - Square using padding trick */}
                <div className="relative w-full rounded-[10px] bg-white overflow-hidden" style={{ paddingBottom: '100%' }}>
                    {images.map((image, index) => (
                        <Image
                            key={index}
                            src={image}
                            alt={`${product.name}${index > 0 ? ` - view ${index + 1}` : ""}`}
                            fill
                            className={`object-cover transition-all duration-500 ${
                                index === currentImageIndex
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-105"
                            }`}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            loading={index === 0 ? "eager" : "lazy"}
                        />
                    ))}

                    {/* BADGE */}
                    <div className="absolute left-3 top-3 z-10">
                        {isOutOfStock ? (
                            <span className="rounded-md bg-zinc-500 px-3 py-1 text-xs font-semibold text-white">
                                Out of Stock
                            </span>
                        ) : (
                            <span className={`rounded-md ${tagColors[displayTag] || "bg-red-500"} px-3 py-1 text-xs font-semibold text-white`}>
                                {displayTag}
                            </span>
                        )}
                    </div>

                    {/* Out of Stock overlay */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-white/50 rounded-[10px] z-10" />
                    )}

                    {/* Mobile Cart Button */}
                    {!isOutOfStock && (
                        <button
                            onClick={handleAddToCart}
                            disabled={cartDisabled}
                            className="sm:hidden absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black text-white z-10 active:scale-95 transition-transform shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ShoppingCart className="h-4 w-4" />
                        </button>
                    )}

                    {/* Desktop Hover Cart */}
                    {!isOutOfStock && (
                        <div
                            className={`hidden sm:flex absolute inset-x-0 bottom-0 justify-center pb-4 transition-all duration-300 ${
                                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                            }`}
                        >
                            <button
                                onClick={handleAddToCart}
                                disabled={cartDisabled}
                                className="flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                {isInCart ? "Added" : isFeaturedBlocked ? "Limit reached" : "Add to Cart"}
                            </button>
                        </div>
                    )}
                </div>

                {/* TEXT CONTENT - grows to fill, pushes price to bottom */}
                <div className="mt-3 sm:mt-4 flex flex-col flex-grow">
                    {/* TITLE */}
                    <h3 className="text-base sm:text-lg font-bold leading-snug text-zinc-900 line-clamp-2">
                        {product.name}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="mt-1 text-xs sm:text-sm text-zinc-500 line-clamp-2">
                        {product.short_description || "\u00A0"}
                    </p>

                    {/* PRICE - pushed to bottom */}
                    <div className="mt-auto pt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="text-lg sm:text-xl font-extrabold text-zinc-900">
                            {formatPrice(product.price)}
                        </span>

                        {product.compare_at_price && (
                            <span className="text-sm text-zinc-600 line-through">
                                {formatPrice(product.compare_at_price)}
                            </span>
                        )}

                        {discount > 0 && (
                            <span className="rounded-md bg-emerald-500 px-1.5 py-0.5 text-[11px] sm:text-[12px] font-semibold text-white">
                                {discount}% OFF
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
