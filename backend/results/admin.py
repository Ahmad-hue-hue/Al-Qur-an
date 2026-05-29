from django.contrib import admin

from .models import MarhalaResult


@admin.register(MarhalaResult)
class MarhalaResultAdmin(admin.ModelAdmin):
    list_display = ("student", "marhala", "average_score", "passed", "attempt_number")
    list_filter = ("passed",)
