from django.test import TestCase

# Create your tests here.
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from users.models import User


class CVApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="cv-user", email="cv@example.com", password="strongpass123")
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

    def test_structured_parse_requires_text_or_cv(self):
        response = self.client.post(reverse("cv-parse-structured"), {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_structured_parse_extracts_basic_fields(self):
        response = self.client.post(
            reverse("cv-parse-structured"),
            {
                "raw_text": (
                    "Jane Doe\n"
                    "jane@example.com\n"
                    "+92 300 1234567\n"
                    "Skills\n"
                    "Python Django React LangGraph"
                )
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Jane Doe")
        self.assertEqual(response.data["email"], "jane@example.com")
        self.assertIn("python", response.data["skills"])

    def test_upload_rejects_unreadable_pdf(self):
        uploaded = SimpleUploadedFile(
            "scan.pdf",
            b"%PDF-1.7\n4 0 obj\n<< /Filter /FlateDecode /Length 64 >>\nstream\n\x00\x01\x02binary-ish-data\x03\x04\nendstream\n",
            content_type="application/pdf",
        )

        response = self.client.post(reverse("cv-upload"), {"file": uploaded}, format="multipart")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("could not extract readable text", response.data["detail"].lower())

    def test_upload_accepts_plain_text_cv(self):
        uploaded = SimpleUploadedFile(
            "resume.txt",
            (
                b"Jane Doe\n"
                b"jane@example.com\n"
                b"+92 300 1234567\n"
                b"Frontend Developer with React, TypeScript, HTML, CSS, and JavaScript experience.\n"
            ),
            content_type="text/plain",
        )

        response = self.client.post(reverse("cv-upload"), {"file": uploaded}, format="multipart")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["latest_verification"]["is_verified"], True)
