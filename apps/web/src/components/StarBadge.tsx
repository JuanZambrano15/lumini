export function StarBadge({ stars, className = '' }: { stars: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-sun px-3 py-1 font-display text-lg font-extrabold text-ink shadow ${className}`}
      aria-label={`${stars} estrellas`}
    >
      <span aria-hidden>⭐</span>
      {stars}
    </span>
  );
}
