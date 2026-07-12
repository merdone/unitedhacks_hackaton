const paths = {
  activity: (
    <>
      <path d="M4 13h3l2.1-6 4 11 2.1-5H20" />
      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" opacity="0.45" />
    </>
  ),
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7m-7 0h7v7" />,
  barChart: <path d="M4 20V10m5 10V4m5 16v-7m5 7V7" />,
  bolt: <path d="m13 2-8 12h6l-1 8 9-13h-6l1-7Z" />,
  brain: (
    <>
      <path d="M9.5 4.3A3.6 3.6 0 0 0 4 7.4a3.5 3.5 0 0 0 .7 6.8A3.9 3.9 0 0 0 9 19.8V4.6" />
      <path d="M14.5 4.3A3.6 3.6 0 0 1 20 7.4a3.5 3.5 0 0 1-.7 6.8 3.9 3.9 0 0 1-4.3 5.6V4.6" />
      <path d="M9.5 8.5c-1.6-.8-3.2-.3-4.2.8m4.2 5c-1.7-.4-3.3.3-4.1 1.6m9.1-7.4c1.6-.8 3.2-.3 4.2.8m-4.2 5c1.7-.4 3.3.3 4.1 1.6M12 4v16" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="3" />
      <path d="M8 3v4m8-4v4M4 10h16m-11 4h3m-3 3h6" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.3-2h7.4L17 8h3v11H4V8Z" />
      <circle cx="12" cy="13.5" r="3.2" />
    </>
  ),
  check: <path d="m5 12 4.2 4.2L19 6.5" />,
  checkin: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="3" />
      <path d="M8.5 8h7m-7 4h4m-4 4 1.5 1.5L15.5 12" />
    </>
  ),
  chevronRight: <path d="m9 5 7 7-7 7" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.4 2" />
    </>
  ),
  dashboard: (
    <>
      <path d="M4 13h6v7H4v-7Zm10-9h6v16h-6V4ZM4 4h6v5H4V4Z" />
    </>
  ),
  dumbbell: <path d="M6 8v8M18 8v8M3 10v4m18-4v4M6 12h12" />,
  edit: (
    <>
      <path d="m14.7 5.3 4 4M5 19l3.2-.7L19 7.5a2.1 2.1 0 0 0-3-3L5.2 15.3 4.5 19H5Z" />
      <path d="M12 5H7a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-5" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" />
      <path d="m4 12 8 4.5 8-4.5M4 16.5l8 4.5 8-4.5" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  message: (
    <>
      <path d="M20 11.5a7.2 7.2 0 0 1-7.5 7.5 8.3 8.3 0 0 1-3.2-.7L4 20l1.7-4.5A7.4 7.4 0 1 1 20 11.5Z" />
      <path d="M8.5 11.5h.01m3.49 0H12m3.49 0h.01" strokeLinecap="round" strokeWidth="2.7" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0m-6 6v4m-3 0h6" />
    </>
  ),
  moon: <path d="M20.2 15.5A8.2 8.2 0 0 1 8.5 3.8 8.2 8.2 0 1 0 20.2 15.5Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  pulse: <path d="M3.5 12h3.2l1.8-4.8 3.2 10 2.3-6.2h6.5" />,
  recovery: (
    <>
      <path d="M12 21s7-4.2 7-10.2A4.8 4.8 0 0 0 12 6.6a4.8 4.8 0 0 0-7 4.2C5 16.8 12 21 12 21Z" />
      <path d="M9 12h2l1-2 2 5 1-3h2" />
    </>
  ),
  refresh: <path d="M20 11a8 8 0 0 0-14.4-4.7L4 8m0-4v4h4m-4 5a8 8 0 0 0 14.4 4.7L20 16m0 4v-4h-4" />,
  spark: (
    <>
      <path d="m12 2 1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" />
      <path d="m18.5 16 .6 2.4 2.4.6-2.4.6-.6 2.4-.6-2.4-2.4-.6 2.4-.6.6-2.4Z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="m15 9 5-5m-3 0h3v3" />
    </>
  ),
  template: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 9h8M8 13h8M8 17h4" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16m-10 4v5m4-5v5M9 4h6l1 3H8l1-3Zm-2 3 1 13h8l1-13" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  x: <path d="m6 6 12 12M18 6 6 18" />,
};

export default function AppIcon({
  name,
  className = 'h-5 w-5',
  strokeWidth = 1.8,
  label,
}) {
  return (
    <svg
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {label && <title>{label}</title>}
      {paths[name] || paths.spark}
    </svg>
  );
}
