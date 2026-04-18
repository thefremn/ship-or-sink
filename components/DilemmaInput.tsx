'use client';

import type { House } from '@/types/oracle';

const chips = [
  'Should I launch my startup?',
  'I want to pivot my career to AI',
  'My co-founder and I disagree',
  'Should I move to a new city?',
];

interface Props {
  dilemma: string;
  onDilemmaChange: (v: string) => void;
  gomJabbar: boolean;
  onGomJabbarChange: (v: boolean) => void;
  house: House | null;
  loading: boolean;
  onSubmit: () => void;
}

export default function DilemmaInput({
  dilemma,
  onDilemmaChange,
  gomJabbar,
  onGomJabbarChange,
  house,
  loading,
  onSubmit,
}: Props) {
  const charCount = dilemma.length;
  const counterColor =
    charCount > 480
      ? 'text-spice-coral'
      : charCount > 400
      ? 'text-sand-600'
      : 'text-sand-400';

  return (
    <div className="mt-2">
      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto">
        {chips.map((chip) => (
          <button
            key={chip}
            onClick={() => onDilemmaChange(chip)}
            className="chip-btn font-sans text-xs text-sand-200 bg-surface-high px-4 py-1.5
              border border-outline-variant/15 cursor-pointer
              hover:border-sand-400 hover:text-sand-50 whitespace-nowrap"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        value={dilemma}
        onChange={(e) => onDilemmaChange(e.target.value)}
        maxLength={500}
        placeholder="Speak your dilemma, seeker of the golden path..."
        className="w-full min-h-[120px] resize-none bg-surface-high text-sand-50
          font-sans text-base leading-relaxed px-4 py-3.5
          border-0 border-b border-sand-600
          focus:border-sand-400 transition-colors duration-300
          placeholder:text-sand-400"
      />

      {/* Char counter */}
      <p className={`font-mono text-xs text-right mt-1 ${counterColor}`}>
        {charCount}/500
      </p>

      {/* Gom Jabbar row */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <span className="font-sans text-sm text-sand-200">Gom Jabbar Mode</span>
          {gomJabbar && (
            <span className="gom-badge font-mono text-[10px] uppercase tracking-[0.15em]
              bg-harkonnen/20 text-harkonnen border border-harkonnen px-2 py-0.5">
              Gom Jabbar Active
            </span>
          )}
        </div>
        {/* Custom toggle */}
        <button
          role="switch"
          aria-checked={gomJabbar}
          onClick={() => onGomJabbarChange(!gomJabbar)}
          className={`relative inline-flex shrink-0 w-10 h-5 transition-colors duration-200 ${
            gomJabbar ? 'bg-harkonnen' : 'bg-outline-variant'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-4 w-4 transition-transform duration-200 ${
              gomJabbar ? 'translate-x-5 bg-sand-50' : 'translate-x-0 bg-sand-400'
            }`}
          />
        </button>
      </div>

      {/* Submit button */}
      <button
        onClick={onSubmit}
        disabled={!house || !dilemma.trim() || loading}
        className="oracle-submit w-full h-13 mt-4 bg-spice-gradient text-on-primary
          font-cinzel text-sm tracking-[0.15em] uppercase
          disabled:bg-none disabled:bg-surface-high disabled:text-sand-400
          disabled:cursor-not-allowed"
      >
        {loading ? 'The spice flows...' : 'Consult the Oracle'}
      </button>
      {!house && (
        <p className="font-sans text-xs text-sand-400 text-center mt-2">
          Align with a House before seeking counsel.
        </p>
      )}
    </div>
  );
}
