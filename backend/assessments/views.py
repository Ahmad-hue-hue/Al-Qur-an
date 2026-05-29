from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from marhalas.models import Course, Marhala
from marhalas.permissions import IsAdmin, IsStudent

from .grading import check_and_update_marhala_result, grade_test
from .models import Test, TestAttempt
from .serializers import (
    AdminTestCreateSerializer,
    TestAttemptSerializer,
    TestSerializer,
    TestSubmitSerializer,
)


class CourseTestView(generics.RetrieveAPIView):
    """Get the test for a course."""
    serializer_class = TestSerializer
    permission_classes = [IsStudent]

    def get_object(self):
        course_id = self.kwargs["course_id"]
        test = Test.objects.filter(course_id=course_id, is_final_exam=False).first()
        if not test:
            return None
        return test

    def retrieve(self, request, *args, **kwargs):
        test = self.get_object()
        if test is None:
            return Response(
                {"error": "No test found for this course"},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(test)
        return Response(serializer.data)


class TestSubmitView(APIView):
    """Submit MCQ answers for a test."""
    permission_classes = [IsStudent]

    def post(self, request, test_id):
        try:
            test = Test.objects.get(id=test_id)
        except Test.DoesNotExist:
            return Response(
                {"error": "Test not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = TestSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        answers = serializer.validated_data["answers"]
        score, passed = grade_test(request.user, test, answers)

        # Determine pass/fail based on marhala threshold
        if test.course:
            marhala = test.course.marhala
            passed = score >= marhala.passing_threshold
        elif test.is_final_exam:
            # Final exam — find the marhala
            from marhalas.models import Course
            course = Course.objects.filter(marhala__tests=test).first()
            if course:
                passed = score >= course.marhala.passing_threshold

        attempt = TestAttempt.objects.create(
            student=request.user,
            test=test,
            score=score,
            passed=passed,
            answers=answers,
            completed_at=timezone.now(),
        )

        # Generate registration number on first test submission
        if not request.user.registration_number:
            request.user.generate_registration_number()

        # Check marhala completion if course test
        if test.course and not test.is_final_exam:
            check_and_update_marhala_result(request.user, test.course.marhala)

        return Response(
            TestAttemptSerializer(attempt).data,
            status=status.HTTP_201_CREATED,
        )


class FinalExamView(generics.RetrieveAPIView):
    """Get the final exam for a marhala."""
    serializer_class = TestSerializer
    permission_classes = [IsStudent]

    def get_object(self):
        marhala_id = self.kwargs["marhala_id"]
        test = Test.objects.filter(
            course__marhala_id=marhala_id, is_final_exam=True
        ).first()
        return test

    def retrieve(self, request, *args, **kwargs):
        test = self.get_object()
        if test is None:
            return Response(
                {"error": "No final exam found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(test)
        return Response(serializer.data)


class FinalExamSubmitView(APIView):
    """Submit final exam answers."""
    permission_classes = [IsStudent]

    def post(self, request, marhala_id):
        test = Test.objects.filter(
            course__marhala_id=marhala_id, is_final_exam=True
        ).first()

        if not test:
            return Response(
                {"error": "No final exam found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = TestSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        answers = serializer.validated_data["answers"]
        score, passed = grade_test(request.user, test, answers)

        marhala = Marhala.objects.get(id=marhala_id)
        passed = score >= marhala.passing_threshold

        attempt = TestAttempt.objects.create(
            student=request.user,
            test=test,
            score=score,
            passed=passed,
            answers=answers,
            completed_at=timezone.now(),
        )

        # Generate registration number on first test
        if not request.user.registration_number:
            request.user.generate_registration_number()

        # Check marhala completion
        check_and_update_marhala_result(request.user, marhala)

        return Response(
            TestAttemptSerializer(attempt).data,
            status=status.HTTP_201_CREATED,
        )


# Admin endpoints
class AdminTestListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAdmin]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return AdminTestCreateSerializer
        return TestSerializer

    def get_queryset(self):
        course_id = self.kwargs.get("course_id")
        if course_id:
            return Test.objects.filter(course_id=course_id)
        return Test.objects.all()


class AdminTestDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TestSerializer
    permission_classes = [IsAdmin]
    queryset = Test.objects.all()


class AdminStudentListView(generics.ListAPIView):
    """List all students with their progress."""
    permission_classes = [IsAdmin]

    def get_queryset(self):
        from accounts.models import User
        return User.objects.filter(role="student")

    def list(self, request, *args, **kwargs):
        from accounts.serializers import UserSerializer
        students = self.get_queryset()
        serializer = UserSerializer(students, many=True)
        return Response(serializer.data)
