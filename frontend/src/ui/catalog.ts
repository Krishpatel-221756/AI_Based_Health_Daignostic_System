import type { AgeGroup, BodyLocation, Duration, Gender, HistoryItem, Severity, SymptomId } from "./api";

export type ChoiceOption<T extends string> = { id: T; label: string };

export const AGE_GROUPS: ChoiceOption<AgeGroup>[] = [
  { id: "child", label: "Child (0–12)" },
  { id: "teen", label: "Teen (13–19)" },
  { id: "adult", label: "Adult (20–59)" },
  { id: "senior", label: "Senior (60+)" }
];

export const GENDERS: ChoiceOption<Gender>[] = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "other", label: "Other" }
];

export const SEVERITIES: ChoiceOption<Severity>[] = [
  { id: "mild", label: "Mild" },
  { id: "moderate", label: "Moderate" },
  { id: "severe", label: "Severe" }
];

export const DURATIONS: ChoiceOption<Duration>[] = [
  { id: "lt_24h", label: "Less than 24 hours" },
  { id: "d_1_3", label: "1–3 days" },
  { id: "d_4_7", label: "4–7 days" },
  { id: "gt_week", label: "More than a week" }
];

export const HISTORY_ITEMS: ChoiceOption<HistoryItem>[] = [
  { id: "diabetes", label: "Diabetes" },
  { id: "blood_pressure", label: "Blood Pressure" },
  { id: "heart_disease", label: "Heart Disease" },
  { id: "asthma", label: "Asthma" },
  { id: "none", label: "None" }
];

export type SymptomItem = { id: SymptomId; label: string; icon: string };
export type SymptomCategory = { id: string; label: string; items: SymptomItem[] };

export const SYMPTOM_CATEGORIES: SymptomCategory[] = [
  {
    id: "general",
    label: "General",
    items: [
      { id: "fever", label: "Fever", icon: "🌡️" },
      { id: "fatigue", label: "Fatigue", icon: "😴" },
      { id: "weight_loss", label: "Weight loss", icon: "⚖️" },
      { id: "chills", label: "Chills", icon: "🥶" }
    ]
  },
  {
    id: "respiratory",
    label: "Respiratory",
    items: [
      { id: "cough", label: "Cough", icon: "🤧" },
      { id: "shortness_of_breath", label: "Shortness of breath", icon: "💨" },
      { id: "chest_pain", label: "Chest pain", icon: "🫀" }
    ]
  },
  {
    id: "digestive",
    label: "Digestive",
    items: [
      { id: "nausea", label: "Nausea", icon: "🤢" },
      { id: "vomiting", label: "Vomiting", icon: "🚽" },
      { id: "diarrhea", label: "Diarrhea", icon: "💩" },
      { id: "abdominal_pain", label: "Abdominal pain", icon: "🫃" }
    ]
  },
  {
    id: "neurological",
    label: "Neurological",
    items: [
      { id: "headache", label: "Headache", icon: "🤕" },
      { id: "dizziness", label: "Dizziness", icon: "🌀" },
      { id: "confusion", label: "Confusion", icon: "❓" }
    ]
  },
  {
    id: "skin",
    label: "Skin",
    items: [
      { id: "rash", label: "Rash", icon: "🔴" },
      { id: "itching", label: "Itching", icon: "🖐️" },
      { id: "redness", label: "Redness", icon: "🟥" }
    ]
  }
];

export type { AgeGroup, BodyLocation, Duration, Gender, HistoryItem, Severity, SymptomId };
