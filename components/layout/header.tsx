

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { SearchModal } from "./search-modal";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "AI Review Card", href: "/ai-review-card", featured: true },
   { name: "About Us", href: "/about" },
];

const categories = [
  {
    name: "NFC Cards",
    href: "/shop?category=nfc-cards",
    image: "https://souhaygiitgemoplvwnl.supabase.co/storage/v1/object/public/other%20images/Untitled_design_5_kcpuvo.svg",
    description: "View the collection",
  },
  {
    name: "3D NFC",
    href: "/shop?category=3d-nfc-products",
    image: "https://souhaygiitgemoplvwnl.supabase.co/storage/v1/object/public/other%20images/Untitled_design_7_vo41br.svg",
    description: "View the collection",
  },
  {
    name: "Standees",
    href: "/shop?category=standees",
    image:
      "https://souhaygiitgemoplvwnl.supabase.co/storage/v1/object/public/other%20images/Untitled_design_6_lq3yh7.svg",
    description: "View the collection",
  },
  {
    name: "All Products",
    href: "/shop",
    image:
      "https://i.pinimg.com/736x/d9/70/2d/d9702dcefc32cb5357f35070a1bfb4d5.jpg",
    description: "Browse everything",
    isAllProducts: true,
  },
];

export function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);


  return (
    <>
      <header className="absolute top-4 left-0 right-0 z-50">
        <div className="mx-auto max-w-5xl px-3">
          {/* ================= DESKTOP ================= */}
          <div className="hidden lg:flex h-20 items-center justify-between rounded-[10px] bg-white px-5 shadow-md">
            {/* Logo */}
            <Link href="/">
              <Image
                src="/Logo_3.svg"
                alt="Instant Connect"
                width={130}
                height={50}
                priority
              />
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-md font-medium transition",
                    "text-black hover:bg-white hover:text-black",
                    pathname === link.href && "bg-white text-black"
                  )}
                >
                  {link.featured && (
                    <Sparkles className="h-5 w-5 text-sky-400" />
                  )}
                  {link.name}
                </Link>
              ))}

              {/* Shop */}
              <div
                className="relative"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                <button
                  onClick={() => setShopOpen((v) => !v)}
                  onMouseEnter={() => setShopOpen(true)}
                  className="flex items-center gap-1 px-4 py-2 text-md font-medium text-black hover:bg-white hover:text-black rounded-[10px]"
                >
                  Shop
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-sky-400 transition-transform duration-300",
                      shopOpen && "rotate-180"
                    )}
                  />
                </button>
                {/* Invisible bridge */}
                <div className="absolute left-0 right-0 h-4 top-full" />
              </div>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(true)} className="icon-btn cursor-pointer">
                <Search className="text-black" />
              </button>
              <Link href="/cart" className="relative icon-btn cursor-pointer">
                <ShoppingCart className="text-black" />
                {itemCount > 0 && <span className="badge">{itemCount}</span>}
              </Link>
            </div>
          </div>

          {/* ================= MEGA MENU (ORIGINAL DESIGN) ================= */}
          <AnimatePresence>
            {shopOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
                className="absolute left-0 right-0 top-[calc(100%+8px)] mx-auto max-w-5xl rounded-[10px] bg-white p-6 shadow-2xl border-none"
              >
                <div className="grid grid-cols-4 gap-6">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.15,
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                    >
                      <Link
                        href={category.href}
                        prefetch={false}
                        className={cn(
                          "group block rounded-[10px] p-4 transition hover:shadow-lg",
                          category.isAllProducts
                            ? "bg-black text-white"
                            : "bg-zinc-100"
                        )}
                      >
                        {/* Image */}
                        <div className="relative aspect-[1/1] overflow-hidden rounded-[10px]">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            sizes="200px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>

                        {/* Content */}
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <h3
                              className={cn(
                                "text-2xl font-extrabold",
                                category.isAllProducts
                                  ? "text-white"
                                  : "text-zinc-900"
                              )}
                            >
                              {category.name}
                            </h3>
                            <p
                              className={cn(
                                "text-sm",
                                category.isAllProducts
                                  ? "text-zinc-300"
                                  : "text-zinc-500"
                              )}
                            >
                              View the collection
                            </p>
                          </div>

                          <span
                            className={cn(
                              "text-2xl transition-transform group-hover:translate-x-1",
                              category.isAllProducts
                                ? "text-white"
                                : "text-zinc-400"
                            )}
                          >
                            →
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================= MOBILE / TABLET ================= */}
          <div className="lg:hidden flex items-center justify-between rounded-[10px] bg-white px-4 py-3 shadow-md">
            <button onClick={() => setMobileOpen(true)}>
              <Menu className="h-6 w-6 text-black" />
            </button>

            <Link href="/">
              <Image
                src="/Logo_3.svg"
                alt="Instant Connect"
                width={110}
                height={40}
              />
            </Link>

            <div className="flex items-center gap-3">
              <button onClick={() => setSearchOpen(true)}>
                <Search className="h-6 w-6 text-black" />
              </button>
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-6 w-6 text-black" />
                {itemCount > 0 && <span className="badge-sm">{itemCount}</span>}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-full w-[300px] bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-100">
                <Image src="/Logo_3.svg" alt="Logo" width={100} height={35} />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="h-10 w-10 flex items-center justify-center rounded-[10px] bg-zinc-100 hover:bg-zinc-200 transition-colors"
                >
                  <X className="h-5 w-5 text-zinc-600" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <nav className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-[10px] px-4 py-3 text-zinc-700 font-medium transition-colors hover:bg-zinc-100",
                          pathname === link.href && "bg-zinc-100 text-zinc-900"
                        )}
                      >
                        {link.featured && (
                          <Sparkles className="h-5 w-5 text-sky-400" />
                        )}
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}

                  {/* Shop Accordion */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05 + 0.1 }}
                  >
                    <button
                      onClick={() => setMobileShopOpen((v) => !v)}
                      className="flex w-full items-center justify-between rounded-[10px] px-4 py-3 text-zinc-700 font-medium transition-colors hover:bg-zinc-100"
                    >
                      Shop
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-zinc-400 transition-transform duration-300",
                          mobileShopOpen && "rotate-180"
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {mobileShopOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-1 pb-2 pl-4 space-y-1">
                            {categories.map((category, index) => (
                              <motion.div
                                key={category.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Link
                                  href={category.href}
                                  prefetch={false}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center gap-3 rounded-[10px] px-4 py-2.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                                >
                                  {category.name}
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </nav>
              </div>

              {/* Footer */}
              <div className="px-4 py-4 border-t border-zinc-100">
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-[10px] bg-zinc-900 px-4 py-3 text-white font-medium transition-colors hover:bg-zinc-800"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* UTILITIES */}
      <style jsx>{`
        .icon-btn {
          height: 36px;
          width: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: white;
        }
        .icon-btn:hover {
          background: white;
          color: black;
        }
        .badge {
          position: absolute;
          top: -6px;
          right: -6px;
          height: 20px;
          width: 20px;
          border-radius: 999px;
          background: #38bdf8;
          color: white;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .badge-sm {
          position: absolute;
          top: -6px;
          right: -6px;
          height: 18px;
          width: 18px;
          border-radius: 999px;
          background: #38bdf8;
          color: white;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
}
