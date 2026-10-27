import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CalendarPlus,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Lightbulb,
  Linkedin,
  Mail,
  MoreVertical,
  Plus,
  User,
  Users,
  Video,
  X,
} from 'lucide-react';
import { useCreateBooking, useMentorSessions } from '../../features/student/hooks';
import type { MentorSessionTab, MentorSession } from '../../features/student/types';
import { PageLoading } from '../../components/ui/PageLoading';

const TABS: { value: MentorSessionTab; label: string }[] = [
  { value: 'upcoming', label: 'Upcoming Sessions' },
  { value: 'past', label: 'Past Sessions' },
];

export function MentorSessionsPage() {
  const { data, isLoading } = useMentorSessions();
  const createBooking = useCreateBooking();

  const [tab, setTab] = useState<MentorSessionTab>('upcoming');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Modal states
  const [bookOpen, setBookOpen] = useState(false);
  const [mentorEmail, setMentorEmail] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [bookError, setBookError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const sessions = data ?? [];

  // Filter sessions based on current active tab
  const filtered = useMemo(() => {
    return sessions.filter((session) =>
      tab === 'upcoming' ? session.status === 'Upcoming' : session.status === 'Completed'
    );
  }, [sessions, tab]);

  const selected: MentorSession | undefined =
    sessions.find((s) => s.id === selectedId) ?? (filtered.length > 0 ? filtered[0] : undefined);

  if (isLoading) {
    return <PageLoading />;
  }

  async function handleBookSession(e: React.FormEvent) {
    e.preventDefault();
    if (!mentorEmail || !title || !date || !time) {
      setBookError('Please fill in all required fields.');
      return;
    }
    setBookError(null);
    try {
      await createBooking.mutateAsync({
        counterpartEmail: mentorEmail,
        title,
        scheduledAt: new Date(`${date}T${time}`).toISOString(),
      });
      setBookingSuccess(true);
    } catch {
      setBookError('Could not book this session. Check the mentor email and try again.');
    }
  }

  function handleCloseModal() {
    setBookOpen(false);
    setBookingSuccess(false);
    setMentorEmail('');
    setTitle('');
    setDate('');
    setTime('');
    setBookError(null);
  }

  // Close modal on Escape key press
  useEffect(() => {
    if (!bookOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bookOpen]);

  return (
    <div className="relative min-h-screen pb-16">
      {/* 2D Ambient Background Glows */}
      <div className="pointer-events-none absolute -top-10 -left-10 h-96 w-96 rounded-full bg-blue-100/35 blur-3xl animate-tracker-glow-1" />
      <div className="pointer-events-none absolute top-40 right-0 h-[450px] w-[450px] rounded-full bg-indigo-50/40 blur-3xl animate-tracker-glow-2" />

      {/* Decorative 2D curve SVG in top right */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-4 right-10 w-96 h-48 text-blue-200/30 hidden lg:block"
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 40 180 C 140 40, 260 160, 380 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="340" cy="40" r="28" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Page Header */}
      <div className="relative mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-[#2161F5] uppercase">
            GUIDANCE TODAY, A BRIGHTER TOMORROW
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-0.5">
            Mentor Sessions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Connect, learn and grow with your mentors.
          </p>
        </div>

        {/* Right side: Motivational quote divider + Book a Session button */}
        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-3 text-right">
            <div className="h-11 w-[2px] rounded-full bg-blue-200" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold tracking-widest text-[#2161F5] uppercase leading-none">
                BETTER
              </span>
              <span className="text-[11px] font-extrabold text-slate-800 leading-snug tracking-wider">
                LEARNERS
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider leading-none">
                BRIGHTER
              </span>
              <span className="text-[10px] font-medium text-slate-400 tracking-wider leading-none mt-0.5">
                TOMORROWS
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setBookOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#2161F5] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs shadow-blue-500/25 transition-all duration-200 hover:bg-blue-600 hover:scale-[1.02] active:scale-98 cursor-pointer"
          >
            <Calendar size={15} strokeWidth={2.2} />
            <span>Book a Session</span>
          </button>
        </div>
      </div>

      {/* Main Content: 2-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Panel: Sessions List / Empty State (~58% width = col-span-7) */}
        <div className="lg:col-span-7">
          <div className="flex h-full min-h-[460px] flex-col rounded-3xl border border-slate-200/70 bg-white/80 p-5 sm:p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md">
            {/* Header Tabs */}
            <div className="flex items-center gap-6 border-b border-slate-100 pb-3">
              {TABS.map((t) => {
                const isActive = tab === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => {
                      setTab(t.value);
                      setSelectedId(null);
                    }}
                    className={`relative pb-2 text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                      isActive ? 'text-[#2161F5]' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {t.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#2161F5]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="flex flex-1 flex-col justify-center">
              {filtered.length === 0 ? (
                /* Empty State (Exact 2D match with screenshot) */
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  {/* 2D Abstract Calendar Illustration with Aura & Badges */}
                  <div className="relative mb-5 flex items-center justify-center animate-mentor-float">
                    {/* Soft ambient blue radial glow */}
                    <div className="absolute h-36 w-36 rounded-full bg-blue-100/50 blur-xl" />

                    {/* Decorative floating accent dashes */}
                    <div className="pointer-events-none absolute -top-2 -left-4 flex flex-col gap-1 opacity-70 animate-mentor-accent">
                      <span className="h-1.5 w-3 -rotate-45 rounded-full bg-[#2161F5]" />
                      <span className="h-1.5 w-2 -rotate-30 rounded-full bg-blue-400" />
                    </div>
                    <div className="pointer-events-none absolute -bottom-1 -right-3 flex flex-col gap-1 opacity-70 animate-mentor-accent">
                      <span className="h-1.5 w-3.5 rotate-45 rounded-full bg-teal-400" />
                      <span className="h-1.5 w-2 rotate-12 rounded-full bg-blue-300" />
                    </div>

                    {/* 2D Calendar Card Graphic */}
                    <div className="relative z-10 flex h-24 w-24 flex-col overflow-hidden rounded-2xl border border-blue-100/80 bg-white shadow-md shadow-blue-500/10">
                      {/* Calendar Blue Header */}
                      <div className="flex h-7 w-full items-center justify-between bg-[#2161F5] px-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                      </div>
                      {/* Calendar Body with Dot Grid */}
                      <div className="grid flex-1 grid-cols-4 place-items-center p-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-100" />
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-200" />
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-100" />
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-200" />
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-200" />
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-100" />
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-200" />
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-100" />
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-100" />
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-200" />
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-100" />
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-200" />
                      </div>

                      {/* Small circular clock badge on lower right */}
                      <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#2161F5] text-white shadow-sm ring-3 ring-white">
                        <Clock size={16} strokeWidth={2.2} />
                      </div>
                    </div>
                  </div>

                  {/* Headline & Description */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-800">
                    {tab === 'upcoming' ? 'No upcoming sessions' : 'No past sessions yet'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs leading-relaxed">
                    {tab === 'upcoming'
                      ? "You don't have any mentor sessions scheduled yet. Book a session with a mentor to get started."
                      : 'Your past mentor sessions will appear here once completed.'}
                  </p>

                  {/* Primary Button */}
                  {tab === 'upcoming' && (
                    <button
                      type="button"
                      onClick={() => setBookOpen(true)}
                      className="mt-5 flex items-center gap-2 rounded-2xl bg-[#2161F5] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs shadow-blue-500/25 transition-all duration-200 hover:bg-blue-600 hover:scale-[1.02] active:scale-98 cursor-pointer"
                    >
                      <Calendar size={15} strokeWidth={2.2} />
                      <span>Book a Session</span>
                      <span className="text-base leading-none">→</span>
                    </button>
                  )}
                </div>
              ) : (
                /* Sessions List when entries exist */
                <div className="flex flex-col divide-y divide-slate-100 py-2">
                  {filtered.map((session) => {
                    const isSelected = selected?.id === session.id;
                    return (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() => setSelectedId(session.id)}
                        className={`group flex items-center gap-4 py-4 px-2 text-left transition-all duration-200 rounded-2xl ${
                          isSelected
                            ? 'bg-blue-50/50 border border-blue-200/80 shadow-2xs'
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Date Badge */}
                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-50/80 border border-blue-100 text-blue-700">
                          <span className="text-[10px] font-bold tracking-wider uppercase leading-none">
                            {session.monthLabel}
                          </span>
                          <span className="text-base font-extrabold leading-none mt-1">
                            {session.dayLabel}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[13.5px] font-bold text-slate-800 transition-colors group-hover:text-[#2161F5]">
                              {session.title}
                            </p>
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                                session.status === 'Upcoming'
                                  ? 'bg-blue-50 text-[#2161F5] border-blue-100'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              {session.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">
                            with {session.mentorName}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                            <Clock size={11} />
                            {session.timeLabel}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Session Details / Empty State (~42% width = col-span-5) */}
        <div className="lg:col-span-5">
          <div className="flex h-full min-h-[460px] flex-col rounded-3xl border border-slate-200/70 bg-white/80 p-5 sm:p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md">
            {selected && filtered.length > 0 ? (
              /* Selected Session Details View */
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                        selected.status === 'Upcoming'
                          ? 'bg-blue-50 text-[#2161F5] border-blue-100'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {selected.status === 'Upcoming' ? 'Upcoming Session' : 'Completed Session'}
                    </span>
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                      aria-label="Options"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <h2 className="mt-4 text-lg font-bold text-slate-900 leading-snug">
                    {selected.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Get expert feedback and level up your project.
                  </p>

                  {/* Metadata Matrix */}
                  <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#2161F5]" />
                      <span className="font-semibold text-slate-800">{selected.dateLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#2161F5]" />
                      <span className="font-semibold text-slate-800">{selected.timeLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video size={14} className="text-[#2161F5]" />
                      <span className="font-semibold text-slate-800">{selected.mode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-[#2161F5]" />
                      <span className="font-semibold text-slate-800">1:1 Session</span>
                    </div>
                  </div>

                  {/* Mentor Profile */}
                  <div className="my-5 flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white/70 p-3.5 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-xs font-bold text-[#2161F5] border border-blue-100">
                        {(selected.mentorName || 'Mentor').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {selected.mentorName || 'Mentor'}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{selected.mentorTitle || 'Mentor'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <a
                        href="#"
                        className="rounded-xl border border-slate-200/80 p-2 text-slate-400 hover:bg-slate-50 hover:text-[#2161F5] transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin size={14} />
                      </a>
                      <a
                        href={`mailto:${selected.mentorName || ''}`}
                        className="rounded-xl border border-slate-200/80 p-2 text-slate-400 hover:bg-slate-50 hover:text-[#2161F5] transition-colors"
                        aria-label="Email"
                      >
                        <Mail size={14} />
                      </a>
                    </div>
                  </div>

                  {/* Agenda */}
                  {selected.agenda && selected.agenda.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">
                        Session Agenda
                      </h4>
                      <div className="space-y-1.5">
                        {selected.agenda.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                            <CheckCircle2 size={13} className="text-[#2161F5]" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Note */}
                  {selected.note && (
                    <div className="mb-4 flex items-start gap-2 rounded-xl bg-blue-50/70 p-3 text-xs text-blue-700 border border-blue-100">
                      <Lightbulb size={14} className="mt-0.5 shrink-0" />
                      <span>{selected.note}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {selected.status === 'Upcoming' && (
                  <div className="mt-5 flex items-center gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Reschedule
                    </button>
                    <a
                      href={selected.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#2161F5] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-600 transition-colors"
                    >
                      <Video size={14} />
                      <span>Join Session</span>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              /* Right Panel Default State: 2D Document Illustration matching screenshot */
              <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                {/* 2D Abstract Document Illustration with Clock Badge */}
                <div className="relative mb-5 flex items-center justify-center animate-mentor-float">
                  {/* Soft ambient blue radial glow */}
                  <div className="absolute h-36 w-36 rounded-full bg-blue-100/50 blur-xl" />

                  {/* Decorative floating accents */}
                  <div className="pointer-events-none absolute -top-3 -right-3 flex flex-col gap-1 opacity-70 animate-mentor-accent">
                    <span className="h-1.5 w-3.5 rotate-45 rounded-full bg-[#2161F5]" />
                    <span className="h-1.5 w-2 rotate-15 rounded-full bg-blue-300" />
                  </div>

                  {/* 2D Document Card Graphic */}
                  <div className="relative z-10 flex h-28 w-24 flex-col justify-between overflow-hidden rounded-2xl border border-blue-100/80 bg-white p-3 shadow-md shadow-blue-500/10">
                    {/* Placeholder Document Text Lines */}
                    <div className="space-y-2 pt-1">
                      <span className="block h-2 w-10 rounded-full bg-[#2161F5]" />
                      <span className="block h-2 w-14 rounded-full bg-blue-200/80" />
                      <span className="block h-2 w-8 rounded-full bg-blue-100" />
                    </div>

                    {/* Small dots */}
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-200" />
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-100" />
                    </div>

                    {/* Small circular clock badge on lower right */}
                    <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#2161F5] text-white shadow-sm ring-3 ring-white">
                      <Clock size={16} strokeWidth={2.2} />
                    </div>
                  </div>
                </div>

                {/* Headline & Description */}
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  {tab === 'past' ? 'No past sessions yet' : 'Select a session'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs leading-relaxed">
                  {tab === 'past'
                    ? 'Your past mentor sessions will appear here once completed.'
                    : 'Choose an upcoming session to view details, prepare, and connect with your mentor.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book a Mentor Session Frosted Glass Modal */}
      {bookOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0F1C37]/42 backdrop-blur-[10px] animate-forge-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
          role="presentation"
        >
          {/* Subtle blue ambient glow behind the modal */}
          <div className="pointer-events-none absolute h-[380px] w-[520px] rounded-full bg-blue-500/15 blur-[90px]" />

          <div
            className="relative w-full max-w-[690px] rounded-[24px] sm:rounded-[26px] border border-white/85 bg-white/95 p-6 sm:p-8 md:p-9 shadow-[0_25px_60px_-15px_rgba(15,28,55,0.22)] backdrop-blur-2xl transition-all overflow-hidden animate-forge-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mentor-modal-title"
            aria-describedby="mentor-modal-desc"
          >
            {/* 2D Ambient Wave Accent in Top-Right Corner (Strictly 2D matching reference) */}
            <div className="pointer-events-none absolute top-0 right-0 w-[320px] h-[210px] overflow-hidden rounded-tr-[24px] sm:rounded-tr-[26px] z-0">
              <svg
                className="w-full h-full text-blue-400/20"
                viewBox="0 0 320 210"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M110 0C170 50 225 105 320 120V0H110Z"
                  fill="url(#modal-wave-grad-1)"
                />
                <path
                  d="M50 0C130 80 200 150 320 175V0H50Z"
                  fill="url(#modal-wave-grad-2)"
                  opacity="0.6"
                />
                <defs>
                  <linearGradient
                    id="modal-wave-grad-1"
                    x1="110"
                    y1="0"
                    x2="320"
                    y2="120"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#2161F5" stopOpacity="0.16" />
                    <stop offset="1" stopColor="#93C5FD" stopOpacity="0.03" />
                  </linearGradient>
                  <linearGradient
                    id="modal-wave-grad-2"
                    x1="50"
                    y1="0"
                    x2="320"
                    y2="175"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#60A5FA" stopOpacity="0.12" />
                    <stop offset="1" stopColor="#DBEAFE" stopOpacity="0.01" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Circular Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute right-5 top-5 sm:right-7 sm:top-7 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-100/70 border border-slate-200/50 text-slate-400 hover:bg-blue-50/80 hover:border-blue-200/70 hover:text-slate-700 transition-all duration-200 hover:scale-[1.04] active:scale-[0.96] shadow-2xs cursor-pointer"
              aria-label="Close modal"
            >
              <X size={17} strokeWidth={2.2} />
            </button>

            {bookingSuccess ? (
              /* Success Confirmation State */
              <div className="relative z-10 py-8 text-center animate-stagger-header">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/90 shadow-sm shadow-emerald-500/10">
                  <Check size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#15213D]">
                  Session Booked Successfully
                </h3>
                <p className="text-xs sm:text-sm text-[#617594] mt-2 max-w-sm mx-auto leading-relaxed">
                  Your mentor has been notified. The session has been scheduled and will appear in your upcoming list.
                </p>
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="h-12 rounded-[14px] bg-[#2161F5] px-8 text-sm font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-600 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form */
              <div className="relative z-10">
                {/* Modal Header */}
                <div className="mb-6 flex items-start gap-4 pr-10 animate-stagger-header">
                  {/* Mentorship Icon Container */}
                  <div className="flex h-12 w-12 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-2xl bg-[#EAF2FF] border border-blue-100/80 text-[#2161F5] shadow-2xs">
                    <Users size={24} strokeWidth={2.2} />
                  </div>

                  {/* Header Text */}
                  <div className="min-w-0 flex-1">
                    <span className="block text-[11px] sm:text-[11.5px] font-bold tracking-[0.14em] uppercase text-[#8FA2BE] mb-1 leading-none">
                      MENTORSHIP
                    </span>
                    <h2
                      id="mentor-modal-title"
                      className="text-[22px] sm:text-[26px] font-extrabold text-[#15213D] leading-tight tracking-tight"
                    >
                      Book a Mentor Session
                    </h2>
                    <p
                      id="mentor-modal-desc"
                      className="text-xs sm:text-[13px] text-[#617594] mt-1.5 leading-relaxed"
                    >
                      Schedule a one-on-one session with your mentor. Enter the details below and they&apos;ll be notified once you confirm.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleBookSession} className="space-y-4">
                  {/* Field 1: Mentor Email */}
                  <div className="animate-stagger-email">
                    <label
                      htmlFor="mentor-email-input"
                      className="block text-[13px] font-semibold text-[#15213D] mb-1.5"
                    >
                      Mentor email
                    </label>
                    <div className="group relative flex h-13 sm:h-[54px] w-full items-center overflow-hidden rounded-[14px] border border-[rgba(60,100,160,0.18)] bg-white shadow-2xs transition-all duration-200 hover:border-[rgba(60,100,160,0.3)] focus-within:border-[#2161F5] focus-within:ring-3 focus-within:ring-blue-500/10">
                      <div className="flex h-full w-12 sm:w-13 items-center justify-center border-r border-slate-100 bg-[#F4F8FE] text-blue-500 transition-colors group-focus-within:bg-blue-50/80 group-focus-within:text-[#2161F5]">
                        <Mail size={18} strokeWidth={2} />
                      </div>
                      <input
                        id="mentor-email-input"
                        type="email"
                        required
                        autoFocus
                        placeholder="mentor1@forgeloom.dev"
                        value={mentorEmail}
                        onChange={(e) => setMentorEmail(e.target.value)}
                        className="h-full flex-1 bg-transparent px-3.5 sm:px-4 text-[13.5px] text-[#15213D] placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                    <p className="mt-1 text-[11.5px] text-[#8FA2BE]">
                      Enter your mentor&apos;s email address.
                    </p>
                  </div>

                  {/* Field 2: Session Title */}
                  <div className="animate-stagger-title">
                    <label
                      htmlFor="session-title-input"
                      className="block text-[13px] font-semibold text-[#15213D] mb-1.5"
                    >
                      Session title
                    </label>
                    <div className="group relative flex h-13 sm:h-[54px] w-full items-center overflow-hidden rounded-[14px] border border-[rgba(60,100,160,0.18)] bg-white shadow-2xs transition-all duration-200 hover:border-[rgba(60,100,160,0.3)] focus-within:border-[#2161F5] focus-within:ring-3 focus-within:ring-blue-500/10">
                      <div className="flex h-full w-12 sm:w-13 items-center justify-center border-r border-slate-100 bg-[#F4F8FE] text-blue-500 transition-colors group-focus-within:bg-blue-50/80 group-focus-within:text-[#2161F5]">
                        <FileText size={18} strokeWidth={2} />
                      </div>
                      <input
                        id="session-title-input"
                        type="text"
                        required
                        placeholder="e.g. Project Review & Guidance"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="h-full flex-1 bg-transparent px-3.5 sm:px-4 text-[13.5px] text-[#15213D] placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                    <p className="mt-1 text-[11.5px] text-[#8FA2BE]">
                      Give your session a clear title.
                    </p>
                  </div>

                  {/* Field 3 & 4: Date & Time in 2-column layout */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-stagger-datetime">
                    {/* Date */}
                    <div>
                      <label
                        htmlFor="session-date-input"
                        className="block text-[13px] font-semibold text-[#15213D] mb-1.5"
                      >
                        Date
                      </label>
                      <div className="group relative flex h-13 sm:h-[54px] w-full items-center overflow-hidden rounded-[14px] border border-[rgba(60,100,160,0.18)] bg-white shadow-2xs transition-all duration-200 hover:border-[rgba(60,100,160,0.3)] focus-within:border-[#2161F5] focus-within:ring-3 focus-within:ring-blue-500/10">
                        <div className="flex h-full w-12 sm:w-13 items-center justify-center border-r border-slate-100 bg-[#F4F8FE] text-blue-500 transition-colors group-focus-within:bg-blue-50/80 group-focus-within:text-[#2161F5]">
                          <Calendar size={18} strokeWidth={2} />
                        </div>
                        <input
                          id="session-date-input"
                          type="date"
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="forge-date-input h-full flex-1 bg-transparent px-3 text-[13.5px] text-[#15213D] focus:outline-none cursor-pointer"
                        />
                      </div>
                      <p className="mt-1 text-[11.5px] text-[#8FA2BE]">
                        Choose a convenient date.
                      </p>
                    </div>

                    {/* Time */}
                    <div>
                      <label
                        htmlFor="session-time-input"
                        className="block text-[13px] font-semibold text-[#15213D] mb-1.5"
                      >
                        Time
                      </label>
                      <div className="group relative flex h-13 sm:h-[54px] w-full items-center overflow-hidden rounded-[14px] border border-[rgba(60,100,160,0.18)] bg-white shadow-2xs transition-all duration-200 hover:border-[rgba(60,100,160,0.3)] focus-within:border-[#2161F5] focus-within:ring-3 focus-within:ring-blue-500/10">
                        <div className="flex h-full w-12 sm:w-13 items-center justify-center border-r border-slate-100 bg-[#F4F8FE] text-blue-500 transition-colors group-focus-within:bg-blue-50/80 group-focus-within:text-[#2161F5]">
                          <Clock size={18} strokeWidth={2} />
                        </div>
                        <input
                          id="session-time-input"
                          type="time"
                          required
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="forge-time-input h-full flex-1 bg-transparent px-3 text-[13.5px] text-[#15213D] focus:outline-none cursor-pointer"
                        />
                      </div>
                      <p className="mt-1 text-[11.5px] text-[#8FA2BE]">
                        Select a time slot.
                      </p>
                    </div>
                  </div>

                  {/* Field 5: Notification Information Panel */}
                  <div className="animate-stagger-notification">
                    <div className="flex items-center gap-3.5 rounded-2xl border border-blue-100/90 bg-gradient-to-r from-[#F0F5FF]/90 to-[#F6F9FF]/70 p-3.5 sm:p-4 transition-all">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#DCE9FE] text-[#2161F5] border border-blue-200/50 shadow-2xs">
                        <Clock size={18} strokeWidth={2.2} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[13px] sm:text-[13.5px] font-bold text-[#15213D]">
                          Your mentor will be notified
                        </h4>
                        <p className="text-[11.5px] sm:text-[12px] text-[#617594] mt-0.5 leading-normal">
                          You&apos;ll receive a confirmation once the booking is successful.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Validation Error Message */}
                  {bookError && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-rose-200/80 bg-rose-50/90 p-3 text-xs text-rose-700">
                      <AlertCircle size={15} className="shrink-0 text-rose-500" />
                      <span className="flex-1">{bookError}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3.5 sm:gap-4 pt-2 animate-stagger-actions">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="h-13 sm:h-[52px] rounded-[14px] border border-slate-200/90 bg-white px-5 text-[13.5px] sm:text-[14px] font-semibold text-[#15213D] shadow-2xs transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.985] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createBooking.isPending}
                      className="h-13 sm:h-[52px] flex items-center justify-center gap-2 rounded-[14px] bg-[#2161F5] px-5 text-[13.5px] sm:text-[14px] font-semibold text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.985] disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer"
                    >
                      {createBooking.isPending ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Confirming...</span>
                        </>
                      ) : (
                        <>
                          <Calendar size={16} strokeWidth={2.2} />
                          <span>Confirm Booking</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
