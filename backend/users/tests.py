from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class AuthFlowTests(APITestCase):
    def test_register_and_login_return_token(self):
        register_response = self.client.post(
            reverse("register"),
            {
                "username": "tester",
                "email": "tester@example.com",
                "password": "strongpass123",
                "first_name": "Test",
                "last_name": "User",
            },
            format="json",
        )
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", register_response.data)

        login_response = self.client.post(
            reverse("login"),
            {"username": "tester", "password": "strongpass123"},
            format="json",
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn("token", login_response.data)
