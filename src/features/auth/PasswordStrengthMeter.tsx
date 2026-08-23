import { getPasswordStrength } from '@/utils/passwordStrength';

const config = {
  weak: { label: 'Weak', width: 'w-1/3', color: 'bg-red-500' },
  fair: { label: 'Fair', width: 'w-2/3', color: 'bg-amber-500' },
  strong: { label: 'Strong', width: 'w-full', color: 'bg-green-500' },
};

export function PasswordStrengthMeter({ password }: { password: string }) {
  const strength = getPasswordStrength(password);
  if (!strength) return null;
  const { label, width, color } = config[strength];

  return (
    <div className="mt-1.5" aria-live="polite">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-950/8 dark:bg-paper-100/8">
        <div className={`h-full rounded-full transition-all ${width} ${color}`} />
      </div>
      <p className="mt-1 text-xs text-ink-600/70 dark:text-paper-100/45">Password strength: {label}</p>
    </div>
  );
}
