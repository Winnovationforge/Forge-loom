import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  Code2,
  Palette,
  Layers,
  PieChart,
  ChevronRight,
  Target,
  FileText,
  MoreVertical,
  X,
  Check,
  Sparkles,
} from 'lucide-react';
import {
  useLearningStreak,
  useStudentCourses,
  useStudentStats,
  useWeeklyProgress,
} from '../../features/student/hooks';
import { PageLoading } from '../../components/ui/PageLoading';
import { ProgressChart } from '../../components/charts/ProgressChart';

const WEEKDAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function TrackerPage() {
  const { data: stats, isLoading: statsLoading } = useStudentStats();
  const { data: weekly, isLoading: weeklyLoading } = useWeeklyProgress();
  const { data: streak, isLoading: streakLoading } = useLearningStreak();
  const { data: courses, isLoading: coursesLoading } = useStudentCourses();

  // Interactive Goal Setting Modal state
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [weeklyGoalInput, setWeeklyGoalInput] = useState('85');
  const [targetHoursInput, setTargetHoursInput] = useState('15');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (statsLoading || weeklyLoading || streakLoading || coursesLoading) {
    return <PageLoading />;
  }

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    setGoalModalOpen(false);
    setToastMessage(`Weekly Goal updated to ${weeklyGoalInput}% (${targetHoursInput} hrs/week)`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="relative min-h-screen pb-16">
      {/* 2D Ambient background glow blobs */}
      <div className="pointer-events-none absolute -top-12 -left-12 h-96 w-96 rounded-full bg-blue-100/35 blur-3xl animate-tracker-glow-1" />
      <div className="pointer-events-none absolute top-48 right-0 h-[420px] w-[420px] rounded-full bg-indigo-50/40 blur-3xl animate-tracker-glow-2" />

      {/* Decorative 2D curve SVG in top right */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-4 right-10 w-96 h-48 text-blue-200/30 animate-tracker-curve hidden lg:block"
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 50 180 C 150 40, 250 160, 380 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="340" cy="40" r="28" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Page Header Section */}
      <div className="relative mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end animate-tracker-fade-1">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-[#2161F5] uppercase">
            YOUR LEARNING JOURNEY
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            My Progress Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your learning, stay consistent and achieve your goals.
          </p>
        </div>

        {/* Right side motivational vertical divider quote */}
        <div className="hidden sm:flex items-center gap-3 text-right">
          <div className="h-10 w-[2px] rounded-full bg-slate-200" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase leading-none">
              Consistent
            </span>
            <span className="text-[12px] font-bold text-slate-700 leading-snug">
              Progress Creates
            </span>
            <span className="text-[10px] font-medium text-slate-400 leading-none">
              Extraordinary Results.
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 animate-tracker-fade-2">
        {/* LEFT COLUMN: Overview Card (span 6) */}
        <div className="lg:col-span-6">
          <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/70 bg-white/80 p-5 sm:p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Overview</h2>
              </div>

              {/* 4 Stat Cards in 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Stat 1: Tasks Completed */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white/70 p-4 shadow-2xs transition-all duration-200 hover:border-blue-100 hover:shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden stat-icon">
                        <img src="/images/dashboard/tasks.svg" alt="Tasks Completed" className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <div className="text-2xl font-extrabold text-slate-900">
                          {stats?.tasksCompleted ?? 24}
                        </div>
                        <div className="text-[11px] font-medium text-slate-400">
                          Tasks Completed
                        </div>
                      </div>
                    </div>

                    {/* Miniature Blue Sparkline */}
                    <svg className="w-14 h-8 text-[#2161F5]" viewBox="0 0 60 30" fill="none">
                      <path
                        d="M 2 22 C 15 25, 25 10, 40 18 C 48 22, 52 8, 58 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Stat 2: Weekly Goal */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white/70 p-4 shadow-2xs transition-all duration-200 hover:border-amber-100 hover:shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden stat-icon">
                        <img src="/images/dashboard/clock.svg" alt="Weekly Goal" className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <div className="text-2xl font-extrabold text-slate-900">
                          {weeklyGoalInput}%
                        </div>
                        <div className="text-[11px] font-medium text-slate-400">
                          Weekly Goal
                        </div>
                      </div>
                    </div>

                    {/* Miniature Orange Sparkline */}
                    <svg className="w-14 h-8 text-amber-500" viewBox="0 0 60 30" fill="none">
                      <path
                        d="M 2 24 C 18 26, 26 14, 40 15 C 48 16, 52 8, 58 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Stat 3: Day Streak */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white/70 p-4 shadow-2xs transition-all duration-200 hover:border-orange-100 hover:shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden stat-icon">
                        <img src="/images/dashboard/streak.svg" alt="Day Streak" className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <div className="text-2xl font-extrabold text-slate-900">
                          {streak?.days ?? 7}
                        </div>
                        <div className="text-[11px] font-medium text-slate-400">
                          Day Streak
                        </div>
                      </div>
                    </div>

                    {/* Miniature Coral Sparkline */}
                    <svg className="w-14 h-8 text-orange-500" viewBox="0 0 60 30" fill="none">
                      <path
                        d="M 2 25 C 14 26, 22 18, 35 20 C 45 22, 50 10, 58 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Stat 4: XP Earned */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white/70 p-4 shadow-2xs transition-all duration-200 hover:border-purple-100 hover:shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden stat-icon">
                        <img src="/images/dashboard/xp.svg" alt="XP Earned" className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <div className="text-2xl font-extrabold text-slate-900">
                          {stats?.xpEarned ?? 1250}
                        </div>
                        <div className="text-[11px] font-medium text-slate-400">
                          XP Earned
                        </div>
                      </div>
                    </div>

                    {/* Miniature Purple Sparkline */}
                    <svg className="w-14 h-8 text-purple-600" viewBox="0 0 60 30" fill="none">
                      <path
                        d="M 2 24 C 15 25, 22 15, 38 18 C 48 20, 52 7, 58 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Learning Streak Section */}
              <div className="mt-5 rounded-2xl border border-slate-100/90 bg-slate-50/40 p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Learning Streak
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Streak and Day Dots */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 shadow-2xs">
                      <Flame size={20} strokeWidth={2.2} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {streak?.days ?? 7} Days Streak
                      </p>
                      <div className="mt-1.5 flex gap-1.5">
                        {(streak?.weekPattern ?? [true, true, true, true, true, true, false]).map(
                          (active, index) => (
                            <span
                              key={index}
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                                active
                                  ? 'bg-[#2161F5] text-white shadow-xs'
                                  : 'bg-slate-200/80 text-slate-400'
                              }`}
                            >
                              {WEEKDAY_LETTERS[index]}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Quote with Oversized Quotation Mark */}
                  <div className="relative pl-4 border-l border-slate-200/80 flex items-center text-left">
                    <span className="text-3xl font-serif text-blue-400/30 leading-none mr-2 select-none">
                      “
                    </span>
                    <p className="text-xs font-medium text-slate-500 leading-snug">
                      Small steps daily<br />lead to big results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Weekly Progress Card (span 6) */}
        <div className="lg:col-span-6">
          <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/70 bg-white/80 p-5 sm:p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md">
            <div>
              {/* Header */}
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Weekly Progress</h2>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-100">
                    {weekly?.changeLabel ?? '↑ +12% from last week'}
                  </span>
                  <button
                    type="button"
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                    aria-label="More options"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Main Progress Metric */}
              <div className="mb-2">
                <div className="text-3xl font-extrabold text-slate-900">
                  {weekly?.totalPercent ?? 65}%
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Total progress this week</p>
              </div>

              {/* SVG Bezier Progress Chart */}
              <div className="mt-2">
                <ProgressChart
                  points={weekly?.points ?? [38, 55, 65, 78, 66, 72, 85]}
                  labels={weekly?.dayLabels}
                  initialActiveIndex={3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULL WIDTH: Subject Progress Card */}
      <div className="mt-6 rounded-3xl border border-slate-200/70 bg-white/80 p-5 sm:p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md animate-tracker-fade-3">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Subject Progress</h2>
          <NavLink
            to="/student/courses"
            className="group flex items-center gap-1 text-xs font-semibold text-[#2161F5] hover:text-blue-700 transition-colors"
          >
            <span>View All</span>
            <ChevronRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </NavLink>
        </div>

        {/* 4 Course Progress Rows */}
        <div className="flex flex-col gap-3">
          {(courses?.slice(0, 4) ?? []).map((course, idx) => {
            // Pick corresponding subject icon and container color
            const iconRender =
              idx === 0 ? (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2161F5]">
                  <Code2 size={18} strokeWidth={2} />
                </div>
              ) : idx === 1 ? (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Palette size={18} strokeWidth={2} />
                </div>
              ) : idx === 2 ? (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Layers size={18} strokeWidth={2} />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <PieChart size={18} strokeWidth={2} />
                </div>
              );

            const lessonsCount = course.lessonsCompleted ?? (idx === 0 ? 12 : idx === 1 ? 9 : idx === 2 ? 14 : 5);
            const totalLessons = course.totalLessons ?? (idx === 0 ? 15 : idx === 1 ? 20 : idx === 2 ? 22 : 18);
            const timeSpent = course.timeSpent ?? (idx === 0 ? '4h 30m' : idx === 1 ? '3h 10m' : idx === 2 ? '5h 15m' : '2h 40m');

            return (
              <div
                key={course.id}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-slate-100 bg-white/60 p-3.5 sm:px-5 transition-all duration-200 hover:border-blue-100 hover:bg-blue-50/20 hover:shadow-xs"
              >
                {/* Subject Info */}
                <div className="flex items-center gap-3.5 min-w-[240px]">
                  {iconRender}
                  <div className="min-w-0">
                    <h3 className="text-[13.5px] font-bold text-slate-800 transition-colors group-hover:text-[#2161F5] truncate">
                      {course.name}
                    </h3>
                  </div>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="flex flex-1 items-center gap-3 max-w-md">
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#2161F5] animate-progress-fill"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-800 min-w-[36px] text-right">
                    {course.progressPercent}%
                  </span>
                </div>

                {/* Lessons & Learning Time Metadata */}
                <div className="flex items-center justify-between md:justify-end gap-5 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <FileText size={13} className="text-slate-400" />
                    <span>
                      {lessonsCount}/{totalLessons} Lessons
                    </span>
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock size={13} className="text-slate-400" />
                    <span>{timeSpent}</span>
                  </span>

                  {/* Navigation Arrow Button */}
                  <NavLink
                    to={`/student/courses/${course.id}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all duration-200 group-hover:bg-[#2161F5] group-hover:text-white group-hover:translate-x-1"
                    aria-label={`View ${course.name}`}
                  >
                    <ChevronRight size={14} />
                  </NavLink>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULL WIDTH: Bottom Motivational CTA Banner */}
      <div className="relative mt-6 overflow-hidden rounded-3xl border border-blue-100/80 bg-gradient-to-r from-blue-50/70 via-white/80 to-indigo-50/60 p-6 shadow-xs backdrop-blur-xl animate-tracker-fade-4">
        {/* Subtle 2D background curve graphic */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-full w-80 text-blue-200/40"
          viewBox="0 0 320 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 20 120 C 100 30, 220 110, 320 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <circle cx="260" cy="35" r="28" stroke="currentColor" strokeWidth="1" />
        </svg>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100/90 text-[#2161F5] shadow-xs">
              <Target size={24} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Stay consistent. Go further.
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Track your progress, complete your goals, and build the future you want.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setGoalModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-[#2161F5] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs shadow-blue-500/25 transition-all duration-200 hover:bg-blue-600 hover:scale-[1.02] active:scale-98 cursor-pointer"
          >
            <span>Set a New Goal</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Confirmation Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900/90 px-4 py-3 text-xs font-semibold text-white shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2">
          <Check size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Interactive Goal Setting Modal */}
      {goalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
          <div
            className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl transition-all"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2161F5]">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Set Learning Goal</h3>
                  <p className="text-xs text-slate-400">Personalize your sprint milestones</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGoalModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Weekly Goal Target (%)
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  required
                  value={weeklyGoalInput}
                  onChange={(e) => setWeeklyGoalInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Study Hours (per week)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  required
                  value={targetHoursInput}
                  onChange={(e) => setTargetHoursInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGoalModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2161F5] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-600 active:scale-98 cursor-pointer"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
