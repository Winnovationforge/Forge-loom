import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  MoreHorizontal,
  MoreVertical,
  ArrowRight,
  Linkedin,
  Mail,
  Video,
  Building2,
  Layers,
  Quote,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import {
  useFeaturedEvent,
  useStudentCourses,
  useStudentMentor,
  useStudentStats,
  useStudentUpcomingEvents,
} from '../../features/student/hooks';
import { PageLoading } from '../../components/ui/PageLoading';

export function HomePage() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useStudentStats();
  const { data: coursesData, isLoading: coursesLoading } = useStudentCourses();
  const { data: eventsData, isLoading: eventsLoading } = useStudentUpcomingEvents();
  const { data: mentorData, isLoading: mentorLoading } = useStudentMentor();
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedEvent();

  const [registered, setRegistered] = useState(false);
  const [courseFilter, setCourseFilter] = useState<'all' | 'in_progress' | 'not_started'>('all');
  const [eventTab, setEventTab] = useState<'upcoming' | 'registered'>('upcoming');

  if (statsLoading || coursesLoading || eventsLoading || mentorLoading || featuredLoading) {
    return <PageLoading />;
  }

  const firstName = user?.email.split('@')[0] ?? 'student1';

  // Fallback / default courses to guarantee the exact 4 reference items
  const allCourseCards = [
    {
      id: 'course-1',
      title: 'Full Stack Web Development',
      status: 'In Progress',
      progress: 65,
      variant: 'deep-blue',
    },
    {
      id: 'course-2',
      title: 'UI/UX Design Fundamentals',
      status: 'Not Started',
      progress: 0,
      variant: 'light-swoosh',
    },
    {
      id: 'course-3',
      title: 'Data Structures & Algorithms',
      status: 'In Progress',
      progress: 40,
      variant: 'navy-sphere',
    },
    {
      id: 'course-4',
      title: 'Product Management Essentials',
      status: 'Not Started',
      progress: 0,
      variant: 'sky-gradient',
    },
  ];

  const filteredCourses = allCourseCards.filter((c) => {
    if (courseFilter === 'in_progress') return c.status === 'In Progress';
    if (courseFilter === 'not_started') return c.status === 'Not Started';
    return true;
  });

  // Upcoming events matching the reference
  const upcomingEvents = [
    {
      id: 'evt-1',
      month: 'MAY',
      day: '28',
      title: 'Frontend Sprint Review',
      timeLocation: '10:00 AM – 11:30 AM · Online',
      icon: Video,
    },
    {
      id: 'evt-2',
      month: 'MAY',
      day: '30',
      title: 'Mentor Session',
      timeLocation: '2:00 PM – 3:00 PM · Virtual Room 2',
      icon: Video,
    },
    {
      id: 'evt-3',
      month: 'JUN',
      day: '2',
      title: 'UI/UX Workshop',
      timeLocation: '11:00 AM – 1:00 PM · Seminar Hall',
      icon: Building2,
    },
  ];

  return (
    <div className="w-full max-w-[1520px] mx-auto flex flex-col xl:flex-row gap-7">
      {/* ================= LEFT / CENTER MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {/* 1. WELCOME SECTION */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#2161F5] tracking-[0.16em] uppercase">
              GOOD TO SEE YOU AGAIN
            </span>
            <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#15213D] tracking-tight mt-0.5">
              Welcome back, {firstName}
            </h1>
            <p className="text-[14px] sm:text-[14.5px] text-[#617594] mt-1">
              Keep learning, keep building. Your next milestone is closer than you think.
            </p>
          </div>

          {/* Right Motivational Note */}
          <div className="hidden lg:flex items-center gap-3 pl-4">
            <div className="w-[2px] h-9 bg-blue-500/70 rounded-full" />
            <div className="text-[12px] font-medium text-slate-500 leading-snug">
              Small progress<br />
              every day creates<br />
              big results.
            </div>
          </div>
        </section>

        {/* 2. FOUR STATISTICS CARDS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Courses Enrolled */}
          <div className="forge-dashboard-card p-5 stat-card relative overflow-hidden flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl overflow-hidden stat-icon shadow-xs transition-transform duration-300 hover:scale-105">
                <img
                  src="/images/dashboard/courses.svg"
                  alt="Courses Enrolled"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="relative z-10 mt-3">
              <div className="text-[26px] sm:text-[28px] font-extrabold text-[#15213D] leading-none">
                {stats?.coursesEnrolled ?? 6}
              </div>
              <div className="text-[12px] font-medium text-[#617594] mt-1.5">
                Courses Enrolled
              </div>
            </div>
            {/* Sparkline Blue SVG */}
            <svg
              className="absolute right-3 bottom-3 w-16 h-8 pointer-events-none stroke-[#2161F5] fill-none opacity-80"
              viewBox="0 0 64 32"
            >
              <path
                d="M 0 24 Q 16 28 28 16 T 50 12 T 64 6"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Card 2: Tasks Completed */}
          <div className="forge-dashboard-card p-5 stat-card relative overflow-hidden flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl overflow-hidden stat-icon shadow-xs transition-transform duration-300 hover:scale-105">
                <img
                  src="/images/dashboard/tasks.svg"
                  alt="Tasks Completed"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="relative z-10 mt-3">
              <div className="text-[26px] sm:text-[28px] font-extrabold text-[#15213D] leading-none">
                {stats?.tasksCompleted ?? 24}
              </div>
              <div className="text-[12px] font-medium text-[#617594] mt-1.5">
                Tasks Completed
              </div>
            </div>
            {/* Sparkline Green SVG */}
            <svg
              className="absolute right-3 bottom-3 w-16 h-8 pointer-events-none stroke-emerald-500 fill-none opacity-80"
              viewBox="0 0 64 32"
            >
              <path
                d="M 0 26 Q 18 26 30 18 T 52 14 T 64 8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Card 3: Current Streak */}
          <div className="forge-dashboard-card p-5 stat-card relative overflow-hidden flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl overflow-hidden stat-icon shadow-xs transition-transform duration-300 hover:scale-105">
                <img
                  src="/images/dashboard/streak.svg"
                  alt="Current Streak"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="relative z-10 mt-3">
              <div className="text-[26px] sm:text-[28px] font-extrabold text-[#15213D] leading-none">
                {stats?.currentStreak ?? 7} days
              </div>
              <div className="text-[12px] font-medium text-[#617594] mt-1.5">
                Current Streak
              </div>
            </div>
            {/* Sparkline Orange SVG */}
            <svg
              className="absolute right-3 bottom-3 w-16 h-8 pointer-events-none stroke-amber-500 fill-none opacity-80"
              viewBox="0 0 64 32"
            >
              <path
                d="M 0 28 Q 16 22 32 20 T 52 10 T 64 6"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Card 4: XP Earned */}
          <div className="forge-dashboard-card p-5 stat-card relative overflow-hidden flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl overflow-hidden stat-icon shadow-xs transition-transform duration-300 hover:scale-105">
                <img
                  src="/images/dashboard/xp.svg"
                  alt="XP Earned"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="relative z-10 mt-3">
              <div className="text-[26px] sm:text-[28px] font-extrabold text-[#15213D] leading-none">
                {stats?.xpEarned ?? 1250}
              </div>
              <div className="text-[12px] font-medium text-[#617594] mt-1.5">
                XP Earned
              </div>
            </div>
            {/* Sparkline Purple SVG */}
            <svg
              className="absolute right-3 bottom-3 w-16 h-8 pointer-events-none stroke-purple-500 fill-none opacity-80"
              viewBox="0 0 64 32"
            >
              <path
                d="M 0 26 Q 16 26 30 18 T 50 14 T 64 4"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </section>

        {/* 3. MY COURSES SECTION WITH GLASS FILTER TABS */}
        <section className="forge-dashboard-card p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[18px] sm:text-[19px] font-bold text-[#15213D]">
                My Courses
              </h2>
              {/* Glassmorphic Filter Tabs */}
              <div className="glass-tab-container">
                <button
                  type="button"
                  onClick={() => setCourseFilter('all')}
                  className={`glass-filter-tab ${
                    courseFilter === 'all'
                      ? 'glass-filter-tab-active'
                      : 'glass-filter-tab-inactive'
                  }`}
                >
                  All ({allCourseCards.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCourseFilter('in_progress')}
                  className={`glass-filter-tab ${
                    courseFilter === 'in_progress'
                      ? 'glass-filter-tab-active'
                      : 'glass-filter-tab-inactive'
                  }`}
                >
                  In Progress (2)
                </button>
                <button
                  type="button"
                  onClick={() => setCourseFilter('not_started')}
                  className={`glass-filter-tab ${
                    courseFilter === 'not_started'
                      ? 'glass-filter-tab-active'
                      : 'glass-filter-tab-inactive'
                  }`}
                >
                  Not Started (2)
                </button>
              </div>
            </div>

            <Link
              to="/student/courses"
              className="text-[13px] font-semibold text-[#2161F5] hover:underline flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="course-card rounded-2xl border border-slate-200/80 bg-white/90 overflow-hidden flex flex-col justify-between shadow-2xs group"
              >
                {/* 2D Abstract Graphic Header */}
                <div className="relative h-28 w-full overflow-hidden">
                  {course.variant === 'deep-blue' && (
                    <div className="h-full w-full bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#1D4ED8] relative course-thumb">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-blue-400/20 blur-md" />
                      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-blue-500/30" />
                    </div>
                  )}

                  {course.variant === 'light-swoosh' && (
                    <div className="h-full w-full bg-gradient-to-br from-[#E0E7FF] via-[#DBEAFE] to-[#EFF6FF] relative course-thumb">
                      <svg
                        className="absolute inset-0 w-full h-full stroke-blue-500/30 fill-none"
                        viewBox="0 0 100 60"
                        preserveAspectRatio="none"
                      >
                        <path d="M 0 40 C 30 10, 70 50, 100 20" strokeWidth="1.5" />
                        <path d="M 20 0 C 40 40, 70 20, 100 50" strokeWidth="1" strokeDasharray="3 3" />
                      </svg>
                    </div>
                  )}

                  {course.variant === 'navy-sphere' && (
                    <div className="h-full w-full bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#1E40AF] relative course-thumb">
                      <div className="absolute top-4 right-6 w-16 h-16 rounded-full bg-gradient-to-tr from-blue-700 to-sky-400 opacity-90 shadow-md" />
                    </div>
                  )}

                  {course.variant === 'sky-gradient' && (
                    <div className="h-full w-full bg-gradient-to-br from-[#E2E8F0] via-[#E0F2FE] to-[#F8FAFC] relative course-thumb">
                      <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-blue-200/50 blur-xs" />
                      <div className="absolute bottom-2 right-4 w-14 h-14 rounded-full bg-sky-300/40" />
                    </div>
                  )}

                  {/* Glassmorphic Status Badge */}
                  <div className="absolute bottom-2.5 left-3 z-10">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold transition-all ${
                        course.status === 'In Progress'
                          ? 'bg-[#2161F5]/90 text-white backdrop-blur-md border border-white/30 shadow-xs'
                          : 'glass-floating-badge text-slate-700'
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-[13px] font-bold text-[#15213D] leading-snug line-clamp-2 min-h-[36px]">
                      {course.title}
                    </h3>
                  </div>

                  <div className="mt-4 pt-2">
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2161F5] rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 mt-1.5">
                      {course.progress}% Complete
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. UPCOMING EVENTS SECTION WITH GLASS FILTER TABS */}
        <section className="forge-dashboard-card p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-[18px] sm:text-[19px] font-bold text-[#15213D]">
                Upcoming Events
              </h2>
              {/* Event Glass Tab Switcher */}
              <div className="glass-tab-container">
                <button
                  type="button"
                  onClick={() => setEventTab('upcoming')}
                  className={`glass-filter-tab ${
                    eventTab === 'upcoming'
                      ? 'glass-filter-tab-active'
                      : 'glass-filter-tab-inactive'
                  }`}
                >
                  Upcoming (3)
                </button>
                <button
                  type="button"
                  onClick={() => setEventTab('registered')}
                  className={`glass-filter-tab ${
                    eventTab === 'registered'
                      ? 'glass-filter-tab-active'
                      : 'glass-filter-tab-inactive'
                  }`}
                >
                  My Schedule
                </button>
              </div>
            </div>

            <Link
              to="/student/calendar"
              className="text-[13px] font-semibold text-[#2161F5] hover:underline flex items-center gap-1 transition-colors"
            >
              View Calendar <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-slate-100">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1 group hover:bg-slate-50/50 rounded-xl px-2 -mx-2 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  {/* Glass Date Badge */}
                  <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl glass-date-badge shrink-0">
                    <span className="text-[9.5px] font-bold text-[#2161F5] uppercase tracking-wider">
                      {evt.month}
                    </span>
                    <span className="text-[16px] font-black text-[#15213D] leading-none mt-0.5">
                      {evt.day}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-[13.5px] font-bold text-[#15213D] leading-tight">
                      {evt.title}
                    </h3>
                    <p className="text-[12px] text-[#617594] mt-1 flex items-center gap-1">
                      {evt.timeLocation}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glass-pill-btn text-[12px] font-semibold cursor-pointer"
                  >
                    <evt.icon size={13} strokeWidth={2.2} />
                    <span>Join</span>
                  </button>

                  <button
                    type="button"
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    aria-label="Event options"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ================= RIGHT INFORMATION COLUMN ================= */}
      <div className="w-full xl:w-[390px] shrink-0 flex flex-col gap-6">
        {/* 1. CITADEL 2.0 FEATURED EVENT CARD */}
        <div className="citadel-card rounded-[22px] p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-lg">
          {/* 2D subtle decorative curves */}
          <svg
            className="absolute -right-12 -bottom-10 w-64 h-64 pointer-events-none opacity-25 text-white stroke-current fill-none"
            viewBox="0 0 200 200"
          >
            <circle cx="120" cy="120" r="80" strokeWidth="2" />
            <circle cx="120" cy="120" r="60" strokeWidth="1" strokeDasharray="4 6" />
          </svg>

          <div>
            {/* Tag + Menu */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md border border-white/25 shadow-xs">
                <Star size={12} className="fill-white" />
                Featured Event
              </span>
              <button
                type="button"
                className="text-white/70 hover:text-white transition-colors cursor-pointer"
                aria-label="Event actions"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Title & Description */}
            <div className="relative z-10 mt-5">
              <h2 className="text-[26px] font-black tracking-tight text-white leading-tight">
                Citadel 2.0
              </h2>
              <p className="text-[13.5px] font-semibold text-blue-100 mt-1">
                Where Ideas Build Impact.
              </p>
              <p className="text-[12px] text-blue-100/90 mt-2.5 leading-relaxed font-normal">
                Join us for an action-packed experience of innovation, collaboration and learning. Be a part of something bigger.
              </p>
            </div>

            {/* 2x2 Details Grid */}
            <div className="relative z-10 mt-5 grid grid-cols-2 gap-y-3.5 gap-x-2 border-t border-white/20 pt-4 text-xs">
              <div className="flex flex-col">
                <span className="flex items-center gap-1.5 font-bold text-white text-[12.5px]">
                  <Calendar size={13} className="text-blue-200" />
                  5 Jun, 2026
                </span>
                <span className="text-[11px] text-blue-200/80 mt-0.5 ml-4.5">Date</span>
              </div>

              <div className="flex flex-col">
                <span className="flex items-center gap-1.5 font-bold text-white text-[12.5px]">
                  <Clock size={13} className="text-blue-200" />
                  9:30 AM – 10:30 AM
                </span>
                <span className="text-[11px] text-blue-200/80 mt-0.5 ml-4.5">Time</span>
              </div>

              <div className="flex flex-col">
                <span className="flex items-center gap-1.5 font-bold text-white text-[12.5px]">
                  <MapPin size={13} className="text-blue-200" />
                  Auditorium, Main Block
                </span>
                <span className="text-[11px] text-blue-200/80 mt-0.5 ml-4.5">Venue</span>
              </div>

              <div className="flex flex-col">
                <span className="flex items-center gap-1.5 font-bold text-white text-[12.5px]">
                  <Users size={13} className="text-blue-200" />
                  500+ Participants
                </span>
                <span className="text-[11px] text-blue-200/80 mt-0.5 ml-4.5">Participants</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => setRegistered(!registered)}
            className="relative z-10 mt-6 w-full h-11 bg-white hover:bg-blue-50 text-[#1748C7] font-bold text-[13.5px] rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-200 hover:scale-[1.01] cursor-pointer"
          >
            <span>{registered ? 'Registered' : 'Register Now'}</span>
            {!registered && <ArrowRight size={15} strokeWidth={2.2} />}
          </button>
        </div>

        {/* 2. MENTOR ASSIGNED CARD */}
        <div className="forge-dashboard-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-bold text-[#15213D]">
                Mentor Assigned
              </h2>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label="Mentor options"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Mentor Info */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-[#2161F5] font-bold text-sm border border-blue-100 shadow-2xs">
                {mentorData?.initials ?? 'RV'}
              </div>
              <div className="flex flex-col">
                <h3 className="text-[14.5px] font-bold text-[#15213D] leading-tight">
                  {mentorData?.name ?? 'Rohit Verma'}
                </h3>
                <p className="text-[11.5px] text-[#617594] mt-0.5">
                  {mentorData?.title ?? 'Full Stack Developer @ Forge'}
                </p>
                <div className="flex items-center gap-1 text-[11.5px] font-semibold text-amber-600 mt-1">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span>{mentorData?.rating ?? 4.9} ({mentorData?.reviewCount ?? 120}+ mentees)</span>
                </div>
              </div>
            </div>

            {/* Quote block */}
            <div className="mt-4 rounded-xl bg-slate-50/90 border border-slate-100 p-3.5 flex items-start gap-2.5">
              <Quote size={15} className="text-slate-300 shrink-0 mt-0.5" />
              <p className="text-[11.5px] text-slate-600 italic leading-relaxed">
                &ldquo;Great mentors don&apos;t just guide, they help you see your own potential.&rdquo;
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2.5">
            {/* Social & Message Buttons */}
            <div className="flex gap-2">
              <a
                href="#linkedin"
                onClick={(e) => e.preventDefault()}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl glass-floating-badge py-2 text-[12px] font-semibold text-slate-700 hover:text-[#2161F5] hover:border-blue-200 transition-all cursor-pointer"
              >
                <Linkedin size={14} className="text-blue-600" />
                <span>LinkedIn</span>
              </a>
              <a
                href="#message"
                onClick={(e) => e.preventDefault()}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl glass-floating-badge py-2 text-[12px] font-semibold text-slate-700 hover:text-[#2161F5] hover:border-blue-200 transition-all cursor-pointer"
              >
                <Mail size={14} className="text-slate-500" />
                <span>Message</span>
              </a>
            </div>

            {/* Primary Book Session Button */}
            <Link to="/student/mentor" className="w-full">
              <button
                type="button"
                className="w-full h-10 rounded-xl bg-[#2161F5] hover:bg-[#1748C7] text-white font-semibold text-[13px] flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Users size={15} />
                <span>Book a Session</span>
              </button>
            </Link>
          </div>
        </div>

        {/* 3. BOTTOM MOTIVATIONAL CARD */}
        <div className="forge-dashboard-card p-4 sm:p-5 flex items-center justify-between gap-3 group hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50/90 border border-blue-100/60 text-[#2161F5] shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
              <Layers size={18} strokeWidth={2.2} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[13.5px] font-bold text-[#15213D] leading-tight">
                Earn. Learn. Build.
              </h3>
              <p className="text-[11.5px] text-[#617594] mt-0.5">
                Turn your learning into opportunities.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full glass-pill-btn text-[#2161F5] hover:scale-105 transition-transform shrink-0 cursor-pointer"
            aria-label="Learn more about opportunities"
          >
            <ArrowRight size={14} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}
