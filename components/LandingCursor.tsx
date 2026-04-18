'use client';

import { useEffect, useRef, useState } from 'react';

export default function LandingCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringPos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    // Don't show on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      dotPos.current = { x: e.clientX, y: e.clientY };
    };

    const loop = () => {
      const ring = ringRef.current;
      const dot = dotRef.current;
      if (ring && dot) {
        // Dot snaps instantly
        dot.style.transform = `translate(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px)`;
        // Ring lags behind
        ringPos.current.x += (dotPos.current.x - ringPos.current.x) * 0.12;
        ringPos.current.y += (dotPos.current.y - ringPos.current.y) * 0.12;
        ring.style.transform = `translate(${ringPos.current.x - 16}px, ${ringPos.current.y - 16}px)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    const onEnter = (e: MouseEvent) => {
      const el = e.target as Element;
      if (el.closest('a, button, [role="button"]')) setIsHover(true);
    };
    const onLeave = (e: MouseEvent) => {
      const el = e.target as Element;
      if (el.closest('a, button, [role="button"]')) setIsHover(false);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
    };
  }, []);

  return (
    <>
      {/* Outer ring — lags behind */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          border: `1px solid ${isHover ? 'rgba(239,159,39,0.9)' : 'rgba(196,163,90,0.5)'}`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'border-color 200ms ease, width 200ms ease, height 200ms ease',
          willChange: 'transform',
          mixBlendMode: 'screen',
          ...(isHover ? { width: 48, height: 48, marginLeft: -8, marginTop: -8 } : {}),
        }}
      />
      {/* Center dot — instant */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          background: isHover ? '#EF9F27' : '#C4A35A',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'background 200ms ease',
          willChange: 'transform',
          boxShadow: isHover ? '0 0 12px 2px rgba(239,159,39,0.6)' : '0 0 6px 1px rgba(196,163,90,0.3)',
        }}
      />
      {/* Crosshair lines on hover */}
      {isHover && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 32,
            height: 32,
            pointerEvents: 'none',
            zIndex: 9998,
            transform: ringRef.current?.style.transform,
          }}
        >
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(239,159,39,0.3)', transform: 'translateY(-50%)' }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(239,159,39,0.3)', transform: 'translateX(-50%)' }} />
        </div>
      )}
    </>
  );
}
