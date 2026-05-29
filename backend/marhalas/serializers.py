from rest_framework import serializers

from .models import Course, Enrollment, Lesson, LessonProgress, Marhala


class MarhalaSerializer(serializers.ModelSerializer):
    courses_count = serializers.SerializerMethodField()

    class Meta:
        model = Marhala
        fields = [
            "id",
            "title",
            "description",
            "order",
            "passing_threshold",
            "image",
            "is_visible",
            "created_at",
            "courses_count",
        ]

    def get_courses_count(self, obj):
        return obj.courses.count()


class LessonSerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            "id",
            "title",
            "content",
            "order",
            "audio_file",
            "duration_minutes",
            "is_completed",
        ]

    def get_is_completed(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return LessonProgress.objects.filter(
                student=request.user, lesson=obj, is_completed=True
            ).exists()
        return False


class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    lessons_count = serializers.SerializerMethodField()
    is_unlocked = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "order",
            "image",
            "lessons",
            "lessons_count",
            "is_unlocked",
        ]

    def get_lessons_count(self, obj):
        return obj.lessons.count()

    def get_is_unlocked(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        # First course in marhala is always unlocked if enrolled
        if obj.order == 1:
            return True
        # Check if previous course's test is passed
        from assessments.models import TestAttempt

        prev_course = Course.objects.filter(
            marhala=obj.marhala, order=obj.order - 1
        ).first()
        if not prev_course:
            return True
        return TestAttempt.objects.filter(
            student=request.user,
            test__course=prev_course,
            passed=True,
        ).exists()


class EnrollmentSerializer(serializers.ModelSerializer):
    marhala = MarhalaSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ["id", "marhala", "status", "enrolled_at", "completed_at"]


class LessonCompleteSerializer(serializers.Serializer):
    lesson_id = serializers.IntegerField()
