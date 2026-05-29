import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import UserManager


class User(AbstractUser):
    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("student", "Student"),
    ]

    username = None
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")
    language_pref = models.CharField(max_length=10, default="en")
    registration_number = models.CharField(
        max_length=50, unique=True, null=True, blank=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    objects = UserManager()

    def __str__(self):
        return f"{self.name} ({self.email})"

    def generate_registration_number(self):
        """Generate unique registration number. Called on first test submission."""
        if self.registration_number:
            return self.registration_number
        year = self.date_joined.year if self.date_joined else 2026
        unique_id = uuid.uuid4().hex[:6].upper()
        self.registration_number = f"AQ-{year}-{unique_id}"
        self.save(update_fields=["registration_number"])
        return self.registration_number
