import { Metadata } from "next";
import Link from "next/link";
import {
    FileText,
    AlertTriangle,
    Scale,
    ShoppingBag,
    Ban,
    HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Terms & Conditions",
    description:
        "Terms and conditions for using Instant Connect products and services.",
};

const sections = [
    {
        id: "1",
        title: "Product Overview",
        content: `Instant Connect offers NFC-based digital products such as digital business cards, NFC cards, stands, tags, and related services. These products allow users to share digital information instantly by tapping or scanning.`,
    },
    {
        id: "2",
        title: "Information Accuracy",
        content: `Customers are responsible for providing accurate and complete information (name, contact details, links, business info, etc.) for setup.

Instant Connect will not be responsible for errors caused by incorrect or incomplete details shared by the customer.`,
    },
    {
        id: "3",
        title: "Product Usage",
        content: `• NFC products work only on compatible devices.
• Internet connection may be required to access linked digital content.
• Physical damage, misuse, or unauthorized modifications are not covered.`,
    },
    {
        id: "4",
        title: "Customization & Changes",
        content: `• Once the product is customized or activated, refunds or cancellations are not allowed.
• Minor content updates may be allowed as per the selected plan or service.`,
    },
    {
        id: "5",
        title: "Payments",
        content: `• All payments must be made in advance.
• Prices are subject to change without prior notice.
• No refunds after order confirmation or product activation.`,
    },
    {
        id: "6",
        title: "Delivery",
        content: `• Delivery timelines may vary based on location and product type.
• Delays caused by courier services, natural events, or technical issues are not under our control.`,
    },
    {
        id: "7",
        title: "Intellectual Property",
        content: `All designs, software, concepts, and digital interfaces related to Instant Connect remain the intellectual property of Instant Connect.

Unauthorized copying or resale is strictly prohibited.`,
    },
    {
        id: "8",
        title: "Limitation of Liability",
        content: `Instant Connect is not liable for:
• Device incompatibility
• Network or internet issues
• Temporary service downtime
• Loss of data due to third-party platforms`,
    },
    {
        id: "9",
        title: "Termination of Service",
        content: `We reserve the right to suspend or terminate services if any misuse, illegal activity, or violation of terms is found.`,
    },
    {
        id: "10",
        title: "Privacy",
        content: `Customer data will be handled as per our Privacy Policy. We do not sell or misuse personal data.`,
    },
    {
        id: "11",
        title: "Changes to Terms",
        content: `Instant Connect reserves the right to update or modify these Terms & Conditions at any time without prior notice.`,
    },
    {
        id: "12",
        title: "Governing Law",
        content: `These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of Indian courts.`,
    },
];

export default function TermsPage() {
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
                            backgroundImage: `url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6">
                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[10px] bg-white/10 backdrop-blur-sm mb-4 mt-24">
                            <FileText className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            Terms & Conditions
                        </h1>
                        <p className="mt-3 text-center text-xs sm:text-sm md:text-base text-white/70 max-w-xs sm:max-w-md md:max-w-2xl">
                            By purchasing or using Instant Connect products, you agree to the following terms.
                        </p>
                    </div>
                </div>
            </section>

            {/* Last Updated */}
            <section className="pt-6 sm:pt-8 lg:pt-10">
                <div className="mx-auto w-[95%]">
                    <div className="rounded-[10px] bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <p className="text-xs sm:text-sm text-zinc-500">
                            Last Updated:{" "}
                            <span className="font-medium text-zinc-900">
                                December 27, 2025
                            </span>
                        </p>
                        <p className="text-xs sm:text-sm text-zinc-500">
                            Effective Date:{" "}
                            <span className="font-medium text-zinc-900">
                                January 1, 2025
                            </span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Navigation */}
            <section className="pt-6 sm:pt-8">
                <div className="mx-auto w-[95%]">
                    <div className="rounded-[10px] bg-white p-5 sm:p-6">
                        <h2 className="text-sm sm:text-base font-bold text-zinc-900 mb-3">
                            Quick Navigation
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#section-${section.id}`}
                                    className="rounded-[10px] bg-zinc-100 px-3 py-1.5 text-xs sm:text-sm text-zinc-700 hover:bg-zinc-200"
                                >
                                    {section.id}. {section.title}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Terms Sections */}
            <section className="py-6 sm:py-8 lg:py-10">
                <div className="mx-auto w-[95%]">
                    <div className="space-y-4 sm:space-y-6">
                        {sections.map((section) => (
                            <div
                                key={section.id}
                                id={`section-${section.id}`}
                                className="rounded-[10px] bg-white p-5 sm:p-6 lg:p-8 scroll-mt-24"
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className="flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-[10px] text-xs sm:text-sm font-bold text-white"
                                        style={{ backgroundColor: "#38bdf8" }}
                                    >
                                        {section.id}
                                    </span>
                                    <div className="flex-1">
                                        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-zinc-900">
                                            {section.title}
                                        </h2>
                                        <div className="mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                                            {section.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Important Notice */}
            <section className="pb-6 sm:pb-8">
                <div className="mx-auto w-[95%]">
                    <div className="rounded-[10px] bg-amber-50 border border-amber-200 p-5 sm:p-6 lg:p-8">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-amber-900">
                                    Important Notice
                                </h3>
                                <p className="mt-2 text-xs sm:text-sm text-amber-800">
                                    By using our website and services, you
                                    acknowledge that you have read, understood,
                                    and agree to be bound by these Terms of
                                    Service. If you are using our services on
                                    behalf of an organization, you represent and
                                    warrant that you have the authority to bind
                                    that organization to these terms.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="pb-8 sm:pb-12 lg:pb-16">
                <div className="mx-auto w-[95%]">
                    <div
                        className="rounded-[10px] p-5 sm:p-8 lg:p-10"
                        style={{ backgroundColor: "#38bdf8" }}
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                                    Have Questions About These Terms?
                                </h2>
                                <p className="mt-2 text-xs sm:text-sm text-white/70">
                                    Our legal team is happy to clarify any part
                                    of these terms for you.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                  prefetch={false}
                                    href="/contact"
                                    className="rounded-[10px] bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-blue-600 hover:bg-blue-50 text-center"
                                >
                                    Contact Us
                                </Link>
                                <Link
                                  prefetch={false}
                                    href="/faqs"
                                    className="rounded-[10px] bg-white/20 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/30 text-center"
                                >
                                    View FAQs
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
