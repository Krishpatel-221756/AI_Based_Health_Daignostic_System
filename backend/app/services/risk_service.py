from app.schemas.diagnosis import DiagnosisRequest, Severity, SymptomId


def red_alert_check(payload: DiagnosisRequest) -> tuple[bool, str | None]:
    symptoms = set(payload.symptoms)
    is_red_alert = (
        payload.severity == Severity.severe
        and SymptomId.chest_pain in symptoms
        and SymptomId.shortness_of_breath in symptoms
    )
    if is_red_alert:
        return True, "Severe symptoms with chest pain and breathlessness detected."
    return False, None

