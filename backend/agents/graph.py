from __future__ import annotations

import uuid

from .interview_agent import interview_turn_agent
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
        "notifications": [],
    }

    if not action:
        state = profile_analyzer(state)
        state = job_searcher(state)
        state["notifications"].append("Found matching roles. Review details.")
        return state

    elif action == "interview_turn":
        state = interview_turn_agent(state)
        return state
        
    elif action == "approve_applications":
        state["notifications"].append("Starting application process...")
        state["action_data"]["needs_info"] = True
        state["notifications"].append(f"Agent requires your input: What is your expected salary?")
        return state
        
    elif action == "answer_question":
        # Use runtime jobs from action payload or previously discovered jobs.
        provided_jobs = (state.get("action_data") or {}).get("jobs")
        if isinstance(provided_jobs, list) and provided_jobs:
            state["jobs"] = provided_jobs
        state = application_agent(state)
        state = notification_agent(state)
        return state

    return state
