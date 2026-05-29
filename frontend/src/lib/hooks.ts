"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "./api"

// Auth
export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me/")
      return data
    },
  })
}

// Marhalas
export function useMarhalas() {
  return useQuery({
    queryKey: ["marhalas"],
    queryFn: async () => {
      const { data } = await api.get("/marhalas/")
      return data
    },
  })
}

export function useMarhala(id: number | string) {
  return useQuery({
    queryKey: ["marhala", id],
    queryFn: async () => {
      const { data } = await api.get(`/marhalas/${id}/`)
      return data
    },
    enabled: !!id,
  })
}

export function useMyMarhalas() {
  return useQuery({
    queryKey: ["my-marhalas"],
    queryFn: async () => {
      const { data } = await api.get("/my/marhalas/")
      return data
    },
  })
}

export function useMarhalaCourses(marhalaId: number | string) {
  return useQuery({
    queryKey: ["marhala-courses", marhalaId],
    queryFn: async () => {
      const { data } = await api.get(`/marhalas/${marhalaId}/courses/`)
      return data
    },
    enabled: !!marhalaId,
  })
}

export function useEnroll() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (marhalaId: number) => {
      const { data } = await api.post(`/marhalas/${marhalaId}/enroll/`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-marhalas"] })
    },
  })
}

// Courses
export function useCourse(id: number | string) {
  return useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data } = await api.get(`/courses/${id}/`)
      return data
    },
    enabled: !!id,
  })
}

// Lessons
export function useLesson(id: number | string) {
  return useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const { data } = await api.get(`/lessons/${id}/`)
      return data
    },
    enabled: !!id,
  })
}

export function useCompleteLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (lessonId: number) => {
      const { data } = await api.post(`/lessons/${lessonId}/complete/`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] })
      queryClient.invalidateQueries({ queryKey: ["lesson"] })
    },
  })
}

// Tests
export function useCourseTest(courseId: number | string) {
  return useQuery({
    queryKey: ["course-test", courseId],
    queryFn: async () => {
      const { data } = await api.get(`/courses/${courseId}/test/`)
      return data
    },
    enabled: !!courseId,
  })
}

export function useSubmitTest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ testId, answers }: { testId: number; answers: Record<number, number> }) => {
      const { data } = await api.post(`/tests/${testId}/submit/`, { answers })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-results"] })
    },
  })
}

// Final Exam
export function useFinalExam(marhalaId: number | string) {
  return useQuery({
    queryKey: ["final-exam", marhalaId],
    queryFn: async () => {
      const { data } = await api.get(`/marhalas/${marhalaId}/final-exam/`)
      return data
    },
    enabled: !!marhalaId,
  })
}

export function useSubmitFinalExam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ marhalaId, answers }: { marhalaId: number; answers: Record<number, number> }) => {
      const { data } = await api.post(`/marhalas/${marhalaId}/final-exam/submit/`, { answers })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-results"] })
    },
  })
}

// Results
export function useMyResults() {
  return useQuery({
    queryKey: ["my-results"],
    queryFn: async () => {
      const { data } = await api.get("/my/results/")
      return data
    },
  })
}

export function useResultDetail(id: number | string) {
  return useQuery({
    queryKey: ["result", id],
    queryFn: async () => {
      const { data } = await api.get(`/my/results/${id}/`)
      return data
    },
    enabled: !!id,
  })
}

// Admin
export function useAdminMarhalas() {
  return useQuery({
    queryKey: ["admin-marhalas"],
    queryFn: async () => {
      const { data } = await api.get("/admin/marhalas/")
      return data
    },
  })
}

export function useAdminStudents() {
  return useQuery({
    queryKey: ["admin-students"],
    queryFn: async () => {
      const { data } = await api.get("/admin/students/")
      return data
    },
  })
}

export function useAdminStudentResults(studentId: number | string) {
  return useQuery({
    queryKey: ["admin-student-results", studentId],
    queryFn: async () => {
      const { data } = await api.get(`/admin/students/${studentId}/results/`)
      return data
    },
    enabled: !!studentId,
  })
}
