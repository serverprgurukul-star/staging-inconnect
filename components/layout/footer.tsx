"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
    Mail,
    MapPin,
    Star,
    Instagram,
    Facebook,
    Twitter,
    Linkedin,
    Youtube,
    Truck,
    IndianRupee,
    Wand,
    ShieldCheck,
    Gift,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Category {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
    display_order: number;
}

const exploreLinks = [
    { name: "About Us", href: "/about" },
    { name: "Shop All", href: "/shop" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "AI Review Card", href: "/ai-review-card", featured: true },
    { name: "Contact", href: "/contact" },
    // { name: "Blogs / Articles", href: "/blog" },
];

const socialLinks = [
    { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
    // { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
    // { name: "Linkedin", icon: Linkedin, href: "https://linkedin.com" },
    // { name: "Youtube", icon: Youtube, href: "https://youtube.com" },
];

export function Footer() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        async function fetchCategories() {
            const supabase = createClient();
            const { data } = await supabase
                .from("categories")
                .select("*")
                .eq("is_active", true)
                .order("display_order", { ascending: true });

            if (data) {
                setCategories(data);
            }
        }
        fetchCategories();
    }, []);

    return (
        <footer className="bg-[#EBEBEB] pt-16 pb-8 text-black font-sans">
            <div className="mx-auto max-w-[95%] px-4 lg:px-10">
                {/* --- TOP SECTION: CONTACT & LINKS --- */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
                    {/* Email & Address (Left) */}
                    <div className="md:col-span-4 space-y-6">
                        <a
                            href="mailto:support@inconnect.in"
                            className="text-2xl font-bold border-b-2 border-black pb-1 hover:opacity-70 transition-opacity"
                        >
                            support@inconnect.in
                        </a>

                        <div className="flex items-start gap-4 pt-4">
                            <div className="p-3 bg-white/50 rounded-[10px] border border-zinc-200">
                                <MapPin size={24} className="text-zinc-500" />
                            </div>
                            <p className="text-sm font-bold leading-relaxed max-w-[260px]">
                                Siddharth nagar, opposite of Miraj Malhar
                                appartment, New Bhupalpura, Udaipur, Rajasthan
                                313001
                            </p>
                        </div>
                    </div>

                    {/* Links Grid (Middle) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 col-span-full lg:col-span-5 gap-8">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">
                                Product
                            </h3>
                            <ul className="space-y-4">
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <Link
                                            href={`/shop?category=${category.slug}`}
                                            className="text-sm font-bold text-zinc-600 hover:text-sky-600 transition-colors"
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">
                                Explore
                            </h3>
                            <ul className="space-y-4">
                                {exploreLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="flex items-center gap-2 text-sm font-bold text-zinc-600 hover:text-sky-600 transition-colors"
                                        >
                                            {link.featured && (
                                                <Star
                                                    size={12}
                                                    className="fill-sky-500 text-sky-500"
                                                />
                                            )}
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">
                                Support
                            </h3>
                            <ul className="space-y-4">
                                <li>
                                    <Link
                                        href="/track-order"
                                        className="text-sm font-bold text-zinc-600 hover:text-sky-600 transition-colors"
                                    >
                                        Track Order
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/faqs"
                                        className="text-sm font-bold text-zinc-600 hover:text-sky-600 transition-colors"
                                    >
                                        FAQs
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link
                                        href="/privacy"
                                        className="text-sm font-bold text-zinc-600 hover:text-sky-600 transition-colors"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/refund"
                                        className="text-sm font-bold text-zinc-600 hover:text-sky-600 transition-colors"
                                    >
                                        Refund Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/terms"
                                        className="text-sm font-bold text-zinc-600 hover:text-sky-600 transition-colors"
                                    >
                                        Terms & Conditions
                                    </Link>
                                </li> */}
                            </ul>
                        </div>
                    </div>

                    {/* Trust Badges (Right) */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-3 text-sm font-medium">
                            <Truck />
                            Free Shipping*
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium">
                            <IndianRupee />
                            Secured Payments
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium">
                            <Wand />
                            Surprises
                        </div>
                    </div>
                </div>

                {/* ---  NEWSLETTER --- */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-10 mb-8">
                    {/* Large Brand Logo */}

                    <img src="/Logo_3.svg" className="w-[140px] sm:w-[160px] md:w-[300px]" alt="Instant Connect" />

                    {/* BeezTech Advertisement Card */}
                </div>

                {/* --- LEGAL --- */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-black/10 pt-4">
                    <div className="flex flex-row w-full justify-between gap-4">
                        <p className="text-xs font-bold text-zinc-500">
                            Copyright © 2025{" "}
                            <span className="text-sky-600">
                                Instant Connect
                            </span>{" "}
                            All Rights Reserved.
                        </p>
                        <div className="hidden md:flex flex-wrap gap-x-8 gap-y-2 text-xs font-black">
                            <Link href="/privacy" className="hover:underline">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:underline">
                                Terms of Service
                            </Link>
                            <Link href="/refund" className="hover:underline">
                                Refund Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
    return (
        <div className="flex flex-col gap-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">
                {title}
            </h3>
            <ul className="flex flex-col gap-3">
                {links.map((link) => (
                    <li key={link}>
                        <Link
                            href="#"
                            className="text-xs font-bold hover:text-[#FF8026] transition-colors"
                        >
                            {link}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
