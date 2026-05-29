from decimal import Decimal

from assessments.models import AnswerOption, Test, TestAttempt
from marhalas.models import Enrollment, Marhala


def grade_test(student, test, answers):
    """Grade a test submission and return score and pass status."""
    questions = test.questions.all()
    total_questions = questions.count()

    if total_questions == 0:
        return Decimal("0"), False

    correct_count = 0
    for question in questions:
        selected_option_id = answers.get(str(question.id))
        if selected_option_id:
            try:
                option = AnswerOption.objects.get(
                    id=selected_option_id, question=question
                )
                if option.is_correct:
                    correct_count += 1
            except AnswerOption.DoesNotExist:
                continue

    score = (Decimal(str(correct_count)) / Decimal(str(total_questions))) * Decimal("100")
    passed = score >= Decimal("50")  # Default, overridden by marhala threshold

    return score, passed


def calculate_marhala_average(student, marhala):
    """Calculate the average score across all course tests + final exam."""
    tests = Test.objects.filter(course__marhala=marhala)
    total_score = Decimal("0")
    count = 0

    for test in tests:
        attempt = TestAttempt.objects.filter(
            student=student, test=test
        ).order_by("-completed_at").first()

        if attempt:
            total_score += attempt.score
            count += 1

    if count == 0:
        return Decimal("0")

    return total_score / Decimal(str(count))


def check_and_update_marhala_result(student, marhala):
    """Check if marhala is completed and update result."""
    from results.models import MarhalaResult

    average = calculate_marhala_average(student, marhala)
    passed = average >= marhala.passing_threshold

    result, created = MarhalaResult.objects.get_or_create(
        student=student,
        marhala=marhala,
        defaults={
            "average_score": average,
            "passed": passed,
            "attempt_number": 1,
        },
    )

    if not created:
        result.average_score = average
        result.passed = passed
        result.attempt_number += 1
        result.save()

    # Update enrollment status
    if passed:
        Enrollment.objects.filter(
            student=student, marhala=marhala, status="active"
        ).update(status="completed", completed_at=result.created_at)

    return result
