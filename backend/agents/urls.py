from django.urls import path

from .views import AgentWorkflowView

urlpatterns = [
    path("workflow/", AgentWorkflowView.as_view(), name="agent-workflow"),
]
