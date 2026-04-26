import { Metadata } from "next";
import Link from "next/link";
import { Truck, Package, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Shipping Policy",
    description:
        "Learn about shipping timelines for Instant Connect orders.",
};

export default function ShippingPolicyPage() {
    return (
        <div
            className="overflow-x-hidden"
            style={{ backgroundColor: "#F4F4F4" }}
        >
            {/* Hero */}
            <section className="pt-[6px] px-[6px] pb-0">
                <div className="relative h-[35vh] sm:h-[40vh] md:h-[45vh] overflow-hidden rounded-[10px]">
                    {/* Background */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6">
                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[10px] bg-white/10 backdrop-blur-sm mb-4">
                            <Truck className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            Shipping Policy
                        </h1>
                    </div>
                </div>
            </section>

            {/* Shipping Policy Content */}
            <section className="py-8 sm:py-12 lg:py-16">
                <div className="mx-auto w-[95%] max-w-3xl">
                    <div className="rounded-[10px] bg-white p-6 sm:p-8 lg:p-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[10px] bg-blue-100">
                                <Package className="h-5 w-5 text-blue-600" />
                            </div>
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-zinc-900">
                                Shipping Timeline
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
                                All Instant Connect products are shipped within <span className="font-semibold">7 working days</span> after final design approval from the customer.
                            </p>

                            <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
                                Shipping timelines may vary based on location, courier partner, or unforeseen circumstances. Any delay will be communicated in advance.
                            </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-zinc-200">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs sm:text-sm text-zinc-500">
                                    For any shipping-related queries, please contact us at{" "}
                                    <a href="mailto:Pr.gurukul1@gmail.com" className="text-blue-600 hover:underline">
                                        Pr.gurukul1@gmail.com
                                    </a>{" "}
                                    or call{" "}
                                    <a href="tel:+918764631130" className="text-blue-600 hover:underline">
                                        +91 87646 31130
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Track Order CTA */}
                    <div
                        className="mt-6 rounded-[10px] p-6 sm:p-8 text-center"
                        style={{ backgroundColor: "#38bdf8" }}
                    >
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                            Track Your Order
                        </h3>
                        <p className="mt-2 text-sm text-white/70">
                            Already placed an order? Track its status here.
                        </p>
                        <Link
                          prefetch={false}
                            href="/track-order"
                            className="mt-4 inline-block rounded-[10px] bg-white px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                        >
                            Track Order
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
