"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Launch time from env — NEXT_PUBLIC_LAUNCH_TIMESTAMP (e.g. 2026-03-28T13:30:00.000Z)
const LAUNCH_TIMESTAMP = new Date(process.env.NEXT_PUBLIC_LAUNCH_TIMESTAMP!).getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Fetch server time once, then tick locally from that anchor.
// This prevents client clock manipulation (setting system time forward).
async function fetchServerTime(): Promise<number> {
  try {
    const res = await fetch('/api/time', { cache: 'no-store' });
    const { now } = await res.json();
    return now as number;
  } catch {
    // Fallback to client time only if server unreachable
    return Date.now();
  }
}

const TimeUnit = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center">
    <div className="relative bg-[#1A1A1A] text-white w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-5xl md:text-6xl font-bold shadow-xl border border-white/5 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-px bg-black/50 z-10" />
      <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 z-10 mt-px" />
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
  const router = useRouter();
  const isAdminPage = pathname?.startsWith("/admin");

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [launched, setLaunched] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const confettiDone = useRef(false);
  // serverTimeOffset = serverNow - clientNow at sync time
  // Added to Date.now() on every tick so client clock changes have no effect
  const serverOffsetMs = useRef(0);

  // Disable right-click and common DevTools shortcuts
  useEffect(() => {
    if (isAdminPage) return;
    if (typeof window === "undefined") return;

    const blockContext = (e: MouseEvent) => e.preventDefault();

    const blockKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      // F12
      if (e.key === "F12") { e.preventDefault(); return; }
      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C / Ctrl+U (view source)
      if (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) { e.preventDefault(); return; }
      if (e.ctrlKey && key === "u") { e.preventDefault(); return; }
      // Cmd equivalents on Mac
      if (e.metaKey && e.altKey && ["i", "j", "c"].includes(key)) { e.preventDefault(); return; }
    };

    document.addEventListener("contextmenu", blockContext);
    document.addEventListener("keydown", blockKeys);

    return () => {
      document.removeEventListener("contextmenu", blockContext);
      document.removeEventListener("keydown", blockKeys);
    };
  }, [isAdminPage]);

  // Countdown tick — anchored to server time to prevent client clock manipulation
  useEffect(() => {
    if (isAdminPage) return;

    let timer: NodeJS.Timeout;

    async function init() {
      // Fetch server time once; compute offset so subsequent ticks stay accurate
      const clientBefore = Date.now();
      const serverNow = await fetchServerTime();
      const clientAfter = Date.now();
      // Use midpoint of request to compensate for network latency
      const clientNow = (clientBefore + clientAfter) / 2;
      serverOffsetMs.current = serverNow - clientNow;

      setIsClient(true);

      // Calculate time using server-anchored clock
      const getServerNow = () => Date.now() + serverOffsetMs.current;
      const calcWithServerTime = (): TimeLeft | null => {
        const diff = LAUNCH_TIMESTAMP - getServerNow();
        if (diff <= 0) return null;
        return {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        };
      };

      const initial = calcWithServerTime();
      if (!initial) {
        setLaunched(true);
        setShowCelebration(false);
        return;
      }

      setTimeLeft(initial);

      timer = setInterval(() => {
        const t = calcWithServerTime();
        if (!t) {
          setLaunched(true);
          setShowCelebration(true);
          setTimeLeft(null);
          clearInterval(timer);
        } else {
          setTimeLeft(t);
        }
      }, 1000);
    }

    init();
    return () => clearInterval(timer);
  }, [isAdminPage]);

  // Confetti + dismiss after live countdown ends
  useEffect(() => {
    if (!showCelebration || confettiDone.current || isAdminPage) return;
    confettiDone.current = true;

    const duration = 3000;
    const end = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const remaining = end - Date.now();
      if (remaining <= 0) return clearInterval(interval);
      const count = 50 * (remaining / duration);
      confetti({ ...defaults, particleCount: count, origin: { x: rand(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount: count, origin: { x: rand(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Dismiss celebration modal and reload after confetti
    const dismissTimer = setTimeout(() => {
      setShowCelebration(false);
      router.refresh();
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(dismissTimer);
    };
  }, [showCelebration, isAdminPage, router]);

  if (!isClient || isAdminPage) return null;

  // Pre-launch: render a full-page takeover that cannot be removed via DevTools
  // (removing the element just shows the blurred background — no content underneath)
  if (!launched && timeLeft) {
    return (
      <div
        style={{ position: "fixed", inset: 0, zIndex: 99999 }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Backdrop — covers everything */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.99)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "1rem",
          }}
        >
          <div className="w-full max-w-2xl bg-[#0A0A0A] rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/10 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-8 sm:mb-12">
              COMING SOON
            </h2>

            <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
              <TimeUnit label="DAYS" value={timeLeft.days} />
              <div className="text-white text-3xl sm:text-5xl font-bold self-start mt-4 sm:mt-6 opacity-30 animate-pulse">:</div>
              <TimeUnit label="HOURS" value={timeLeft.hours} />
              <div className="text-white text-3xl sm:text-5xl font-bold self-start mt-4 sm:mt-6 opacity-30 animate-pulse">:</div>
              <TimeUnit label="MINUTES" value={timeLeft.minutes} />
              <div className="text-white text-3xl sm:text-5xl font-bold self-start mt-4 sm:mt-6 opacity-30 animate-pulse">:</div>
              <TimeUnit label="SECONDS" value={timeLeft.seconds} />
            </div>

            <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Get ready for the biggest launch of the season! We are working hard to bring you the best experience. Stay tuned and get ready to be amazed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Post-launch: "We are open!" celebration banner — only if timer hit zero live
  if (showCelebration) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, zIndex: 99999 }}
          className="flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl bg-[#0A0A0A] rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/10 text-center py-12"
          >
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-orange-500 to-red-500 tracking-tight mb-6">
              WE ARE OPEN!
            </h2>
            <p className="text-lg sm:text-xl text-zinc-300 max-w-lg mx-auto">
              The wait is finally over. Thank you for your patience! Welcome to the new experience.
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
