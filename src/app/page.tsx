"use client";

import { useState, useCallback, useMemo } from "react";
import type { Segment, Theme, NotificationRow, JourneyData } from "@/lib/types";
import { ALL_SEGMENTS, SEGMENT_THEMES } from "@/lib/config";
import { useAppTheme } from "@/lib/theme-context";
import { journeyData as defaultJourney } from "@/data/journey";
import { generateNotifications, exportToCsv, downloadCsv } from "@/lib/generator";
import { SegmentPicker } from "@/components/segment-picker";
import { StatsBar } from "@/components/stats-bar";
import { ResultsTable } from "@/components/results-table";
import { JourneyUpload } from "@/components/journey-upload";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeConfig } from "@/components/theme-config";

export default function Home() {
  const { pick } = useAppTheme();
  const [journey, setJourney] = useState<JourneyData>(defaultJourney);
  const [segments, setSegments] = useState<Segment[]>([...ALL_SEGMENTS]);
  const [themeMapping, setThemeMapping] = useState<Record<Segment, Theme[]>>({ ...SEGMENT_THEMES });
  const [rows, setRows] = useState<NotificationRow[]>([]);
  const [generated, setGenerated] = useState(false);

  const allSegmentsConfigured = useMemo(
    () => segments.every((seg) => themeMapping[seg].length === 3),
    [segments, themeMapping]
  );

  const count = useMemo(
    () => segments.reduce((sum, seg) => sum + themeMapping[seg].length * journey.total_quests * 8, 0),
    [segments, themeMapping, journey]
  );

  const handleGenerate = useCallback(() => {
    const result = generateNotifications(segments, journey.quests, journey.journey_id, themeMapping);
    setRows(result);
    setGenerated(true);
  }, [segments, journey, themeMapping]);

  const handleDownload = useCallback(() => {
    const csv = exportToCsv(rows);
    downloadCsv(csv, `${journey.journey_id}_notifications.csv`);
  }, [rows, journey]);

  const handleJourneyLoaded = useCallback((newJourney: JourneyData) => {
    setJourney(newJourney);
    setRows([]);
    setGenerated(false);
  }, []);

  const uniqueThemes = [...new Set(rows.map((r) => r.theme))];
  const uniqueQuests = [...new Set(rows.map((r) => r.questId))];

  return (
    <div className={`min-h-screen font-mono flex flex-col transition-colors duration-500 ${
      pick({
        muthr: "bg-[#0a0e08] text-[#33ff00] grid-bg",
        light: "bg-slate-50 text-zinc-900",
        speakx: "bg-gradient-to-b from-[#FFF8F3] via-[#FFF4ED] to-[#FFF0E6] text-[#2D1B0E]",
      })
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b px-6 py-3 ${pick({
        muthr: "border-[#1a3312] bg-[#0a0e08]/95",
        light: "border-zinc-200 bg-white/80 glass shadow-sm",
        speakx: "border-[#F0D4BE]/60 bg-white/70 glass shadow-sm",
      })}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${pick({
                muthr: "bg-[#33ff00] status-pulse",
                light: "bg-indigo-500",
                speakx: "bg-[#E8642C] step-glow",
              })}`} />
              <h1 className={`text-lg font-bold tracking-[0.2em] uppercase ${pick({
                muthr: "glow-green-strong text-[#33ff00]",
                light: "text-zinc-900 tracking-tight",
                speakx: "text-[#E8642C] tracking-tight",
              })}`}>
                {pick({ muthr: "MU-TH-UR 6000", light: "NotifCraft", speakx: "SpeakX" })}
              </h1>
            </div>
            <span className={`text-sm hidden sm:inline ${pick({
              muthr: "text-[#4a8a3a] tracking-wider",
              light: "text-zinc-400",
              speakx: "text-[#B8977A]",
            })}`}>
              {pick({
                muthr: "// NOTIFCRAFT TERMINAL v2.1",
                light: "Notification Generator",
                speakx: "Notification Generator",
              })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Status pills */}
            <div className={`hidden md:flex items-center gap-4 mr-4 text-[11px] tracking-wider ${pick({
              muthr: "text-[#4a8a3a]",
              light: "text-zinc-400",
              speakx: "text-[#B8977A]",
            })}`}>
              <span>{journey.journey_id} <span className={`font-bold ${pick({
                muthr: "text-[#33ff00]", light: "text-zinc-700", speakx: "text-[#2D1B0E]"
              })}`}>{journey.total_quests}Q</span></span>
              <span className={`w-1 h-1 rounded-full ${pick({
                muthr: "bg-[#33ff00]", light: "bg-zinc-300", speakx: "bg-[#E8642C]/30"
              })}`} />
              <span className={`font-bold ${allSegmentsConfigured
                ? pick({ muthr: "text-[#33ff00]", light: "text-emerald-500", speakx: "text-[#E8642C]" })
                : pick({ muthr: "text-[#ff9900]", light: "text-amber-500", speakx: "text-[#F47B2A]" })
              }`}>
                {allSegmentsConfigured ? "READY" : "CONFIGURING"}
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10 flex-1 w-full">
        {/* Step 1: Data Source */}
        <section className="fade-up">
          <StepHeader step={1} title="Data Source" subtitle="Upload your journey CSV or use the default" />
          <JourneyUpload currentJourney={journey} onJourneyLoaded={handleJourneyLoaded} />
        </section>

        {/* Step 2: Segments */}
        <section className="fade-up fade-up-delay-1">
          <StepHeader step={2} title="Engagement Segments" subtitle="Choose which user segments to target" />
          <SegmentPicker selected={segments} onChange={setSegments} />
        </section>

        {/* Step 3: Theme Config */}
        <section className="fade-up fade-up-delay-2">
          <StepHeader step={3} title="Theme Configuration" subtitle="Assign top 3 Octolysis themes per segment from CTR analysis" />
          <ThemeConfig mapping={themeMapping} onChange={setThemeMapping} />
        </section>

        {/* Step 4: Generate */}
        <section className="fade-up fade-up-delay-3">
          <StepHeader step={4} title="Generate" subtitle={`${count.toLocaleString("en-IN")} notifications will be created`} />
          <div className={`border rounded-2xl p-6 ${pick({
            muthr: "border-[#1a3312] bg-[#0d1a0a]",
            light: "border-zinc-200 bg-white shadow-sm",
            speakx: "border-[#F0D4BE]/60 bg-white/80 glass-light shadow-sm",
          })}`}>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleGenerate}
                disabled={segments.length === 0 || !allSegmentsConfigured}
                className={`px-8 py-3.5 text-sm font-mono uppercase tracking-wider transition-all font-bold rounded-xl hover-lift ${
                  segments.length === 0 || !allSegmentsConfigured
                    ? pick({
                        muthr: "border border-[#1a3312] text-[#1a3312] cursor-not-allowed",
                        light: "bg-zinc-100 text-zinc-300 cursor-not-allowed",
                        speakx: "bg-[#F0D4BE]/30 text-[#B8977A] cursor-not-allowed",
                      })
                    : pick({
                        muthr: "border border-[#33ff00] text-[#33ff00] bg-[#33ff00]/5 hover:bg-[#33ff00]/15 hover:shadow-[0_0_20px_rgba(51,255,0,0.15)] glow-green",
                        light: "text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg",
                        speakx: "text-white bg-gradient-to-r from-[#E8642C] to-[#F47B2A] hover:from-[#D4581F] hover:to-[#E86A25] shadow-md hover:shadow-lg hover:shadow-[#E8642C]/20",
                      })
                }`}
              >
                {pick({
                  muthr: `EXECUTE // ${count.toLocaleString("en-IN")} UNITS`,
                  light: `Generate ${count.toLocaleString("en-IN")} Notifications`,
                  speakx: `Generate ${count.toLocaleString("en-IN")} Notifications`,
                })}
              </button>

              {generated && (
                <button
                  onClick={handleDownload}
                  className={`px-8 py-3.5 text-sm font-mono uppercase tracking-wider border font-bold rounded-xl transition-all hover-lift ${
                    pick({
                      muthr: "border-[#ff9900]/50 text-[#ffbb44] bg-[#ff9900]/5 hover:bg-[#ff9900]/15 glow-amber",
                      light: "border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100",
                      speakx: "border-[#E8642C]/30 text-[#E8642C] bg-[#FFF0E6] hover:bg-[#FFE0CC]",
                    })
                  }`}
                >
                  {pick({ muthr: "EXPORT CSV", light: "Download CSV", speakx: "Download CSV" })}
                </button>
              )}

              {!allSegmentsConfigured && segments.length > 0 && (
                <span className={`text-xs tracking-wider font-bold ${pick({
                  muthr: "text-[#ff9900]", light: "text-amber-500", speakx: "text-[#F47B2A]",
                })}`}>
                  Select 3 themes per segment to continue
                </span>
              )}

              {generated && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className={`w-2.5 h-2.5 rounded-full ${pick({
                    muthr: "bg-[#33ff00] status-pulse",
                    light: "bg-emerald-500",
                    speakx: "bg-[#E8642C] step-glow",
                  })}`} />
                  <span className={`text-sm tracking-wider font-bold ${pick({
                    muthr: "text-[#33ff00] glow-green",
                    light: "text-emerald-600",
                    speakx: "text-[#E8642C]",
                  })}`}>
                    {rows.length.toLocaleString("en-IN")} generated
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {generated && (
          <>
            <section className="fade-up fade-up-delay-4">
              <StepHeader step={5} title="Results" subtitle="Browse, filter, and export your notifications" />
              <StatsBar
                totalRows={rows.length}
                segments={segments.length}
                quests={uniqueQuests.length}
                themes={uniqueThemes.length}
              />
            </section>

            <section className="fade-up">
              <ResultsTable rows={rows} />
            </section>
          </>
        )}

        {!generated && (
          <div className={`text-center py-16 fade-up fade-up-delay-4 rounded-2xl border ${pick({
            muthr: "border-[#1a3312] bg-[#0d1a0a]/50",
            light: "border-zinc-100 bg-white/50",
            speakx: "border-[#F0D4BE]/40 bg-white/40 glass-light",
          })}`}>
            <div className={`text-4xl mb-4 ${pick({ muthr: "", light: "", speakx: "" })}`}>
              {pick({ muthr: "//", light: "//", speakx: "✦" })}
            </div>
            <p className={`text-sm tracking-widest uppercase mb-2 ${pick({
              muthr: "text-[#4a8a3a]", light: "text-zinc-400", speakx: "text-[#B8977A]",
            })}`}>
              {pick({ muthr: "AWAITING COMMAND", light: "Ready to generate", speakx: "Ready to generate" })}
            </p>
            <p className={`text-xs tracking-wider ${pick({
              muthr: "text-[#2a5a1a]", light: "text-zinc-300", speakx: "text-[#B8977A]/60",
            })}`}>
              Complete the steps above and click generate
            </p>
            <span className={`inline-block w-2.5 h-5 mt-6 cursor-blink ${pick({
              muthr: "bg-[#33ff00]", light: "bg-indigo-500", speakx: "bg-[#E8642C]",
            })}`} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t px-6 py-4 mt-auto ${pick({
        muthr: "border-[#1a3312]",
        light: "border-zinc-200 bg-white",
        speakx: "border-[#F0D4BE]/40 bg-white/50 glass-light",
      })}`}>
        <div className={`max-w-7xl mx-auto flex justify-between text-xs tracking-wider ${pick({
          muthr: "text-[#2a5a1a] uppercase",
          light: "text-zinc-300",
          speakx: "text-[#B8977A]/60",
        })}`}>
          <span>{pick({
            muthr: "WEYLAND-YUTANI CORPORATION // BUILDING BETTER WORLDS",
            light: "NotifCraft by SpeakX",
            speakx: "SpeakX.ai — Speak English with Confidence",
          })}</span>
          <span>{pick({ muthr: "MUTHR v6.02", light: "v2.1", speakx: "v2.1" })}</span>
        </div>
      </footer>
    </div>
  );
}

function StepHeader({ step, title, subtitle }: { step: number; title: string; subtitle?: string }) {
  const { pick } = useAppTheme();
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${pick({
        muthr: "bg-[#33ff00]/10 text-[#33ff00] border border-[#33ff00]/30",
        light: "bg-indigo-50 text-indigo-600 border border-indigo-200",
        speakx: "bg-gradient-to-br from-[#E8642C] to-[#F47B2A] text-white shadow-sm",
      })}`}>
        {pick({ muthr: `0${step}`, light: String(step), speakx: String(step) })}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h2 className={`text-sm font-bold uppercase tracking-wider ${pick({
            muthr: "text-[#ffbb44] glow-amber",
            light: "text-zinc-700",
            speakx: "text-[#2D1B0E]",
          })}`}>
            {title}
          </h2>
          <div className={`flex-1 border-t ${pick({
            muthr: "border-[#1a3312]",
            light: "border-zinc-100",
            speakx: "border-[#F0D4BE]/40",
          })}`} />
        </div>
        {subtitle && (
          <p className={`text-xs mt-1 ${pick({
            muthr: "text-[#3a7a2a]",
            light: "text-zinc-400",
            speakx: "text-[#B8977A]",
          })}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
