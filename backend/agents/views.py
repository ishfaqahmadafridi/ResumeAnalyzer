from __future__ import annotations

from rest_framework.response import Response
from rest_framework.views import APIView

from .graph import run_application_workflow


class AgentWorkflowView(APIView):
    def post(self, request):
        result = run_application_workflow(
            user_id=str(request.user.id),
            cv_text=request.data.get("cv_text", ""),
            action=request.data.get("action"),
            thread_id=request.data.get("thread_id"),
            action_data=request.data.get("action_data") or {},
        )
        return Response(result)
