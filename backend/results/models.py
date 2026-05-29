from django.conf import settings
from django.db import models


class MarhalaResult(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="marhala_results",
    )
    marhala = models.ForeignKey(
        "marhalas.Marhala", on_delete=models.CASCADE, related_name="results"
    )
    average_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    passed = models.BooleanField(default=False)
    attempt_number = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["student", "marhala"]
        verbose_name_plural = "Marhala Results"

    def __str__(self):
        status = "Passed" if self.passed else "Failed"
        return f"{self.student.name} - {self.marhala.title}: {self.average_score}% ({status})"
