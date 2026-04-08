from __future__ import annotations

from rest_framework import serializers

from .models import AnalysisResult, CV, RecommendedRole, VerificationResult


class RecommendedRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendedRole
        fields = ["id", "title", "match_percentage", "created_at"]


class VerificationResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationResult
        fields = ["id", "is_verified", "details", "created_at"]


class AnalysisResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisResult
        fields = ["id", "full_json_state", "score", "created_at"]


class CVSerializer(serializers.ModelSerializer):
    recommended_roles = RecommendedRoleSerializer(many=True, read_only=True)
    latest_analysis = serializers.SerializerMethodField()
    latest_verification = serializers.SerializerMethodField()

    class Meta:
        model = CV
        fields = [
            "id",
            "encrypted_file",
            "raw_text",
            "created_at",
            "updated_at",
            "recommended_roles",
            "latest_analysis",
            "latest_verification",
        ]
        read_only_fields = ["id", "raw_text", "created_at", "updated_at"]

    def get_latest_analysis(self, obj):
        analysis = obj.analysis_results.order_by("-created_at").first()
        return AnalysisResultSerializer(analysis).data if analysis else None

    def get_latest_verification(self, obj):
        verification = obj.verification_results.order_by("-created_at").first()
        return VerificationResultSerializer(verification).data if verification else None
