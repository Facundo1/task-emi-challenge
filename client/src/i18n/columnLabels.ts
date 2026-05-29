import type { CandidateKey } from "../types/api";
import type { TranslationKey } from "./translations";

export const COLUMN_LABEL: Record<CandidateKey, TranslationKey> = {
  id: "column.id",
  name: "column.name",
  document: "column.document",
  cv_zonajobs: "column.cv_zonajobs",
  cv_bumeran: "column.cv_bumeran",
  phone: "column.phone",
  email: "column.email",
  date: "column.date",
  age: "column.age",
  has_university: "column.has_university",
  career: "column.career",
  graduated: "column.graduated",
  courses_approved: "column.courses_approved",
  location: "column.location",
  accepts_working_hours: "column.accepts_working_hours",
  desired_salary: "column.desired_salary",
  had_interview: "column.had_interview",
  reason: "column.reason",
};
