from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from users.models import User


class OrchestratorTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="agent-user", email="agent@example.com", password="strongpass123")
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

    def test_orchestrator_runs_workflow(self):
        response = self.client.post(
            reverse("orchestrate"),
            {
                "user_id": str(self.user.id),
                "cv_text": "Python Django React LangGraph",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("profile_summary", response.data)
        self.assertIn("jobs", response.data)
        self.assertIn("applications", response.data)
