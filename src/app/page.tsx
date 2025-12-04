"use client";

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  // Visible text and fade flag
  const [phrase, setPhrase] = useState<string>('how\'s it going');
  const [visible, setVisible] = useState<boolean>(true);

  const timerRef = useRef<number | null>(null);

  const FADE_MS = 1000;
  const CHANGE_MS = 3000;

  // Phrase pools
  const calmPhrases = [
    'how\'s it going',
    'this is work in progress',
    'please leave a message',
    'no need to rush',
    '"Good things take time" -Deb Sofield',
    'relax...',
    'take a deep breath...',
    'it took 13.8 billion years to get you here...',
	'I can take a couple decades to make a portfolio',
	'have some chil, my friend',
	'did u know u can\'t actually scroll here',
	'here play a game https://y8.com',
	'or just stay here ig..',
	'...',
	'this is awkward',
	'...',
  ];

  // const activePhrases = [
  //   'try right clicking...',
  //   'hmmm...',
  // ];

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
    timerRef.current = window.setTimeout(() => {
      // trigger fade-out, swap phrase, fade-in
      setVisible(false);
      window.setTimeout(() => {
        setPhrase(prev => {
          const currentIndex = calmPhrases.indexOf(prev);
          const nextIndex = (currentIndex + 1) % calmPhrases.length;
          return calmPhrases[nextIndex];
        });
        setVisible(true);
        // schedule next after this transition completes
        scheduleNext();
      }, FADE_MS);
    }, CHANGE_MS);
  };

  useEffect(() => {
    scheduleNext();

    const handleWheel = (e: WheelEvent) => {
		console.log(e.deltaX, e.deltaY)
    e.preventDefault(); // Prevent actual scrolling
	if (e.deltaY == 0) {
		const update = Number(e.deltaX > 0)*(-2)+1

	}
  };

  window.addEventListener('wheel', handleWheel, { passive: false });

  return () => {
    clearTimer();
    window.removeEventListener('wheel', handleWheel);
  };
  }, []);

  return (
    <div className="relative min-h-screen flex justify-center animate-fade-in backdrop-blur-sm">
      <section className="py-16 px-6 flex items-center justify-center select-none">
        <div className="container relative mx-auto text-center">
          <h2
            className={
              'text-5xl xl:text-6xl 3xl:text-7xl mb-1 font-bold bg-gradient-to-tr from-primary to-secondary bg-clip-text text-transparent'
            }
          >
            Under construction
          </h2>
          <p className={"text-xl min-w-56 max-w-64 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full z-50 md:text-sm text-secondary transition-opacity duration-1000 transform"
              + (visible ? ' opacity-80' : ' opacity-0')
            }>{phrase}</p>
        </div>
		{/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center space-y-2">
			<p className="text-sm font-mono text-secondary/80">try scrolling</p>
			<div className="w-px h-4 bg-secondary/80 mx-auto" />
		</div> */}
      </section>
	  <section>

	  </section>
	</div>
  );
}
