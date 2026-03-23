from app.schemas.diagnosis import DiagnosisRequest, DiagnosisResponse, ConditionResult, RecommendedActions
from app.services.ml_service import predict_top3
from app.services.recommendation_service import build_recommendations
from app.services.risk_service import red_alert_check


DISCLAIMER = "This system is not a medical diagnosis. Please consult a certified doctor."


def diagnose(payload: DiagnosisRequest) -> DiagnosisResponse:
    red_alert, red_reason = red_alert_check(payload)

    top3 = predict_top3(
        age_group=payload.age_group,
        gender=payload.gender,
        severity=payload.severity,
        duration=payload.duration,
        symptoms=payload.symptoms,
        history=payload.medical_history,
    )

    possible = [ConditionResult(name=name, confidence=conf) for name, conf in top3]

    home_care, when_to_see, emergency_warning, lifestyle, meal_routine = build_recommendations(
        payload, red_alert
    )

    return DiagnosisResponse(
        disclaimer=DISCLAIMER,
        red_alert=red_alert,
        red_alert_reason=red_reason,
        possible_conditions=possible,
        recommended_actions=RecommendedActions(
            home_care=home_care,
            when_to_see_a_doctor=when_to_see,
            emergency_warning=emergency_warning,
        ),
        lifestyle_tips=lifestyle,
        meal_routine=meal_routine,
    )
