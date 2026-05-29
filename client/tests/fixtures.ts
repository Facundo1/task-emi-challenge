import type { Candidate } from "../src/types/api";

export function makeCandidate(overrides: Partial<Candidate> = {}): Candidate {
  return {
    id: "fixture-id",
    name: "Fixture Name",
    document: 99999,
    cv_zonajobs: "",
    cv_bumeran: "",
    phone: "(000) 000-0000",
    email: "fixture@example.com",
    date: "2020-01-01 00:00:00",
    age: 30,
    has_university: "Si",
    career: "Adm. de empresas",
    graduated: "Ya me recibí",
    courses_approved: "",
    location: "CABA, Argentina",
    accepts_working_hours: "Si",
    desired_salary: "15000",
    had_interview: "No",
    reason: "",
    ...overrides,
  };
}
