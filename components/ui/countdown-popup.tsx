"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const TARGET_DATE = new Date("March 28, 2026 19:00:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TimeUnit = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center">
    <div className="relative bg-[#1A1A1A] text-white w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-5xl md:text-6xl font-bold shadow-xl border border-white/5 overflow-hidden">
      {/* Flip line effect */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-black/50 z-10" />
      <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 z-10 mt-px" />
      
      {/* Shadow gradient for flip look */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-black/20" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-black/40 to-transparent" />
      
      <span className="relative z-20 tabular-nums">
        {value.toString().padStart(2, "0")}
      </span>
    </div>
    <span className="mt-3 md:mt-4 text-xs sm:text-sm font-medium text-zinc-400 tracking-wider">
      {label}
    </span>
  </div>
);

export function CountdownPopup() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    if (isAdminPage) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference <= 0) {
        setHasEnded(true);
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    const timerInit = setTimeout(() => {
      setIsClient(true);
      const initialTimeLeft = calculateTimeLeft();
      setTimeLeft(initialTimeLeft);
      // Popup cannot be bypassed
      setIsOpen(true);
    }, 0);

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      if (!newTimeLeft) {
        clearInterval(timer);
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => {
      clearTimeout(timerInit);
      clearInterval(timer);
    };
  }, [isAdminPage]);

  useEffect(() => {
    if (isAdminPage) return;
    
    if (hasEnded && isOpen) {
      // Fire confetti explosion
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      // Auto destroy popup after celebration
      const destroyTimer = setTimeout(() => {
        setIsOpen(false);
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(destroyTimer);
      };
    }
  }, [hasEnded, isOpen, isAdminPage]);

  if (!isClient || isAdminPage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[#0A0A0A] rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/10"
          >
            {hasEnded ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-orange-500 to-red-500 tracking-tight mb-6">
                  WE ARE OPEN!
                </h2>
                <p className="text-lg sm:text-xl text-zinc-300 max-w-lg mx-auto">
                  The wait is finally over. Thank you for your patience! Welcome to the new experience.
                </p>
              </motion.div>
            ) : (
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-8 sm:mb-12">
                  COMING SOON
                </h2>

                <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
                  <TimeUnit label="DAYS" value={timeLeft?.days || 0} />
                  <div className="text-white text-3xl sm:text-5xl font-bold self-start mt-4 sm:mt-6 opacity-30 animate-pulse">:</div>
                  <TimeUnit label="HOURS" value={timeLeft?.hours || 0} />
                  <div className="text-white text-3xl sm:text-5xl font-bold self-start mt-4 sm:mt-6 opacity-30 animate-pulse">:</div>
                  <TimeUnit label="MINUTES" value={timeLeft?.minutes || 0} />
                  <div className="text-white text-3xl sm:text-5xl font-bold self-start mt-4 sm:mt-6 opacity-30 animate-pulse">:</div>
                  <TimeUnit label="SECONDS" value={timeLeft?.seconds || 0} />
                </div>

                <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
                  Get ready for the biggest launch of the season! We are working hard to bring you the best experience. Stay tuned and get ready to be amazed.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
