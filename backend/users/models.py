from __future__ import annotations

import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(blank=False, default="")


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    applications_today = models.IntegerField(default=0)
    last_application_date = models.DateField(null=True, blank=True)


@receiver(post_save, sender=User)
def ensure_profile_exists(sender, instance: User, created: bool, **kwargs) -> None:
    if created:
        Profile.objects.create(user=instance)
