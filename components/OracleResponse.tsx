'use client';

import { useState } from 'react';
import type { House, OracleResponse as OracleResponseType } from '@/types/oracle';

const houseBadgeClass: Record<House, string> = {
  atreides: 'bg-atreides/20 text-atreides border border-atreides/40',
  harkonnen: 'bg-harkonnen/20 text-harkonnen border border-harkonnen/40',
  fremen: 'bg-fremen-gold/20 text-fremen-gold border border-fremen-gold/40',
};

const scores = (res: OracleResponseType) => [
  { label: 'Success odds', value: res.successScore, color: 'spice-amber', delay: '0ms' },
  { label: 'Risk level',   value: res.riskScore,    color: 'spice-coral', delay: '150ms' },
  { label: 'Spice yield',  value: res.spiceScore,   color: 'spice-teal',  delay: '300ms' },
];

interface Props {
  response: OracleResponseType;
  house: House;
  onReset: () => void;
}

export default function OracleResponse({ response, house, onReset }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(response.verdict);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface-low p-6 mt-6 animate-fade-slide-up ghost-border">
      {/* Zone 1 — Prophecy */}
      <span className={`font-mono text-[10px] uppercase tracking-[0.15em] px-2.5 py-0.5 inline-block mb-4 ${houseBadgeClass[house]}`}>
        House {house}
      </span>

      <div className="prophecy-block border-l-2 border-spice-amber pl-4 my-4">
        <p className="font-crimson italic text-sand-50 text-lg leading-relaxed">
          {response.prophecy}
        </p>
      </div>

      <div className="ghost-border border-t border-0 my-5" />

      {/* Zone 2 — Spice Probability Engine */}
      <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-sand-400 mb-4">
        spice probability across timelines
      </p>

      <div className="flex flex-col gap-3.5">
        {scores(response).map(({ label, value, color, delay }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="font-sans text-xs text-sand-200 w-32 md:w-32 truncate">{label}</span>
            <div className="flex-1 h-1.5 md:h-1.5 bg-surface-high">
              <div
                className={`h-full bg-${color} animate-bar-fill`}
                style={{ '--bar-target': `${value}%`, animationDelay: delay } as React.CSSProperties}
              />
            </div>
            <span className={`font-mono text-sm font-medium text-${color} w-12 text-right`}>
              {value}%
            </span>
          </div>
        ))}
      </div>

      <div className="ghost-border border-t border-0 my-5" />

      {/* Zone 3 — The Fremen Verdict */}
      <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-sand-400 text-center mb-3">
        — the fremen verdict —
      </p>
      <p className="font-cinzel text-sand-50 text-xl md:text-xl text-lg text-center leading-relaxed px-4">
        {response.verdict}
      </p>

      {/* Actions */}
      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={handleCopy}
          className="verdict-copy-btn font-sans text-xs text-sand-200 bg-surface-high px-4 py-2
            ghost-border hover:border-sand-400 hover:text-sand-50 cursor-pointer"
        >
          {copied ? <span className="text-sand-400">Ascertained.</span> : 'Copy Verdict'}
        </button>
        <button
          onClick={onReset}
          className="verdict-reset-btn font-sans text-xs text-sand-400 bg-transparent px-4 py-2
            hover:text-sand-200 transition-colors duration-200"
        >
          Initialize New Consultation
        </button>
      </div>
    </div>
  );
}
