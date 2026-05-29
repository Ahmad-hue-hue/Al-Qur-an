# Al-Qur'an Learning Platform — Architecture Plan

## Overview

A comprehensive Quran learning platform where students progress through structured Marhalas (levels), complete courses, take tests, and earn results. Admin-managed content with sequential unlocking and progressive learning.

## Core Rules

| Rule | Value |
|------|-------|
| **Marhala 1 pass** | ≥ 50% average |
| **Marhalas 2-4 pass** | ≥ 60% average |
| **Average includes** | All course tests + Final Exam (weighted equally) |
| **Retake on fail** | Full retake — lessons + tests reset |
| **Attempts** | Unlimited |
| **Public access** | Marhala 1 visible but content locked (login CTA); Marhalas 2-4 hidden |
| **Roles** | Admin + Student |
| **Payment** | Free |
| **Registration number** | Auto-generated on first test submission, displayed on dashboard + results + certificate |

## Tech Stack

| Layer | Technology | Package Manager |
|-------|-----------|----------------|
| **Frontend** | Next.js + TypeScript + Tailwind CSS v4 + shadcn/ui | bun |
| **Backend** | Django + Django REST Framework | uv |
| **Auth** | Django SimpleJWT (register, login, refresh) | — |
| **Database** | PostgreSQL (via Django ORM) | — |
| **Audio** | MP3 uploaded by admin, stored via Django FileField | — |
| **i18n** | next-intl (Arabic + English + more) | — |
| **Design** | Stripe-inspired — clean, minimal, functional | — |

## Project Structure

```
Al-Qur-an/
├── PLAN.md                          # This file
├── backend/                         # Django REST API
│   ├── config/                      # Django project settings
│   │   ├── settings.py              # DRF, CORS, JWT, PostgreSQL
│   │   ├── urls.py                  # Root URL routing
│   │   └── wsgi.py
│   ├── accounts/                    # Custom User model
│   │   ├── models.py                # User: email, name, role, language, registration_number
│   │   ├── serializers.py           # Register, Login, Profile serializers
│   │   ├── views.py                 # Register, Login, Token, Profile endpoints
│   │   ├── urls.py
│   │   └── signals.py               # Generate registration_number on first test
│   ├── marhalas/                    # Core learning structure
│   │   ├── models.py                # Marhala, Course, Lesson, Enrollment, LessonProgress
│   │   ├── serializers.py
│   │   ├── views.py                 # CRUD + progression logic
│   │   ├── urls.py
│   │   ├── permissions.py           # IsAdmin, IsEnrolled, PrerequisitesMet
│   │   └── progression.py           # Unlock logic, prerequisite checking
│   ├── assessments/                 # Testing system
│   │   ├── models.py                # Test, Question, AnswerOption, TestAttempt
│   │   ├── serializers.py
│   │   ├── views.py                 # Test fetch, MCQ submit, auto-grade
│   │   └── grading.py               # Score calculation, average computation
│   ├── results/                     # Results and reporting
│   │   ├── models.py                # MarhalaResult
│   │   ├── serializers.py
│   │   └── views.py                 # Student results, admin results
│   ├── manage.py
│   └── pyproject.toml               # uv dependencies
│
└── frontend/                        # Next.js Application
    ├── app/
    │   ├── globals.css              # Tailwind v4 @theme + @custom-variant dark
    │   ├── layout.tsx               # Root layout: Navbar, Footer, i18n, AuthProvider
    │   ├── page.tsx                 # Stripe-inspired landing page
    │   ├── (marketing)/
    │   │   └── marhalas/[id]/page.tsx
    │   ├── (auth)/
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   ├── (dashboard)/
    │   │   ├── dashboard/page.tsx
    │   │   ├── marhalas/page.tsx
    │   │   ├── marhalas/[id]/page.tsx
    │   │   ├── courses/[id]/page.tsx
    │   │   ├── lessons/[id]/page.tsx
    │   │   ├── tests/[id]/page.tsx
    │   │   └── results/[id]/page.tsx
    │   └── admin/
    │       ├── layout.tsx
    │       ├── dashboard/page.tsx
    │       ├── marhalas/page.tsx
    │       ├── courses/[id]/lessons/page.tsx
    │       ├── tests/[id]/edit/page.tsx
    │       └── students/[id]/page.tsx
    ├── components/
    │   ├── ui/                      # shadcn components
    │   ├── layout/                  # Navbar, Sidebar, Footer
    │   ├── courses/                 # MarhalaCard, CourseCard, LessonList
    │   ├── tests/                   # MCQPlayer, TestTimer, QuestionCard
    │   ├── audio/                   # AudioPlayer
    │   └── admin/                   # DataTable, StatsCard
    ├── hooks/
    │   ├── useAuth.ts
    │   ├── useCourses.ts
    │   └── useAudio.ts
    ├── lib/
    │   ├── api.ts                   # Axios instance + interceptors
    │   ├── utils.ts                 # cn() utility
    │   └── i18n.ts                  # next-intl config
    ├── messages/                    # en.json, ar.json
    ├── middleware.ts
    ├── package.json
    └── bun.lockb
```

## Backend Models

### accounts.User
- `email` — unique, used for login
- `name` — full name
- `role` — choices: admin, student
- `language_pref` — default: 'en'
- `registration_number` — nullable, auto-generated on first test submission

### marhalas.Marhala
- `title` — e.g., "Marhala 1"
- `description` — text
- `order` — integer 1-4, unique
- `passing_threshold` — decimal (50 for Marhala 1, 60 for others)
- `image` — optional cover image
- `is_visible` — controls public preview (Marhala 1 = true)
- `created_at` — timestamp

### marhalas.Course
- `marhala` — FK to Marhala
- `title` — course name
- `description` — text
- `order` — integer, ordering within marhala
- `image` — optional cover image

### marhalas.Lesson
- `course` — FK to Course
- `title` — lesson name
- `content` — HTML/richtext body
- `order` — integer, ordering within course
- `audio_file` — FileField for admin-uploaded MP3
- `duration_minutes` — estimated reading time

### marhalas.Enrollment
- `student` — FK to User
- `marhala` — FK to Marhala
- `status` — choices: active, completed, failed
- `enrolled_at` — timestamp
- `completed_at` — nullable timestamp

### marhalas.LessonProgress
- `student` — FK to User
- `lesson` — FK to Lesson
- `is_completed` — boolean
- `completed_at` — nullable timestamp

### assessments.Test
- `course` — FK to Course (null for final exam)
- `is_final_exam` — boolean
- `title` — test name
- `time_limit_minutes` — integer
- `created_at` — timestamp

### assessments.Question
- `test` — FK to Test
- `text` — question text
- `order` — integer

### assessments.AnswerOption
- `question` — FK to Question
- `text` — answer option text
- `is_correct` — boolean
- `order` — integer

### assessments.TestAttempt
- `student` — FK to User
- `test` — FK to Test
- `score` — decimal
- `passed` — boolean
- `answers` — JSON (stores selected options)
- `started_at` — timestamp
- `completed_at` — timestamp

### results.MarhalaResult
- `student` — FK to User
- `marhala` — FK to Marhala
- `average_score` — decimal (avg of all course tests + final exam)
- `passed` — boolean
- `attempt_number` — integer (increments on retake)
- `created_at` — timestamp

## API Endpoints

### Public (no auth)
```
GET  /api/marhalas/                  # List visible marhalas
GET  /api/marhalas/:id/              # Marhala detail
```

### Auth
```
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/token/refresh/
GET  /api/auth/me/
```

### Student (authenticated)
```
GET  /api/my/marhalas/               # Enrolled marhalas + progress
POST /api/marhalas/:id/enroll/       # Enroll (prereq check)
GET  /api/marhalas/:id/courses/      # Courses with unlock status
GET  /api/courses/:id/               # Course detail + lessons
GET  /api/lessons/:id/               # Lesson content + audio
POST /api/lessons/:id/complete/      # Mark lesson complete
GET  /api/courses/:id/test/          # Get test questions
POST /api/tests/:id/submit/          # Submit MCQ answers
GET  /api/marhalas/:id/final-exam/   # Get final exam
POST /api/marhalas/:id/final-exam/submit/
GET  /api/my/results/                # All marhala results
GET  /api/my/results/:marhala_id/    # Detailed result
```

### Admin
```
GET    /api/admin/marhalas/
POST   /api/admin/marhalas/
PUT    /api/admin/marhalas/:id/
DELETE /api/admin/marhalas/:id/
GET    /api/admin/marhalas/:id/courses/
POST   /api/admin/courses/
PUT    /api/admin/courses/:id/
DELETE /api/admin/courses/:id/
GET    /api/admin/courses/:id/lessons/
POST   /api/admin/lessons/
PUT    /api/admin/lessons/:id/
DELETE /api/admin/lessons/:id/
GET    /api/admin/tests/
POST   /api/admin/tests/
PUT    /api/admin/tests/:id/
DELETE /api/admin/tests/:id/
GET    /api/admin/students/
GET    /api/admin/students/:id/progress/
POST   /api/admin/students/:id/reset-marhala/
```

## Progression Logic

```
Enroll → Check prerequisite (prev marhala passed)
         Create Enrollment
         → Course 1 → Lesson 1 auto-unlocked

Complete lesson → Unlock next lesson in same course

All lessons done → Unlock that course's test

Pass course test → Unlock next course

All courses + Final Exam done → Calculate average:
    avg = (sum of all test scores + final exam) / (num tests + 1)
    If avg ≥ marhala.passing_threshold:
        → MarhalaResult.passed = True
        → Next marhala unlocks
    Else:
        → MarhalaResult.passed = False
        → Reset all LessonProgress + TestAttempt for marhala
        → Student repeats everything (unlimited)
```

## Frontend Pages

| Route | Page | Access |
|-------|------|--------|
| `/` | Landing page | Public |
| `/marhalas` | Marhala listing (Marhala 1 only) | Public |
| `/marhalas/:id` | Marhala detail (locked preview) | Public |
| `/login` | Login | Guest |
| `/register` | Register | Guest |
| `/dashboard` | Student overview + registration number | Student |
| `/marhalas` | My marhalas with progress | Student |
| `/marhalas/:id` | Courses in marhala (lock/unlock) | Student |
| `/courses/:id` | Lessons list | Student |
| `/lessons/:id` | Lesson reader + audio | Student |
| `/tests/:id` | MCQ test player | Student |
| `/results` | All results | Student |
| `/results/:marhalaId` | Detailed breakdown | Student |
| `/admin` | Admin overview | Admin |
| `/admin/marhalas` | Manage marhalas | Admin |
| `/admin/courses/:id/lessons` | Manage lessons | Admin |
| `/admin/tests/:id/edit` | Build tests | Admin |
| `/admin/students/:id` | Student progress | Admin |

## Implementation Phases

| # | Phase | Details |
|---|-------|---------|
| 1 | Django project setup | Project, apps, User model, DRF, JWT, CORS, PostgreSQL, uv |
| 2 | Marhala/Course/Lesson models + API | CRUD, permissions, admin endpoints |
| 3 | Enrollment + progression | Enroll, unlock logic, prerequisites, LessonProgress |
| 4 | Assessment system | Test, Question, Answer, auto-grading, average calc, MarhalaResult |
| 5 | Next.js setup | Tailwind v4, shadcn/ui, bun, React Query, i18n, Axios |
| 6 | Auth pages | Login, Register, JWT, protected routes |
| 7 | Marketing pages | Landing, public marhala preview, login CTA |
| 8 | Student dashboard | My marhalas, progress, registration number |
| 9 | Lesson viewer | Rich text, audio player, complete button, sequential unlock |
| 10 | MCQ test player | Questions, timer, submit, instant score |
| 11 | Results system | Averages, pass/fail, retake flow |
| 12 | Admin panel | Full CRUD, test builder, student progress |
| 13 | Audio upload | Admin upload, storage, player integration |
| 14 | i18n + RTL | Arabic/English, RTL layout |
| 15 | Polish + Deploy | Stripe-inspired refinement, Docker, production config |
