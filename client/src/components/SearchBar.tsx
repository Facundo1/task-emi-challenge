import { useTranslation } from "../i18n/useTranslation";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <label className="group relative inline-flex w-72 items-center border border-rule bg-canvas/60 transition-colors focus-within:border-accent">
      <span
        aria-hidden
        className="pointer-events-none flex h-9 w-9 items-center justify-center font-mono text-xs text-ink-3 group-focus-within:text-accent"
      >
        ⌕
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("search.placeholder")}
        aria-label={t("search.aria")}
        className="h-9 w-full bg-transparent pr-2 font-sans text-sm text-ink placeholder:text-ink-3 focus:outline-none"
      />
      <span
        aria-hidden
        className="pointer-events-none mr-2 hidden border border-rule px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-3 sm:inline-block"
      >
        ⌘K
      </span>
    </label>
  );
}
