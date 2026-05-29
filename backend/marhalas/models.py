from django.conf import settings
from django.db import models


class Marhala(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(unique=True)
    passing_threshold = models.DecimalField(
        max_digits=5, decimal_places=2, default=60.0
    )
    image = models.ImageField(upload_to="marhalas/", blank=True, null=True)
    is_visible = models.BooleanField(
        default=False,
        help_text="Controls whether this marhala appears in public listings",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"Marhala {self.order}: {self.title}"


class Course(models.Model):
    marhala = models.ForeignKey(
        Marhala, on_delete=models.CASCADE, related_name="courses"
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField()
    image = models.ImageField(upload_to="courses/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order"]
        unique_together = ["marhala", "order"]

    def __str__(self):
        return f"{self.marhala.title} - Course {self.order}: {self.title}"


class Lesson(models.Model):
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="lessons"
    )
    title = models.CharField(max_length=255)
    content = models.TextField(help_text="HTML/richtext content")
    order = models.PositiveIntegerField()
    audio_file = models.FileField(upload_to="lessons/audio/", blank=True, null=True)
    duration_minutes = models.PositiveIntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order"]
        unique_together = ["course", "order"]

    def __str__(self):
        return f"{self.course.title} - Lesson {self.order}: {self.title}"


class Enrollment(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )
    marhala = models.ForeignKey(Marhala, on_delete=models.CASCADE, related_name="enrollments")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ["student", "marhala"]

    def __str__(self):
        return f"{self.student.name} - {self.marhala.title} ({self.status})"


class LessonProgress(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="lesson_progress",
    )
    lesson = models.ForeignKey(
        Lesson, on_delete=models.CASCADE, related_name="progress"
    )
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ["student", "lesson"]

    def __str__(self):
        return f"{self.student.name} - {self.lesson.title} ({'done' if self.is_completed else 'pending'})"
