import {
  Briefcase,
  ChartNoAxesCombined,
  ChevronDown,
  CircleCheck,
  Compass,
  Factory,
  FileText,
  Globe,
  Handshake,
  Lock,
  type LucideIcon,
  Mail,
  MapPin,
  MessageSquare,
  Network,
  Puzzle,
  Scale,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  ShieldKeyhole,
  Star,
  Target,
  Truck,
  User,
  UserStar,
  Users,
} from "lucide-react";

type IconProps = { className?: string };

/**
 * The site's icon set, mapped onto Lucide.
 *
 * These were hand-authored SVG paths until Drew pointed at the handshake and
 * said it did not read as a handshake — which it didn't. That is not a
 * one-icon bug: drawing two dozen pictograms by hand means two dozen chances
 * to produce something that is recognisable to the person who drew it and to
 * nobody else, and no way to find the bad ones except by looking at all of
 * them. Lucide is drawn by people who do this properly, on a consistent 24px
 * grid, and its outline-stroke style is the one the comps already use.
 *
 * The wrapper keeps the contract every call site relies on: `Icons[name]` is a
 * component taking only `className`, it defaults to `h-6 w-6`, it is always
 * `aria-hidden` (every icon on this site sits beside its own label), and the
 * stroke is 1.5 rather than Lucide's default 2 — heavier reads as UI chrome
 * against this typography.
 *
 * Keys are ours, not Lucide's, so a better-fitting icon can be swapped in
 * without touching the pages that use it.
 */
function icon(Glyph: LucideIcon) {
  return function Icon({ className }: IconProps) {
    return (
      <Glyph
        aria-hidden="true"
        strokeWidth={1.5}
        className={className ?? "h-6 w-6"}
      />
    );
  };
}

export const Icons = {
  person: icon(User),
  users: icon(Users),
  personStar: icon(UserStar),
  factory: icon(Factory),
  globe: icon(Globe),
  map: icon(MapPin),
  handshake: icon(Handshake),
  chat: icon(MessageSquare),
  chart: icon(ChartNoAxesCombined),
  check: icon(CircleCheck),
  shield: icon(ShieldCheck),
  shieldPlain: icon(Shield),
  shieldLock: icon(ShieldKeyhole),
  lock: icon(Lock),
  hierarchy: icon(Network),
  briefcase: icon(Briefcase),
  mail: icon(Mail),
  search: icon(Search),
  chevronDown: icon(ChevronDown),
  compass: icon(Compass),
  star: icon(Star),
  puzzle: icon(Puzzle),
  target: icon(Target),
  document: icon(FileText),
  gear: icon(Settings),
  truck: icon(Truck),
  scale: icon(Scale),
};

export type IconName = keyof typeof Icons;

/** An icon on a filled teal disc — the chip the comps set on card headers. */
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
      aria-hidden="true"
      className={
        className ??
        "flex h-14 w-14 items-center justify-center rounded-full bg-teal-900 text-cream-50"
      }
    >
      <Icon className="h-6 w-6" />
    </span>
  );
}
