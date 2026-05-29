import { render, screen, waitFor, type RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { ReactElement } from "react";
import { RejectModal } from "../src/components/RejectModal";
import { I18nProvider } from "../src/i18n/I18nProvider";

const SAMPLE_REASONS = [
  "Cantidad de materias aprobadas fuera de lo deseado",
  "Edad fuera de rango",
  "No es universitario",
  "Salario pretendido fuera de rango",
];

function renderWithI18n(ui: ReactElement): RenderResult {
  return render(<I18nProvider initialLocale="es">{ui}</I18nProvider>);
}

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.endsWith("/api/reasons")) {
        return new Response(JSON.stringify(SAMPLE_REASONS), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response("Not found", { status: 404 });
    })
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("RejectModal", () => {
  it("fetches and displays the available reasons", async () => {
    renderWithI18n(
      <RejectModal
        candidateName="John Smith"
        initialReason=""
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    for (const reason of SAMPLE_REASONS) {
      await waitFor(() => expect(screen.getByLabelText(reason)).toBeInTheDocument());
    }
  });

  it("pre-selects reasons from initialReason", async () => {
    renderWithI18n(
      <RejectModal
        candidateName="John Smith"
        initialReason="Edad fuera de rango, No es universitario"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    await waitFor(() =>
      expect(screen.getByLabelText("Edad fuera de rango")).toBeChecked()
    );
    expect(screen.getByLabelText("No es universitario")).toBeChecked();
    expect(screen.getByLabelText("Salario pretendido fuera de rango")).not.toBeChecked();
  });

  it("disables the reject button when no reasons are selected", async () => {
    renderWithI18n(
      <RejectModal
        candidateName="John Smith"
        initialReason=""
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    await screen.findByLabelText("Edad fuera de rango");
    expect(screen.getByRole("button", { name: /rechazar \(0\)/i })).toBeDisabled();
  });

  it("calls onConfirm with the selected reasons", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    renderWithI18n(
      <RejectModal
        candidateName="John Smith"
        initialReason=""
        onCancel={vi.fn()}
        onConfirm={onConfirm}
      />
    );

    await screen.findByLabelText("Edad fuera de rango");
    await user.click(screen.getByLabelText("Edad fuera de rango"));
    await user.click(screen.getByLabelText("No es universitario"));
    await user.click(screen.getByRole("button", { name: /rechazar \(2\)/i }));

    expect(onConfirm).toHaveBeenCalledWith(
      expect.arrayContaining(["Edad fuera de rango", "No es universitario"])
    );
  });

  it("calls onCancel when the cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    renderWithI18n(
      <RejectModal
        candidateName="John Smith"
        initialReason=""
        onCancel={onCancel}
        onConfirm={vi.fn()}
      />
    );
    await user.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
