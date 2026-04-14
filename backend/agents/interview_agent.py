from __future__ import annotations

import os
from typing import Any

from cv.analysis_engine_parts.gemini_client import generate_with_gemini


INTERVIEW_TURN_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "reply": {"type": "STRING"},
        "role": {"type": "STRING"},
    },
    "required": ["reply", "role"],
}


INTERVIEW_SYSTEM_INSTRUCTION = (
    "You are HireFlow AI, a professional interviewer bot. "
    "Always ask exactly one question per turn unless giving the final summary. "
    "Use this order: one-time CV analysis first, then HR screening, then role-specific technical, then behavioral, then closing. "
    "After each candidate answer, include one short acknowledgement line then the next question. "
    "Do not reveal internal phase names. "
    "If user says start interview without CV context, ask them to upload/paste CV first. "
    "If role is unclear, ask a single short role confirmation question. "
    "At the end, provide full summary with score out of 10, strengths, areas of improvement, final recommendation: Strong Hire, Hire, Average, or Not Recommended. "
    "Keep tone friendly and professional. Return JSON only matching schema."
)


def interview_turn_agent(state: dict[str, Any]) -> dict[str, Any]:
    action_data = state.get("action_data") or {}
    user_text = str(action_data.get("user_text", "")).strip()
    history = action_data.get("history") or []
    role = str(action_data.get("role", "")).strip()

    if not user_text:
        state["interview_reply"] = "Please send your message to continue the interview."
        return state

    history_text = []
    for item in history[-12:]:
        if not isinstance(item, dict):
            continue
        speaker = "Candidate" if item.get("role") == "user" else "HireFlow AI"
        text = str(item.get("text", "")).strip()
        if text:
            history_text.append(f"{speaker}: {text}")

    prompt = "\n\n".join(
        [
            f"Target role from CV: {role or 'Unknown'}",
            "CV raw text:",
            (state.get("cv_text") or "")[:2500],
            "Conversation so far:",
            "\n".join(history_text) if history_text else "No previous messages.",
            f"Latest candidate message: {user_text}",
            "Generate the next interviewer response now.",
        ]
    )

    payload = generate_with_gemini(
        prompt,
        response_schema=INTERVIEW_TURN_SCHEMA,
        system_instruction=INTERVIEW_SYSTEM_INSTRUCTION,
    )
    if payload and isinstance(payload, dict):
        reply = str(payload.get("reply", "")).strip()
        inferred_role = str(payload.get("role", "")).strip()
        if reply:
            state["interview_reply"] = reply
            if inferred_role:
                state["interview_role"] = inferred_role
            return state

    has_any_key = bool(os.getenv("GEMINI_API_KEY", "").strip() or os.getenv("CV_GEMINI_API_KEYS", "").strip())
    if not has_any_key:
        state["interview_reply"] = "Interview model is not configured. Add GEMINI_API_KEY (or CV_GEMINI_API_KEYS) in backend environment, then retry."
    else:
        state["interview_reply"] = "Interview model is temporarily unavailable. Please try again in a moment."
    return state
