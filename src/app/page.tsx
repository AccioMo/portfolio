"use client";

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  // Visible text and fade flag
  const [phrase, setPhrase] = useState<string>('[nullptr]');
  const [visible, setVisible] = useState<boolean>(true);

  // Refs for mouse speed calculation and timers
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  // const speedRef = useRef<number>(0); // px/sec moving average
  // const speedSamplesRef = useRef<number[]>([]);
  const timerRef = useRef<number | null>(null);

  const FADE_MS = 1000;

  // Phrase pools
  const calmPhrases = [
    'Good morning.',
    'Bon matin.',
    'Bonjour.',
    'Buongiorno.',
    'Guten Morgen.',
    'Доброе утро.',
  ];

  // const activePhrases = [
  //   'try right clicking...',
  //   'hmmm...',
  // ];

  // Utility: pick phrase based on current average speed
  const pickPhrase = () => {
    // const speed = speedRef.current || 0;
    // const threshold = 300; // px/sec -> above this considered "active"
    const pool = calmPhrases;
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  };

  // Clear running timer
  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Schedule next phrase change based on speed
  const scheduleNext = () => {
    clearTimer();
    // const speed = speedRef.current || 0;
    // slower changes when calm, faster when active
    const base = 3000;
    timerRef.current = window.setTimeout(() => {
      // trigger fade-out, swap phrase, fade-in
      setVisible(false);
      window.setTimeout(() => {
        setPhrase(pickPhrase());
        setVisible(true);
        // schedule next after this transition completes
        scheduleNext();
      }, FADE_MS);
    }, base);
  };

  useEffect(() => {
    // Mouse move handler computes instantaneous speed and keeps a short moving average
    // const handleMouseMove = (e: MouseEvent) => {
    //   const now = performance.now();
    //   const pos = { x: e.clientX, y: e.clientY };
    //   const lastPos = lastPosRef.current;
    //   const lastTime = lastTimeRef.current;

    //   if (lastPos && lastTime) {
    //     const dx = pos.x - lastPos.x;
    //     const dy = pos.y - lastPos.y;
    //     const dist = Math.sqrt(dx * dx + dy * dy);
    //     const dt = Math.max(1, now - lastTime);
    //     const speed = (dist / dt) * 1000; // px/sec

    //     // keep small sample window
    //     const samples = speedSamplesRef.current;
    //     samples.push(speed);
    //     if (samples.length > 8) samples.shift();
    //     const avg = samples.reduce((s, v) => s + v, 0) / samples.length;
    //     speedRef.current = avg;
    //   }

    //   lastPosRef.current = pos;
    //   lastTimeRef.current = now;
    // };

    // window.addEventListener('mousemove', handleMouseMove);

    // Start scheduler
    scheduleNext();

    return () => {
      // window.removeEventListener('mousemove', handleMouseMove);
      clearTimer();
    };
    // We intentionally omit deps to set up once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen flex justify-center animate-fade-in">
        {/* <div className="absolute flex justify-center w-24 h-full right-0 top-0" data-project-area="true">
          <a className="rotate-90 my-auto opacity-65 hover:opacity-80 transition-all duration-300" href="/works">Works</a>
        </div>
        <div className="absolute flex justify-center w-24 h-full left-0 top-0" data-project-area="true">
          <a className="-rotate-90 my-auto opacity-65 hover:opacity-80 transition-all duration-300" href="/contact">Contact</a>
        </div>
        <div className="absolute flex justify-center h-24 w-full left-0 bottom-0" data-project-area="true">
          <a className="my-auto opacity-65 hover:opacity-80 transition-all duration-300" href="/about">About</a>
        </div> */}
      <section className="py-16 px-6 flex items-center justify-center cursor-none select-none">
        <div className="container mx-auto text-center">
          <h2
            className={
              'text-5xl xl:text-5xl 3xl:text-8xl mb-1 font-bold bg-gradient-to-tr from-neutral-200 mask-t-to-gray-800 bg-clip-text text-transparent'
            }
          >
            Hello.
          </h2>
          <p className={"text-xl z-50 md:text-sm text-gray-600 dark:text-gray-300 transition-opacity duration-1000 transform"
              + (visible ? ' opacity-100' : ' opacity-0')
            }>{phrase}</p>
        </div>
      </section>
    </div>
  );
}
