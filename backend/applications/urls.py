from django.urls import path
from .views import ApplicationListView, ApplicationDetailView

urlpatterns = [
    path('', ApplicationListView.as_view(), name='application-list'),
    path('<uuid:pk>/', ApplicationDetailView.as_view(), name='application-detail'),
]
