"use client";

import { useAppTheme } from "@/lib/theme-context";

interface Props {
  totalRows: number;
  segments: number;
  quests: number;
  themes: number;
}

export function StatsBar({ totalRows, segments, quests, themes }: Props) {
  const { pick } = useAppTheme();

  const stats = [
    { label: "NOTIFICATIONS", value: totalRows.toLocaleString("en-IN") },
    { label: "SEGMENTS", value: segments },
    { label: "QUESTS", value: quests },
    { label: "THEMES", value: themes },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`border p-5 panel-glow rounded-xl hover-lift ${pick({
            muthr: "border-[#1a3312] bg-[#0d1a0a]",
            light: "border-zinc-200 bg-white shadow-sm",
            speakx: "border-[#F0D4BE]/60 bg-white/80 shadow-sm",
          })}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full ${pick({
              muthr: "bg-[#33ff00] status-pulse",
              light: "bg-indigo-500",
              speakx: "bg-[#E8642C]",
            })}`} />
            <span className={`text-xs uppercase tracking-widest font-bold ${pick({
              muthr: "text-[#4a8a3a]",
              light: "text-zinc-400",
              speakx: "text-[#B8977A]",
            })}`}>
              {s.label}
            </span>
          </div>
          <p className={`text-3xl font-bold tabular-nums font-mono ${pick({
            muthr: "text-[#33ff00] glow-green",
            light: "text-zinc-900",
            speakx: "text-[#2D1B0E]",
          })}`}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}
