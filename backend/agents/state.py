from __future__ import annotations

from typing import NotRequired, TypedDict


class WorkflowState(TypedDict):
    user_id: str
    cv_text: str
    action: NotRequired[str | None]
    thread_id: NotRequired[str | None]
    action_data: NotRequired[dict]
    profile_summary: NotRequired[dict]
    jobs: NotRequired[list[dict]]
    applications: NotRequired[list[dict]]
    notifications: NotRequired[list[str]]
    interview_reply: NotRequired[str]
    interview_role: NotRequired[str]
