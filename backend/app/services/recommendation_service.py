from app.schemas.diagnosis import DiagnosisRequest, Duration, HistoryItem, MealRoutine, MealRoutineItem, Severity, SymptomId


def build_recommendations(
    payload: DiagnosisRequest, red_alert: bool
) -> tuple[list[str], str, str | None, list[str], MealRoutine]:
    home_care = []

    if payload.severity in (Severity.mild, Severity.moderate):
        home_care.extend(
            [
                "Rest and stay hydrated.",
                "Monitor symptoms and keep a simple symptom log.",
                "Use supportive care (warm fluids, light meals) as tolerated.",
            ]
        )

    if payload.duration in (Duration.d_4_7, Duration.gt_week):
        home_care.append("If symptoms persist or worsen, seek clinical evaluation.")

    when_to_see = "Seek medical advice if symptoms worsen, persist, or you feel unsafe."
    if payload.severity == Severity.moderate:
        when_to_see = "See a doctor within 24–48 hours if not improving."
    if payload.severity == Severity.severe:
        when_to_see = "Seek urgent medical care today."

    emergency_warning = None
    if red_alert:
        emergency_warning = (
            "RED ALERT: Call local emergency services or go to the nearest emergency department now."
        )
    elif payload.severity == Severity.severe:
        emergency_warning = "If you have trouble breathing, chest pain, fainting, or confusion, seek emergency care."

    lifestyle = [
        "Maintain regular sleep and hydration.",
        "Wash hands regularly and avoid close contact when sick.",
        "Balanced diet and light activity as tolerated.",
        "Keep chronic conditions (e.g., diabetes, asthma) well-controlled with clinician guidance.",
    ]

    symptoms = set(payload.symptoms)
    history = set(payload.medical_history)

    gi = any(
        s in symptoms
        for s in (
            SymptomId.nausea,
            SymptomId.vomiting,
            SymptomId.diarrhea,
            SymptomId.abdominal_pain,
        )
    )
    resp = any(s in symptoms for s in (SymptomId.cough, SymptomId.shortness_of_breath, SymptomId.chest_pain))

    overview = "A simple supportive meal routine to help you feel better."
    if red_alert or payload.severity == Severity.severe:
        overview = "If you need urgent care, prioritize safety; use this only if able to eat/drink."

    items: list[MealRoutineItem] = [
        MealRoutineItem(
            time="Breakfast",
            suggestions=["Easy-to-digest meal with protein + complex carbs (e.g., oats, eggs, yogurt)."],
        ),
        MealRoutineItem(
            time="Lunch",
            suggestions=["Balanced plate: vegetables + lean protein + whole grains (as tolerated)."],
        ),
        MealRoutineItem(
            time="Snack",
            suggestions=["Fruit or nuts, or yogurt; choose what feels gentle for your stomach."],
        ),
        MealRoutineItem(
            time="Dinner",
            suggestions=["Lighter dinner: soup, lentils, rice/roti with vegetables, or similar."],
        ),
        MealRoutineItem(
            time="Hydration",
            suggestions=["Water frequently; warm fluids can feel soothing."],
        ),
    ]

    notes: list[str] = ["Avoid alcohol; limit sugary drinks while unwell."]

    if gi:
        items = [
            MealRoutineItem(
                time="Breakfast",
                suggestions=["Small bland meal (toast/khichdi/rice porridge/banana) if tolerated."],
            ),
            MealRoutineItem(
                time="Lunch",
                suggestions=["Light foods: rice, curd/yogurt (if tolerated), soup, boiled vegetables."],
            ),
            MealRoutineItem(
                time="Snack",
                suggestions=["Plain crackers, banana, or yogurt; keep portions small."],
            ),
            MealRoutineItem(
                time="Dinner",
                suggestions=["Light dinner: rice porridge, soup, or soft cooked foods."],
            ),
            MealRoutineItem(
                time="Hydration",
                suggestions=["Sip water frequently; oral rehydration solution can help replace fluids."],
            ),
        ]
        notes.extend(
            [
                "Avoid very spicy, oily, and high-fiber meals until improving.",
                "If you can’t keep fluids down, seek urgent medical advice.",
            ]
        )

    if resp:
        notes.append("Warm fluids and soups may feel soothing; avoid smoke exposure.")

    if HistoryItem.diabetes in history:
        notes.extend(
            [
                "Keep meals consistent; prioritize high-fiber carbs and lean protein.",
                "Avoid sugary drinks and large refined-carb portions.",
            ]
        )

    if HistoryItem.blood_pressure in history or HistoryItem.heart_disease in history:
        notes.extend(
            [
                "Limit salty/processed foods; prefer home-cooked meals.",
                "Choose unsalted snacks and hydrate regularly.",
            ]
        )

    if SymptomId.weight_loss in symptoms:
        notes.append("Unexplained weight loss can be serious; consider a clinician visit soon.")

    meal_routine = MealRoutine(overview=overview, items=items, notes=notes)

    return home_care, when_to_see, emergency_warning, lifestyle, meal_routine
