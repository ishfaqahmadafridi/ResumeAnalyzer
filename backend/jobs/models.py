from __future__ import annotations

import uuid

from django.db import models


class Job(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    url = models.URLField(max_length=500)
    source = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
