"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const LAUNCH_TIMESTAMP = new Date(process.env.NEXT_PUBLIC_LAUNCH_TIMESTAMP!).getTime();
const SESSION_OFFSET_KEY = "ic_time_offset";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

async function fetchServerTime(): Promise<number> {
  try {
    const cached = sessionStorage.getItem(SESSION_OFFSET_KEY);
    if (cached !== null) return Date.now() + parseFloat(cached);
    const clientBefore = Date.now();
    const res = await fetch("/api/time");
    const { now } = await res.json();
    const clientAfter = Date.now();
    const offset = now - (clientBefore + clientAfter) / 2;
    sessionStorage.setItem(SESSION_OFFSET_KEY, String(offset));
    return Date.now() + offset;
  } catch {
    return Date.now();
  }
}

const TimeUnit = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center">
    <div className="relative bg-[#1A1A1A] text-white w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-5xl md:text-6xl font-bold shadow-xl border border-white/5 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-px bg-black/50 z-10" />
      <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 z-10 mt-px" />
      <div className="absolute top-0 left-0 w-full h-1/2 bg-black/20" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
      <span className="relative z-20 tabular-nums">
        {value.toString().padStart(2, "0")}
      </span>
    </div>
    <span className="mt-3 md:mt-4 text-xs sm:text-sm font-medium text-zinc-400 tracking-wider">
      {label}
    </span>
  </div>
);

export default function ComingSoonPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isClient, setIsClient] = useState(false);
  const serverOffsetMs = useRef(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    async function init() {
      // Already past launch — redirect to home
      if (Date.now() >= LAUNCH_TIMESTAMP) {
        router.replace("/");
        return;
      }

      const serverNow = await fetchServerTime();
      serverOffsetMs.current = serverNow - Date.now();
      setIsClient(true);

      const getServerNow = () => Date.now() + serverOffsetMs.current;
      const calc = (): TimeLeft | null => {
        const diff = LAUNCH_TIMESTAMP - getServerNow();
        if (diff <= 0) return null;
        return {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        };
      };

      const initial = calc();
      if (!initial) {
        router.replace("/");
        return;
      }

      setTimeLeft(initial);

      timer = setInterval(() => {
        const t = calc();
        if (!t) {
          clearInterval(timer);
          router.replace("/");
        } else {
          setTimeLeft(t);
        }
      }, 1000);
    }

    init();
    return () => clearInterval(timer);
  }, [router]);

  if (!isClient || !timeLeft) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-zinc-700 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
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
  );
}
