import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CandidatesTable } from "../src/components/CandidatesTable";
import type { ColumnsConfig } from "../src/types/api";
import { makeCandidate } from "./fixtures";

const approved = makeCandidate({ id: "a", name: "Approved One", reason: "" });
const rejected = makeCandidate({
  id: "r",
  name: "Rejected One",
  reason: "Edad fuera de rango",
});

function getColumnKeys(): string[] {
  return Array.from(document.querySelectorAll("th[data-column]")).map(
    (th) => th.getAttribute("data-column") ?? ""
  );
}

describe("CandidatesTable", () => {
  it("renders only the columns marked visible in the columns config", () => {
    const columns: ColumnsConfig = { name: true, email: true, age: false, reason: true };
    render(
      <CandidatesTable
        candidates={[approved]}
        columns={columns}
        pendingId={null}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />
    );
    const keys = getColumnKeys();
    expect(keys).toContain("name");
    expect(keys).toContain("email");
    expect(keys).toContain("reason");
    expect(keys).not.toContain("age");
  });

  it("shows the approved badge when the candidate has an empty reason", () => {
    render(
      <CandidatesTable
        candidates={[approved]}
        columns={{ name: true }}
        pendingId={null}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />
    );
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  it("shows the rejected badge when the candidate has a non-empty reason", () => {
    render(
      <CandidatesTable
        candidates={[rejected]}
        columns={{ name: true }}
        pendingId={null}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />
    );
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });

  it("renders an empty state when there are no candidates", () => {
    render(
      <CandidatesTable
        candidates={[]}
        columns={{ name: true }}
        pendingId={null}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />
    );
    expect(screen.getByText(/no candidates match/i)).toBeInTheDocument();
  });

  it("renders the candidate row data for the visible columns only", () => {
    render(
      <CandidatesTable
        candidates={[approved]}
        columns={{ name: true, email: false }}
        pendingId={null}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />
    );
    expect(screen.getByText("Approved One")).toBeInTheDocument();
    expect(screen.queryByText("fixture@example.com")).not.toBeInTheDocument();
  });

  it("preserves the order of columns from the config object", () => {
    const columns: ColumnsConfig = { email: true, name: true, age: true };
    render(
      <CandidatesTable
        candidates={[approved]}
        columns={columns}
        pendingId={null}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />
    );
    expect(getColumnKeys()).toEqual(["status", "email", "name", "age", "actions"]);
  });
});
