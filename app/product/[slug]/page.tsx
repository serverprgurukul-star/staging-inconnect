"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    Home,
    Star,
    Scissors,
    Users,
    Smartphone,
    Apple,
    Tablet,
    Shield,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils";
import type { Product, Category } from "@/types/database";
import { ProductCard } from "@/components/products/product-card";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const productFaqs = [
    {
        question: "What is Instant Connect?",
        answer: "Instant Connect is an NFC-based digital solution that allows you to instantly share your business details, contact information, social media links, payment links, and more by simply tapping the card or scanning a QR code.",
    },
    {
        question: "Which devices support Instant Connect?",
        answer: "Instant Connect works on all NFC-enabled Android phones and iPhones (XR and above). For devices without NFC, the QR code on the product can be scanned to access the details.",
    },
    {
        question: "Can I update my information after purchase?",
        answer: "Yes, your digital information can be updated even after purchase. Updates depend on the plan selected and may be free or chargeable as per the service terms.",
    },
    {
        question: "Do I need an internet connection to use Instant Connect?",
        answer: "Internet is required only to open the digital profile. The NFC card itself does not require charging, battery, or any app installation.",
    },
    {
        question: "Is the NFC card reusable and shareable?",
        answer: "Yes, the NFC card is reusable and long-lasting. You can tap it unlimited times and share your details with anyone without any physical wear for digital data.",
    },
    {
        question: "What happens if my card gets damaged or lost?",
        answer: "Physical damage or loss is not covered under warranty. However, you can reorder a replacement card and link it to your existing digital profile.",
    },
];

export default function ProductPage({ params }: PageProps) {
    const [product, setProduct] = useState<Product | null>(null);
    const [category, setCategory] = useState<Category | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const { addItem, items } = useCart();

    useEffect(() => {
        async function fetchProduct() {
            const { slug } = await params;
            const supabase = createClient();

            const { data: productData } = await supabase
                .from("products")
                .select("*")
                .eq("slug", slug)
                .eq("is_active", true)
                .single();

            if (!productData) {
                notFound();
            }

            setProduct(productData);

            if (productData.category_id) {
                const { data: categoryData } = await supabase
                    .from("categories")
                    .select("*")
                    .eq("id", productData.category_id)
                    .single();
                setCategory(categoryData);

                const { data: related } = await supabase
                    .from("products")
                    .select("*")
                    .eq("category_id", productData.category_id)
                    .neq("id", productData.id)
                    .eq("is_active", true)
                    .limit(4);
                setRelatedProducts(related || []);
            }

            setIsLoading(false);
        }

        fetchProduct();
    }, [params]);

    if (isLoading) {
        return (
            <div
                className="min-h-screen pt-20 sm:pt-28 lg:pt-36"
                style={{ backgroundColor: "#F4F4F4" }}
            >
                <div className="mx-auto w-[95%]">
                    <div className="grid lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-12">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <div className="hidden sm:flex flex-col gap-3">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-16 h-16 lg:w-20 lg:h-20 rounded-[10px] bg-zinc-200 animate-pulse"
                                    />
                                ))}
                            </div>
                            <div className="flex-1 aspect-square rounded-[10px] bg-zinc-200 animate-pulse" />
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="h-5 w-32 sm:w-48 bg-zinc-200 rounded animate-pulse" />
                            <div className="h-8 sm:h-10 w-48 sm:w-64 bg-zinc-200 rounded animate-pulse" />
                            <div className="h-16 sm:h-20 w-full bg-zinc-200 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return notFound();
    }

    const images =
        product.images.length > 0
            ? product.images
            : ["/placeholder-product.jpg"];

    const isOutOfStock = product.stock_quantity <= 0;
    const isInCart = items.some((i) => i.productId === product.id);
    const anyFeaturedInCart = items.some((i) => i.isFeatured);
    const isFeaturedBlocked = product.is_featured && anyFeaturedInCart;
    const addDisabled = isOutOfStock || isFeaturedBlocked;

    const handleAddToCart = () => {
        if (addDisabled) return;
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
        <div className="min-h-screen" style={{ backgroundColor: "#F4F4F4" }}>
            {/* Main Content */}
            <section className="pt-20 sm:pt-28 lg:pt-36 pb-6 sm:pb-10 lg:pb-16">
                <div className="mx-auto w-[95%]">
                    <div className="grid lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-12 xl:gap-16">
                        {/* Left: Image Gallery */}
                        <div>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                {/* Vertical Thumbnails (Desktop/Tablet) */}
                                {images.length > 1 && (
                                    <div className="hidden sm:flex flex-col gap-2 lg:gap-3 order-first">
                                        {images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    setSelectedImage(index)
                                                }
                                                className={`relative w-14 h-14 lg:w-20 lg:h-20 rounded-[10px] overflow-hidden border-2 transition-all shrink-0 ${
                                                    selectedImage === index
                                                        ? "border-zinc-900"
                                                        : "border-transparent hover:border-zinc-300"
                                                }`}
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`${product.name} ${index + 1}`}
                                                    fill
                                                    sizes="80px"
                                                    className="object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Main Image */}
                                <div className="relative flex-1 aspect-square rounded-[10px] overflow-hidden bg-white">
                                    <Image
                                        src={images[selectedImage]}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 1024px) 95vw, 50vw"
                                        className="object-contain p-4 sm:p-6 lg:p-10"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Mobile Thumbnails (Horizontal scroll) */}
                            {images.length > 1 && (
                                <div className="flex sm:hidden gap-2.5 overflow-x-auto no-scrollbar mt-3 pb-1">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedImage(index)
                                            }
                                            className={`relative rounded-[10px] overflow-hidden border-2 transition-all shrink-0 ${
                                                selectedImage === index
                                                    ? "border-zinc-900 ring-2 ring-zinc-900/20"
                                                    : "border-zinc-200 active:border-zinc-400"
                                            }`}
                                            style={{
                                                width: "72px",
                                                height: "72px",
                                            }}
                                        >
                                            <Image
                                                src={image}
                                                alt={`${product.name} ${index + 1}`}
                                                fill
                                                sizes="72px"
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Product Info */}
                        <div className="mt-2 sm:mt-0 lg:pt-4">
                            {/* Breadcrumb */}
                            <nav className="hidden sm:flex items-center gap-2 text-sm text-zinc-500">
                                <Link href="/" className="hover:text-zinc-700">
                                    <Home className="h-4 w-4" />
                                </Link>
                                {category && (
                                    <>
                                        <span className="text-zinc-300">/</span>
                                        <Link
                                            href={`/shop?category=${category.slug}`}
                                            className="hover:text-zinc-700"
                                        >
                                            {category.name}
                                        </Link>
                                    </>
                                )}
                                <span className="text-zinc-300">/</span>
                                <span className="text-zinc-700 font-medium line-clamp-1">
                                    {product.name}
                                </span>
                            </nav>

                            {/* Mobile Breadcrumb (Simplified) */}
                            <nav className="flex sm:hidden items-center gap-1.5 text-xs text-zinc-500 mb-2">
                                <Link href="/" className="hover:text-zinc-700">
                                    <Home className="h-3.5 w-3.5" />
                                </Link>
                                {category && (
                                    <>
                                        <span>/</span>
                                        <Link
                                            href={`/shop?category=${category.slug}`}
                                            className="hover:text-zinc-700"
                                        >
                                            {category.name}
                                        </Link>
                                    </>
                                )}
                            </nav>

                            {/* Rating */}
                            <div className="flex items-center gap-1 sm:gap-1.5 sm:mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                                <span className="text-xs sm:text-sm text-zinc-500 ml-1">
                                    (739)
                                </span>
                            </div>

                            {/* Title & Price */}
                            <div className="mt-2 sm:mt-3">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-zinc-900">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-3 mt-2 sm:mt-3">
                                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.compare_at_price && product.compare_at_price > product.price && (
                                        <>
                                            <span className="text-lg sm:text-xl text-zinc-400 line-through">
                                                {formatPrice(product.compare_at_price)}
                                            </span>
                                            <span className="rounded-[10px] bg-emerald-500 px-2.5 py-1 text-xs sm:text-sm font-semibold text-white">
                                                {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Short Description */}
                            {product.short_description && (
                                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-zinc-600 leading-relaxed">
                                    {product.short_description}
                                </p>
                            )}

                            {/* Best For */}
                            {product.best_for && (
                                <div className="mt-3 sm:mt-4">
                                    <span className="text-xs sm:text-sm font-medium text-zinc-500">Best for: </span>
                                    <span className="text-xs sm:text-sm text-zinc-700">{product.best_for}</span>
                                </div>
                            )}

                            {/* Stock Status */}
                            <div className="mt-3 sm:mt-4 flex items-center gap-2">
                                {product.stock_quantity > 0 ? (
                                    <>
                                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                        <span className="text-sm font-medium text-emerald-600">In Stock</span>
                                        {product.stock_quantity <= 10 && (
                                            <span className="text-xs text-amber-600">
                                                (Only {product.stock_quantity} left)
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="h-2 w-2 rounded-full bg-red-500" />
                                        <span className="text-sm font-medium text-red-600">Out of Stock</span>
                                    </>
                                )}
                            </div>

                            {/* Features */}
                            {product.features && product.features.length > 0 && (
                                <div className="mt-4 sm:mt-6">
                                    <h3 className="text-sm sm:text-base font-semibold text-zinc-900 mb-2 sm:mb-3">Features</h3>
                                    <ul className="space-y-1.5 sm:space-y-2">
                                        {product.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-zinc-600">
                                                <span className="text-emerald-500 mt-1">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Specifications */}
                            {product.specifications && Object.keys(product.specifications).length > 0 && (
                                <div className="mt-4 sm:mt-6">
                                    <h3 className="text-sm sm:text-base font-semibold text-zinc-900 mb-2 sm:mb-3">Specifications</h3>
                                    <div className="rounded-[10px] border border-zinc-200 overflow-hidden">
                                        {Object.entries(product.specifications as Record<string, string>).map(([key, value], index) => (
                                            <div
                                                key={key}
                                                className={`flex ${index !== 0 ? 'border-t border-zinc-200' : ''}`}
                                            >
                                                <span className="w-1/3 sm:w-2/5 px-3 py-2 text-xs sm:text-sm font-medium text-zinc-500 bg-zinc-50">
                                                    {key}
                                                </span>
                                                <span className="flex-1 px-3 py-2 text-xs sm:text-sm text-zinc-700">
                                                    {value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart (Desktop/Tablet only) */}
                            <div className="hidden sm:flex items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={addDisabled}
                                    className="flex-1 h-10 sm:h-12 rounded-[10px] text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: "#38bdf8" }}
                                >
                                    {isOutOfStock
                                        ? "Out of stock"
                                        : isInCart
                                        ? "Added to cart"
                                        : isFeaturedBlocked
                                        ? "Limit reached"
                                        : "Add to cart"}
                                </button>
                            </div>

                            {/* FAQ Accordion */}
                            <div className="mt-6 sm:mt-10 space-y-0">
                                {productFaqs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className="border-b border-zinc-200"
                                    >
                                        <button
                                            onClick={() =>
                                                setOpenFaq(
                                                    openFaq === index
                                                        ? null
                                                        : index,
                                                )
                                            }
                                            className="w-full flex items-center gap-2.5 sm:gap-3 py-3.5 sm:py-4 text-left active:bg-zinc-100 transition-colors"
                                        >
                                            <Scissors className="h-4 w-4 text-zinc-400 shrink-0" />
                                            <span className="font-medium text-zinc-900 text-sm sm:text-base">
                                                {faq.question}
                                            </span>
                                        </button>
                                        {openFaq === index && (
                                            <div className="pb-3.5 sm:pb-4 pl-6.5 sm:pl-7">
                                                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Full Description */}
            {product.description && (
                <section className="pb-6 sm:pb-10 lg:pb-12">
                    <div className="mx-auto w-[95%]">
                        <div className="rounded-[10px] bg-white p-5 sm:p-6 lg:p-8">
                            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-3 sm:mb-4">
                                Product Description
                            </h2>
                            <div className="prose prose-sm sm:prose-base max-w-none text-zinc-600">
                                <p className="whitespace-pre-line leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="pb-6 sm:pb-10 lg:pb-16">
                    <div className="mx-auto w-[95%]">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-zinc-900">
                                You might also like
                            </h2>
                            {category && (
                                <Link
                                    href={`/shop?category=${category.slug}`}
                                    className="text-xs sm:text-sm font-medium hover:underline"
                                    style={{ color: "#38bdf8" }}
                                >
                                    View all
                                </Link>
                            )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard
                                    key={relatedProduct.id}
                                    product={relatedProduct}
                                    noBg
                                    tag="Popular"
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Features Bar */}
            <section className="py-6 sm:py-8 lg:py-12 border-t border-zinc-200">
                <div className="mx-auto w-[95%]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {/* Connect with anyone */}
                        <div className="flex gap-3 items-start">
                            <div className="shrink-0 w-8 h-8 sm:w-auto sm:h-auto flex items-center justify-center">
                                <Users className="h-5 w-5 text-zinc-700" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-zinc-900 text-sm">
                                    Connect with anyone
                                </h3>
                                <p className="mt-0.5 sm:mt-1 text-xs text-zinc-500 leading-relaxed">
                                    Just one person needs Tapt to begin
                                    networking.
                                </p>
                            </div>
                        </div>

                        {/* No app required */}
                        <div className="flex gap-3 items-start">
                            <div className="shrink-0 w-8 h-8 sm:w-auto sm:h-auto flex items-center justify-center">
                                <Smartphone className="h-5 w-5 text-zinc-700" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-zinc-900 text-sm">
                                    No app required
                                </h3>
                                <p className="mt-0.5 sm:mt-1 text-xs text-zinc-500 leading-relaxed">
                                    Use your web browser to exchange contact
                                    details.
                                </p>
                            </div>
                        </div>

                        {/* iOS & Android compatible */}
                        <div className="flex gap-3 items-start">
                            <div className="shrink-0 w-8 h-8 sm:w-auto sm:h-auto flex items-center justify-center">
                                <div className="flex flex-col gap-0.5">
                                    <Apple className="h-3 w-3 text-zinc-700" />
                                    <Tablet className="h-3 w-3 text-zinc-700" />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-zinc-900 text-sm">
                                    iOS & Android compatible
                                </h3>
                                <p className="mt-0.5 sm:mt-1 text-xs text-zinc-500 leading-relaxed">
                                    Works with all mobile devices.
                                </p>
                            </div>
                        </div>

                        {/* Built to last */}
                        <div className="flex gap-3 items-start">
                            <div className="shrink-0 w-8 h-8 sm:w-auto sm:h-auto flex items-center justify-center">
                                <Shield className="h-5 w-5 text-zinc-700" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-zinc-900 text-sm">
                                    Built to last
                                </h3>
                                <p className="mt-0.5 sm:mt-1 text-xs text-zinc-500 leading-relaxed">
                                    Crafted like a credit card, our cards are
                                    durable and timeless.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky Add to Cart Bar (Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-200 p-4 sm:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                <button
                    onClick={handleAddToCart}
                    disabled={addDisabled}
                    className="w-full h-11 rounded-[10px] text-white font-semibold text-sm active:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#38bdf8" }}
                >
                    {isOutOfStock
                        ? "Out of stock"
                        : isInCart
                        ? "Added to cart"
                        : isFeaturedBlocked
                        ? "Limit reached"
                        : `Add to cart • ${formatPrice(product.price)}`}
                </button>
            </div>

            {/* Spacer for mobile sticky bar */}
            <div className="h-24 sm:hidden" aria-hidden="true" />
        </div>
    );
}
