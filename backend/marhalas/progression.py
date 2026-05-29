from django.utils import timezone

from assessments.models import TestAttempt
from .models import Course, Enrollment, Lesson, LessonProgress, Marhala


def can_enroll(student, marhala):
    """Check if student can enroll in a marhala (prerequisites met)."""
    if marhala.order == 1:
        return True

    prev_marhala = Marhala.objects.filter(order=marhala.order - 1).first()
    if not prev_marhala:
        return True

    return TestAttempt.objects.filter(
        student=student,
        test__course__marhala=prev_marhala,
        passed=True,
    ).exists() and Enrollment.objects.filter(
        student=student, marhala=prev_marhala, status="completed"
    ).exists()


def enroll_student(student, marhala):
    """Enroll a student in a marhala if prerequisites are met."""
    if not can_enroll(student, marhala):
        raise PermissionError("Complete previous marhala first")

    enrollment, created = Enrollment.objects.get_or_create(
        student=student, marhala=marhala, defaults={"status": "active"}
    )
    return enrollment


def complete_lesson(student, lesson):
    """Mark a lesson as complete and return the next lesson if available."""
    progress, _ = LessonProgress.objects.update_or_create(
        student=student,
        lesson=lesson,
        defaults={"is_completed": True, "completed_at": timezone.now()},
    )

    # Check if there's a next lesson in the course
    next_lesson = Lesson.objects.filter(
        course=lesson.course, order__gt=lesson.order
    ).order_by("order").first()

    return progress, next_lesson


def is_course_complete(student, course):
    """Check if all lessons in a course are completed by the student."""
    total_lessons = course.lessons.count()
    completed_lessons = LessonProgress.objects.filter(
        student=student, lesson__course=course, is_completed=True
    ).count()
    return completed_lessons == total_lessons


def check_marhala_completion(student, marhala):
    """Check if student has completed all courses and exams in a marhala."""
    courses = Course.objects.filter(marhala=marhala)

    for course in courses:
        # Check all lessons completed
        if not is_course_complete(student, course):
            return False

        # Check course test passed
        if not TestAttempt.objects.filter(
            student=student, test__course=course, passed=True
        ).exists():
            return False

    # Check final exam passed
    if not TestAttempt.objects.filter(
        student=student, test__course__marhala=marhala, test__is_final_exam=True, passed=True
    ).exists():
        return False

    return True


def calculate_marhala_average(student, marhala):
    """Calculate the average score across all course tests + final exam."""
    from assessments.models import Test

    tests = Test.objects.filter(course__marhala=marhala)
    total_score = 0
    count = 0

    for test in tests:
        attempt = TestAttempt.objects.filter(
            student=student, test=test
        ).order_by("-completed_at").first()

        if attempt:
            total_score += float(attempt.score)
            count += 1

    if count == 0:
        return 0

    return total_score / count


def reset_marhala_progress(student, marhala):
    """Reset all progress for a marhala (for retakes)."""
    courses = Course.objects.filter(marhala=marhala)

    for course in courses:
        LessonProgress.objects.filter(
            student=student, lesson__course=course
        ).delete()
        TestAttempt.objects.filter(
            student=student, test__course=course
        ).delete()

    # Delete enrollment to allow fresh start
    Enrollment.objects.filter(student=student, marhala=marhala).delete()
