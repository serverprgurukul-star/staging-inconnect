"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    compare_at_price: number | null;
    images: string[];
    is_featured: boolean;
}

interface ShopProductCardProps {
    product: Product;
}

export function ShopProductCard({ product }: ShopProductCardProps) {
    const { addItem } = useCart();
    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const images =
        product.images.length > 0
            ? product.images
            : ["/placeholder-product.jpg"];

    // Auto-slide images on hover (desktop only)
    useEffect(() => {
        if (isHovered && images.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
            }, 1500);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setCurrentImageIndex(0);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isHovered, images.length]);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            compareAtPrice: product.compare_at_price,
            image: images[0],
        });
    };

    return (
        <div className="group">
            <Link prefetch={false} href={`/product/${product.slug}`}>
                <div
                    className="relative aspect-square overflow-hidden rounded-[10px] bg-white"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Images */}
                    {images.map((image, index) => (
                        <Image
                            key={index}
                            src={image}
                            alt={product.name}
                            fill
                            className={`object-contain p-4 sm:p-6 transition-opacity duration-500 ${
                                index === currentImageIndex
                                    ? "opacity-100"
                                    : "opacity-0"
                            }`}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    ))}

                    {/* Popular Badge */}
                    {product.is_featured && (
                        <span
                            className="absolute left-2 top-2 sm:left-3 sm:top-3 rounded-[10px] px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium text-white z-10"
                            style={{ backgroundColor: "#38bdf8" }}
                        >
                            Popular
                        </span>
                    )}

                    {/* Mobile: Cart Icon Button (always visible) */}
                    <button
                        onClick={handleAddToCart}
                        className="lg:hidden absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-[10px] shadow-lg text-white z-10 active:scale-95 transition-transform"
                        style={{ backgroundColor: "#38bdf8" }}
                    >
                        <ShoppingCart className="h-5 w-5" />
                    </button>

                    {/* Desktop: Hover Overlay with Add to Cart */}
                    <div
                        className={`hidden lg:flex absolute inset-x-0 bottom-0 flex-col items-center justify-end pb-4 transition-opacity duration-300 ${
                            isHovered ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        {/* Dots Indicator */}
                        {images.length > 1 && (
                            <div className="flex items-center gap-1.5 mb-3">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setCurrentImageIndex(index);
                                        }}
                                        className={`h-2 w-2 rounded-[10px] transition-colors ${
                                            index === currentImageIndex
                                                ? "bg-zinc-800"
                                                : "bg-zinc-300"
                                        }`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className="rounded-[10px] px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: "#38bdf8" }}
                        >
                            Add to cart
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="mt-3">
                    <h3 className="text-sm sm:text-base font-medium text-zinc-900 line-clamp-1 group-hover:text-zinc-600 transition-colors">
                        {product.name}
                    </h3>
                    <p className="mt-0.5 text-sm sm:text-base text-zinc-500">
                        {formatPrice(product.price)}
                    </p>
                </div>
            </Link>
        </div>
    );
}
