from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Course, Enrollment, Lesson, LessonProgress, Marhala
from .permissions import IsAdmin, IsEnrolled, IsStudent
from .progression import (
    can_enroll,
    check_marhala_completion,
    complete_lesson,
    enroll_student,
    is_course_complete,
    reset_marhala_progress,
)
from .serializers import (
    CourseSerializer,
    EnrollmentSerializer,
    LessonSerializer,
    MarhalaSerializer,
)


# Public endpoints
class MarhalaListView(generics.ListAPIView):
    serializer_class = MarhalaSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role == "admin":
            return Marhala.objects.all()
        return Marhala.objects.filter(is_visible=True)


class MarhalaDetailView(generics.RetrieveAPIView):
    serializer_class = MarhalaSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Marhala.objects.all()


# Student endpoints
class MyMarhalasView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        return Enrollment.objects.filter(student=self.request.user)


class EnrollView(APIView):
    permission_classes = [IsStudent]

    def post(self, request, marhala_id):
        try:
            marhala = Marhala.objects.get(id=marhala_id)
        except Marhala.DoesNotExist:
            return Response(
                {"error": "Marhala not found"}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            enrollment = enroll_student(request.user, marhala)
            return Response(
                EnrollmentSerializer(enrollment).data,
                status=status.HTTP_201_CREATED,
            )
        except PermissionError as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_403_FORBIDDEN
            )


class MarhalaCoursesView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        return Course.objects.filter(marhala_id=self.kwargs["marhala_id"])


class CourseDetailView(generics.RetrieveAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsStudent]
    queryset = Course.objects.all()


class LessonDetailView(generics.RetrieveAPIView):
    serializer_class = LessonSerializer
    permission_classes = [IsStudent]
    queryset = Lesson.objects.all()


class LessonCompleteView(APIView):
    permission_classes = [IsStudent]

    def post(self, request, lesson_id):
        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response(
                {"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND
            )

        progress, next_lesson = complete_lesson(request.user, lesson)
        return Response(
            {
                "message": "Lesson completed",
                "next_lesson_id": next_lesson.id if next_lesson else None,
            }
        )


# Admin endpoints
class AdminMarhalaListCreateView(generics.ListCreateAPIView):
    serializer_class = MarhalaSerializer
    permission_classes = [IsAdmin]
    queryset = Marhala.objects.all()


class AdminMarhalaDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MarhalaSerializer
    permission_classes = [IsAdmin]
    queryset = Marhala.objects.all()


class AdminCourseListCreateView(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        marhala_id = self.kwargs.get("marhala_id")
        if marhala_id:
            return Course.objects.filter(marhala_id=marhala_id)
        return Course.objects.all()


class AdminCourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAdmin]
    queryset = Course.objects.all()


class AdminLessonListCreateView(generics.ListCreateAPIView):
    serializer_class = LessonSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        course_id = self.kwargs.get("course_id")
        if course_id:
            return Lesson.objects.filter(course_id=course_id)
        return Lesson.objects.all()


class AdminLessonDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LessonSerializer
    permission_classes = [IsAdmin]
    queryset = Lesson.objects.all()
