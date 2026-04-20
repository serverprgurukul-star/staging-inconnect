"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { formatPrice } from "@/lib/utils";
import type { Product, Category } from "@/types/database";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RECENT_SEARCHES_KEY = "instant-connect-recent-searches";
const MAX_RECENT_SEARCHES = 5;

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Load recent searches from localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
            if (saved) {
                setRecentSearches(JSON.parse(saved));
            }
        }
    }, []);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleEsc);
        }
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    // Fetch categories only when modal first opens
    useEffect(() => {
        if (!isOpen || categories.length > 0) return;
        async function fetchCategories() {
            const supabase = createClient();
            const { data } = await supabase
                .from("categories")
                .select("*")
                .eq("is_active", true)
                .order("name");
            setCategories(data || []);
        }
        fetchCategories();
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    // Search products
    const searchProducts = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setProducts([]);
            return;
        }

        setIsLoading(true);
        const supabase = createClient();

        const { data } = await supabase
            .from("products")
            .select("id, slug, name, short_description, price, compare_at_price, images")
            .eq("is_active", true)
            .or(
                `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`,
            )
            .limit(8);

        setProducts(data || []);
        setIsLoading(false);
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            searchProducts(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query, searchProducts]);

    // Save search to recent
    const saveRecentSearch = (search: string) => {
        if (!search.trim()) return;
        const updated = [
            search,
            ...recentSearches.filter((s) => s !== search),
        ].slice(0, MAX_RECENT_SEARCHES);
        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    };

    // Handle product click
    const handleProductClick = () => {
        saveRecentSearch(query);
        onClose();
    };

    // Handle recent search click
    const handleRecentClick = (search: string) => {
        setQuery(search);
        searchProducts(search);
    };

    // Clear recent searches
    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem(RECENT_SEARCHES_KEY);
    };

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm px-4 pt-[5vh] sm:pt-[10vh]"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="w-full max-w-2xl rounded-[10px] bg-white shadow-2xl"
                style={{ maxHeight: "85vh" }}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 border-b border-zinc-200 p-4">
                    <Search className="h-5 w-5 text-zinc-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search products..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 bg-transparent text-lg outline-none placeholder:text-zinc-400"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="rounded-[10px] p-1 hover:bg-zinc-100"
                        >
                            <X className="h-4 w-4 text-zinc-400" />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="rounded-[10px] bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-500"
                    >
                        ESC
                    </button>
                </div>

                {/* Content */}
                <div
                    className="overflow-y-auto"
                    style={{ maxHeight: "calc(85vh - 80px)" }}
                >
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="h-6 w-6 animate-spin rounded-[10px] border-2 border-zinc-300 border-t-zinc-900" />
                        </div>
                    )}

                    {/* Search Results */}
                    {!isLoading && query && products.length > 0 && (
                        <div className="p-4">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                Products ({products.length})
                            </p>
                            <div className="space-y-2">
                                {products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.slug}`}
                                        onClick={handleProductClick}
                                        className="flex items-center gap-4 rounded-[10px] p-3 hover:bg-zinc-50"
                                    >
                                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-[10px] bg-zinc-100">
                                            <Image
                                                src={
                                                    product.images[0] ||
                                                    "/placeholder-product.jpg"
                                                }
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-zinc-900 truncate">
                                                {product.name}
                                            </p>
                                            <p className="text-sm text-zinc-500 truncate">
                                                {product.short_description}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-zinc-900">
                                                {formatPrice(product.price)}
                                            </p>
                                            {product.compare_at_price &&
                                                product.compare_at_price >
                                                    product.price && (
                                                    <p className="text-xs text-zinc-400 line-through">
                                                        {formatPrice(
                                                            product.compare_at_price,
                                                        )}
                                                    </p>
                                                )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link
                                href={`/shop?search=${encodeURIComponent(query)}`}
                                onClick={handleProductClick}
                                className="mt-4 flex items-center justify-center gap-2 rounded-[10px] bg-zinc-100 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-200"
                            >
                                View all results
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    )}

                    {/* No Results */}
                    {!isLoading && query && products.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-zinc-500">
                                No products found for &ldquo;{query}&rdquo;
                            </p>
                            <p className="mt-2 text-sm text-zinc-400">
                                Try a different search term
                            </p>
                        </div>
                    )}

                    {/* Default State - Recent & Categories */}
                    {!query && (
                        <div className="p-4">
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                                <div className="mb-6">
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                            Recent Searches
                                        </p>
                                        <button
                                            onClick={clearRecentSearches}
                                            className="text-xs text-zinc-400 hover:text-zinc-600"
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((search, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    handleRecentClick(search)
                                                }
                                                className="flex items-center gap-2 rounded-[10px] bg-zinc-100 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-200"
                                            >
                                                <Clock className="h-3 w-3" />
                                                {search}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Popular Categories */}
                            <div>
                                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    <TrendingUp className="mr-1.5 inline-block h-3 w-3" />
                                    Popular Categories
                                </p>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/shop?category=${category.slug}`}
                                            onClick={onClose}
                                            className="flex items-center gap-3 rounded-[10px] bg-zinc-50 p-3 hover:bg-zinc-100 sm:p-4"
                                        >
                                            {category.image_url && (
                                                <div className="relative h-10 w-10 overflow-hidden rounded-[10px] bg-zinc-200">
                                                    <Image
                                                        src={category.image_url}
                                                        alt={category.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-zinc-900">
                                                    {category.name}
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    Shop now
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="mt-6 border-t border-zinc-100 pt-6">
                                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Quick Links
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        href="/shop"
                                        onClick={onClose}
                                        className="rounded-[10px] border border-zinc-200 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                                    >
                                        All Products
                                    </Link>
                                    <Link
                                        href="/how-it-works"
                                        onClick={onClose}
                                        className="rounded-[10px] border border-zinc-200 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                                    >
                                        How It Works
                                    </Link>
                                    <Link
                                        href="/faqs"
                                        onClick={onClose}
                                        className="rounded-[10px] border border-zinc-200 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                                    >
                                        FAQs
                                    </Link>
                                    <Link
                                        href="/contact"
                                        onClick={onClose}
                                        className="rounded-[10px] border border-zinc-200 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                                    >
                                        Contact
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
