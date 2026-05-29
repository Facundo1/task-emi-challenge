import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ActionButtons } from "../src/components/ActionButtons";
import { makeCandidate } from "./fixtures";

const rejected = makeCandidate({ id: "r", name: "Test User", reason: "Edad fuera de rango" });
const approved = makeCandidate({ id: "a", name: "Test User", reason: "" });

describe("ActionButtons", () => {
  it("calls onApprove when the approve button is clicked", async () => {
    const user = userEvent.setup();
    const onApprove = vi.fn();
    render(
      <ActionButtons
        candidate={rejected}
        onApprove={onApprove}
        onReject={vi.fn()}
        isPending={false}
      />
    );
    await user.click(screen.getByRole("button", { name: /approve/i }));
    expect(onApprove).toHaveBeenCalledOnce();
  });

  it("calls onReject when the reject button is clicked", async () => {
    const user = userEvent.setup();
    const onReject = vi.fn();
    render(
      <ActionButtons
        candidate={rejected}
        onApprove={vi.fn()}
        onReject={onReject}
        isPending={false}
      />
    );
    await user.click(screen.getByRole("button", { name: /reject/i }));
    expect(onReject).toHaveBeenCalledOnce();
  });

  it("disables the approve button when the candidate is already approved", () => {
    render(
      <ActionButtons
        candidate={approved}
        onApprove={vi.fn()}
        onReject={vi.fn()}
        isPending={false}
      />
    );
    expect(screen.getByRole("button", { name: /approve/i })).toBeDisabled();
  });

  it("keeps the reject button enabled for an approved candidate", () => {
    render(
      <ActionButtons
        candidate={approved}
        onApprove={vi.fn()}
        onReject={vi.fn()}
        isPending={false}
      />
    );
    expect(screen.getByRole("button", { name: /reject/i })).not.toBeDisabled();
  });

  it("disables both buttons when an action is pending", () => {
    render(
      <ActionButtons
        candidate={rejected}
        onApprove={vi.fn()}
        onReject={vi.fn()}
        isPending
      />
    );
    expect(screen.getByRole("button", { name: /approve/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /reject/i })).toBeDisabled();
  });
});
