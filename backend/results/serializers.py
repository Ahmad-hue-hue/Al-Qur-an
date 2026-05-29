from rest_framework import serializers

from .models import MarhalaResult


class MarhalaResultSerializer(serializers.ModelSerializer):
    marhala_title = serializers.CharField(source="marhala.title", read_only=True)

    class Meta:
        model = MarhalaResult
        fields = [
            "id",
            "marhala",
            "marhala_title",
            "average_score",
            "passed",
            "attempt_number",
            "created_at",
        ]
