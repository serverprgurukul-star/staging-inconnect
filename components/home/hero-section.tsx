import Image from "next/image";

export function HeroSection() {
  return (
    <section className="mx-3 mt-0 sm:mx-1.5 sm:mt-0 md:mb-0 mb-58">
      <div className="relative md:mt-0 mt-21 h-[290px] w-full overflow-hidden rounded-b-xl md:rounded-b-2xl sm:h-[600px] md:h-[750px]">
        {/* Background Banner */}
        <div className="absolute inset-0 h-full w-full">
          {/* <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source
              src="https://res.cloudinary.com/dem0bqs8e/video/upload/v1767860757/copy_8DF5DC17-E994-4E9C-95EC-99E54FA834B7_pxcxtl.mov"
              type="video/mp4"
            />
          </video> */}
          <Image
            src="https://souhaygiitgemoplvwnl.supabase.co/storage/v1/object/public/other%20images/Photo_1_pglrg1.jpg"
            alt="Instant Connect Hero Banner"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/90 to-black/40" />

        {/* Content */}
        <div className="relative z-10  flex h-full flex-col items-center justify-center px-4 sm:px-6">
          <h1 className="mt-3 sm:mt-4 text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white max-w-xs sm:max-w-lg md:max-w-3xl">
            India's #1 NFC Business Card — Share Your Profile in One Tap
          </h1>
          <p className="text-center mt-4 mb-1 md:mb-18 text-xs sm:text-sm md:text-base text-white/70 max-w-xs sm:max-w-md md:max-w-3xl">
            Buy NFC smart cards, AI review cards & digital standees. No app
            needed. Works on all phones. Free shipping across India.
          </p>

          {/* <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-5 sm:mt-6 md:mt-8 flex flex-wrap justify-center gap-3"
                        >
                            <Link
                                href="/shop"
                                className="rounded-[10px] bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
                            >
                                Shop Now
                            </Link>
                            <Link
                                href="/book-demo"
                                className="rounded-[10px] bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                            >
                                Book a Demo
                            </Link>
                        </motion.div> */}
        </div>
      </div>
    </section>
  );
}
