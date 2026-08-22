type IconProps = { className?: string };

function Base({
  children,
  className,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "h-6 w-6"}
    >
      {children}
    </svg>
  );
}

export const Icons = {
  person: (p: IconProps) => (
    <Base {...p}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.2-3.2 3.8-5 7-5s5.8 1.8 7 5" />
    </Base>
  ),
  users: (p: IconProps) => (
    <Base {...p}>
      <circle cx="9" cy="9" r="3" />
      <path d="M3.5 19c1-2.7 3-4.2 5.5-4.2s4.5 1.5 5.5 4.2M15.5 6.5a3 3 0 1 1 0 5.4M17 14.9c2 .4 3.4 1.8 4 4.1" />
    </Base>
  ),
  factory: (p: IconProps) => (
    <Base {...p}>
      <path d="M3 20V9l6 3.5V9l6 3.5V6l6-2v16H3Z" />
      <path d="M7 16h2M12 16h2M17 16h2" />
    </Base>
  ),
  globe: (p: IconProps) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.6 2.3 3.9 5.1 3.9 8.5s-1.3 6.2-3.9 8.5c-2.6-2.3-3.9-5.1-3.9-8.5s1.3-6.2 3.9-8.5Z" />
    </Base>
  ),
  handshake: (p: IconProps) => (
    <Base {...p}>
      <path d="M2.5 8.5 6 6l5 1.5L14.5 6l7 3.5-2.5 6-3-1M6 6l-3.5 2v6l3 2 5 3.5 6.5-4" />
      <path d="M9.5 12.5 12 14.5" />
    </Base>
  ),
  chart: (p: IconProps) => (
    <Base {...p}>
      <path d="M4 4v16h16" />
      <path d="M8 14l3.5-4 3 2.5L19 7" />
      <path d="M15.5 7H19v3.5" />
    </Base>
  ),
  /* circled check — the "key roles placed" list in refs/dirA-casestudy-*.png */
  check: (p: IconProps) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.25 12.25 2.5 2.5 5-5.5" />
    </Base>
  ),
  shield: (p: IconProps) => (
    <Base {...p}>
      <path d="M12 3.5 19 6v5.5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-2.5Z" />
      <path d="m9 11.5 2 2 4-4" />
    </Base>
  ),
  /* padlock + org chart — the merger study's outcome strip,
     refs/dirA-casestudy-merger-confidential.png */
  lock: (p: IconProps) => (
    <Base {...p}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="1.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <path d="M12 14v3" />
    </Base>
  ),
  hierarchy: (p: IconProps) => (
    <Base {...p}>
      <rect x="9" y="3.5" width="6" height="4.5" rx="1" />
      <rect x="3" y="16" width="6" height="4.5" rx="1" />
      <rect x="15" y="16" width="6" height="4.5" rx="1" />
      <path d="M12 8v3.5M6 16v-2.25h12V16" />
    </Base>
  ),
  /* a shield with a keyhole — "confidential search partnership" */
  shieldLock: (p: IconProps) => (
    <Base {...p}>
      <path d="M12 3.5 19 6v5.5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-2.5Z" />
      <circle cx="12" cy="10.5" r="1.6" />
      <path d="M12 12.1v2.4" />
    </Base>
  ),
  /* outline only, no check — the confidentiality note band */
  shieldPlain: (p: IconProps) => (
    <Base {...p}>
      <path d="M12 3.5 19 6v5.5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-2.5Z" />
    </Base>
  ),
  map: (p: IconProps) => (
    <Base {...p}>
      <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Zm0 0v14m6-12v14" />
    </Base>
  ),
  compass: (p: IconProps) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </Base>
  ),
  chat: (p: IconProps) => (
    <Base {...p}>
      <path d="M20 5H4v11h4v4l4.5-4H20V5Z" />
      <path d="M8 10h8" />
    </Base>
  ),
  star: (p: IconProps) => (
    <Base {...p}>
      <path d="m12 4 2.2 4.9 5.3.5-4 3.6 1.1 5.2L12 15.5l-4.6 2.7L8.5 13l-4-3.6 5.3-.5L12 4Z" />
    </Base>
  ),
  puzzle: (p: IconProps) => (
    <Base {...p}>
      <path d="M9 4h6v3.2a1.8 1.8 0 1 0 0 3.1V13h3.2a1.8 1.8 0 1 1 3.1 0H20v7h-7v-2.7a1.8 1.8 0 1 0-3.1 0V20H4v-7h2.7a1.8 1.8 0 1 1 0-3.1V4h2.3Z" />
    </Base>
  ),
  target: (p: IconProps) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </Base>
  ),
  document: (p: IconProps) => (
    <Base {...p}>
      <path d="M6 3.5h8L18 8v12.5H6V3.5Z" />
      <path d="M14 3.5V8h4M9 12h6M9 15.5h6" />
    </Base>
  ),
  gear: (p: IconProps) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18" />
    </Base>
  ),
  truck: (p: IconProps) => (
    <Base {...p}>
      <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" />
      <circle cx="7" cy="17.5" r="1.7" />
      <circle cx="17" cy="17.5" r="1.7" />
    </Base>
  ),
  scale: (p: IconProps) => (
    <Base {...p}>
      <path d="M12 4v16m-6 0h12M12 4 5.5 7M12 4l6.5 3M5.5 7 3 13a3 3 0 0 0 5 0L5.5 7Zm13 0L16 13a3 3 0 0 0 5 0l-2.5-6Z" />
    </Base>
  ),
} as const;

export type IconName = keyof typeof Icons;

/** Direction A teal circle icon */
export function CircleIcon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const Icon = Icons[name];
  return (
    <span
      className={
        className ??
        "flex h-14 w-14 items-center justify-center rounded-full bg-teal-900 text-cream-50"
      }
    >
      <Icon className="h-6 w-6" />
    </span>
  );
}
