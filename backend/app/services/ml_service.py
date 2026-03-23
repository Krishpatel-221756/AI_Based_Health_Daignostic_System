from __future__ import annotations

from dataclasses import dataclass
from typing import List

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

from app.schemas.diagnosis import (
    AgeGroup,
    Duration,
    Gender,
    HistoryItem,
    Severity,
    SymptomId,
)


CONDITIONS: list[str] = [
    "Common Cold / Viral Upper Respiratory Infection",
    "Seasonal Flu-like Illness",
    "Gastroenteritis",
    "Migraine / Tension Headache",
    "Allergic Skin Reaction",
    "Asthma Exacerbation",
    "Pneumonia",
    "Acute Bronchitis",
    "Hypertensive Urgency",
    "Diabetes-related Complication",
    "Anxiety / Panic Attack",
    "Anemia / Iron Deficiency",
]


ALL_SYMPTOMS: list[SymptomId] = list(SymptomId)


def _featurize(
    age_group: AgeGroup,
    gender: Gender,
    severity: Severity,
    duration: Duration,
    symptoms: list[SymptomId],
    history: list[HistoryItem],
) -> dict:
    symptom_set = set(symptoms)
    history_set = set(history)
    if HistoryItem.none in history_set:
        history_set = {HistoryItem.none}

    x: dict[str, object] = {
        "age_group": age_group.value,
        "gender": gender.value,
        "severity": severity.value,
        "duration": duration.value,
    }
    for s in ALL_SYMPTOMS:
        x[f"symptom__{s.value}"] = int(s in symptom_set)
    for h in HistoryItem:
        x[f"history__{h.value}"] = int(h in history_set)
    return x


def _rules_to_label(symptoms: set[SymptomId], history: set[HistoryItem]) -> int:
    # Critical / Complex
    if SymptomId.chest_pain in symptoms and SymptomId.shortness_of_breath in symptoms and SymptomId.fever in symptoms:
        return CONDITIONS.index("Pneumonia")
    
    if SymptomId.chest_pain in symptoms and HistoryItem.blood_pressure in history:
        return CONDITIONS.index("Hypertensive Urgency")
        
    if (SymptomId.confusion in symptoms or SymptomId.weight_loss in symptoms) and HistoryItem.diabetes in history:
        return CONDITIONS.index("Diabetes-related Complication")

    if SymptomId.chest_pain in symptoms and SymptomId.dizziness in symptoms and SymptomId.shortness_of_breath in symptoms:
        return CONDITIONS.index("Anxiety / Panic Attack")

    # Respiratory
    if SymptomId.shortness_of_breath in symptoms and HistoryItem.asthma in history:
        return CONDITIONS.index("Asthma Exacerbation")
    
    if SymptomId.cough in symptoms and SymptomId.fatigue in symptoms and SymptomId.fever not in symptoms:
        return CONDITIONS.index("Acute Bronchitis")

    # Others
    if SymptomId.fatigue in symptoms and SymptomId.dizziness in symptoms and SymptomId.shortness_of_breath in symptoms:
        return CONDITIONS.index("Anemia / Iron Deficiency")

    if SymptomId.rash in symptoms or SymptomId.itching in symptoms or SymptomId.redness in symptoms:
        return CONDITIONS.index("Allergic Skin Reaction")
    if SymptomId.nausea in symptoms or SymptomId.vomiting in symptoms or SymptomId.diarrhea in symptoms:
        return CONDITIONS.index("Gastroenteritis")
    if SymptomId.headache in symptoms or SymptomId.dizziness in symptoms:
        return CONDITIONS.index("Migraine / Tension Headache")
    if SymptomId.fever in symptoms and SymptomId.chills in symptoms and SymptomId.fatigue in symptoms:
        return CONDITIONS.index("Seasonal Flu-like Illness")
    if SymptomId.cough in symptoms:
        return CONDITIONS.index("Common Cold / Viral Upper Respiratory Infection")
    return CONDITIONS.index("Common Cold / Viral Upper Respiratory Infection")


@dataclass(frozen=True)
class ModelArtifacts:
    pipeline: Pipeline
    feature_keys: list[str]


_MODEL: ModelArtifacts | None = None


def _train_model() -> ModelArtifacts:
    rng = np.random.default_rng(7)

    ages = [a.value for a in AgeGroup]
    genders = [g.value for g in Gender]
    severities = [s.value for s in Severity]
    durations = [d.value for d in Duration]

    feature_keys: list[str] = ["age_group", "gender", "severity", "duration"]
    feature_keys.extend([f"symptom__{s.value}" for s in ALL_SYMPTOMS])
    feature_keys.extend([f"history__{h.value}" for h in HistoryItem])

    rows: list[list[object]] = []
    labels: list[int] = []

    for _ in range(1200):
        age = rng.choice(ages)
        gender = rng.choice(genders)
        severity = rng.choice(severities, p=[0.55, 0.35, 0.10])
        duration = rng.choice(durations, p=[0.25, 0.35, 0.25, 0.15])

        symptoms = set()
        for s in ALL_SYMPTOMS:
            if rng.random() < 0.10:
                symptoms.add(s)

        if rng.random() < 0.30:
            symptoms.add(SymptomId.cough)
        if rng.random() < 0.20:
            symptoms.add(SymptomId.fever)
        if rng.random() < 0.18:
            symptoms.add(SymptomId.fatigue)
        if rng.random() < 0.10:
            symptoms.add(SymptomId.headache)
        if rng.random() < 0.08:
            symptoms.add(SymptomId.diarrhea)
        if rng.random() < 0.07:
            symptoms.add(SymptomId.rash)
        if rng.random() < 0.08:
            symptoms.add(SymptomId.chest_pain)
        if rng.random() < 0.08:
            symptoms.add(SymptomId.shortness_of_breath)
        if rng.random() < 0.05:
            symptoms.add(SymptomId.confusion)
        if rng.random() < 0.05:
            symptoms.add(SymptomId.weight_loss)

        history = set()
        if rng.random() < 0.08:
            history.add(HistoryItem.asthma)
        if rng.random() < 0.07:
            history.add(HistoryItem.diabetes)
        if rng.random() < 0.08:
            history.add(HistoryItem.blood_pressure)
        if rng.random() < 0.04:
            history.add(HistoryItem.heart_disease)
        if not history:
            history.add(HistoryItem.none)

        label = _rules_to_label(symptoms, history)
        labels.append(label)

        x = _featurize(
            AgeGroup(age),
            Gender(gender),
            Severity(severity),
            Duration(duration),
            list(symptoms),
            list(history),
        )
        rows.append([x[k] for k in feature_keys])

    X = np.array(rows, dtype=object)
    y = np.array(labels, dtype=int)

    categorical_idx = [0, 1, 2, 3]
    numeric_idx = list(range(4, len(feature_keys)))

    encoder = OneHotEncoder(handle_unknown="ignore")
    clf = LogisticRegression(max_iter=500)

    def _split_columns(X_in: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
        return X_in[:, categorical_idx], X_in[:, numeric_idx].astype(float)

    class ColumnSplitter:
        def fit(self, X_in, y=None):
            return self

        def transform(self, X_in):
            cat, num = _split_columns(X_in)
            cat_enc = encoder.fit_transform(cat) if not hasattr(self, "_fitted") else encoder.transform(cat)
            self._fitted = True
            return np.hstack([cat_enc.toarray(), num])

    splitter = ColumnSplitter()
    pipeline = Pipeline(
        steps=[
            ("splitter", splitter),
            ("clf", clf),
        ]
    )
    pipeline.fit(X, y)
    return ModelArtifacts(pipeline=pipeline, feature_keys=feature_keys)


def get_model() -> ModelArtifacts:
    global _MODEL
    if _MODEL is None:
        _MODEL = _train_model()
    return _MODEL


def predict_top3(
    age_group: AgeGroup,
    gender: Gender,
    severity: Severity,
    duration: Duration,
    symptoms: List[SymptomId],
    history: List[HistoryItem],
) -> list[tuple[str, float]]:
    model = get_model()
    x = _featurize(age_group, gender, severity, duration, symptoms, history)
    X = np.array([[x[k] for k in model.feature_keys]], dtype=object)

    proba = model.pipeline.predict_proba(X)[0]
    top_idx = np.argsort(proba)[::-1][:3]
    return [(CONDITIONS[i], float(proba[i])) for i in top_idx]
