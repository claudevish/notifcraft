import type { Segment, Theme } from "./types";

export const SEGMENT_THEMES: Record<Segment, Theme[]> = {
  E0: ["epic_meaning", "unpredictability", "social_influence"],
  E_lt_40: ["empowerment", "accomplishment", "unpredictability"],
  E_lt_70: ["accomplishment", "ownership", "social_influence"],
  E_gte_70: ["accomplishment", "ownership", "loss_avoidance"],
};

export const SEGMENT_LABELS: Record<Segment, string> = {
  E0: "E = 0 (Never engaged)",
  E_lt_40: "E < 40 (Low engagement)",
  E_lt_70: "E < 70 (Medium engagement)",
  E_gte_70: "E \u2265 70 (High engagement)",
};

export const SEGMENT_SHORT: Record<Segment, string> = {
  E0: "E = 0",
  E_lt_40: "E < 40",
  E_lt_70: "E < 70",
  E_gte_70: "E \u2265 70",
};

export const THEME_LABELS: Record<Theme, string> = {
  epic_meaning: "Epic Meaning",
  accomplishment: "Accomplishment",
  empowerment: "Empowerment",
  ownership: "Ownership",
  social_influence: "Social Influence",
  scarcity: "Scarcity",
  unpredictability: "Unpredictability",
  loss_avoidance: "Loss Avoidance",
};

export const THEME_COLORS: Record<Theme, string> = {
  epic_meaning: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  accomplishment: "bg-green-500/15 text-green-400 border-green-500/30",
  empowerment: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  ownership: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  social_influence: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  scarcity: "bg-red-500/15 text-red-400 border-red-500/30",
  unpredictability: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  loss_avoidance: "bg-orange-500/15 text-orange-400 border-orange-500/30",
};

export const ALL_SEGMENTS: Segment[] = ["E0", "E_lt_40", "E_lt_70", "E_gte_70"];
