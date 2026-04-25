import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Target, Users, Zap, Award, Heart, Globe } from "lucide-react";
import { BookDemoCTA } from "@/components/home/book-demo-cta";

export const metadata: Metadata = {
    title: "About Instant Connect | India's Leading NFC Business Card Brand",
    description:
        "Learn about Instant Connect - your partner in digital networking solutions.",
};

const stats = [
    { label: "Happy Customers", value: "10,000+" },
    { label: "Products Delivered", value: "25,000+" },
    { label: "Cities Covered", value: "100+" },
    { label: "Years of Experience", value: "5+" },
];

const values = [
    {
        icon: Target,
        title: "Innovation First",
        description:
            "We constantly push boundaries to bring you the latest in digital networking technology.",
    },
    {
        icon: Users,
        title: "Customer Centric",
        description:
            "Your success is our priority. We design solutions that work for your unique needs.",
    },
    {
        icon: Zap,
        title: "Speed & Quality",
        description:
            "Fast delivery without compromising on quality. Every product is crafted with care.",
    },
    {
        icon: Award,
        title: "Excellence",
        description:
            "We strive for excellence in everything we do, from product design to customer service.",
    },
];

const team = [
    {
        name: "Kartik",
        role: "Founder & CEO",
        image: "https://res.cloudinary.com/dem0bqs8e/image/upload/v1770999075/1000072158_4_eywxic.png",
    },
    {
        name: " Nitin Patel",
        role: "Head of Design",
        image: "https://res.cloudinary.com/dem0bqs8e/image/upload/v1770999075/IMG_6560_sc0myb.jpg",
    },
    {
        name: "Manthan Mehta",
        role: "Tech Lead",
        image: "https://res.cloudinary.com/dem0bqs8e/image/upload/v1770999075/IMG-20250805-WA0025_stasxq.jpg",
    },
    {
        name: "Vedika Bhardwaj",
        role: "Customer Success",
        image: "https://res.cloudinary.com/dem0bqs8e/image/upload/v1770999075/Screenshot_20251202_141511_Gallery_j31bug.jpg",
    },
    {
        name: "Mohit Paliwal",
        role: "Customer Success",
        image: "https://res.cloudinary.com/dem0bqs8e/image/upload/v1770999074/IMG_1437_udjto1.jpg",
    },
    {
        name: "Dishant Singh Chauhan",
        role: "Customer Success",
        image: "https://res.cloudinary.com/dem0bqs8e/image/upload/v1770999498/IMG_6213_nsts0z.jpg",
    },
    {
        name: "Ayush Ameta",
        role: "Customer Success",
        image: "https://res.cloudinary.com/dem0bqs8e/image/upload/v1770999497/IMG_8284_fwgpes.jpg",
    },
    {
        name: "Jesika Gurjar",
        role: "Customer Success",
        image: "https://res.cloudinary.com/dem0bqs8e/image/upload/v1770999553/Screenshot_2026-02-13_at_9.49.05_PM_m1chun.png",
    },
    {
        name: "Aagam Choudhary",
        role: "Customer Success",
        image: "https://res.cloudinary.com/dem0bqs8e/image/upload/v1770999074/IMG_3137_oyo4l5.jpg",
    },

    
];

export default function AboutPage() {
    return (
        <div
            className="overflow-x-hidden"
            style={{ backgroundColor: "#F4F4F4" }}
        >
            {/* Hero */}
            <section className="px-[6px] pb-0">
                <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden rounded-b-[10px]">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/90 to-black/40" />


                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6 pt-16 lg:pt-0">
                       
                        <h1 className="mt-3 sm:mt-4 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-xs sm:max-w-lg md:max-w-3xl">
                            India's Leading NFC Business Card Brand — Based in Udaipur

                        </h1>
                         <p className="text-center mt-4 text-xs sm:text-sm md:text-base text-white/70 max-w-xs sm:max-w-md md:max-w-2xl">
                            Trusted by 10,000+ professionals across India. We make digital networking effortless with smart NFC cards, AI review tools, and more.
                        </p>
                        <div className="mt-5 sm:mt-6 md:mt-8 flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/shop"
                                className="rounded-[10px] bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
                            >
                                Shop Now
                            </Link>
                            <Link
                                href="/contact"
                                className="rounded-[10px] bg-white/20 backdrop-blur-sm px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/30"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="pt-10 pb-8 sm:pt-14 sm:pb-10 lg:pt-20 lg:pb-12">
                <div className="mx-auto w-[95%]">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-[10px] bg-white p-4 sm:p-6 text-center"
                            >
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900">
                                    {stat.value}
                                </p>
                                <p className="mt-1 text-xs sm:text-sm text-zinc-500">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-8 sm:py-12 lg:py-16">
                <div className="mx-auto w-[95%]">
                    {/* Section Header */}
                    <div className="pb-6 sm:pb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="hidden sm:block h-px w-8 bg-sky-400" />
                            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-sky-400">
                                From an idea to India&apos;s leading NFC provider
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tighter leading-[0.9]">
                            Our{" "}
                            <span className="text-zinc-400">journey.</span>
                        </h2>
                    </div>

                    {/* Content Grid */}
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                        {/* Left - Story */}
                        <div className="w-full lg:w-1/2 p-5 sm:p-8 rounded-[10px] bg-white">
                            <div className="space-y-4 text-sm sm:text-base text-zinc-600">
                                <p>
                                    Founded in Udaipur, Rajasthan, Instant Connect started with one simple idea - It all started when our founders experienced
                                    the frustration of running out of business
                                    cards at a crucial networking event. That
                                    moment sparked an idea: what if we could
                                    carry our entire professional identity in a
                                    single, smart card?
                                </p>
                                <p>
                                    Today, Instant Connect is India&apos;s
                                    leading provider of NFC-enabled networking
                                    solutions. From individual professionals to
                                    large enterprises, we help thousands of
                                    people make memorable first impressions
                                    every day.
                                </p>
                                <p>
                                    Our product range has expanded to include
                                    NFC cards, QR cards, standees, keychains,
                                    and table tents - all designed to help you
                                    share your contact information, social
                                    profiles, and business details with just a
                                    tap.
                                </p>
                            </div>
                        </div>

                        {/* Right - Image */}
                        <div className="w-full lg:w-1/2 relative min-h-[280px] sm:min-h-[350px] lg:min-h-[400px] rounded-[10px] overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                                alt="Team collaboration"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-8 sm:py-12 lg:py-16">
                <div className="mx-auto w-[95%]">
                    {/* Section Header */}
                    <div className="text-center pb-6 sm:pb-8 lg:pb-10">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="h-px w-8 bg-sky-400" />
                            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-sky-400">
                                The principles that guide us
                            </span>
                            <span className="h-px w-8 bg-sky-400" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tighter leading-[0.9]">
                            Our{" "}
                            <span className="text-zinc-400">values.</span>
                        </h2>
                    </div>

                    {/* Values Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                        {values.map((value) => (
                            <div
                                key={value.title}
                                className="rounded-[10px] bg-white p-5 sm:p-6"
                            >
                                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-[10px] bg-blue-100">
                                    <value.icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                </div>
                                <h3 className="mt-4 text-base sm:text-lg font-semibold text-zinc-900">
                                    {value.title}
                                </h3>
                                <p className="mt-1.5 text-xs sm:text-sm text-zinc-500">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            {/* <section className="py-8 sm:py-12 lg:py-16">
                <div className="mx-auto w-[95%]">
                    <div
                        className="rounded-[10px] p-5 sm:p-8 lg:p-10"
                        style={{ backgroundColor: "#38bdf8" }}
                    >

                        <div className="text-center pb-6 sm:pb-8">
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <span className="h-px w-8 bg-white/50" />
                                <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-white/70">
                                    Passionate individuals
                                </span>
                                <span className="h-px w-8 bg-white/50" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter leading-[0.9]">
                                Meet our{" "}
                                <span className="text-white/60">team.</span>
                            </h2>
                        </div>


                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            {team.map((member) => (
                                <div
                                    key={member.name}
                                    className="overflow-hidden rounded-[10px] bg-white/10 backdrop-blur-sm"
                                >
                                    <div className="relative aspect-square">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-3 sm:p-4 text-center">
                                        <h3 className="text-sm sm:text-base font-bold text-white">
                                            {member.name}
                                        </h3>
                                        
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Mission & Vision */}
            <section className="py-8 sm:py-12 lg:py-16">
                <div className="mx-auto w-[95%]">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                        {/* Mission */}
                        <div className="w-full lg:w-1/2 p-5 sm:p-8 rounded-[10px] bg-white">
                            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-[10px] bg-teal-100">
                                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600" />
                            </div>
                            <h3 className="mt-4 text-lg sm:text-xl font-bold text-zinc-900">
                                Our Mission
                            </h3>
                            <p className="mt-3 text-sm sm:text-base text-zinc-600">
                                To empower professionals and businesses with
                                innovative digital networking solutions that
                                make meaningful connections effortless and
                                memorable.
                            </p>
                        </div>

                        {/* Vision */}
                        <div
                            className="w-full lg:w-1/2 p-5 sm:p-8 rounded-[10px]"
                            style={{ backgroundColor: "#F5A623" }}
                        >
                            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-[10px] bg-black/10">
                                <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                            </div>
                            <h3 className="mt-4 text-lg sm:text-xl font-bold text-black">
                                Our Vision
                            </h3>
                            <p className="mt-3 text-sm sm:text-base text-black/80">
                                To become the global leader in smart networking
                                products, making paper business cards obsolete
                                and contributing to a more sustainable,
                                connected world.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <BookDemoCTA />
        </div>
    );
}
