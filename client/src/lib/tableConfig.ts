import type { CandidateKey } from "../types/api";

export const MONO_KEYS: ReadonlySet<CandidateKey> = new Set<CandidateKey>([
  "document",
  "phone",
  "age",
  "date",
  "desired_salary",
  "courses_approved",
]);

export const YESNO_KEYS: ReadonlySet<CandidateKey> = new Set<CandidateKey>([
  "has_university",
  "accepts_working_hours",
  "had_interview",
]);

export const COLUMN_WIDTH: Partial<Record<CandidateKey, string>> = {
  reason: "min-w-[260px] w-[260px]",
  age: "min-w-[48px] w-[48px]",
  courses_approved: "min-w-[80px] w-[80px]",
  has_university: "min-w-[72px] w-[72px]",
  accepts_working_hours: "min-w-[72px] w-[72px]",
  had_interview: "min-w-[72px] w-[72px]",
  cv_zonajobs: "min-w-[80px] w-[80px]",
  cv_bumeran: "min-w-[80px] w-[80px]",
  date: "min-w-[96px] w-[96px]",
  desired_salary: "min-w-[96px] w-[96px]",
  document: "min-w-[96px] w-[96px]",
  phone: "min-w-[110px] w-[110px]",
};
