from __future__ import annotations

from rest_framework.response import Response
from rest_framework.views import APIView

from agents.graph import run_application_workflow
from .serializers import OrchestratorRequestSerializer


class OrchestratorView(APIView):
    def post(self, request):
        serializer = OrchestratorRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = run_application_workflow(
            user_id=serializer.validated_data["user_id"],
            cv_text=serializer.validated_data.get("cv_text", ""),
            action=serializer.validated_data.get("action"),
            thread_id=serializer.validated_data.get("thread_id"),
            action_data=serializer.validated_data.get("action_data") or {},
        )
        return Response(result)
