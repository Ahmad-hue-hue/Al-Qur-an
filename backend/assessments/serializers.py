from rest_framework import serializers

from .models import AnswerOption, Question, Test, TestAttempt


class AnswerOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerOption
        fields = ["id", "text", "order"]


class QuestionSerializer(serializers.ModelSerializer):
    options = AnswerOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ["id", "text", "order", "options"]


class TestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Test
        fields = ["id", "title", "is_final_exam", "time_limit_minutes", "questions"]


class TestSubmitSerializer(serializers.Serializer):
    answers = serializers.DictField(
        child=serializers.IntegerField(),
        help_text="Map of question_id to selected_answer_option_id",
    )


class TestAttemptSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source="test.title", read_only=True)

    class Meta:
        model = TestAttempt
        fields = [
            "id",
            "test",
            "test_title",
            "score",
            "passed",
            "answers",
            "started_at",
            "completed_at",
        ]


class AdminQuestionCreateSerializer(serializers.ModelSerializer):
    options = AnswerOptionSerializer(many=True)

    class Meta:
        model = Question
        fields = ["id", "text", "order", "options"]

    def create(self, validated_data):
        options_data = validated_data.pop("options")
        question = Question.objects.create(**validated_data)
        for option_data in options_data:
            AnswerOption.objects.create(question=question, **option_data)
        return question


class AdminTestCreateSerializer(serializers.ModelSerializer):
    questions = AdminQuestionCreateSerializer(many=True, required=False)

    class Meta:
        model = Test
        fields = ["id", "title", "course", "is_final_exam", "time_limit_minutes", "questions"]

    def create(self, validated_data):
        questions_data = validated_data.pop("questions", [])
        test = Test.objects.create(**validated_data)
        for question_data in questions_data:
            options_data = question_data.pop("options", [])
            question = Question.objects.create(test=test, **question_data)
            for option_data in options_data:
                AnswerOption.objects.create(question=question, **option_data)
        return test
