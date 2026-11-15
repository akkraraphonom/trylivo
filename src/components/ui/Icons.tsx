import type { SVGProps } from "react";
import { ASTERISK_PATH } from "./Logo";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

function Base20({ size = 20, strokeWidth = 1.2, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p: P) => (
  <Base20 {...p}>
    <path d="M 3.892 3.892 L 0 0" transform="translate(14.108 14.108)" />
    <path d="M 0 7.175 C 0 3.212 3.212 0 7.175 0 C 11.137 0 14.35 3.212 14.35 7.175 C 14.35 11.137 11.137 14.35 7.175 14.35 C 3.212 14.35 0 11.137 0 7.175 Z" transform="translate(2 2)" />
  </Base20>
);
export const UserIcon = (p: P) => (
  <Base20 {...p}>
    <path d="M 0 5 C 0 2.239 2.239 0 5 0 C 7.761 0 10 2.239 10 5 C 10 7.761 7.761 10 5 10 C 2.239 10 0 7.761 0 5 Z" transform="translate(5.11 1)" />
    <path d="M 16 8 C 16 3.582 12.418 0 8 0 C 3.582 0 0 3.582 0 8" transform="translate(2.11 11)" />
  </Base20>
);
export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <Base20 {...p} fill={filled ? "currentColor" : "none"}>
    <path
      d="M 0 4.863 C 0 2.855 1.264 1.054 3.178 0.336 C 5.093 -0.383 7.262 0.129 8.632 1.622 C 8.727 1.722 8.86 1.779 9 1.779 C 9.139 1.779 9.273 1.722 9.368 1.622 C 10.734 0.119 12.908 -0.4 14.827 0.321 C 16.746 1.041 18.01 2.85 18 4.863 C 18 6.881 16.65 8.389 15.3 9.711 L 10.357 14.395 C 10.018 14.776 9.528 14.997 9.011 15 C 8.494 15.003 8.001 14.789 7.657 14.411 L 2.7 9.711 C 1.35 8.389 0 6.89 0 4.863"
      transform="translate(1 2.49)"
    />
  </Base20>
);
export const BagIcon = (p: P) => (
  <Base20 {...p}>
    <g transform="translate(1 1.02)">
      <path d="M 4.491 17.1 C 4.491 16.603 4.893 16.2 5.389 16.2 C 5.885 16.2 6.287 16.603 6.287 17.1 C 6.287 17.597 5.885 18 5.389 18 C 4.893 18 4.491 17.597 4.491 17.1 Z" />
      <path d="M 14.371 17.1 C 14.371 16.603 14.773 16.2 15.269 16.2 C 15.766 16.2 16.168 16.603 16.168 17.1 C 16.168 17.597 15.766 18 15.269 18 C 14.773 18 14.371 17.597 14.371 17.1 Z" />
      <path d="M 0 0 L 1.796 0 L 4.186 11.178 C 4.366 12.022 5.12 12.619 5.982 12.6 L 14.766 12.6 C 15.609 12.599 16.337 12.011 16.518 11.187 L 18 4.5 L 2.757 4.5" />
    </g>
  </Base20>
);
export const ChevronDown = (p: P) => (
  <Base20 strokeWidth={1.5} {...p}>
    <path d="M 0 0 L 8 8 L 16 0" transform="translate(2 7)" />
  </Base20>
);
export const ChevronLeft = (p: P) => (
  <Base {...p}>
    <path d="m15 6-6 6 6 6" />
  </Base>
);
export const ChevronRight = (p: P) => (
  <Base {...p}>
    <path d="m9 6 6 6-6 6" />
  </Base>
);
export const ArrowUpRight = (p: P) => (
  <Base20 strokeWidth={1.8} {...p}>
    <path d="M 0 0 L 14 0 L 14 14 M 0 14 L 14 0" transform="translate(3 3)" />
  </Base20>
);
export const ArrowRight = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
);
export const CloseIcon = (p: P) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);
export const MenuIcon = (p: P) => (
  <Base {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Base>
);
export const PlusIcon = (p: P) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);
export const MinusIcon = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14" />
  </Base>
);
export const RulerIcon = (p: P) => (
  <Base {...p}>
    <path d="m3 16.5 13.5-13.5 4.5 4.5L7.5 21 3 16.5Z" />
    <path d="m7 12.5 1.5 1.5M10 9.5l1.5 1.5M13 6.5 14.5 8" />
  </Base>
);
export const FilterIcon = (p: P) => (
  <Base {...p}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </Base>
);
export const InstagramIcon = (p: P) => (
  <Base {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </Base>
);
export const StarIcon = ({ size = 13, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth={1.2} strokeLinejoin="round" aria-hidden="true" {...rest}>
    <path
      d="M 7.621 0.232 C 7.692 0.09 7.84 0 8.001 0 C 8.162 0 8.309 0.09 8.381 0.232 L 10.229 3.912 C 10.476 4.404 10.953 4.745 11.504 4.824 L 15.637 5.419 C 15.797 5.442 15.929 5.552 15.979 5.702 C 16.029 5.853 15.988 6.019 15.872 6.13 L 12.883 8.991 C 12.483 9.374 12.301 9.927 12.395 10.468 L 13.1 14.511 C 13.128 14.668 13.063 14.827 12.932 14.92 C 12.801 15.014 12.627 15.026 12.484 14.951 L 8.789 13.042 C 8.295 12.786 7.705 12.786 7.211 13.042 L 3.518 14.951 C 3.375 15.026 3.201 15.013 3.07 14.92 C 2.939 14.826 2.874 14.667 2.902 14.511 L 3.607 10.469 C 3.701 9.927 3.518 9.375 3.118 8.991 L 0.129 6.131 C 0.013 6.02 -0.029 5.854 0.021 5.702 C 0.071 5.551 0.204 5.44 0.365 5.418 L 4.496 4.824 C 5.049 4.745 5.526 4.404 5.774 3.912 Z"
      transform="translate(2 2)"
    />
  </svg>
);
export const PlayIcon = (p: P) => (
  <Base {...p} fill="currentColor" stroke="none">
    <path d="M8 5.5v13l10-6.5-10-6.5Z" />
  </Base>
);
export const PauseIcon = (p: P) => (
  <Base {...p} fill="currentColor" stroke="none">
    <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
  </Base>
);
export const TrashIcon = (p: P) => (
  <Base {...p}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
  </Base>
);

/** Six-armed asterisk used next to the wordmark. */
export const Asterisk = ({ size = 20, ...rest }: P) => (
  <svg width={size} height={(size * 22) / 21} viewBox="0 0 21 22" fill="currentColor" aria-hidden="true" {...rest}>
    <path d={ASTERISK_PATH} />
  </svg>
);

function Base24({ size = 36, strokeWidth = 1.4, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

export const TruckIcon = (p: P) => (
  <Base24 {...p}>
    <path d="M 12 14 L 12 2 C 12 0.895 11.105 0 10 0 L 2 0 C 0.895 0 0 0.895 0 2 L 0 13 C 0 13.552 0.448 14 1 14 L 3 14" transform="translate(2 4)" />
    <path d="M 6 0 L 0 0" transform="translate(9 18)" />
    <path d="M 5 10 L 7 10 C 7.552 10 8 9.552 8 9 L 8 5.35 C 8 5.123 7.922 4.903 7.78 4.726 L 4.3 0.376 C 4.111 0.139 3.824 0 3.52 0 L 0 0" transform="translate(14 8)" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="7" cy="18" r="2" />
  </Base24>
);
export const LeafIcon = (p: P) => (
  <Base24 {...p}>
    <path d="M 7.022 18 C 3.381 18.011 0.339 15.229 0.026 11.602 C -0.287 7.975 2.233 4.713 5.822 4.1 C 11.522 3 13.022 2.48 15.022 0 C 16.022 2 17.022 4.18 17.022 8 C 17.022 13.5 12.242 18 7.022 18 Z" transform="translate(3.978 2)" />
    <path d="M 0 9 C 0 6 1.85 3.64 5.08 3 C 7.5 2.52 10 1 11 0" transform="translate(2 12)" />
  </Base24>
);
export const ReturnIcon = (p: P) => (
  <Base24 {...p}>
    <path d="M 5 10 L 0 5 L 5 0" transform="translate(4 4)" />
    <path d="M 0 0 L 10.5 0 C 13.538 0 16 2.462 16 5.5 C 16 8.538 13.538 11 10.5 11 L 7 11" transform="translate(4 9)" />
  </Base24>
);
export const ShieldIcon = (p: P) => (
  <Base24 {...p}>
    <path d="M 16 10.997 C 16 15.997 12.5 18.497 8.34 19.947 C 8.122 20.021 7.886 20.017 7.67 19.937 C 3.5 18.497 0 15.997 0 10.997 L 0 3.997 C 0 3.445 0.448 2.997 1 2.997 C 3 2.997 5.5 1.797 7.24 0.277 C 7.678 -0.097 8.322 -0.097 8.76 0.277 C 10.51 1.807 13 2.997 15 2.997 C 15.552 2.997 16 3.445 16 3.997 Z" transform="translate(4 2.003)" />
    <path d="M 0 2 L 2 4 L 6 0" transform="translate(9 10)" />
  </Base24>
);

export const uspIcons = {
  truck: TruckIcon,
  leaf: LeafIcon,
  return: ReturnIcon,
  shield: ShieldIcon,
};
