from rest_framework import serializers

from .models import Job


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ["id", "title", "company", "location", "description", "url", "source", "created_at"]
        read_only_fields = ["id", "created_at"]
