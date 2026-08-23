import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordStrengthMeter } from '@/features/auth/PasswordStrengthMeter';
import { useLogin } from '@/hooks/useAuth';

interface FormErrors {
  username?: string;
  password?: string;
}

const statusLine = [
  { label: 'Backlog', color: 'bg-column-backlog' },
  { label: 'In Progress', color: 'bg-column-progress' },
  { label: 'Review', color: 'bg-column-review' },
  { label: 'Done', color: 'bg-column-done' },
];

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  function validate(): boolean {
    const next: FormErrors = {};
    if (!username.trim()) next.username = 'Username is required.';
    if (!password) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    login.mutate(
      { username: username.trim(), password, rememberMe },
      {
        onSuccess: () => {
          const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard';
          navigate(from, { replace: true });
        },
      },
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink-950 p-10 text-paper-100 lg:flex">
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} aria-hidden="true" />
        <div className="relative flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-400 font-mono text-[13px] font-bold text-ink-950">
            SD
          </div>
          <span className="font-display font-semibold">SprintDesk</span>
        </div>

        <div className="relative max-w-md">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-400">Sprint 3 · Aug 17 – Aug 28</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.1] text-paper-100">
            Every task,
            <br />
            one board,
            <br />
            zero guesswork.
          </h1>
          <p className="mt-4 text-sm text-paper-100/60">
            Track backlog to done, watch velocity trend in real time, and never lose a
            comment thread again.
          </p>

          <ul className="mt-8 space-y-2.5">
            {statusLine.map((s) => (
              <li key={s.label} className="flex items-center gap-3 font-mono text-xs uppercase tracking-wide text-paper-100/70">
                <span className={`h-1.5 w-6 rounded-full ${s.color}`} aria-hidden="true" />
                {s.label}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative font-mono text-[11px] text-paper-100/30">Built for software teams that ship.</p>
      </div>
      
      <div className="flex items-center justify-center bg-paper px-4 py-12 dark:bg-ink-950">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ink-950 font-mono text-[13px] font-bold text-accent-400 dark:bg-accent-400 dark:text-ink-950">
                SD
              </div>
              <span className="font-display font-semibold text-ink-950 dark:text-paper-100">SprintDesk</span>
            </div>
          </div>

          <h2 className="font-display text-xl font-semibold text-ink-950 dark:text-paper-100">Sign in</h2>
          <p className="mt-1 text-sm text-ink-600 dark:text-paper-100/50">Welcome back to your sprint.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <Input
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              required
              placeholder="emilys"
            />
            <div>
              <Input
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
                placeholder="••••••••"
              />
              <PasswordStrengthMeter password={password} />
            </div>

            <label className="flex items-center gap-2 text-sm text-ink-600 dark:text-paper-100/60">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="focus-ring h-4 w-4 rounded border-ink-950/20 text-accent-500 dark:border-paper-100/20"
              />
              Remember me for 30 days
            </label>

            {login.isError && (
              <p role="alert" className="rounded-lg border border-red-300/40 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
                Invalid username or password. Please try again.
              </p>
            )}

            <Button type="submit" className="w-full" isLoading={login.isPending}>
              Sign in
            </Button>

            <p className="text-center font-mono text-xs text-ink-600/60 dark:text-paper-100/30">
              demo: <span className="text-ink-700 dark:text-paper-100/60">emilys</span> /{' '}
              <span className="text-ink-700 dark:text-paper-100/60">emilyspass</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
