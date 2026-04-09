from __future__ import annotations

import uuid

from django.conf import settings
from django.db import models


class CV(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="cvs")
    encrypted_file = models.FileField(upload_to="cvs/")
    raw_text = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at", "-created_at"]


class AnalysisResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cv = models.ForeignKey(CV, on_delete=models.CASCADE, related_name="analysis_results")
    full_json_state = models.TextField()
    score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)


class RecommendedRole(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cv = models.ForeignKey(CV, on_delete=models.CASCADE, related_name="recommended_roles")
    title = models.CharField(max_length=255)
    match_percentage = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)


class VerificationResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cv = models.ForeignKey(CV, on_delete=models.CASCADE, related_name="verification_results")
    is_verified = models.BooleanField(default=False)
    details = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
