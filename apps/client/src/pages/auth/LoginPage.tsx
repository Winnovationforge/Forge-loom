import { useState, type FormEvent, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { ROLE_HOME_PATH } from '../../auth/roleHome';
import { ApiClientError } from '../../lib/apiClient';

interface LocationState {
  from?: { pathname: string };
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Parallax canvas offset
  const [cursorOffset, setCursorOffset] = useState({ x: 0, y: 0 });

  // Card spotlight & 3D tilt
  const [spotlight, setSpotlight] = useState({ x: 220, y: 150, opacity: 0 });
  const [cardTilt, setCardTilt] = useState({ rotateX: 0, rotateY: 0 });

  function handleCanvasMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      const { clientX, clientY, currentTarget } = e;
      const { clientWidth, clientHeight } = currentTarget;
      const x = (clientX / clientWidth - 0.5) * 2;
      const y = (clientY / clientHeight - 0.5) * 2;
      setCursorOffset({ x, y });
    }
  }

  function handleCardMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setSpotlight({ x, y, opacity: 1 });

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -2.5;
      const rotateY = ((x - centerX) / centerX) * 2.5;
      setCardTilt({ rotateX, rotateY });
    }
  }

  function handleCardMouseLeave() {
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
    setCardTilt({ rotateX: 0, rotateY: 0 });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);

    try {
      const loggedInUser = await login({ email: email.trim(), password });
      const from = (location.state as LocationState | null)?.from?.pathname;
      const destination = from && from !== '/login' ? from : ROLE_HOME_PATH[loggedInUser.role];
      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : 'Invalid credentials. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      onMouseMove={handleCanvasMouseMove}
      className="relative min-h-screen w-full overflow-hidden animate-blue-white-bg flex items-center justify-center p-4 sm:p-6 select-none font-sans"
    >
      {/* ================= AMBIENT ORGANIC BLOBS ================= */}
      {/* Blob A: Left Sapphire Bloom */}
      <div
        aria-hidden="true"
        style={{
          transform: `translate3d(${cursorOffset.x * 12}px, ${cursorOffset.y * 10}px, 0)`,
          transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute -left-44 top-1/2 -translate-y-1/2 w-[680px] sm:w-[780px] h-[680px] sm:h-[780px] rounded-full bg-gradient-to-tr from-[#2563EB]/24 via-[#60A5FA]/18 to-[#DBEAFE]/12 opacity-90 blur-[130px] pointer-events-none animate-blob-a"
      />

      {/* Blob B: Top-Right Sky Blue */}
      <div
        aria-hidden="true"
        style={{
          transform: `translate3d(${cursorOffset.x * -12}px, ${cursorOffset.y * -10}px, 0)`,
          transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute -right-24 -top-24 w-[520px] sm:w-[600px] h-[520px] sm:h-[600px] rounded-full bg-gradient-to-bl from-[#3B82F6]/20 via-[#93C5FD]/16 to-white/70 opacity-85 blur-[120px] pointer-events-none animate-blob-b"
      />

      {/* Blob C: Bottom-Right Azure Hue */}
      <div
        aria-hidden="true"
        style={{
          transform: `translate3d(${cursorOffset.x * -8}px, ${cursorOffset.y * -8}px, 0)`,
          transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute -right-16 -bottom-16 w-[460px] sm:w-[520px] h-[460px] sm:h-[520px] rounded-full bg-gradient-to-tl from-[#60A5FA]/18 via-[#93C5FD]/12 to-transparent opacity-75 blur-[120px] pointer-events-none animate-blob-c"
      />

      {/* Center White Backlight */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/95 blur-[110px] pointer-events-none animate-soft-light"
      />

      {/* ================= FLOATING AMBIENT DUST MOTES ================= */}
      <div
        aria-hidden="true"
        className="absolute top-[24%] left-[20%] w-3.5 h-3.5 rounded-full bg-blue-300/40 blur-[1px] pointer-events-none animate-particle-1"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[26%] right-[22%] w-3 h-3 rounded-full bg-indigo-300/40 blur-[1px] pointer-events-none animate-particle-2"
      />
      <div
        aria-hidden="true"
        className="absolute top-[65%] left-[16%] w-2.5 h-2.5 rounded-full bg-sky-400/35 blur-[1px] pointer-events-none animate-particle-3"
      />

      {/* ================= ELEGANT ORBITAL CONTOUR LINES ================= */}
      {/* Upper-right swooshes */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none stroke-[#94B4E8]/40 fill-none animate-arc-1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <path d="M 760 0 C 840 160, 1050 300, 1440 370" strokeWidth="1.3" />
        <path d="M 850 0 C 920 180, 1110 320, 1440 410" strokeWidth="0.9" strokeDasharray="6 8" />
        <path d="M 980 180 C 1140 280, 1310 350, 1440 390" strokeWidth="1" />
      </svg>

      {/* Lower-left swooshes */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none stroke-[#93C5FD]/35 fill-none animate-arc-2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <path d="M 480 900 C 510 740, 440 600, 380 500 C 330 420, 270 330, 0 250" strokeWidth="1.2" />
        <path d="M 400 900 C 420 780, 360 650, 300 550 C 250 470, 180 380, 0 320" strokeWidth="0.8" strokeDasharray="5 7" />
      </svg>

      {/* ================= ULTRA-PREMIUM APPLE GLASSMORPHISM CARD ================= */}
      <main
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        style={
          {
            '--spotlight-x': `${spotlight.x}px`,
            '--spotlight-y': `${spotlight.y}px`,
            '--spotlight-opacity': spotlight.opacity,
            transform: `perspective(1000px) rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY}deg) translate3d(${cursorOffset.x * 2.5}px, ${cursorOffset.y * 2.5}px, 0)`,
          } as React.CSSProperties
        }
        className="relative z-20 w-full max-w-[450px] sm:max-w-[460px] forge-glass-card animate-card-shimmer p-8 sm:p-11 animate-card-entrance"
      >
        {/* Specular Top Rim Highlight */}
        <div className="absolute inset-0 rounded-[34px] pointer-events-none bg-gradient-to-b from-white/80 via-transparent to-transparent opacity-95" />

        {/* BRAND TITLE & SUBTITLE */}
        <header className="relative z-10 text-center mb-8">
          <div className="flex items-baseline justify-center animate-stagger-brand">
            <h1 className="text-[36px] sm:text-[42px] font-extrabold text-[#1855F4] tracking-tight">
              FORGE
            </h1>
            <span className="ml-2.5 text-2xl sm:text-[27px] font-semibold text-[#94A3B8] tracking-normal">
              LMS
            </span>
          </div>
          <p className="mt-2 text-[14px] sm:text-[15px] font-normal text-[#64748B] animate-stagger-sub">
            Sign in to continue
          </p>
        </header>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
          {/* EMAIL PILL FIELD */}
          <div className="animate-stagger-email">
            <label htmlFor="email" className="block text-[11px] font-bold text-slate-700 uppercase tracking-[0.14em] mb-2 ml-1">
              Email
            </label>
            <div className="relative flex items-center forge-glass-input h-[54px] px-4.5 sm:px-5">
              <Mail
                className="input-icon w-[19px] h-[19px] shrink-0"
                strokeWidth={1.7}
                aria-hidden="true"
              />
              <input
                id="email"
                type="email"
                required
                aria-label="Email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent pl-3.5 text-[15px] font-normal text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* PASSWORD PILL FIELD */}
          <div className="animate-stagger-password">
            <label htmlFor="password" className="block text-[11px] font-bold text-slate-700 uppercase tracking-[0.14em] mb-2 ml-1">
              Password
            </label>
            <div className="relative flex items-center forge-glass-input h-[54px] px-4.5 sm:px-5">
              <Lock
                className="input-icon w-[19px] h-[19px] shrink-0"
                strokeWidth={1.7}
                aria-hidden="true"
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                aria-label="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent pl-3.5 text-[15px] font-normal text-slate-800 placeholder:text-slate-400 focus:outline-none tracking-wider font-sans"
              />
              {/* Eye Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="relative w-[19px] h-[19px] text-slate-400 hover:text-slate-700 transition-colors duration-200 focus:outline-none shrink-0 cursor-pointer flex items-center justify-center"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <Eye
                  className={`absolute w-[19px] h-[19px] transition-all duration-200 ease-out ${
                    showPassword ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
                  }`}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
                <EyeOff
                  className={`absolute w-[19px] h-[19px] transition-all duration-200 ease-out ${
                    showPassword ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
                  }`}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div
              role="alert"
              className="rounded-[14px] bg-red-50/95 border border-red-200 p-3 text-center text-[13px] font-medium text-red-700 shadow-sm transition-all"
            >
              {error}
            </div>
          )}

          {/* SIGN IN BUTTON */}
          <div className="animate-stagger-button pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="group forge-btn-primary w-full h-[52px] px-6 text-white font-semibold text-[15px] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-90"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Signing in…</span>
                </div>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight
                    className="btn-arrow w-4 h-4"
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
          </div>
        </form>

        {/* REGISTER FOOTER */}
        <footer className="relative z-10 mt-8 text-center text-[14px] text-slate-500 font-normal animate-stagger-register">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-[#1855F4] hover:text-[#1140BF] hover:underline ml-1 transition-colors duration-200"
          >
            Register
          </Link>
        </footer>
      </main>
    </div>
  );
}
