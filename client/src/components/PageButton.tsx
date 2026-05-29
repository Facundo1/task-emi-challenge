import type { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  ariaLabel?: string;
  ariaCurrent?: "page";
};

export function PageButton({
  children,
  onClick,
  disabled,
  active,
  ariaLabel,
  ariaCurrent,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      className={clsx(
        "min-w-[2.25rem] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors focus-ring",
        active
          ? "bg-accent text-canvas"
          : "text-ink-2 hover:bg-surface-2 hover:text-ink",
        "disabled:cursor-not-allowed disabled:text-ink-4 disabled:hover:bg-transparent disabled:hover:text-ink-4"
      )}
    >
      <span className="flex items-center justify-center">{children}</span>
    </button>
  );
}
