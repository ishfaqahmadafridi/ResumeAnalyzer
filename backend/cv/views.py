from __future__ import annotations

import json

from rest_framework import generics, parsers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .analysis_engine_parts import ModelUnavailableError, analyze_cv_text, parse_structured_cv
from .models import AnalysisResult, CV, RecommendedRole, VerificationResult
from .serializers import CVSerializer
from .text_extractor import extract_text_from_uploaded_file


def _replace_recommended_roles(cv: CV, recommended_roles: list[dict]) -> None:
    cv.recommended_roles.all().delete()
    RecommendedRole.objects.bulk_create(
        [
            RecommendedRole(cv=cv, title=role["role"], match_percentage=role["matched_skills_percentage"])
            for role in recommended_roles
        ]
    )


def _save_analysis_result(cv: CV, analysis: dict) -> None:
    AnalysisResult.objects.update_or_create(
        cv=cv,
        defaults={
            "full_json_state": json.dumps(analysis),
            "score": analysis["score"],
        },
    )


def _save_verification_result(cv: CV, extracted_text: str) -> None:
    VerificationResult.objects.update_or_create(
        cv=cv,
        defaults={
            "is_verified": bool(extracted_text.strip()),
            "details": {
                "message": (
                    "CV text extracted successfully."
                    if extracted_text.strip()
                    else "Upload saved, but no text could be extracted."
                )
            },
        },
    )


class CVUploadView(APIView):
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def post(self, request):
        uploaded_file = request.FILES.get("file")
        if uploaded_file is None:
            return Response({"detail": "A CV file is required."}, status=status.HTTP_400_BAD_REQUEST)

        file_name = (getattr(uploaded_file, "name", "") or "").lower()
        if not file_name.endswith((".pdf", ".docx", ".txt")):
            return Response(
                {"detail": "Unsupported CV format. Please upload a PDF, DOCX, or TXT file."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        extracted_text = extract_text_from_uploaded_file(uploaded_file)
        if not extracted_text.strip():
            return Response(
                {
                    "detail": (
                        "We could not extract readable text from this file. "
                        "Please upload a text-based PDF, DOCX, or TXT CV."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        cv = CV.objects.create(user=request.user, encrypted_file=uploaded_file, raw_text=extracted_text)

        analysis = analyze_cv_text(extracted_text)
        _save_analysis_result(cv, analysis)
        _replace_recommended_roles(cv, analysis["recommended_roles"])
        _save_verification_result(cv, extracted_text)
        return Response(CVSerializer(cv).data, status=status.HTTP_201_CREATED)


class CVListView(generics.ListAPIView):
    serializer_class = CVSerializer

    def get_queryset(self):
        return CV.objects.filter(user=self.request.user).prefetch_related(
            "recommended_roles",
            "analysis_results",
            "verification_results",
        )


class CVDetailView(generics.RetrieveAPIView):
    serializer_class = CVSerializer

    def get_queryset(self):
        return CV.objects.filter(user=self.request.user).prefetch_related(
            "recommended_roles",
            "analysis_results",
            "verification_results",
        )


class CVRoleAnalysisView(APIView):
    def post(self, request):
        cv_id = request.data.get("cv_id")
        selected_role = request.data.get("role") or request.data.get("selected_role")

        if not selected_role or not str(selected_role).strip():
            return Response(
                {"detail": "Role is required. Please select a recommended role or enter your own role."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        selected_role = str(selected_role).strip()

        try:
            cv = CV.objects.get(pk=cv_id, user=request.user)
        except CV.DoesNotExist:
            return Response({"detail": "CV not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            analysis = analyze_cv_text(cv.raw_text or "", selected_role=selected_role)
        except ModelUnavailableError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        _save_analysis_result(cv, analysis)
        _replace_recommended_roles(cv, analysis["recommended_roles"])
        return Response(analysis)


class CVStructuredParseView(APIView):
    def post(self, request):
        cv_id = request.data.get("cv_id")
        raw_text = request.data.get("raw_text")

        if cv_id:
            try:
                raw_text = CV.objects.only("raw_text").get(pk=cv_id, user=request.user).raw_text
            except CV.DoesNotExist:
                return Response({"detail": "CV not found."}, status=status.HTTP_404_NOT_FOUND)

        if not raw_text:
            return Response({"detail": "Provide either cv_id or raw_text."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(parse_structured_cv(raw_text))
