'use client';

import Image from 'next/image';

export default function Header() {
  return (
    <header className="relative w-full py-10 text-center border-b border-outline-variant/15">
      <div className="flex flex-col items-center justify-center gap-3 bg-transparent">
        <Image
          src="/logo.png"
          alt="FREMN Oracle"
          width={96}
          height={96}
          priority
          unoptimized
          className="h-20 w-auto object-contain shrink-0 bg-transparent"
        />
        <div className="text-center">
          <p className="font-cinzel text-sand-50 tracking-widest-2 text-4xl mb-1">FREMN</p>
          <p className="font-cinzel text-sand-400 tracking-widest-3 text-sm">ORACLE</p>
        </div>
      </div>
      <div className="w-16 h-px bg-sand-600 mx-auto mt-4 mb-3" />
      <p className="font-sans italic text-sand-200 text-xs">Prescience for your decisions</p>
    </header>
  );
}
