'use client';

import { useEffect, useState } from 'react';

const cyclingLines = [
  'Visions coalesce across timelines...',
  'The Kwisatz Haderach stirs...',
  'Reading the golden path...',
  'Water of Life flows through the oracle...',
];

export default function LoadingState() {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex((i) => (i + 1) % cyclingLines.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-slide-up flex flex-col items-center justify-center py-16">
      <div className="w-3 h-3 rounded-full bg-spice-amber animate-pulse-glow mb-4" />
      <p className="font-crimson italic text-sand-400 text-lg">The spice flows...</p>
      <p key={lineIndex} className="font-sans text-sm text-sand-400 text-center mt-2 animate-fade-slide-up">
        {cyclingLines[lineIndex]}
      </p>
    </div>
  );
}
