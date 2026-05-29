from django.conf import settings
from django.db import models


class Test(models.Model):
    course = models.ForeignKey(
        "marhalas.Course",
        on_delete=models.CASCADE,
        related_name="tests",
        null=True,
        blank=True,
    )
    is_final_exam = models.BooleanField(default=False)
    title = models.CharField(max_length=255)
    time_limit_minutes = models.PositiveIntegerField(default=30)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Test"
        verbose_name_plural = "Tests"

    def __str__(self):
        exam_type = "Final Exam" if self.is_final_exam else "Course Test"
        return f"{exam_type}: {self.title}"


class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"Q{self.order}: {self.text[:50]}"


class AnswerOption(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="options"
    )
    text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.text} ({'correct' if self.is_correct else 'wrong'})"


class TestAttempt(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="test_attempts",
    )
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="attempts")
    score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    passed = models.BooleanField(default=False)
    answers = models.JSONField(default=dict, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "Test Attempts"

    def __str__(self):
        return f"{self.student.name} - {self.test.title} ({self.score}%)"
