"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Package,
    ShoppingCart,
    IndianRupee,
    Users,
    TrendingUp,
    ArrowRight,
    ArrowUpRight,
    Plus,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle,
    FolderTree,
    Tag,
    Star,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    pendingOrders: number;
    pendingDemos: number;
    lowStockProducts: number;
    activeCategories: number;
}

interface RecentOrder {
    id: string;
    order_number: string;
    status: string;
    total: number;
    created_at: string;
    customers: {
        first_name: string;
        last_name: string;
        email: string;
    } | null;
}

interface RecentDemo {
    id: string;
    name: string;
    email: string;
    company: string | null;
    status: string;
    created_at: string;
}

interface LowStockProduct {
    id: string;
    name: string;
    stock_quantity: number;
    images: string[];
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        pendingOrders: 0,
        pendingDemos: 0,
        lowStockProducts: 0,
        activeCategories: 0,
    });
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [recentDemos, setRecentDemos] = useState<RecentDemo[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>(
        [],
    );
    const [isLoading, setIsLoading] = useState(true);

    const currentDate = new Date();
    const greeting =
        currentDate.getHours() < 12
            ? "Good Morning"
            : currentDate.getHours() < 18
              ? "Good Afternoon"
              : "Good Evening";

    useEffect(() => {
        async function fetchDashboardData() {
            const supabase = createClient();

            const [
                productsRes,
                ordersRes,
                customersRes,
                recentOrdersRes,
                pendingOrdersRes,
                pendingDemosRes,
                recentDemosRes,
                lowStockRes,
                categoriesRes,
            ] = await Promise.all([
                supabase
                    .from("products")
                    .select("id", { count: "exact", head: true }),
                supabase.from("orders").select("id, total, status", { count: "exact" }),
                supabase
                    .from("customers")
                    .select("id", { count: "exact", head: true }),
                supabase
                    .from("orders")
                    .select(
                        "id, order_number, status, total, created_at, customers(first_name, last_name, email)",
                    )
                    .order("created_at", { ascending: false })
                    .limit(5),
                supabase
                    .from("orders")
                    .select("id", { count: "exact", head: true })
                    .in("status", ["pending", "confirmed", "processing"]),
                supabase
                    .from("demo_bookings")
                    .select("id", { count: "exact", head: true })
                    .eq("status", "pending"),
                supabase
                    .from("demo_bookings")
                    .select("id, name, email, company, status, created_at")
                    .order("created_at", { ascending: false })
                    .limit(5),
                supabase
                    .from("products")
                    .select("id, name, stock_quantity, images")
                    .lt("stock_quantity", 10)
                    .eq("is_active", true)
                    .order("stock_quantity", { ascending: true })
                    .limit(5),
                supabase
                    .from("categories")
                    .select("id", { count: "exact", head: true })
                    .eq("is_active", true),
            ]);

            const nonCancelledOrders = (ordersRes.data || []).filter(
                (order) => order.status !== "cancelled",
            );

            const totalRevenue = nonCancelledOrders.reduce(
                (sum, order) => sum + (order.total || 0),
                0,
            );

            setStats({
                totalProducts: productsRes.count || 0,
                totalOrders: nonCancelledOrders.length,
                totalRevenue,
                totalCustomers: customersRes.count || 0,
                pendingOrders: pendingOrdersRes.count || 0,
                pendingDemos: pendingDemosRes.count || 0,
                lowStockProducts: lowStockRes.data?.length || 0,
                activeCategories: categoriesRes.count || 0,
            });

            setRecentOrders(
                (recentOrdersRes.data || []).map((order) => ({
                    ...order,
                    customers: Array.isArray(order.customers)
                        ? order.customers[0]
                        : order.customers,
                })) as RecentOrder[],
            );

            setRecentDemos(recentDemosRes.data || []);
            setLowStockProducts(lowStockRes.data || []);
            setIsLoading(false);
        }

        fetchDashboardData();
    }, []);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: "bg-amber-100 text-amber-700",
            confirmed: "bg-blue-100 text-blue-700",
            processing: "bg-blue-100 text-blue-700",
            shipped: "bg-teal-100 text-teal-700",
            delivered: "bg-green-100 text-green-700",
            cancelled: "bg-red-100 text-red-700",
            contacted: "bg-blue-100 text-blue-700",
            scheduled: "bg-teal-100 text-teal-700",
            completed: "bg-green-100 text-green-700",
        };
        return colors[status] || "bg-zinc-100 text-zinc-700";
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-[10px] border-4 border-zinc-200 border-t-zinc-900" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">
                        {greeting}!
                    </h1>
                    <p className="mt-1 text-zinc-500">
                        Here&apos;s what&apos;s happening with your store today.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Calendar className="h-4 w-4" />
                    {currentDate.toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </div>
            </div>

            {/* Alert Banner */}
            {(stats.pendingOrders > 0 ||
                stats.pendingDemos > 0 ||
                stats.lowStockProducts > 0) && (
                <div className="flex flex-wrap gap-3">
                    {stats.pendingOrders > 0 && (
                        <Link
                            href="/masterman/orders"
                            prefetch={false}
                            className="flex items-center gap-2 rounded-[10px] bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100"
                        >
                            <Clock className="h-4 w-4" />
                            {stats.pendingOrders} orders need attention
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    )}
                    {stats.pendingDemos > 0 && (
                        <Link
                            href="/masterman/demo-bookings"
                            prefetch={false}
                            className="flex items-center gap-2 rounded-[10px] bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                        >
                            <Calendar className="h-4 w-4" />
                            {stats.pendingDemos} demo requests pending
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    )}
                    {stats.lowStockProducts > 0 && (
                        <Link
                            href="/masterman/products"
                            prefetch={false}
                            className="flex items-center gap-2 rounded-[10px] bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                        >
                            <AlertTriangle className="h-4 w-4" />
                            {stats.lowStockProducts} products low on stock
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    )}
                </div>
            )}

            {/* Main Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Revenue Card */}
                <div className="rounded-[10px] border border-zinc-200 bg-linear-to-br from-teal-500 to-teal-600 p-5 text-white">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-teal-100">
                            Total Revenue
                        </span>
                        <div className="rounded-[10px] bg-white/20 p-2">
                            <IndianRupee className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-bold">
                        {formatPrice(stats.totalRevenue)}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-sm text-teal-100">
                        <TrendingUp className="h-4 w-4" />
                        <span>All time earnings</span>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="rounded-[10px] border border-zinc-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-500">
                            Total Orders
                        </span>
                        <div className="rounded-[10px] bg-blue-100 p-2">
                            <ShoppingCart className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-bold text-zinc-900">
                        {stats.totalOrders}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="flex items-center gap-1 text-amber-600">
                            <Clock className="h-3 w-3" />
                            {stats.pendingOrders} pending
                        </span>
                    </div>
                </div>

                {/* Customers Card */}
                <div className="rounded-[10px] border border-zinc-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-500">
                            Total Customers
                        </span>
                        <div className="rounded-[10px] bg-blue-100 p-2">
                            <Users className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-bold text-zinc-900">
                        {stats.totalCustomers}
                    </p>
                    <div className="mt-2 text-sm text-zinc-500">
                        Registered users
                    </div>
                </div>

                {/* Products Card */}
                <div className="rounded-[10px] border border-zinc-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-500">
                            Total Products
                        </span>
                        <div className="rounded-[10px] bg-orange-100 p-2">
                            <Package className="h-5 w-5 text-orange-600" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-bold text-zinc-900">
                        {stats.totalProducts}
                    </p>
                    <div className="mt-2 text-sm text-zinc-500">
                        In {stats.activeCategories} categories
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                    href="/masterman/products/new"
                    prefetch={false}
                    className="group flex items-center gap-3 rounded-[10px] border border-zinc-200 bg-white p-4 transition-all hover:border-teal-200 hover:shadow-md"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-teal-100 text-teal-600 transition-colors group-hover:bg-teal-500 group-hover:text-white">
                        <Plus className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-zinc-900">
                            Add Product
                        </p>
                        <p className="text-xs text-zinc-500">
                            Create new listing
                        </p>
                    </div>
                </Link>

                <Link
                    href="/masterman/categories/new"
                    prefetch={false}
                    className="group flex items-center gap-3 rounded-[10px] border border-zinc-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                        <FolderTree className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-zinc-900">
                            Add Category
                        </p>
                        <p className="text-xs text-zinc-500">
                            Organize products
                        </p>
                    </div>
                </Link>

                <Link
                    href="/masterman/coupons/new"
                    prefetch={false}
                    className="group flex items-center gap-3 rounded-[10px] border border-zinc-200 bg-white p-4 transition-all hover:border-orange-200 hover:shadow-md"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-orange-100 text-orange-600 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                        <Tag className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-zinc-900">
                            Create Coupon
                        </p>
                        <p className="text-xs text-zinc-500">
                            Add discount code
                        </p>
                    </div>
                </Link>

                <Link
                    href="/masterman/testimonials/new"
                    prefetch={false}
                    className="group flex items-center gap-3 rounded-[10px] border border-zinc-200 bg-white p-4 transition-all hover:border-amber-200 hover:shadow-md"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-amber-100 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                        <Star className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-zinc-900">
                            Add Review
                        </p>
                        <p className="text-xs text-zinc-500">
                            Customer testimonial
                        </p>
                    </div>
                </Link>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Orders */}
                <div className="lg:col-span-2 rounded-[10px] border border-zinc-200 bg-white">
                    <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-zinc-400" />
                            <h2 className="font-semibold text-zinc-900">
                                Recent Orders
                            </h2>
                        </div>
                        <Link
                            href="/masterman/orders"
                            prefetch={false}
                            className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700"
                        >
                            View all
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="divide-y divide-zinc-100">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between px-5 py-4 hover:bg-zinc-50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-zinc-100 text-sm font-medium text-zinc-600">
                                            {order.customers?.first_name?.charAt(
                                                0,
                                            ) || "G"}
                                        </div>
                                        <div>
                                            <p className="font-medium text-zinc-900">
                                                {order.customers
                                                    ? `${order.customers.first_name} ${order.customers.last_name}`
                                                    : "Guest"}
                                            </p>
                                            <p className="text-sm text-zinc-500">
                                                {order.order_number}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-zinc-900">
                                            {formatPrice(order.total)}
                                        </p>
                                        <span
                                            className={cn(
                                                "mt-1 inline-block rounded-[10px] px-2 py-0.5 text-xs font-medium capitalize",
                                                getStatusColor(order.status),
                                            )}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-5 py-12 text-center">
                                <ShoppingCart className="mx-auto h-10 w-10 text-zinc-300" />
                                <p className="mt-2 text-sm text-zinc-500">
                                    No orders yet
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Demo Bookings */}
                    <div className="rounded-[10px] border border-zinc-200 bg-white">
                        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-zinc-400" />
                                <h2 className="font-semibold text-zinc-900">
                                    Demo Requests
                                </h2>
                            </div>
                            <Link
                                href="/masterman/demo-bookings"
                                prefetch={false}
                                className="text-sm font-medium text-teal-600 hover:text-teal-700"
                            >
                                View all
                            </Link>
                        </div>
                        <div className="divide-y divide-zinc-100">
                            {recentDemos.length > 0 ? (
                                recentDemos.slice(0, 4).map((demo) => (
                                    <div key={demo.id} className="px-5 py-3">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium text-zinc-900">
                                                {demo.name}
                                            </p>
                                            <span
                                                className={cn(
                                                    "rounded-[10px] px-2 py-0.5 text-xs font-medium capitalize",
                                                    getStatusColor(demo.status),
                                                )}
                                            >
                                                {demo.status}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-xs text-zinc-500">
                                            {demo.company || demo.email}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="px-5 py-8 text-center">
                                    <Calendar className="mx-auto h-8 w-8 text-zinc-300" />
                                    <p className="mt-2 text-sm text-zinc-500">
                                        No demo requests
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    <div className="rounded-[10px] border border-zinc-200 bg-white">
                        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                <h2 className="font-semibold text-zinc-900">
                                    Low Stock
                                </h2>
                            </div>
                        </div>
                        <div className="divide-y divide-zinc-100">
                            {lowStockProducts.length > 0 ? (
                                lowStockProducts.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/masterman/products/${product.id}`}
                                        prefetch={false}
                                        className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-50"
                                    >
                                        <div className="relative h-10 w-10 overflow-hidden rounded-[10px] bg-zinc-100">
                                            {product.images?.[0] ? (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <Package className="absolute inset-0 m-auto h-5 w-5 text-zinc-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm font-medium text-zinc-900">
                                                {product.name}
                                            </p>
                                            <p
                                                className={cn(
                                                    "text-xs font-medium",
                                                    product.stock_quantity === 0
                                                        ? "text-red-600"
                                                        : "text-amber-600",
                                                )}
                                            >
                                                {product.stock_quantity === 0
                                                    ? "Out of stock"
                                                    : `${product.stock_quantity} left`}
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="px-5 py-8 text-center">
                                    <CheckCircle className="mx-auto h-8 w-8 text-green-400" />
                                    <p className="mt-2 text-sm text-zinc-500">
                                        All stocked up!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
