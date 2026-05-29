from django.urls import path

from . import views

urlpatterns = [
    path("my/results/", views.MyResultsView.as_view(), name="my-results"),
    path("my/results/<int:pk>/", views.MarhalaResultDetailView.as_view(), name="my-result-detail"),
    path("admin/results/", views.AdminStudentResultsView.as_view(), name="admin-results"),
    path("admin/students/<int:student_id>/results/", views.AdminStudentResultsView.as_view(), name="admin-student-results"),
]
