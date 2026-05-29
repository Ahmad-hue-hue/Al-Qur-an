from rest_framework import generics, permissions

from marhalas.permissions import IsAdmin, IsStudent

from .models import MarhalaResult
from .serializers import MarhalaResultSerializer


class MyResultsView(generics.ListAPIView):
    serializer_class = MarhalaResultSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        return MarhalaResult.objects.filter(student=self.request.user)


class MarhalaResultDetailView(generics.RetrieveAPIView):
    serializer_class = MarhalaResultSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        return MarhalaResult.objects.filter(student=self.request.user)


class AdminStudentResultsView(generics.ListAPIView):
    serializer_class = MarhalaResultSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        student_id = self.kwargs.get("student_id")
        if student_id:
            return MarhalaResult.objects.filter(student_id=student_id)
        return MarhalaResult.objects.all()
