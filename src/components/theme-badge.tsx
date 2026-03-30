"use client";

import type { Theme } from "@/lib/types";
import { THEME_LABELS } from "@/lib/config";
import { useAppTheme } from "@/lib/theme-context";

const MUTHR_COLORS: Record<Theme, string> = {
  epic_meaning: "border-[#33ff00]/50 text-[#55ff33] bg-[#33ff00]/8",
  accomplishment: "border-[#00ff88]/50 text-[#33ffaa] bg-[#00ff88]/8",
  empowerment: "border-[#00ccff]/50 text-[#44ddff] bg-[#00ccff]/8",
  ownership: "border-[#ff9900]/50 text-[#ffbb44] bg-[#ff9900]/8",
  social_influence: "border-[#ff66cc]/50 text-[#ff88dd] bg-[#ff66cc]/8",
  scarcity: "border-[#ff3333]/50 text-[#ff6666] bg-[#ff3333]/8",
  unpredictability: "border-[#aa88ff]/50 text-[#bbaaff] bg-[#aa88ff]/8",
  loss_avoidance: "border-[#ffcc00]/50 text-[#ffdd44] bg-[#ffcc00]/8",
};

const LIGHT_COLORS: Record<Theme, string> = {
  epic_meaning: "border-violet-200 text-violet-700 bg-violet-50",
  accomplishment: "border-emerald-200 text-emerald-700 bg-emerald-50",
  empowerment: "border-sky-200 text-sky-700 bg-sky-50",
  ownership: "border-amber-200 text-amber-700 bg-amber-50",
  social_influence: "border-pink-200 text-pink-700 bg-pink-50",
  scarcity: "border-red-200 text-red-700 bg-red-50",
  unpredictability: "border-purple-200 text-purple-700 bg-purple-50",
  loss_avoidance: "border-orange-200 text-orange-700 bg-orange-50",
};

const SPEAKX_COLORS: Record<Theme, string> = {
  epic_meaning: "border-[#E8642C]/30 text-[#E8642C] bg-[#FFF0E6]",
  accomplishment: "border-[#E8642C]/30 text-[#C85520] bg-[#FFF0E6]",
  empowerment: "border-[#F47B2A]/30 text-[#F47B2A] bg-[#FFF5EC]",
  ownership: "border-[#E8642C]/30 text-[#B84A1C] bg-[#FFF0E6]",
  social_influence: "border-[#F47B2A]/30 text-[#E8642C] bg-[#FFF5EC]",
  scarcity: "border-[#C85520]/30 text-[#C85520] bg-[#FFF0E6]",
  unpredictability: "border-[#E8642C]/30 text-[#F47B2A] bg-[#FFF5EC]",
  loss_avoidance: "border-[#F47B2A]/30 text-[#C85520] bg-[#FFF0E6]",
};

export function ThemeBadge({ theme }: { theme: Theme }) {
  const { pick } = useAppTheme();

  return (
    <span
      className={`inline-flex items-center border px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider font-bold whitespace-nowrap ${
        pick({
          muthr: MUTHR_COLORS[theme],
          light: LIGHT_COLORS[theme],
          speakx: SPEAKX_COLORS[theme],
        })
      }`}
    >
      {THEME_LABELS[theme]}
    </span>
  );
}
