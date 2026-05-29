const ITEMS = [
  "Zona Jobs",
  "Bumeran",
  "Indeed",
  "LinkedIn",
  "Computrabajo",
  "Glassdoor",
];

type Props = { "aria-hidden"?: boolean };

export function MarqueeRow({ "aria-hidden": ariaHidden }: Props) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {ITEMS.map((source) => (
        <span key={source} className="flex items-center">
          <span className="px-6">{source}</span>
          <span className="text-accent">&divide;</span>
        </span>
      ))}
    </div>
  );
}
