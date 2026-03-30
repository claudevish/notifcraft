import type { Segment, Theme, NotificationRow, QuestData } from "./types";
import { SEGMENT_THEMES } from "./config";
import { SAMPLE_TEMPLATES } from "./templates";

export function generateNotifications(
  segments: Segment[],
  quests: QuestData[],
  journeyId: string,
  customMapping?: Record<Segment, Theme[]>
): NotificationRow[] {
  const rows: NotificationRow[] = [];
  const themeMap = customMapping ?? SEGMENT_THEMES;

  for (const segment of segments) {
    const themes = themeMap[segment];
    for (const quest of quests) {
      for (const theme of themes) {
        const templates = SAMPLE_TEMPLATES[theme];
        for (let i = 0; i < templates.length; i++) {
          const t = templates[i];
          rows.push({
            journeyId,
            segment,
            questId: quest.quest_id,
            questTitle: quest.quest_title_en,
            theme,
            templateNumber: i + 1,
            title: t.title,
            body: t.body,
            cta: t.cta,
            image: t.image,
          });
        }
      }
    }
  }

  return rows;
}

export function exportToCsv(rows: NotificationRow[]): string {
  const header = [
    "Journey ID", "Segment", "Quest ID", "Quest Title",
    "Theme", "Template #", "Title", "Body", "CTA", "Image",
  ];

  const escapeCsv = (val: string) => {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push([
      row.journeyId,
      row.segment,
      row.questId,
      escapeCsv(row.questTitle),
      row.theme,
      String(row.templateNumber),
      escapeCsv(row.title),
      escapeCsv(row.body),
      escapeCsv(row.cta),
      escapeCsv(row.image),
    ].join(","));
  }

  return lines.join("\n");
}

export function downloadCsv(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function getUniqueThemes(rows: NotificationRow[]): Theme[] {
  return [...new Set(rows.map((r) => r.theme))];
}

export function getUniqueQuests(rows: NotificationRow[]): string[] {
  return [...new Set(rows.map((r) => r.questId))];
}
