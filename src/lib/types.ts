export type Segment = "E0" | "E_lt_40" | "E_lt_70" | "E_gte_70";

export type Theme =
  | "epic_meaning"
  | "accomplishment"
  | "empowerment"
  | "ownership"
  | "social_influence"
  | "scarcity"
  | "unpredictability"
  | "loss_avoidance";

export interface QuestData {
  quest_id: string;
  quest_title_en: string;
  quest_title_hi: string;
  quest_description: string;
  chapter_id: string;
  chapter_title: string;
  chapter_number: number;
  total_chapters: number;
  character_name: string;
  narrative_moment: string;
  emotional_context: string;
  engagement_hook: string;
  scenario: string;
}

export interface JourneyData {
  journey_id: string;
  journey_title: string;
  total_quests: number;
  quests: QuestData[];
}

export interface NotificationRow {
  journeyId: string;
  segment: Segment;
  questId: string;
  questTitle: string;
  theme: Theme;
  templateNumber: number;
  title: string;
  body: string;
  cta: string;
  image: string;
}

export interface NotificationTemplate {
  title: string;
  body: string;
  cta: string;
  image: string;
}
