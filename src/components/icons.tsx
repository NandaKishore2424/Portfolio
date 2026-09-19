import type { SVGProps } from "react";
import { siGithub } from "simple-icons";

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

export function GithubIcon({ title = "GitHub", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" aria-label={title} {...props}>
      <path d={siGithub.path} />
    </svg>
  );
}

export function LinkedinIcon({ title = "LinkedIn", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" aria-label={title} {...props}>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.02h4.56V23H.22V8.02zm8.12 0h4.37v2.05h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V23h-4.56v-7.3c0-1.74-.03-3.98-2.43-3.98-2.43 0-2.8 1.9-2.8 3.86V23H8.34V8.02z" />
    </svg>
  );
}

/** Small brand-agnostic icon renderer for simple-icons entries. */
export function SimpleIcon({
  path,
  title,
  ...props
}: IconProps & { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" aria-label={title} {...props}>
      <path d={path} />
    </svg>
  );
}
