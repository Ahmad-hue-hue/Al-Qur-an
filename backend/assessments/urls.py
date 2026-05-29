from django.urls import path

from . import views

urlpatterns = [
    # Student
    path("courses/<int:course_id>/test/", views.CourseTestView.as_view(), name="course-test"),
    path("tests/<int:test_id>/submit/", views.TestSubmitView.as_view(), name="test-submit"),
    path("marhalas/<int:marhala_id>/final-exam/", views.FinalExamView.as_view(), name="final-exam"),
    path("marhalas/<int:marhala_id>/final-exam/submit/", views.FinalExamSubmitView.as_view(), name="final-exam-submit"),
    # Admin
    path("admin/tests/", views.AdminTestListCreateView.as_view(), name="admin-test-list"),
    path("admin/tests/<int:pk>/", views.AdminTestDetailView.as_view(), name="admin-test-detail"),
    path("admin/courses/<int:course_id>/tests/", views.AdminTestListCreateView.as_view(), name="admin-course-tests"),
    path("admin/students/", views.AdminStudentListView.as_view(), name="admin-students"),
]
