import { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/ui/accordion";

export const metadata: Metadata = {
    title: "FAQs",
    description:
        "Frequently asked questions about Instant Connect NFC cards and products.",
};

const faqs = [
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

export default function FAQsPage() {
    return (
        <div
            className="overflow-x-hidden"
            style={{ backgroundColor: "#F4F4F4" }}
        >
            {/* Hero */}
            <section className="px-[6px] pb-0">
                <div className="relative h-[40vh] sm:h-[50vh] md:h-[55vh] overflow-hidden rounded-b-[10px]">
                    {/* Background */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6 pt-16 lg:pt-0">
                        <p className="text-center text-xs sm:text-sm md:text-base text-white/70 max-w-xs sm:max-w-md md:max-w-2xl">
                            Find answers to common questions about our NFC
                            products and services.
                        </p>
                        <h1 className="mt-3 sm:mt-4 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            Frequently Asked Questions
                        </h1>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="pt-10 pb-8 sm:pt-14 sm:pb-10 lg:pt-20 lg:pb-12">
                <div className="mx-auto w-[95%]">
                    {/* Section Header */}
                    <div className="pb-6 sm:pb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="hidden sm:block h-px w-8 bg-sky-400" />
                            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-sky-400">
                                {faqs.length} Questions answered
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tighter leading-[0.9]">
                            Common{" "}
                            <span className="text-zinc-400">questions.</span>
                        </h2>
                    </div>

                    {/* FAQs */}
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <Accordion
                                key={index}
                                title={`${index + 1}. ${faq.question}`}
                            >
                                <p className="text-sm sm:text-base text-zinc-600">
                                    {faq.answer}
                                </p>
                            </Accordion>
                        ))}
                    </div>
                </div>
            </section>

            {/* Still Have Questions */}
            <section className="py-8 sm:py-12 lg:py-16">
                <div className="mx-auto w-[95%]">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                        {/* Contact Support */}
                        <div
                            className="w-full lg:w-1/2 p-5 sm:p-8 rounded-[10px]"
                            style={{ backgroundColor: "#38bdf8" }}
                        >
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                                Still have questions?
                            </h3>
                            <p className="mt-2 text-sm sm:text-base text-white/70">
                                Our support team is here to help you with any
                                questions you may have.
                            </p>
                            <Link
                              prefetch={false}
                                href="/contact"
                                className="mt-5 sm:mt-6 inline-block rounded-[10px] bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-blue-600 hover:bg-blue-50"
                            >
                                Contact Support
                            </Link>
                        </div>

                        {/* Book Demo */}
                        <div
                            className="w-full lg:w-1/2 p-5 sm:p-8 rounded-[10px]"
                            style={{ backgroundColor: "#F5A623" }}
                        >
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
                                Want a personalized demo?
                            </h3>
                            <p className="mt-2 text-sm sm:text-base text-black/70">
                                See our products in action with a free
                                personalized demonstration.
                            </p>
                            <Link
                              prefetch={false}
                                href="/book-demo"
                                className="mt-5 sm:mt-6 inline-block rounded-[10px] bg-black px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-black/90"
                            >
                                Book a Demo
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
