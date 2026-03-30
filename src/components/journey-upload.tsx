"use client";

import { useRef, useState } from "react";
import type { JourneyData, QuestData } from "@/lib/types";
import { useAppTheme } from "@/lib/theme-context";

interface Props {
  currentJourney: JourneyData;
  onJourneyLoaded: (journey: JourneyData) => void;
}

function parseCsvToJourney(csvText: string): JourneyData {
  const lines = csvText.split("\n");
  if (lines.length < 2) throw new Error("CSV file is empty or invalid");

  const headers = lines[0].split(",").map((h) => h.trim());
  const getCol = (name: string) => headers.indexOf(name);

  const colJourneyId = getCol("journeyID");
  const colJourneyTitle = getCol("journeyTitle");
  const colChapterId = getCol("chapterID");
  const colChapterTitle = getCol("chapterTitle");
  const colQuestId = getCol("questId");
  const colQuestTitleHi = getCol("questTitle/Hi");
  const colQuestTitleEn = getCol("questTitle/En");
  const colQuestDesc = getCol("questDescription");
  const colCharName = getCol("lesson/characterConfig/name");
  const colNarrative = getCol("mentorQuestNarration/En");
  const colEmotion = getCol("lesson/emotionalContext");
  const colHook = getCol("lesson/cliffhangerMessage");
  const colScenario = getCol("scenario");

  if (colQuestId === -1) throw new Error("Missing 'questId' column in CSV");

  const quests: QuestData[] = [];
  const seen = new Set<string>();
  let journeyId = "";
  let journeyTitle = "";

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    if (!row.trim()) continue;

    const cols = parseCSVRow(row);
    const qid = cols[colQuestId]?.trim();
    if (!qid || seen.has(qid)) continue;
    seen.add(qid);

    if (!journeyId && colJourneyId >= 0) {
      journeyId = cols[colJourneyId]?.trim() || "J_UNKNOWN";
      journeyTitle = cols[colJourneyTitle]?.trim().replace(/\n/g, " ") || "Uploaded Journey";
    }

    const chapterId = cols[colChapterId]?.trim() || "";
    let chapterNum = 1;
    const chapterMatch = chapterId.match(/_C(\d+)/);
    if (chapterMatch) chapterNum = parseInt(chapterMatch[1], 10);

    quests.push({
      quest_id: qid,
      quest_title_en: cols[colQuestTitleEn]?.trim() || qid,
      quest_title_hi: cols[colQuestTitleHi]?.trim() || "",
      quest_description: cols[colQuestDesc]?.trim().replace(/\n/g, " ") || "",
      chapter_id: chapterId,
      chapter_title: cols[colChapterTitle]?.trim().replace(/\n/g, " ") || "",
      chapter_number: chapterNum,
      total_chapters: 5,
      character_name: cols[colCharName]?.trim() || "",
      narrative_moment: cols[colNarrative]?.trim().replace(/\n/g, " ") || "",
      emotional_context: cols[colEmotion]?.trim() || "",
      engagement_hook: cols[colHook]?.trim() || "",
      scenario: cols[colScenario]?.trim().replace(/\n/g, " ") || "",
    });
  }

  const totalChapters = new Set(quests.map((q) => q.chapter_id)).size;
  quests.forEach((q) => (q.total_chapters = totalChapters));

  return {
    journey_id: journeyId || "J_UPLOADED",
    journey_title: journeyTitle || "Uploaded Journey",
    total_quests: quests.length,
    quests,
  };
}

function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

export function JourneyUpload({ currentJourney, onJourneyLoaded }: Props) {
  const { pick } = useAppTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const jsonRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setStatus("PROCESSING CSV...");

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const journey = parseCsvToJourney(text);
        onJourneyLoaded(journey);
        setStatus(`LOADED: ${journey.journey_id} // ${journey.total_quests} QUESTS`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse CSV");
        setStatus("");
      }
    };
    reader.readAsText(file);
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setStatus("PROCESSING JSON...");

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as JourneyData;
        if (!data.quests || !Array.isArray(data.quests)) {
          throw new Error("Invalid JSON: missing 'quests' array");
        }
        onJourneyLoaded(data);
        setStatus(`LOADED: ${data.journey_id} // ${data.total_quests} QUESTS`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse JSON");
        setStatus("");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`border p-5 panel-glow rounded-2xl ${pick({
      muthr: "border-[#1a3312] bg-[#0d1a0a]",
      light: "border-zinc-200 bg-white shadow-sm",
      speakx: "border-[#F0D4BE]/60 bg-white/80 glass-light shadow-sm",
    })}`}>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
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
          ACTIVE JOURNEY: {currentJourney.journey_id}
        </span>
        <span className={`text-sm font-bold ${pick({
          muthr: "text-[#33ff00]",
          light: "text-zinc-900",
          speakx: "text-[#2D1B0E]",
        })}`}>
          {currentJourney.journey_title}
        </span>
        <span className={`text-xs ${pick({
          muthr: "text-[#4a8a3a]",
          light: "text-zinc-400",
          speakx: "text-[#B8977A]",
        })}`}>
          ({currentJourney.total_quests} quests)
        </span>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <input ref={fileRef} type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
        <button
          onClick={() => fileRef.current?.click()}
          className={`px-5 py-2.5 text-sm font-mono uppercase tracking-wider border font-bold transition rounded-xl hover-lift ${
            pick({
              muthr: "border-[#33ff00]/40 text-[#33ff00] bg-[#33ff00]/5 hover:bg-[#33ff00]/10",
              light: "border-indigo-300 text-indigo-600 bg-indigo-50 hover:bg-indigo-100",
              speakx: "border-[#E8642C]/40 text-[#E8642C] bg-[#FFF0E6] hover:bg-[#FFE0CC]",
            })
          }`}
        >
          UPLOAD JOURNEY CSV
        </button>

        <input ref={jsonRef} type="file" accept=".json" onChange={handleJsonUpload} className="hidden" />
        <button
          onClick={() => jsonRef.current?.click()}
          className={`px-5 py-2.5 text-sm font-mono uppercase tracking-wider border font-bold transition ${
            pick({
              muthr: "border-[#ff9900]/40 text-[#ff9900] bg-[#ff9900]/5 hover:bg-[#ff9900]/10",
              light: "border-amber-300 text-amber-600 bg-amber-50 hover:bg-amber-100",
              speakx: "border-[#F47B2A]/40 text-[#F47B2A] bg-[#FFF5EC] hover:bg-[#FFE8D6]",
            })
          }`}
        >
          UPLOAD JSON
        </button>

        {status && (
          <span className={`text-sm tracking-wider font-bold ${pick({
            muthr: "text-[#33ff00] glow-green",
            light: "text-indigo-600",
            speakx: "text-[#E8642C]",
          })}`}>
            {status}
          </span>
        )}
        {error && (
          <span className={`text-sm tracking-wider font-bold ${pick({
            muthr: "text-[#ff3333] glow-red",
            light: "text-red-600",
            speakx: "text-red-600",
          })}`}>
            ERROR: {error}
          </span>
        )}
      </div>
    </div>
  );
}
