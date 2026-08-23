interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md';
}

export function Avatar({ name, src, size = 'sm' }: AvatarProps) {
  const dims = size === 'sm' ? 'h-6 w-6 text-xs' : 'h-9 w-9 text-sm';
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (src) {
    return <img src={src} alt={name} className={`${dims} flex-shrink-0 rounded-full object-cover`} />;
  }

  return (
    <span
      className={`flex ${dims} flex-shrink-0 items-center justify-center rounded-full bg-ink-950/8 font-mono font-semibold text-ink-700 dark:bg-paper-100/10 dark:text-paper-200`}
      aria-hidden="true"
      title={name}
    >
      {initials}
    </span>
  );
}
