"use client";

import { useAppTheme, type AppTheme } from "@/lib/theme-context";

const THEME_STYLES: Record<AppTheme, { border: string; text: string; dot: string; bg: string; label: string }> = {
  muthr: {
    border: "border-[#33ff00]/40",
    text: "text-[#33ff00]",
    dot: "bg-[#33ff00]",
    bg: "hover:bg-[#33ff00]/10",
    label: "MUTHR",
  },
  light: {
    border: "border-indigo-300",
    text: "text-indigo-600",
    dot: "bg-indigo-500",
    bg: "bg-white hover:bg-indigo-50",
    label: "LIGHT",
  },
  speakx: {
    border: "border-[#E8642C]/40",
    text: "text-[#E8642C]",
    dot: "bg-[#E8642C]",
    bg: "bg-[#FFF8F3] hover:bg-[#FFE8D6]",
    label: "SPEAKX",
  },
};

export function ThemeToggle() {
  const { theme, setTheme } = useAppTheme();
  const s = THEME_STYLES[theme];

  return (
    <div className="flex items-center gap-1">
      {(["muthr", "light", "speakx"] as AppTheme[]).map((t) => {
        const style = THEME_STYLES[t];
        const active = theme === t;
        return (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-all ${
              active
                ? `${style.border} ${style.text} ${style.bg} font-bold`
                : `border-transparent ${style.text}/30 hover:${style.text}/60`
            }`}
            title={`Switch to ${style.label} theme`}
          >
            <span className={`w-1.5 h-1.5 rounded-full transition-colors ${active ? style.dot : "bg-zinc-400/30"}`} />
            {style.label}
          </button>
        );
      })}
    </div>
  );
}
