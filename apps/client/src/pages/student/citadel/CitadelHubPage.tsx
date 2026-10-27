import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  HelpCircle,
  Lightbulb,
  Link2,
  MoreHorizontal,
  Shield,
  Users,
  X,
  Zap,
  BookOpen,
  ClipboardList,
} from 'lucide-react';
import { useCitadelDaysRemaining, useSprints } from '../../../features/student/hooks';
import { ProgressDonut } from '../../../components/ui/ProgressDonut';
import { PageLoading } from '../../../components/ui/PageLoading';
import { CitadelSubNav } from './CitadelSubNav';

export function CitadelHubPage() {
  const { data: sprints, isLoading: sprintsLoading } = useSprints();
  const { data: daysRemaining, isLoading: daysLoading } = useCitadelDaysRemaining();

  // Interactive state
  const [selectedCycleFilter, setSelectedCycleFilter] = useState('All Sprint Cycles');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  if (sprintsLoading || daysLoading) {
    return <PageLoading />;
  }

  const sprintList = sprints ?? [];
  const completedCount = sprintList.filter((s) => s.status === 'completed').length;
  const overallPercent =
    sprintList.length > 0
      ? Math.round(sprintList.reduce((sum, s) => sum + s.progressPercent, 0) / sprintList.length)
      : 0;
  const currentSprint = sprintList.find((s) => s.status === 'in_progress');
  const currentTasksPercent = currentSprint?.tasks.length
    ? Math.round(
        (currentSprint.tasks.filter((t) => t.status === 'completed').length /
          currentSprint.tasks.length) *
          100
      )
    : 0;

  return (
    <div className="relative min-h-screen pb-16">
      {/* 2D Ambient Background Glows */}
      <div className="pointer-events-none absolute -top-10 -left-10 h-96 w-96 rounded-full bg-blue-100/35 blur-3xl" />
      <div className="pointer-events-none absolute top-40 right-0 h-[450px] w-[450px] rounded-full bg-indigo-50/40 blur-3xl" />

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
      <div className="relative mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-[#2161F5] uppercase">
            Citadel
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-0.5">
            Welcome to Citadel
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your progress, complete sprints, and build something extraordinary.
          </p>
        </div>

        {/* Right side stacked motivational copy with vertical line */}
        <div className="hidden sm:flex items-center gap-3 text-right">
          <div className="h-10 w-[2px] rounded-full bg-slate-200" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase leading-none">
              Ideas
            </span>
            <span className="text-[12px] font-bold text-slate-700 leading-snug">
              Today
            </span>
            <span className="text-[10px] font-medium text-slate-400 leading-none">
              Solutions Tomorrow
            </span>
          </div>
        </div>
      </div>

      {/* Citadel Sub-navigation Tabs */}
      <CitadelSubNav />

      {/* Notice Banner */}
      <div className="relative mb-6 flex items-start gap-3.5 rounded-2xl border border-blue-200/80 bg-blue-50/60 p-4 shadow-2xs backdrop-blur-md">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100/90 text-[#2161F5] shadow-xs mt-0.5">
          <Lightbulb size={18} strokeWidth={2.2} />
        </div>
        <p className="text-xs sm:text-[13px] font-medium text-slate-600 leading-relaxed">
          You&apos;re not on a Citadel team yet — once a College Admin or Trainer places you on one
          and it picks up a problem statement, your sprint cycles will show up here.
        </p>
      </div>

      {/* Top Grid: Sprint Progress Overview (Left) + Featured Citadel Card (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sprint Progress Overview (~65% width) */}
        <div className="lg:col-span-8">
          <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/70 bg-white/80 p-5 sm:p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md">
            <div>
              {/* Card Header with Dropdown */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Sprint Progress Overview
                </h2>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-100/80 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-2xs transition-all hover:bg-slate-200/80 cursor-pointer"
                  >
                    <Calendar size={13} className="text-slate-500" />
                    <span>{selectedCycleFilter}</span>
                    <ChevronDown size={13} className="text-slate-400" />
                  </button>

                  {filterDropdownOpen && (
                    <div className="absolute right-0 z-20 mt-1.5 w-48 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg backdrop-blur-md animate-item-fade-up">
                      {['All Sprint Cycles', 'Current Sprint', 'Sprint 1', 'Sprint 2'].map(
                        (option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setSelectedCycleFilter(option);
                              setFilterDropdownOpen(false);
                            }}
                            className={`flex w-full items-center rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                              selectedCycleFilter === option
                                ? 'bg-blue-50 text-[#2161F5] font-semibold'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {option}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Content: 3 columns (Percent + Bar, Donut Ring, Quote) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6 py-2">
                {/* Metric & Bar */}
                <div className="flex flex-col justify-center">
                  <div className="text-3xl font-extrabold text-[#2161F5]">
                    {overallPercent}%
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Across all sprint cycles</p>
                  <div className="relative h-2 w-full max-w-[160px] overflow-hidden rounded-full bg-slate-100 mt-3">
                    <div
                      className="h-full rounded-full bg-[#2161F5] transition-all duration-700"
                      style={{ width: `${overallPercent}%` }}
                    />
                  </div>
                </div>

                {/* Progress Donut */}
                <div className="flex justify-center sm:justify-center">
                  <ProgressDonut
                    percent={overallPercent}
                    size={96}
                    strokeWidth={9}
                    progressColor="#2161F5"
                    trackColor="#EAF2FF"
                  />
                </div>

                {/* Micro Quote */}
                <div className="flex items-start gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
                  <span className="text-3xl font-serif text-blue-400/40 leading-none select-none">
                    “
                  </span>
                  <div>
                    <p className="text-xs font-medium text-slate-600 leading-snug">
                      Big ideas start with small consistent steps.
                    </p>
                    <span className="text-[10.5px] font-semibold text-slate-400 mt-1 block">
                      — Citadel
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 3 Stat Widgets */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5 border-t border-slate-100 pt-5">
              {/* Stat 1: Sprints Completed */}
              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 p-3.5 shadow-2xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden">
                  <img src="/images/dashboard/sprint.svg" alt="Sprints Completed" className="h-full w-full object-contain" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900">
                    {completedCount}/{sprintList.length}
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    Sprints Completed
                  </div>
                </div>
              </div>

              {/* Stat 2: Tasks Completed */}
              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 p-3.5 shadow-2xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden">
                  <img src="/images/dashboard/tasks.svg" alt="Tasks Completed" className="h-full w-full object-contain" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900">
                    {currentTasksPercent}%
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    Tasks Completed
                  </div>
                </div>
              </div>

              {/* Stat 3: Days Remaining */}
              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 p-3.5 shadow-2xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden">
                  <img src="/images/dashboard/xp.svg" alt="Days Remaining" className="h-full w-full object-contain" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900">
                    {daysRemaining}
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    Days Remaining
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Citadel Hero Card (~35% width) */}
        <div className="lg:col-span-4">
          <div className="relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#1748C7] via-[#2161F5] to-[#2F6BFF] p-6 text-white shadow-md shadow-blue-500/25 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30">
            {/* Background 2D abstract glowing waves & bars */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute right-0 bottom-0 h-48 w-48 text-white/10"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="180" cy="180" r="80" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" />
              <path d="M 60 200 L 60 140 M 90 200 L 90 120 M 120 200 L 120 90 M 150 200 L 150 60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>

            {/* Top Row: Badge and Menu */}
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10.5px] font-bold tracking-wider uppercase backdrop-blur-md">
                  <Shield size={12} strokeWidth={2.5} />
                  CITADEL
                </span>

                <button
                  type="button"
                  className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Citadel card options"
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Title & Tagline */}
              <h3 className="mt-7 text-2xl font-extrabold tracking-tight leading-tight">
                Build. Iterate. Impact.
              </h3>
              <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-blue-100/90 font-normal">
                Work in focused sprint cycles, collaborate with mentors, and turn ideas into
                real-world solutions.
              </p>

              {/* Quote Block */}
              <blockquote className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-3.5 text-xs text-blue-50 italic backdrop-blur-xs leading-relaxed">
                &ldquo;Great projects are not built in a day, but in consistent cycles.&rdquo;
              </blockquote>
            </div>

            {/* Bottom Graphic: 2D Ascending Glowing Bars */}
            <div className="relative z-10 mt-6 flex items-end justify-end gap-1.5 opacity-60">
              <span className="h-4 w-2 rounded-full bg-white/40" />
              <span className="h-6 w-2 rounded-full bg-white/60" />
              <span className="h-8 w-2 rounded-full bg-white/80" />
              <span className="h-11 w-2 rounded-full bg-white shadow-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity (Left) + Quick Links (Right) */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Recent Activity Card */}
        <div className="lg:col-span-7">
          <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/70 bg-white/80 p-5 sm:p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md">
            <div>
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#2161F5]" />
                  <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-semibold text-[#2161F5] hover:underline"
                >
                  <span>View All Activity</span>
                  <ChevronRight size={13} />
                </button>
              </div>

              {/* 2D Empty State Illustration matching screenshot */}
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100/90 bg-blue-50 text-[#2161F5] shadow-2xs">
                  <FileText size={26} strokeWidth={1.8} />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No recent activity</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Your sprint activity, updates, and milestones will appear here.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Card */}
        <div className="lg:col-span-5">
          <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/70 bg-white/80 p-5 sm:p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md">
            <div>
              <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Link2 size={16} className="text-[#2161F5]" />
                <h2 className="text-base font-bold text-slate-900">Quick Links</h2>
              </div>

              {/* 4 Action Cards in 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Link 1: View Problem Statement */}
                <Link
                  to="/student/citadel/problem-statement"
                  className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white/70 p-3.5 shadow-2xs transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/25 hover:shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2161F5] transition-colors group-hover:bg-[#2161F5] group-hover:text-white">
                      <BookOpen size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-800 leading-snug">
                      View Problem<br />Statement
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#2161F5]"
                  />
                </Link>

                {/* Link 2: Meet Your Team */}
                <Link
                  to="/student/citadel/sprints"
                  className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white/70 p-3.5 shadow-2xs transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/25 hover:shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                      <Users size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-800 leading-snug">
                      Meet Your<br />Team
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-purple-600"
                  />
                </Link>

                {/* Link 3: Check Guidelines */}
                <button
                  type="button"
                  onClick={() => setGuidelinesOpen(true)}
                  className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white/70 p-3.5 shadow-2xs text-left transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/25 hover:shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      <ClipboardList size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-800 leading-snug">
                      Check<br />Guidelines
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-emerald-600"
                  />
                </button>

                {/* Link 4: Get Help */}
                <button
                  type="button"
                  onClick={() => setHelpOpen(true)}
                  className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white/70 p-3.5 shadow-2xs text-left transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/25 hover:shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                      <HelpCircle size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-800 leading-snug">
                      Get<br />Help
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-amber-600"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines Modal */}
      {guidelinesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
          <div
            className="w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl transition-all"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#2161F5]">
                  <ClipboardList size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Citadel Guidelines</h3>
                  <p className="text-xs text-slate-400">Sprint cycle rules & grading criteria</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGuidelinesOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="rounded-xl bg-blue-50/60 p-3 border border-blue-100">
                <p className="font-semibold text-blue-900">1. Sprint Cycles</p>
                <p className="text-blue-700 mt-0.5">
                  Teams work in 2-week agile sprint iterations, submitting code repositories and
                  milestone deliverables at the end of each cycle.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/60">
                <p className="font-semibold text-slate-800">2. Deliverables & Code Reviews</p>
                <p className="text-slate-500 mt-0.5">
                  Each sprint requires documented progress, peer reviews, and mentor validation
                  before advancing to the next cycle.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/60">
                <p className="font-semibold text-slate-800">3. Mentorship & Support</p>
                <p className="text-slate-500 mt-0.5">
                  Book regular 1-on-1 mentor check-ins via the Mentor Sessions tab to resolve blockers
                  and refine architecture.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setGuidelinesOpen(false)}
                className="rounded-xl bg-[#2161F5] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-600 cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Get Help Modal */}
      {helpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
          <div
            className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl transition-all"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Need Help with Citadel?</h3>
                  <p className="text-xs text-slate-400">Get guidance from mentors and community</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <Link
                to="/student/mentor"
                onClick={() => setHelpOpen(false)}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 hover:bg-blue-50/40 hover:border-blue-200 transition-colors"
              >
                <div>
                  <p className="font-semibold text-slate-800">Book Mentor Session</p>
                  <p className="text-slate-400 mt-0.5">Schedule 1-on-1 advice with industry experts</p>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </Link>

              <Link
                to="/student/events"
                onClick={() => setHelpOpen(false)}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 hover:bg-blue-50/40 hover:border-blue-200 transition-colors"
              >
                <div>
                  <p className="font-semibold text-slate-800">Citadel Workshops & Office Hours</p>
                  <p className="text-slate-400 mt-0.5">Attend live sprint Q&A sessions</p>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </Link>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
