"use client";

import type { Segment, Theme } from "@/lib/types";
import { SEGMENT_SHORT, THEME_LABELS, ALL_SEGMENTS } from "@/lib/config";
import { useAppTheme } from "@/lib/theme-context";

const ALL_THEMES: Theme[] = [
  "epic_meaning", "accomplishment", "empowerment", "ownership",
  "social_influence", "scarcity", "unpredictability", "loss_avoidance",
];

interface Props {
  mapping: Record<Segment, Theme[]>;
  onChange: (mapping: Record<Segment, Theme[]>) => void;
}

export function ThemeConfig({ mapping, onChange }: Props) {
  const { pick } = useAppTheme();

  const toggleTheme = (seg: Segment, theme: Theme) => {
    const current = mapping[seg];
    const updated = current.includes(theme)
      ? current.filter((th) => th !== theme)
      : current.length < 3
        ? [...current, theme]
        : current;

    onChange({ ...mapping, [seg]: updated });
  };

  return (
    <div className="space-y-4">
      <p className={`text-xs tracking-wider ${pick({
        muthr: "text-[#4a8a3a]",
        light: "text-zinc-400",
        speakx: "text-[#B8977A]",
      })}`}>
        Select exactly 3 themes per segment (based on CTR analysis). Themes at capacity are locked.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ALL_SEGMENTS.map((seg) => {
          const selected = mapping[seg];
          const isFull = selected.length >= 3;

          return (
            <div
              key={seg}
              className={`border p-4 panel-glow ${
                pick({
                  muthr: "border-[#1a3312] bg-[#0d1a0a]",
                  light: "border-zinc-200 bg-white shadow-sm rounded-lg",
                  speakx: "border-[#F0D4BE] bg-white shadow-sm rounded-lg",
                })
              }`}
            >
              {/* Segment header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    selected.length === 3
                      ? pick({ muthr: "bg-[#33ff00] status-pulse", light: "bg-emerald-500", speakx: "bg-[#E8642C]" })
                      : pick({ muthr: "bg-[#ff9900]", light: "bg-amber-500", speakx: "bg-[#F47B2A]" })
                  }`} />
                  <span className={`text-sm font-bold tracking-wider ${
                    pick({ muthr: "text-[#33ff00]", light: "text-zinc-900", speakx: "text-[#2D1B0E]" })
                  }`}>
                    {SEGMENT_SHORT[seg]}
                  </span>
                </div>
                <span className={`text-xs font-bold tracking-wider ${
                  selected.length === 3
                    ? pick({ muthr: "text-[#33ff00]", light: "text-emerald-600", speakx: "text-[#E8642C]" })
                    : pick({ muthr: "text-[#ff9900]", light: "text-amber-600", speakx: "text-[#F47B2A]" })
                }`}>
                  {selected.length}/3 SELECTED
                </span>
              </div>

              {/* Theme buttons */}
              <div className="flex flex-wrap gap-2">
                {ALL_THEMES.map((theme) => {
                  const isSelected = selected.includes(theme);
                  const isDisabled = !isSelected && isFull;

                  return (
                    <button
                      key={theme}
                      onClick={() => toggleTheme(seg, theme)}
                      disabled={isDisabled}
                      className={`px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider border transition-all font-bold ${
                        isSelected
                          ? pick({
                              muthr: "border-[#33ff00]/60 text-[#33ff00] bg-[#33ff00]/10",
                              light: "border-indigo-400 text-indigo-700 bg-indigo-100",
                              speakx: "border-[#E8642C] text-[#E8642C] bg-[#FFF0E6]",
                            })
                          : isDisabled
                            ? pick({
                                muthr: "border-[#1a3312]/30 text-[#1a3312] cursor-not-allowed opacity-30",
                                light: "border-zinc-200 text-zinc-300 cursor-not-allowed",
                                speakx: "border-[#F0D4BE]/50 text-[#B8977A]/50 cursor-not-allowed",
                              })
                            : pick({
                                muthr: "border-[#1a3312] text-[#3a8a2a] hover:border-[#33ff00]/40 hover:text-[#33ff00] hover:bg-[#33ff00]/5",
                                light: "border-zinc-200 text-zinc-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50",
                                speakx: "border-[#F0D4BE] text-[#8B6B4E] hover:border-[#E8642C]/50 hover:text-[#E8642C] hover:bg-[#FFF0E6]",
                              })
                      }`}
                    >
                      {THEME_LABELS[theme]}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
