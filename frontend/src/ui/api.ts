export type AgeGroup = "child" | "teen" | "adult" | "senior";
export type Gender = "male" | "female" | "other";
export type Severity = "mild" | "moderate" | "severe";
export type Duration = "lt_24h" | "d_1_3" | "d_4_7" | "gt_week";
export type BodyLocation =
  | "head_neck"
  | "chest"
  | "abdomen"
  | "back"
  | "arms_hands"
  | "legs_feet"
  | "skin"
  | "general";
export type SymptomId =
  | "fever"
  | "fatigue"
  | "weight_loss"
  | "chills"
  | "cough"
  | "shortness_of_breath"
  | "chest_pain"
  | "nausea"
  | "vomiting"
  | "diarrhea"
  | "abdominal_pain"
  | "headache"
  | "dizziness"
  | "confusion"
  | "rash"
  | "itching"
  | "redness";

export type HistoryItem = "diabetes" | "blood_pressure" | "heart_disease" | "asthma" | "none";

export type DiagnosisRequest = {
  age_group: AgeGroup;
  gender: Gender;
  body_location: BodyLocation | null;
  symptoms: SymptomId[];
  severity: Severity;
  duration: Duration;
  medical_history: HistoryItem[];
  additional_information: string | null;
  patient_id?: number;
};

export type ConditionResult = { name: string; confidence: number };

export type DiagnosisResponse = {
  disclaimer: string;
  red_alert: boolean;
  red_alert_reason: string | null;
  possible_conditions: ConditionResult[];
  recommended_actions: {
    home_care: string[];
    when_to_see_a_doctor: string;
    emergency_warning: string | null;
  };
  lifestyle_tips: string[];
  meal_routine: {
    overview: string;
    items: { time: string; suggestions: string[] }[];
    notes: string[];
  };
};

export type DiagnosisHistoryItem = {
  id: number;
  created_at: string;
  age_group: AgeGroup;
  gender: Gender;
  body_location: BodyLocation | null;
  symptoms: string; // comma separated
  severity: Severity;
  duration: Duration;
  medical_history: string; // comma separated
  predicted_condition: string;
  confidence: number;
  red_alert: boolean;
};

export class DiagnoseApi {
  constructor(private readonly baseUrl: string) {}

  async health(): Promise<"ok"> {
    const res = await fetch(`${this.baseUrl}/health`);
    if (!res.ok) {
      throw new Error(`Health check failed: ${res.status}`);
    }
    const data = (await res.json()) as { status?: string };
    if (data.status !== "ok") {
      throw new Error("Health check failed");
    }
    return "ok";
  }

  async diagnose(payload: DiagnosisRequest): Promise<DiagnosisResponse> {
    const res = await fetch(`${this.baseUrl}/api/v1/diagnose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed: ${res.status}`);
    }
    return (await res.json()) as DiagnosisResponse;
  }

  async getHistory(patientId?: number): Promise<DiagnosisHistoryItem[]> {
    const url = patientId
      ? `${this.baseUrl}/api/v1/history?patient_id=${patientId}`
      : `${this.baseUrl}/api/v1/history`;
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed: ${res.status}`);
    }
    return (await res.json()) as DiagnosisHistoryItem[];
  }

  async getStats(): Promise<AnalyticsStats> {
    const res = await fetch(`${this.baseUrl}/api/v1/stats`);
    if (!res.ok) {
      throw new Error("Failed to fetch stats");
    }
    return (await res.json()) as AnalyticsStats;
  }

  async login(username: string, password: string): Promise<{ success: boolean; token: string }> {
    const res = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      throw new Error("Login failed");
    }
    return (await res.json()) as { success: boolean; token: string };
  }

  async patientLogin(username: string, password: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/v1/auth/patient/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return await res.json();
  }

  async patientSignup(username: string, password: string, age_group: AgeGroup, gender: Gender): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/v1/auth/patient/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, age_group, gender }),
    });
    if (!res.ok) throw new Error("Signup failed");
    return await res.json();
  }

  async submitFeedback(payload: FeedbackCreate): Promise<FeedbackResponse> {
    const res = await fetch(`${this.baseUrl}/api/v1/feedback/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error("Failed to submit feedback");
    }
    return (await res.json()) as FeedbackResponse;
  }
}

export interface AnalyticsStats {
  total_diagnoses: number;
  condition_counts: Record<string, number>;
  age_group_counts: Record<string, number>;
  gender_counts: Record<string, number>;
  red_alert_count: number;
}

export type FeedbackCreate = {
  rating: number;
  comment: string;
  patient_id?: number;
};

export type FeedbackResponse = {
  id: number;
  patient_id?: number;
  rating: number;
  comment?: string;
  created_at: string;
};
