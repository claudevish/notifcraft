"use client";

import type { Segment } from "@/lib/types";
import { SEGMENT_LABELS, SEGMENT_SHORT, SEGMENT_THEMES, THEME_LABELS } from "@/lib/config";
import { useAppTheme } from "@/lib/theme-context";

const ALL: Segment[] = ["E0", "E_lt_40", "E_lt_70", "E_gte_70"];

interface Props {
  selected: Segment[];
  onChange: (segments: Segment[]) => void;
}

export function SegmentPicker({ selected, onChange }: Props) {
  const { pick } = useAppTheme();

  const toggle = (seg: Segment) => {
    if (selected.includes(seg)) {
      onChange(selected.filter((s) => s !== seg));
    } else {
      onChange([...selected, seg]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {ALL.map((seg) => {
        const active = selected.includes(seg);
        const themes = SEGMENT_THEMES[seg];
        return (
          <button
            key={seg}
            onClick={() => toggle(seg)}
            className={`relative border p-5 text-left transition-all font-mono rounded-xl hover-lift ${
              active
                ? pick({
                    muthr: "border-[#33ff00]/60 bg-[#0f2a0a] panel-glow-active",
                    light: "border-indigo-400 bg-indigo-50 panel-glow-active shadow-sm",
                    speakx: "border-[#E8642C] bg-[#FFF0E6] panel-glow-active shadow-md",
                  })
                : pick({
                    muthr: "border-[#1a3312] bg-[#0d1a0a] hover:border-[#33ff00]/30",
                    light: "border-zinc-200 bg-white hover:border-indigo-300 shadow-sm",
                    speakx: "border-[#F0D4BE]/60 bg-white/80 hover:border-[#E8642C]/50 shadow-sm",
                  })
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`w-3 h-3 rounded-full border-2 transition-all ${
                  active
                    ? pick({
                        muthr: "bg-[#33ff00] border-[#33ff00] status-pulse",
                        light: "bg-indigo-500 border-indigo-500",
                        speakx: "bg-[#E8642C] border-[#E8642C]",
                      })
                    : pick({
                        muthr: "bg-transparent border-[#2a5a1a]",
                        light: "bg-transparent border-zinc-300",
                        speakx: "bg-transparent border-[#F0D4BE]",
                      })
                }`}
              />
              <span className={`font-bold text-base tracking-wider ${
                active
                  ? pick({ muthr: "text-[#33ff00] glow-green", light: "text-indigo-700", speakx: "text-[#E8642C]" })
                  : pick({ muthr: "text-[#3a9a2a]", light: "text-zinc-500", speakx: "text-[#8B6B4E]" })
              }`}>
                {SEGMENT_SHORT[seg]}
              </span>
              {active && (
                <span className={`ml-auto text-xs tracking-widest font-bold ${pick({
                  muthr: "text-[#33ff00]",
                  light: "text-indigo-500",
                  speakx: "text-[#E8642C]",
                })}`}>
                  {pick({ muthr: "ONLINE", light: "ACTIVE", speakx: "ACTIVE" })}
                </span>
              )}
            </div>
            <p className={`text-xs mb-3 uppercase tracking-wider ${pick({
              muthr: "text-[#4a8a3a]",
              light: "text-zinc-400",
              speakx: "text-[#B8977A]",
            })}`}>
              {SEGMENT_LABELS[seg]}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {themes.map((th) => (
                <span
                  key={th}
                  className={`text-[11px] px-2 py-1 border uppercase tracking-wider ${
                    active
                      ? pick({
                          muthr: "border-[#33ff00]/30 text-[#66ff44] bg-[#33ff00]/8",
                          light: "border-indigo-200 text-indigo-600 bg-indigo-50",
                          speakx: "border-[#E8642C]/30 text-[#E8642C] bg-[#FFF0E6]",
                        })
                      : pick({
                          muthr: "border-[#1a3312] text-[#3a8a2a]",
                          light: "border-zinc-200 text-zinc-400",
                          speakx: "border-[#F0D4BE] text-[#B8977A]",
                        })
                  }`}
                >
                  {THEME_LABELS[th]}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
