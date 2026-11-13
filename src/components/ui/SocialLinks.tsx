import { SITE_CONFIG } from "@/lib/constants";

export function LinkedInIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.83v1.5h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13v5.43h-4v-4.82c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.9h-4v-11Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export const SOCIALS = [
  { name: "LinkedIn", href: SITE_CONFIG.links.linkedin, Icon: LinkedInIcon },
  { name: "Instagram", href: SITE_CONFIG.links.instagram, Icon: InstagramIcon },
];

/** Social profile links. `variant="icons"` shows round-free icon buttons; `"text"` shows icon + name. */
export function SocialLinks({ variant = "text", className = "" }: { variant?: "text" | "icons"; className?: string }) {
  return (
    <ul className={`flex items-center ${variant === "icons" ? "gap-2" : "gap-6"} ${className}`}>
      {SOCIALS.map(({ name, href, Icon }) => (
        <li key={name}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Atalitix ${name}`}
            className={
              variant === "icons"
                ? "flex h-9 w-9 items-center justify-center rounded-[3px] border border-[var(--rule-strong)] text-[var(--ink)] transition-colors hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                : "inline-flex items-center gap-2 text-[14px] text-[var(--ink)] link-underline hover:text-[var(--brand-blue)]"
            }
          >
            <Icon />
            {variant === "text" && name}
          </a>
        </li>
      ))}
    </ul>
  );
}
