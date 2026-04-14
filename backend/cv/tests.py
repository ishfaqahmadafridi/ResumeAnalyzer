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
from cv.analysis_engine_parts.skill_utils import extract_known_skills
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

    @override_settings(CV_ROLE_ANALYSIS_MODEL_REQUIRED=False)
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

    def test_analyze_role_requires_explicit_role(self):
        cv = CV.objects.create(
            user=self.user,
            encrypted_file="cvs/resume.txt",
            raw_text="Jane Doe\nReact TypeScript JavaScript Next.js Tailwind",
        )

        response = self.client.post(
            reverse("cv-analyze-role"),
            {"cv_id": str(cv.id)},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("role is required", response.data["detail"].lower())

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

        self.assertIsNone(result["analysis"])
        self.assertTrue(any(item.get("role") == "Mechanical Engineer" for item in result["recommended_roles"]))
        self.assertGreaterEqual(result["score"], 0)
        self.assertEqual(mock_generate.call_count, 1)

    @override_settings(CV_ANALYSIS_USE_LLM=True, CV_LLM_PROVIDER="gemini", CV_GEMINI_MODEL="gemini-2.5-flash", CV_ROLE_ANALYSIS_MODEL_REQUIRED=False)
    @patch("cv.analysis_engine_parts.analyzer.gemini_is_configured", return_value=True)
    @patch("cv.analysis_engine_parts.analyzer.generate_with_gemini")
    def test_analysis_uses_selected_role_for_second_gemini_pass(self, mock_generate, _mock_is_configured):
        mock_generate.side_effect = [
            {
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
                    }
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
            },
            {
                "role": "Data Analyst",
                "benchmark_skills": ["sql", "excel", "pandas", "tableau"],
                "matched_skills": ["sql", "excel"],
                "missing_skills": ["pandas", "tableau"],
                "recommended_skills": ["pandas", "tableau"],
                "matched_skills_percentage": 25,
                "role_specific_cv_score": 28,
            },
        ]

        result = analyze_cv_text("Jane Doe SQL Excel CV text", selected_role="Data Analyst")

        self.assertEqual(result["analysis"]["role"], "Data Analyst")
        self.assertIn("pandas", result["analysis"]["recommended_skills"])
        self.assertIn("tableau", result["analysis"]["recommended_skills"])
        self.assertEqual(mock_generate.call_count, 2)

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
        self.assertIn("excel", result["analysis"]["matched_skills"])
        self.assertTrue(
            all(skill in result["analysis"]["missing_skills"] for skill in ["employee relations", "recruitment", "hr policies"])
        )
        self.assertTrue(
            all(skill in result["analysis"]["recommended_skills"] for skill in ["employee relations", "recruitment", "hr policies"])
        )
        self.assertGreaterEqual(result["score"], 0)
        self.assertEqual(mock_generate.call_count, 2)

    @override_settings(CV_ANALYSIS_USE_LLM=False)
    def test_fallback_analysis_does_not_fabricate_recommended_roles_for_unrelated_cv(self):
        result = analyze_cv_text("Mechanical engineering internship with turbine maintenance, plant operations, and workshop tools.")

        self.assertIsInstance(result["recommended_roles"], list)
        self.assertIsNone(result["analysis"])
        self.assertGreaterEqual(result["score"], 0)

    @override_settings(CV_ANALYSIS_USE_LLM=False)
    def test_fallback_detects_role_from_headline_pattern(self):
        result = analyze_cv_text(
            "John Doe\n"
            "john@example.com\n"
            "Frontend Developer with React, TypeScript, HTML, CSS, JavaScript experience."
        )

        self.assertGreater(len(result["recommended_roles"]), 0)
        self.assertEqual(result["recommended_roles"][0]["role"], "Frontend Developer")

    def test_extract_known_skills_filters_contact_and_spoken_languages(self):
        skills = extract_known_skills(
            "Saqib Afridi\n"
            "saqibafridi636@gmail.com\n"
            "Languages: English, Urdu, Pashto\n"
            "Skills\n"
            "React, JavaScript, HTML, CSS, Tailwind\n"
            "LinkedIn: linkedin.com/in/saqib-afridi\n"
        )

        self.assertIn("react", skills)
        self.assertIn("javascript", skills)
        self.assertNotIn("english", skills)
        self.assertNotIn("urdu", skills)
        self.assertNotIn("pashto", skills)
        self.assertFalse(any("gmail" in skill for skill in skills))
        self.assertFalse(any("linkedin" in skill for skill in skills))

    def test_extract_known_skills_filters_university_like_items(self):
        skills = extract_known_skills(
            "Education\n"
            "University of Engineering and Technology\n"
            "Skills\n"
            "React, JavaScript, Next.js, Node.js\n"
        )

        self.assertIn("react", skills)
        self.assertIn("javascript", skills)
        self.assertFalse(any("university" in skill for skill in skills))

    def test_structured_parse_extracts_languages_separately(self):
        response = self.client.post(
            reverse("cv-parse-structured"),
            {
                "raw_text": (
                    "Saqib Afridi\n"
                    "Languages: English, Urdu, Pashto\n"
                    "Skills\n"
                    "React, JavaScript, Next.js\n"
                    "Education\n"
                    "University of Engineering and Technology\n"
                )
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("languages"), ["english", "urdu", "pashto"])
        self.assertIn("react", response.data.get("skills", []))
        self.assertNotIn("english", response.data.get("skills", []))

    @override_settings(CV_ANALYSIS_USE_LLM=False, CV_ROLE_ANALYSIS_MODEL_REQUIRED=False)
    def test_selected_role_fallback_score_is_not_zero_when_skills_exist(self):
        result = analyze_cv_text(
            "Skills\nReact, JavaScript, Next.js, CSS\n"
            "Experience\nBuilt frontend interfaces and components\n",
            selected_role="Frontend Web Developer",
        )

        self.assertEqual(result["analysis"]["matched_skills_percentage"], 0)
        self.assertEqual(result["analysis"]["role_specific_cv_score"], 0)

    def test_extract_known_skills_removes_separator_and_fragment_noise(self):
        skills = extract_known_skills(
            "Skills\n"
            "___________\n"
            "Frameworks, RESTful APIs, Version Control Systems\n"
            "Developers that\n"
            "with\n"
        )

        self.assertIn("restful apis", skills)
        self.assertIn("version control systems", skills)
        self.assertFalse(any("_" in skill for skill in skills))
        self.assertNotIn("developers that", skills)
        self.assertNotIn("with", skills)

    def test_extract_known_skills_removes_weak_single_tokens_when_phrase_exists(self):
        skills = extract_known_skills(
            "Skills\n"
            "Web Development Stacks\n"
            "Spring Boot\n"
        )

        self.assertIn("web development stacks", skills)
        self.assertIn("spring boot", skills)
        self.assertNotIn("web", skills)
        self.assertNotIn("development", skills)
        self.assertNotIn("stacks", skills)
        self.assertNotIn("spring", skills)
        self.assertNotIn("boot", skills)

    def test_extract_known_skills_filters_noisy_mechanical_fragments(self):
        skills = extract_known_skills(
            "Skills\n"
            "technicaldrawing\n"
            "blueprintreading\n"
            "machinedesign\n"
            "materialselection\n"
            "finiteelementanalysis(fea)\n"
            "ansys\n"
            "abaqus\n"
            "solidworks\n"
            "catia\n"
            "london\n"
            "unitedkingdomamultinational\n"
            "supervisedacross-functional teamof40+\n"
            "reductionincycletime\n"
            "present\n"
        )

        self.assertIn("ansys", skills)
        self.assertIn("abaqus", skills)
        self.assertIn("solidworks", skills)
        self.assertIn("catia", skills)
        self.assertNotIn("london", skills)
        self.assertFalse(any("unitedkingdom" in skill for skill in skills))
        self.assertFalse(any("supervised" in skill for skill in skills))
        self.assertFalse(any("present" == skill for skill in skills))

    def test_extract_known_skills_filters_university_and_city_tokens(self):
        skills = extract_known_skills(
            "Skills\n"
            "fuuast\n"
            "kohat\n"
            "kp\n"
            "ics\n"
            "html5\n"
            "css3\n"
            "javascript\n"
            "react.js\n"
            "node.js\n"
            "mongodb tools\n"
            "git\n"
            "figma\n"
        )

        self.assertIn("javascript", skills)
        self.assertIn("react.js", skills)
        self.assertIn("node.js", skills)
        self.assertIn("git", skills)
        self.assertNotIn("fuuast", skills)
        self.assertNotIn("kohat", skills)
        self.assertNotIn("kp", skills)
        self.assertNotIn("ics", skills)

    @override_settings(CV_ANALYSIS_USE_LLM=False, CV_ROLE_ANALYSIS_MODEL_REQUIRED=False)
    def test_fallback_analysis_keeps_user_selected_custom_role_without_inventing_skills(self):
        result = analyze_cv_text("Worked with people, operations, and office tasks.", selected_role="HR")

        self.assertIn("HR", result["analysis"]["role"])
        self.assertIsInstance(result["analysis"]["matched_skills"], list)
        self.assertEqual(result["analysis"]["missing_skills"], [])
        self.assertEqual(result["analysis"]["recommended_skills"], [])

    @override_settings(CV_ANALYSIS_USE_LLM=False, CV_ROLE_ANALYSIS_MODEL_REQUIRED=False)
    def test_fallback_analysis_uses_role_benchmark_for_missing_and_recommended(self):
        result = analyze_cv_text(
            "Skills\nHTML, CSS, JavaScript, React, Git\n",
            selected_role="Frontend Web Developer",
        )

        self.assertEqual(result["analysis"]["missing_skills"], [])
        self.assertEqual(result["analysis"]["recommended_skills"], [])
        self.assertEqual(result["analysis"]["matched_skills_percentage"], 0)

    @override_settings(CV_ANALYSIS_USE_LLM=True, CV_LLM_PROVIDER="gemini", CV_GEMINI_MODEL="gemini-2.5-flash", CV_ROLE_ANALYSIS_MODEL_REQUIRED=False)
    @patch("cv.analysis_engine_parts.analyzer.gemini_is_configured", return_value=True)
    @patch("cv.analysis_engine_parts.analyzer.generate_with_gemini", return_value=None)
    def test_custom_role_returns_minimal_selected_role_when_gemini_returns_nothing(self, _mock_generate, _mock_is_configured):
        result = analyze_cv_text("First Last Human Resources excel", selected_role="HR")

        self.assertIn("HR", result["analysis"]["role"])
        self.assertIsInstance(result["analysis"]["matched_skills"], list)
        self.assertEqual(result["analysis"]["missing_skills"], [])
        self.assertEqual(result["analysis"]["recommended_skills"], [])

    @override_settings(CV_ANALYSIS_USE_LLM=False, CV_ROLE_ANALYSIS_MODEL_REQUIRED=True)
    def test_role_analysis_returns_503_when_model_required_and_unavailable(self):
        cv = CV.objects.create(
            user=self.user,
            encrypted_file="cvs/resume.txt",
            raw_text="Jane Doe\nReact TypeScript JavaScript Next.js Tailwind",
        )

        response = self.client.post(
            reverse("cv-analyze-role"),
            {"cv_id": str(cv.id), "role": "Frontend Developer"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertIn("model", str(response.data.get("detail", "")).lower())
