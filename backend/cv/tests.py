from django.test import TestCase
from django.test import override_settings
from unittest.mock import patch

# Create your tests here.
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from users.models import User
from cv.analysis_engine_parts.analyzer import analyze_cv_text
from cv.models import CV, AnalysisResult


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

    def test_analyze_role_updates_existing_analysis_record(self):
        cv = CV.objects.create(
            user=self.user,
            encrypted_file="cvs/resume.txt",
            raw_text="Jane Doe\nReact TypeScript JavaScript Next.js Tailwind",
        )
        AnalysisResult.objects.create(
            cv=cv,
            full_json_state='{"score": 20, "recommended_roles": [], "analysis": null, "structured_data": {}}',
            score=20,
        )

        response = self.client.post(
            reverse("cv-analyze-role"),
            {"cv_id": str(cv.id), "role": "Frontend Developer"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(AnalysisResult.objects.filter(cv=cv).count(), 1)

    @override_settings(CV_ANALYSIS_USE_LLM=True, CV_LLM_PROVIDER="gemini", CV_GEMINI_MODEL="gemini-2.5-flash")
    @patch("cv.analysis_engine_parts.analyzer.gemini_is_configured", return_value=True)
    @patch("cv.analysis_engine_parts.analyzer.generate_with_gemini")
    def test_analysis_uses_gemini_for_initial_recommendations(self, mock_generate, _mock_is_configured):
        mock_generate.return_value = {
            "structured_data": {
                "name": "Jane Doe",
                "email": "jane@example.com",
                "phone": "+92 300 1234567",
                "summary": "Mechanical engineer with CAD, SolidWorks, and manufacturing experience.",
                "experience": ["Designed machine components"],
                "education": ["BS Mechanical Engineering"],
                "projects": ["Industrial design project"],
                "skills": ["solidworks", "autocad", "manufacturing"],
                "links": ["https://example.com"],
            },
            "recommended_roles": [
                {
                    "role": "Mechanical Engineer",
                    "matched_skills": ["solidworks", "autocad", "manufacturing"],
                    "missing_skills": ["ansys", "gd&t"],
                    "matched_skills_percentage": 68,
                },
                {
                    "role": "Design Engineer",
                    "matched_skills": ["solidworks", "autocad"],
                    "missing_skills": ["ansys"],
                    "matched_skills_percentage": 54,
                },
                {
                    "role": "Production Engineer",
                    "matched_skills": ["manufacturing"],
                    "missing_skills": ["quality control"],
                    "matched_skills_percentage": 33,
                },
            ],
            "analysis": {
                "role": "Mechanical Engineer",
                "your_skills": ["solidworks", "autocad", "manufacturing"],
                "matched_skills": ["solidworks", "autocad", "manufacturing"],
                "matched_skills_percentage": 68,
                "missing_skills": ["ansys", "gd&t"],
                "recommended_skills": ["ansys", "gd&t"],
                "role_specific_cv_score": 68,
            },
            "score": 68,
        }

        result = analyze_cv_text("Jane Doe Mechanical Engineering SolidWorks AutoCAD manufacturing CV text")

        self.assertEqual(result["analysis"]["role"], "Mechanical Engineer")
        self.assertEqual(result["recommended_roles"][0]["role"], "Mechanical Engineer")
        self.assertEqual(result["score"], 68)
        self.assertEqual(mock_generate.call_count, 1)

    @override_settings(CV_ANALYSIS_USE_LLM=True, CV_LLM_PROVIDER="gemini", CV_GEMINI_MODEL="gemini-2.5-flash")
    @patch("cv.analysis_engine_parts.analyzer.gemini_is_configured", return_value=True)
    @patch("cv.analysis_engine_parts.analyzer.generate_with_gemini")
    def test_analysis_uses_selected_role_for_second_gemini_pass(self, mock_generate, _mock_is_configured):
        mock_generate.return_value = {
            "structured_data": {
                "name": "Jane Doe",
                "email": "jane@example.com",
                "phone": "+92 300 1234567",
                "summary": "Transitioning into data analysis.",
                "experience": ["Worked with dashboards"],
                "education": [],
                "projects": [],
                "skills": ["sql", "excel"],
                "links": [],
            },
            "recommended_roles": [
                {
                    "role": "Data Analyst",
                    "matched_skills": ["sql", "excel"],
                    "missing_skills": ["pandas", "tableau"],
                    "matched_skills_percentage": 25,
                },
                {
                    "role": "Frontend Developer",
                    "matched_skills": [],
                    "missing_skills": ["react"],
                    "matched_skills_percentage": 0,
                },
                {
                    "role": "AI Engineer",
                    "matched_skills": [],
                    "missing_skills": ["python"],
                    "matched_skills_percentage": 0,
                },
            ],
            "analysis": {
                "role": "Data Analyst",
                "your_skills": ["sql", "excel"],
                "matched_skills": ["sql", "excel"],
                "matched_skills_percentage": 25,
                "missing_skills": ["pandas", "tableau"],
                "recommended_skills": ["pandas", "tableau"],
                "role_specific_cv_score": 28,
            },
            "score": 28,
        }

        result = analyze_cv_text("Jane Doe SQL Excel CV text", selected_role="Data Analyst")

        self.assertEqual(result["analysis"]["role"], "Data Analyst")
        self.assertEqual(result["analysis"]["recommended_skills"], ["pandas", "tableau"])
        self.assertEqual(mock_generate.call_count, 1)

    @override_settings(CV_ANALYSIS_USE_LLM=True, CV_LLM_PROVIDER="gemini", CV_GEMINI_MODEL="gemini-2.5-flash")
    @patch("cv.analysis_engine_parts.analyzer.gemini_is_configured", return_value=True)
    @patch("cv.analysis_engine_parts.analyzer.generate_with_gemini")
    def test_custom_selected_role_gets_benchmark_skills_when_initial_analysis_is_sparse(self, mock_generate, _mock_is_configured):
        mock_generate.side_effect = [
            {
                "structured_data": {
                    "name": "First Last",
                    "email": "first.last@gmail.com",
                    "phone": "+44 1234567890",
                    "summary": "",
                    "experience": [],
                    "education": [],
                    "projects": [],
                    "skills": ["excel"],
                    "links": [],
                },
                "recommended_roles": [],
                "analysis": {
                    "role": "HR",
                    "your_skills": ["excel"],
                    "matched_skills": ["excel"],
                    "matched_skills_percentage": 0,
                    "missing_skills": [],
                    "recommended_skills": [],
                    "role_specific_cv_score": 0,
                },
                "score": 0,
            },
            {
                "role": "HR",
                "benchmark_skills": ["employee relations", "recruitment", "hr policies", "performance management"],
                "matched_skills": ["excel"],
                "missing_skills": ["employee relations", "recruitment", "hr policies"],
                "recommended_skills": ["employee relations", "recruitment", "hr policies"],
                "matched_skills_percentage": 10,
                "role_specific_cv_score": 10,
            },
        ]

        result = analyze_cv_text("First Last Human Resources New excel", selected_role="HR")

        self.assertEqual(result["analysis"]["role"], "HR")
        self.assertEqual(result["analysis"]["matched_skills"], ["excel"])
        self.assertEqual(result["analysis"]["missing_skills"], ["employee relations", "recruitment", "hr policies"])
        self.assertEqual(result["analysis"]["recommended_skills"], ["employee relations", "recruitment", "hr policies"])
        self.assertEqual(result["score"], 10)
        self.assertEqual(mock_generate.call_count, 2)

    def test_fallback_analysis_does_not_fabricate_recommended_roles_for_unrelated_cv(self):
        result = analyze_cv_text("Mechanical engineering internship with turbine maintenance, plant operations, and workshop tools.")

        self.assertEqual(result["recommended_roles"], [])
        self.assertIsNone(result["analysis"])
        self.assertEqual(result["score"], 0)

    def test_fallback_analysis_keeps_user_selected_custom_role_without_inventing_skills(self):
        result = analyze_cv_text("Worked with people, operations, and office tasks.", selected_role="HR")

        self.assertEqual(result["analysis"]["role"], "HR")
        self.assertEqual(result["analysis"]["matched_skills"], [])
        self.assertEqual(result["analysis"]["missing_skills"], [])
        self.assertEqual(result["analysis"]["recommended_skills"], [])
        self.assertEqual(result["recommended_roles"], [])

    @override_settings(CV_ANALYSIS_USE_LLM=True, CV_LLM_PROVIDER="gemini", CV_GEMINI_MODEL="gemini-2.5-flash")
    @patch("cv.analysis_engine_parts.analyzer.gemini_is_configured", return_value=True)
    @patch("cv.analysis_engine_parts.analyzer.generate_with_gemini", return_value=None)
    def test_custom_role_returns_minimal_selected_role_when_gemini_returns_nothing(self, _mock_generate, _mock_is_configured):
        result = analyze_cv_text("First Last Human Resources excel", selected_role="HR")

        self.assertEqual(result["analysis"]["role"], "HR")
        self.assertEqual(result["analysis"]["matched_skills"], [])
        self.assertEqual(result["analysis"]["missing_skills"], [])
        self.assertEqual(result["analysis"]["recommended_skills"], [])
