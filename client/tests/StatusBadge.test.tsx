import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatusBadge } from "../src/components/StatusBadge";
import { makeCandidate } from "./fixtures";

describe("StatusBadge", () => {
  it("shows Approved when the candidate has an empty reason", () => {
    render(<StatusBadge candidate={makeCandidate({ reason: "" })} />);
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  it("shows Rejected when the candidate has any non-empty reason", () => {
    render(<StatusBadge candidate={makeCandidate({ reason: "Edad fuera de rango" })} />);
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });

  it("exposes data-status=approved for an empty reason", () => {
    render(<StatusBadge candidate={makeCandidate({ reason: "" })} />);
    expect(screen.getByText("Approved")).toHaveAttribute("data-status", "approved");
  });

  it("exposes data-status=rejected for a non-empty reason", () => {
    render(<StatusBadge candidate={makeCandidate({ reason: "Edad fuera de rango" })} />);
    expect(screen.getByText("Rejected")).toHaveAttribute("data-status", "rejected");
  });
});
