from __future__ import annotations

from cv.analysis_engine_parts import analyze_cv_text


def profile_analyzer(state: dict) -> dict:
    analysis = analyze_cv_text(state.get("cv_text", ""))
    state["profile_summary"] = {
        "recommended_roles": analysis["recommended_roles"],
        "score": analysis["score"],
        "analysis": analysis["analysis"],
    }
    return state


def job_searcher(state: dict) -> dict:
    primary_role = "Generalist"
    summary = state.get("profile_summary") or {}
    if summary.get("analysis"):
        primary_role = summary["analysis"]["role"]

    state["jobs"] = [
        {
            "title": primary_role,
            "company": "Demo Company",
            "location": "Remote",
            "url": "https://example.com/jobs/demo-role",
            "source": "internal-demo",
        }
    ]
    return state


def application_agent(state: dict) -> dict:
    jobs = state.get("jobs", [])
    state["applications"] = [
        {
            "job_title": job["title"],
            "status": "drafted",
            "cover_note": f"Prepared a tailored application draft for {job['title']}.",
        }
        for job in jobs
    ]
    return state


def notification_agent(state: dict) -> dict:
    application_count = len(state.get("applications", []))
    jobs = state.get("jobs", [])
    
    if application_count > 0:
        names = ", ".join([job.get("company", "Unknown") for job in jobs])
        state["notifications"] = [f"Successfully completed {application_count} job application(s) for your role at: {names}."]
    else:
        state["notifications"] = ["No job applications were submitted during this workflow."]
        
    return state
