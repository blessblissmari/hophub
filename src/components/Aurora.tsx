export function Aurora({ className = '' }: { className?: string }) {
  return (
    <div className={`aurora ${className}`} aria-hidden>
      <div className="blob blob-amber" />
      <div className="blob blob-rose" />
      <div className="blob blob-violet" />
    </div>
  );
}
