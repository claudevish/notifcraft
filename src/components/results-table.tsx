"use client";

import { useState, useMemo } from "react";
import type { NotificationRow, Theme } from "@/lib/types";
import { SEGMENT_SHORT, THEME_LABELS } from "@/lib/config";
import { ThemeBadge } from "./theme-badge";
import { useAppTheme } from "@/lib/theme-context";

interface Props {
  rows: NotificationRow[];
}

const PAGE_SIZE = 15;

export function ResultsTable({ rows }: Props) {
  const { pick } = useAppTheme();
  const [search, setSearch] = useState("");
  const [segFilter, setSegFilter] = useState<string>("all");
  const [themeFilter, setThemeFilter] = useState<string>("all");
  const [page, setPage] = useState(0);

  const segments = useMemo(() => [...new Set(rows.map((r) => r.segment))], [rows]);
  const themes = useMemo(() => [...new Set(rows.map((r) => r.theme))], [rows]);

  const filtered = useMemo(() => {
    let result = rows;
    if (segFilter !== "all") result = result.filter((r) => r.segment === segFilter);
    if (themeFilter !== "all") result = result.filter((r) => r.theme === themeFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.body.toLowerCase().includes(q) ||
          r.questTitle.toLowerCase().includes(q) ||
          r.cta.toLowerCase().includes(q)
      );
    }
    return result;
  }, [rows, segFilter, themeFilter, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const selectClass = pick({
    muthr: "px-4 py-2.5 text-sm font-mono bg-[#0a0e08] border border-[#1a3312] text-[#33ff00] focus:border-[#33ff00]/50 focus:outline-none uppercase tracking-wider",
    light: "px-4 py-2.5 text-sm font-mono bg-white border border-zinc-200 text-zinc-700 focus:border-indigo-400 focus:outline-none uppercase tracking-wider rounded-md",
    speakx: "px-4 py-2.5 text-sm font-mono bg-white border border-[#F0D4BE] text-[#2D1B0E] focus:border-[#E8642C] focus:outline-none uppercase tracking-wider rounded-md",
  });

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative">
          <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold ${pick({
            muthr: "text-[#4a8a3a]",
            light: "text-zinc-300",
            speakx: "text-[#B8977A]",
          })}`}>
            {pick({ muthr: ">_", light: "", speakx: "" })}
          </span>
          <input
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className={`${pick({ muthr: "pl-10", light: "pl-4", speakx: "pl-4" })} pr-4 py-2.5 text-sm font-mono border focus:outline-none w-72 tracking-wider ${
              pick({
                muthr: "bg-[#0a0e08] border-[#1a3312] text-[#33ff00] placeholder-[#2a5a1a] focus:border-[#33ff00]/50",
                light: "bg-white border-zinc-200 text-zinc-700 placeholder-zinc-400 focus:border-indigo-400 rounded-md",
                speakx: "bg-white border-[#F0D4BE] text-[#2D1B0E] placeholder-[#B8977A] focus:border-[#E8642C] rounded-md",
              })
            }`}
          />
        </div>

        <select
          value={segFilter}
          onChange={(e) => { setSegFilter(e.target.value); setPage(0); }}
          className={selectClass}
        >
          <option value="all">ALL SEGMENTS</option>
          {segments.map((s) => (
            <option key={s} value={s}>{SEGMENT_SHORT[s]}</option>
          ))}
        </select>

        <select
          value={themeFilter}
          onChange={(e) => { setThemeFilter(e.target.value); setPage(0); }}
          className={selectClass}
        >
          <option value="all">ALL THEMES</option>
          {themes.map((th) => (
            <option key={th} value={th}>{THEME_LABELS[th as Theme].toUpperCase()}</option>
          ))}
        </select>

        <span className={`text-sm ml-auto tracking-wider font-bold ${pick({
          muthr: "text-[#4a8a3a]",
          light: "text-zinc-400",
          speakx: "text-[#8B6B4E]",
        })}`}>
          [{filtered.length.toLocaleString("en-IN")} records]
        </span>
      </div>

      {/* Card-based results */}
      <div className="space-y-3">
        {pageRows.map((row, i) => (
          <div
            key={`${row.questId}-${row.segment}-${row.theme}-${row.templateNumber}`}
            className={`border p-4 transition-all panel-glow ${
              pick({
                muthr: "border-[#1a3312] bg-[#0d1a0a] hover:border-[#33ff00]/30",
                light: "border-zinc-200 bg-white hover:border-indigo-300 shadow-sm rounded-lg",
                speakx: "border-[#F0D4BE] bg-white hover:border-[#E8642C]/50 shadow-sm rounded-lg",
              })
            }`}
          >
            {/* Top row: metadata */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className={`text-xs tabular-nums font-bold ${pick({
                muthr: "text-[#4a8a3a]",
                light: "text-zinc-400",
                speakx: "text-[#B8977A]",
              })}`}>
                #{String(page * PAGE_SIZE + i + 1).padStart(4, "0")}
              </span>
              <span className={`px-2 py-0.5 text-xs font-bold border tracking-wider ${
                pick({
                  muthr: "text-[#33ff00] border-[#33ff00]/40 bg-[#33ff00]/5",
                  light: "text-indigo-600 border-indigo-200 bg-indigo-50 rounded",
                  speakx: "text-[#E8642C] border-[#E8642C]/30 bg-[#FFF0E6] rounded",
                })
              }`}>
                {SEGMENT_SHORT[row.segment]}
              </span>
              <ThemeBadge theme={row.theme} />
              <span className={`text-xs tracking-wider ${pick({
                muthr: "text-[#4a8a3a]",
                light: "text-zinc-400",
                speakx: "text-[#B8977A]",
              })}`}>
                {row.questTitle}
              </span>
              <span className={`text-xs ml-auto ${pick({
                muthr: "text-[#2a5a1a]",
                light: "text-zinc-300",
                speakx: "text-[#B8977A]",
              })}`}>
                T{row.templateNumber}
              </span>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-4">
                <p className={`text-[11px] uppercase tracking-wider mb-1 ${pick({
                  muthr: "text-[#4a8a3a]",
                  light: "text-zinc-400",
                  speakx: "text-[#B8977A]",
                })}`}>TITLE</p>
                <p className={`text-base font-bold leading-snug ${pick({
                  muthr: "text-[#55ff33]",
                  light: "text-zinc-900",
                  speakx: "text-[#2D1B0E]",
                })}`}>{row.title}</p>
              </div>

              <div className="lg:col-span-5">
                <p className={`text-[11px] uppercase tracking-wider mb-1 ${pick({
                  muthr: "text-[#4a8a3a]",
                  light: "text-zinc-400",
                  speakx: "text-[#B8977A]",
                })}`}>BODY</p>
                <p className={`text-sm leading-relaxed ${pick({
                  muthr: "text-[#88cc77]",
                  light: "text-zinc-600",
                  speakx: "text-[#8B6B4E]",
                })}`}>{row.body}</p>
              </div>

              <div className="lg:col-span-3">
                <div className="mb-3">
                  <p className={`text-[11px] uppercase tracking-wider mb-1 ${pick({
                    muthr: "text-[#4a8a3a]",
                    light: "text-zinc-400",
                    speakx: "text-[#B8977A]",
                  })}`}>CTA</p>
                  <p className={`text-sm font-bold uppercase tracking-wider ${pick({
                    muthr: "text-[#ffbb44]",
                    light: "text-indigo-600",
                    speakx: "text-[#E8642C]",
                  })}`}>{row.cta}</p>
                </div>
                <div>
                  <p className={`text-[11px] uppercase tracking-wider mb-1 ${pick({
                    muthr: "text-[#4a8a3a]",
                    light: "text-zinc-400",
                    speakx: "text-[#B8977A]",
                  })}`}>IMAGE</p>
                  <p className={`text-xs italic leading-relaxed ${pick({
                    muthr: "text-[#5a9a4a]",
                    light: "text-zinc-400",
                    speakx: "text-[#B8977A]",
                  })}`}>{row.image}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className={`px-5 py-2 text-sm font-mono uppercase tracking-widest border font-bold transition ${
              pick({
                muthr: "border-[#1a3312] text-[#33ff00] disabled:text-[#1a3312] hover:bg-[#33ff00]/5 hover:border-[#33ff00]/40",
                light: "border-zinc-200 text-zinc-600 disabled:text-zinc-300 hover:bg-zinc-50 rounded-md",
                speakx: "border-[#F0D4BE] text-[#E8642C] disabled:text-[#B8977A] hover:bg-[#FFF0E6] rounded-md",
              })
            }`}
          >
            {pick({ muthr: "<< PREV", light: "Previous", speakx: "Previous" })}
          </button>
          <span className={`text-sm tracking-wider font-mono font-bold ${pick({
            muthr: "text-[#4a8a3a]",
            light: "text-zinc-400",
            speakx: "text-[#8B6B4E]",
          })}`}>
            PAGE {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className={`px-5 py-2 text-sm font-mono uppercase tracking-widest border font-bold transition ${
              pick({
                muthr: "border-[#1a3312] text-[#33ff00] disabled:text-[#1a3312] hover:bg-[#33ff00]/5 hover:border-[#33ff00]/40",
                light: "border-zinc-200 text-zinc-600 disabled:text-zinc-300 hover:bg-zinc-50 rounded-md",
                speakx: "border-[#F0D4BE] text-[#E8642C] disabled:text-[#B8977A] hover:bg-[#FFF0E6] rounded-md",
              })
            }`}
          >
            {pick({ muthr: "NEXT >>", light: "Next", speakx: "Next" })}
          </button>
        </div>
      )}
    </div>
  );
}
