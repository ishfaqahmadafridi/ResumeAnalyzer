from rest_framework import generics, permissions

from .models import Job
from .serializers import JobSerializer


class JobListView(generics.ListCreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]


class JobDetailView(generics.RetrieveAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
