from __future__ import annotations

import uuid

from .nodes import application_agent, job_searcher, notification_agent, profile_analyzer


def run_application_workflow(
    *,
    user_id: str,
    cv_text: str,
    action: str | None = None,
    thread_id: str | None = None,
    action_data: dict | None = None,
) -> dict:
    state = {
        "user_id": user_id,
        "cv_text": cv_text,
        "action": action,
        "thread_id": thread_id or str(uuid.uuid4()),
        "action_data": action_data or {},
    }

    for node in (profile_analyzer, job_searcher, application_agent, notification_agent):
        state = node(state)

    return state
