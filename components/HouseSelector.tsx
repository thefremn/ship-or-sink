'use client';

import type { House } from '@/types/oracle';

const houses: {
  id: House;
  label: string;
  description: string;
  activeClass: string;
  activeBorder: string;
  hoverClass: string;
}[] = [
  {
    id: 'atreides',
    label: 'ATREIDES',
    description: 'Noble. Long-term. Honour-driven.',
    activeClass: 'bg-atreides text-sand-50',
    activeBorder: 'border-atreides',
    hoverClass: 'house-btn-atreides',
  },
  {
    id: 'harkonnen',
    label: 'HARKONNEN',
    description: 'Ruthless. Efficient. Unsentimental.',
    activeClass: 'bg-harkonnen text-sand-50',
    activeBorder: 'border-harkonnen',
    hoverClass: 'house-btn-harkonnen',
  },
  {
    id: 'fremen',
    label: 'FREMEN',
    description: 'Adaptive. Resourceful. Desert-forged.',
    activeClass: 'bg-fremen-gold text-void-900',
    activeBorder: 'border-fremen-gold',
    hoverClass: 'house-btn-fremen',
  },
];

interface Props {
  selected: House | null;
  onChange: (house: House) => void;
}

export default function HouseSelector({ selected, onChange }: Props) {
  const selectedHouse = houses.find((h) => h.id === selected);

  return (
    <div className="py-6">
      <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-sand-400 mb-3 text-center">
        Align with a House
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-2">
        {houses.map((house) => {
          const isActive = selected === house.id;
          return (
            <button
              key={house.id}
              onClick={() => onChange(house.id)}
              className={`
                house-btn md:w-40 w-full h-12 font-sans text-sm tracking-[0.1em] uppercase
                border
                ${isActive
                  ? `${house.activeClass} ${house.activeBorder}`
                  : `bg-surface-low text-sand-200 border-outline-variant/15 ${house.hoverClass}`
                }
              `}
            >
              {house.label}
            </button>
          );
        })}
      </div>
      {selectedHouse && (
        <p className="font-sans italic text-xs text-sand-400 text-center mt-3">
          {selectedHouse.description}
        </p>
      )}
    </div>
  );
}
