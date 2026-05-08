interface Props {
  color?: string;
  size?: number;
  className?: string;
  animate?: boolean;
}

export function BeerGlassIcon({ color = '#e9a92a', size = 56, className = '', animate = true }: Props) {
  return (
    <svg
      viewBox="0 0 64 80"
      width={size}
      height={(size * 80) / 64}
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="glass-shine" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id={`liquid-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.7" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="40" height="64" rx="6" fill={`url(#liquid-${color.replace('#', '')})`} />
      <rect x="8" y="8" width="40" height="14" rx="6" fill="white" opacity="0.92" />
      <rect x="8" y="8" width="40" height="64" rx="6" fill="url(#glass-shine)" />
      <path d="M48 22 q12 4 12 16 t-12 16" stroke={color} strokeOpacity="0.85" strokeWidth="3" fill="none" strokeLinecap="round" />
      {animate && (
        <>
          <circle cx="20" cy="60" r="2" fill="white" opacity="0.7">
            <animate attributeName="cy" values="60;14" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.8;0" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="32" cy="64" r="1.5" fill="white" opacity="0.6">
            <animate attributeName="cy" values="64;18" dur="4s" begin="-1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.7;0" dur="4s" begin="-1.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="38" cy="58" r="1" fill="white" opacity="0.5">
            <animate attributeName="cy" values="58;14" dur="3.5s" begin="-0.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.6;0" dur="3.5s" begin="-0.6s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
}
