from django.contrib import admin

from .models import Course, Enrollment, Lesson, LessonProgress, Marhala


@admin.register(Marhala)
class MarhalaAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "passing_threshold", "is_visible")
    list_filter = ("is_visible",)
    ordering = ("order",)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "marhala", "order")
    list_filter = ("marhala",)


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "order", "duration_minutes")
    list_filter = ("course",)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("student", "marhala", "status", "enrolled_at")
    list_filter = ("status",)


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ("student", "lesson", "is_completed", "completed_at")
    list_filter = ("is_completed",)
