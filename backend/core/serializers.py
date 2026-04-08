from rest_framework import serializers

class OrchestratorRequestSerializer(serializers.Serializer):
    user_id = serializers.CharField(required=True)
    cv_text = serializers.CharField(required=False, allow_blank=True)
    action = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    thread_id = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    action_data = serializers.JSONField(required=False, allow_null=True)
