from django.urls import path
from .views import CVUploadView, CVListView, CVDetailView, CVRoleAnalysisView, CVStructuredParseView

urlpatterns = [
    path('upload/', CVUploadView.as_view(), name='cv-upload'),
    path('analyze-role/', CVRoleAnalysisView.as_view(), name='cv-analyze-role'),
    path('parse-structured/', CVStructuredParseView.as_view(), name='cv-parse-structured'),
    path('', CVListView.as_view(), name='cv-list'),
    path('<uuid:pk>/', CVDetailView.as_view(), name='cv-detail'),
]
