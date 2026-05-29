from django.urls import path

from . import views

urlpatterns = [
    # Public
    path("marhalas/", views.MarhalaListView.as_view(), name="marhala-list"),
    path("marhalas/<int:pk>/", views.MarhalaDetailView.as_view(), name="marhala-detail"),
    # Student
    path("my/marhalas/", views.MyMarhalasView.as_view(), name="my-marhalas"),
    path("marhalas/<int:marhala_id>/enroll/", views.EnrollView.as_view(), name="enroll"),
    path("marhalas/<int:marhala_id>/courses/", views.MarhalaCoursesView.as_view(), name="marhala-courses"),
    path("courses/<int:pk>/", views.CourseDetailView.as_view(), name="course-detail"),
    path("lessons/<int:pk>/", views.LessonDetailView.as_view(), name="lesson-detail"),
    path("lessons/<int:lesson_id>/complete/", views.LessonCompleteView.as_view(), name="lesson-complete"),
    # Admin
    path("admin/marhalas/", views.AdminMarhalaListCreateView.as_view(), name="admin-marhala-list"),
    path("admin/marhalas/<int:pk>/", views.AdminMarhalaDetailView.as_view(), name="admin-marhala-detail"),
    path("admin/marhalas/<int:marhala_id>/courses/", views.AdminCourseListCreateView.as_view(), name="admin-marhala-courses"),
    path("admin/courses/", views.AdminCourseListCreateView.as_view(), name="admin-course-list"),
    path("admin/courses/<int:pk>/", views.AdminCourseDetailView.as_view(), name="admin-course-detail"),
    path("admin/courses/<int:course_id>/lessons/", views.AdminLessonListCreateView.as_view(), name="admin-course-lessons"),
    path("admin/lessons/", views.AdminLessonListCreateView.as_view(), name="admin-lesson-list"),
    path("admin/lessons/<int:pk>/", views.AdminLessonDetailView.as_view(), name="admin-lesson-detail"),
]
