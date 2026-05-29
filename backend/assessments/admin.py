from django.contrib import admin

from .models import AnswerOption, Question, Test, TestAttempt


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "is_final_exam", "time_limit_minutes")
    list_filter = ("is_final_exam",)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("text", "test", "order")


@admin.register(AnswerOption)
class AnswerOptionAdmin(admin.ModelAdmin):
    list_display = ("text", "question", "is_correct")


@admin.register(TestAttempt)
class TestAttemptAdmin(admin.ModelAdmin):
    list_display = ("student", "test", "score", "passed", "completed_at")
    list_filter = ("passed",)
