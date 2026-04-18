'use client';

import { useEffect, useState } from 'react';
import type { Consultation, House } from '@/types/oracle';

const houseBadgeClass: Record<House, string> = {
  atreides: 'bg-atreides/20 text-atreides border border-atreides/40',
  harkonnen: 'bg-harkonnen/20 text-harkonnen border border-harkonnen/40',
  fremen: 'bg-fremen-gold/20 text-fremen-gold border border-fremen-gold/40',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

interface Props {
  token: string;
  refreshTrigger: number;
}

export default function ConsultationHistory({ token, refreshTrigger }: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  useEffect(() => {
    if (!token) return;
    fetch('/api/history', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setConsultations(d.consultations ?? []));
  }, [token, refreshTrigger]);

  if (consultations.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="ghost-border border-t border-0" />
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex justify-between items-center w-full py-4 cursor-pointer hover:text-sand-200 transition-colors duration-200"
      >
        <span className="font-sans text-sm text-sand-400">
          Past Consultations ({consultations.length})
        </span>
        <span className={`text-sand-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="flex flex-col gap-3 mt-3">
          {consultations.map((c) => (
            <div
              key={c.id}
              onClick={() => setExpanded(expanded === c.id ? null : c.id)}
              className="history-item bg-surface-low p-4 ghost-border cursor-pointer hover:border-sand-400"
            >
              <div className="flex justify-between items-center">
                <span className={`font-mono text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 ${houseBadgeClass[c.house]}`}>
                  House {c.house}
                </span>
                <span className="font-mono text-[11px] text-sand-400">{formatDate(c.created_at)}</span>
              </div>
              <p className="font-sans text-sm text-sand-200 line-clamp-2 mt-2">{c.dilemma}</p>
              <p className="font-crimson italic text-sand-50 text-sm line-clamp-1 mt-1">{c.verdict}</p>

              {expanded === c.id && (
                <div className="mt-4 border-l-2 border-spice-amber pl-3">
                  <p className="font-crimson italic text-sand-50 text-base leading-relaxed">{c.prophecy}</p>
                  <div className="flex flex-col gap-2 mt-3">
                    {[
                      { label: 'Success', value: c.success_score, color: 'spice-amber' },
                      { label: 'Risk',    value: c.risk_score,    color: 'spice-coral' },
                      { label: 'Spice',   value: c.spice_score,   color: 'spice-teal' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="font-sans text-xs text-sand-200 w-16">{label}</span>
                        <div className="flex-1 h-1.5 bg-surface-high">
                          <div className={`h-full bg-${color}`} style={{ width: `${value}%` }} />
                        </div>
                        <span className={`font-mono text-xs text-${color} w-10 text-right`}>{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
