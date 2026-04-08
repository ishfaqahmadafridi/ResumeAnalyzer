from __future__ import annotations

from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import Profile, User


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["applications_today", "last_application_date"]


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "profile"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get("username") or ""
        email = attrs.get("email") or ""
        password = attrs["password"]

        if email and not username:
            try:
                username = User.objects.only("username").get(email=email).username
            except User.DoesNotExist as exc:
                raise serializers.ValidationError("Invalid credentials.") from exc

        user = authenticate(username=username, password=password)
        if user is None:
            raise serializers.ValidationError("Invalid credentials.")

        attrs["user"] = user
        return attrs
