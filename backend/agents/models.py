from django.db import models
from users.models import User
from cv.models import CV
import uuid

class GraphThread(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    thread_id = models.CharField(max_length=255, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='graph_threads')
    cv = models.ForeignKey(CV, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=50, default='running') # running, waiting_approval, completed
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
