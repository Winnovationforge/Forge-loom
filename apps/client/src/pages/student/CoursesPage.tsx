import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Calendar,
  XCircle,
  Search,
  Filter,
  ChevronDown,
  ArrowRight,
  FileText,
  Video,
  Trophy,
  Sparkles,
  Quote,
} from 'lucide-react';
import { useStudentActivity, useStudentCourses } from '../../features/student/hooks';
import type { CourseStatus } from '../../features/student/types';
import { PageLoading } from '../../components/ui/PageLoading';

type TabValue = 'all' | CourseStatus;

const TABS: { value: TabValue; label: string }[] = [
  { value: 'all', label: 'All Courses' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'dropped', label: 'Dropped' },
];

export function CoursesPage() {
  const { data: courses, isLoading: coursesLoading } = useStudentCourses();
  const { data: activityData, isLoading: activityLoading } = useStudentActivity();

  const [tab, setTab] = useState<TabValue>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter courses based on active tab and search input
  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    let list = tab === 'all' ? courses : courses.filter((c) => c.status === tab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    return list;
  }, [courses, tab, searchQuery]);

  // Compute breakdown stats
  const overview = useMemo(() => {
    const list = courses ?? [];
    const enrolled = list.length;
    const inProgress = list.filter((c) => c.status === 'in_progress').length;
    const completed = list.filter((c) => c.status === 'completed').length;
    const upcoming = list.filter((c) => c.status === 'upcoming').length;
    const dropped = list.filter((c) => c.status === 'dropped').length;
    const overallPercent = enrolled
      ? Math.round(list.reduce((sum, c) => sum + c.progressPercent, 0) / enrolled)
      : 0;

    return { enrolled, inProgress, completed, upcoming, dropped, overallPercent };
  }, [courses]);

  // Default recent activity list matching the reference image
  const recentActivity = [
    {
      id: 'act-1',
      title: 'Completed Lesson 12',
      course: 'Full Stack Web Development',
      timeAgo: '2h ago',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border border-emerald-100/70',
    },
    {
      id: 'act-2',
      title: 'Submitted Assignment',
      course: 'Data Structures & Algorithms',
      timeAgo: '5h ago',
      icon: FileText,
      color: 'bg-purple-50 text-purple-600 border border-purple-100/70',
    },
    {
      id: 'act-3',
      title: 'Watched Lesson 8',
      course: 'UI/UX Design Fundamentals',
      timeAgo: '1d ago',
      icon: Video,
      color: 'bg-blue-50 text-[#2161F5] border border-blue-100/70',
    },
    {
      id: 'act-4',
      title: 'Scored 85% in Quiz',
      course: 'Cyber Security Basics',
      timeAgo: '2d ago',
      icon: Trophy,
      color: 'bg-amber-50 text-amber-600 border border-amber-100/70',
    },
  ];

  if (coursesLoading || activityLoading) {
    return <PageLoading />;
  }

  // Circular progress math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (overview.overallPercent / 100) * circumference;

  return (
    <div className="w-full max-w-[1520px] mx-auto flex flex-col gap-6">
      {/* ================= BREADCRUMB & PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-slate-400 mb-1.5">
            <Link to="/student" className="text-[#2161F5] hover:underline transition-colors">
              Home
            </Link>
            <span className="text-slate-300">›</span>
            <span className="text-slate-600">Courses</span>
          </div>

          <h1 className="text-[32px] sm:text-[36px] font-extrabold text-[#15213D] tracking-tight">
            My Courses
          </h1>
          <p className="text-[14px] sm:text-[14.5px] text-[#617594] mt-1">
            Continue your learning journey. Explore, track, and complete your courses.
          </p>
        </div>

        {/* Right Motivational Quote */}
        <div className="hidden lg:flex items-start gap-3 pl-4 border-l border-slate-200/70">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
            Better<br />
            Learners<br />
            Brighter<br />
            Tomorrows
          </div>
        </div>
      </div>

      {/* ================= COURSE FILTER BAR ================= */}
      <div className="forge-dashboard-card p-2 sm:p-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {TABS.map((item) => {
            const isActive = tab === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setTab(item.value)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#2161F5] text-white shadow-xs'
                    : 'text-[#617594] hover:text-[#15213D] hover:bg-slate-100/70'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Search & Filter Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative flex items-center w-full sm:w-60">
            <Search
              size={15}
              className="absolute left-3 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your courses..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-50/90 border border-slate-200/80 text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#2161F5] focus:bg-white transition-colors"
            />
          </div>

          <button
            type="button"
            className="h-9 px-3.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-[13px] font-medium text-slate-700 flex items-center gap-2 cursor-pointer shadow-2xs transition-colors shrink-0"
          >
            <Filter size={14} className="text-slate-500" />
            <span>Filter</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* ================= MAIN 2-COLUMN LAYOUT ================= */}
      <div className="flex flex-col xl:flex-row gap-7">
        {/* ================= LEFT / MAIN CONTENT AREA ================= */}
        <div className="flex-1 min-w-0">
          {filteredCourses.length === 0 ? (
            /* PRECISE 2D EMPTY STATE MATCHING REFERENCE */
            <div className="forge-dashboard-card p-10 sm:p-16 min-h-[480px] flex flex-col items-center justify-center text-center relative overflow-hidden">
              {/* Background ambient radial glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-100/30 blur-3xl pointer-events-none" />

              {/* Abstract 2D Layered Book Illustration */}
              <div className="relative flex items-center justify-center animate-float-illustration">
                {/* Back Layered Card */}
                <div className="absolute w-24 h-24 rounded-2xl bg-[#E0EDFF]/80 -rotate-6 translate-x-3 translate-y-1.5 shadow-xs" />

                {/* Middle Layered Card */}
                <div className="absolute w-24 h-24 rounded-2xl bg-[#D6E6FF]/85 rotate-3 -translate-x-2 translate-y-0.5 shadow-xs" />

                {/* Front White Frosted Card */}
                <div className="relative z-10 w-24 h-24 rounded-2xl bg-white/95 border border-blue-200/70 shadow-sm flex items-center justify-center">
                  <BookOpen size={34} className="text-[#2161F5]" strokeWidth={1.8} />
                </div>

                {/* Sparkle Lines on Top Right */}
                <div className="absolute -top-3 -right-6 pointer-events-none animate-sparkle">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <line x1="12" y1="2" x2="12" y2="7" stroke="#2161F5" strokeWidth="2.2" strokeLinecap="round" />
                    <line x1="19" y1="5" x2="15.5" y2="8.5" stroke="#2161F5" strokeWidth="2.2" strokeLinecap="round" />
                    <line x1="22" y1="12" x2="17" y2="12" stroke="#2161F5" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Headline & Description */}
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#15213D] mt-7">
                No courses in this category yet
              </h2>
              <p className="text-[14px] text-[#617594] max-w-md mt-2 leading-relaxed">
                Looks like you haven&apos;t added any courses here. Start exploring the catalog to begin your learning journey.
              </p>

              {/* Primary CTA Button */}
              <Link
                to="/student/catalog"
                className="mt-6 inline-flex items-center gap-2 h-11 px-7 rounded-xl bg-[#2161F5] hover:bg-[#1748C7] text-white font-semibold text-[13.5px] shadow-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                <span>Browse Courses</span>
                <ArrowRight size={15} strokeWidth={2.2} />
              </Link>

              {/* Secondary Action */}
              <Link
                to="/student/catalog"
                className="mt-3.5 text-[13px] font-medium text-[#2161F5] hover:underline transition-colors"
              >
                View Course Catalog
              </Link>
            </div>
          ) : (
            /* ACTIVE COURSES LIST (If courses exist) */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/student/courses/${course.id}`}
                  className="course-card forge-dashboard-card p-5 flex flex-col justify-between group hover:border-blue-200/80 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#2161F5] border border-blue-100">
                      <BookOpen size={20} strokeWidth={1.8} />
                    </div>
                    <span className="glass-floating-badge px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#2161F5]">
                      {course.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-[15px] font-bold text-[#15213D] leading-snug group-hover:text-[#2161F5] transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-[12px] text-slate-500 mt-1">
                      {course.level} · {course.updatedLabel}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11.5px] font-semibold text-slate-600 mb-1.5">
                      <span>Progress</span>
                      <span>{course.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2161F5] rounded-full transition-all duration-500"
                        style={{ width: `${course.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT INFORMATION COLUMN ================= */}
        <div className="w-full xl:w-[380px] shrink-0 flex flex-col gap-6">
          {/* 1. COURSE PROGRESS OVERVIEW CARD */}
          <div className="forge-dashboard-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-bold text-[#15213D]">
                  Course Progress Overview
                </h2>
                <Link
                  to="/student/tracker"
                  className="text-[12.5px] font-semibold text-[#2161F5] hover:underline flex items-center gap-1 transition-colors"
                >
                  View Details <ArrowRight size={13} />
                </Link>
              </div>

              {/* Progress Ring & Breakdown */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Circular Gauge */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background track */}
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        stroke="#E2E8F0"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      {/* Animated Progress Ring */}
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        stroke="#2161F5"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <span className="absolute text-[20px] font-extrabold text-[#15213D]">
                      {overview.overallPercent}%
                    </span>
                  </div>
                  <span className="text-[11.5px] font-medium text-[#617594] mt-1.5">
                    Overall Progress
                  </span>
                </div>

                {/* Semantic Counts List */}
                <div className="flex-1 w-full space-y-2.5 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#617594] font-medium">
                      <BookOpen size={14} className="text-[#2161F5]" />
                      Courses Enrolled
                    </span>
                    <span className="font-bold text-[#15213D]">{overview.enrolled}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#617594] font-medium">
                      <PlayCircle size={14} className="text-sky-500" />
                      In Progress
                    </span>
                    <span className="font-bold text-[#15213D]">{overview.inProgress}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#617594] font-medium">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      Completed
                    </span>
                    <span className="font-bold text-[#15213D]">{overview.completed}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#617594] font-medium">
                      <Calendar size={14} className="text-amber-500" />
                      Upcoming
                    </span>
                    <span className="font-bold text-[#15213D]">{overview.upcoming}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#617594] font-medium">
                      <XCircle size={14} className="text-rose-500" />
                      Dropped
                    </span>
                    <span className="font-bold text-[#15213D]">{overview.dropped}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Motivational Quote Box */}
            <div className="mt-5 rounded-xl bg-[#EFF6FF]/75 border border-blue-100/70 p-3.5 flex items-start gap-2.5">
              <Quote size={15} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="text-[11.5px] text-slate-600 italic leading-relaxed">
                &ldquo;A little progress each day adds up to big results.&rdquo;
              </p>
            </div>
          </div>

          {/* 2. RECENT ACTIVITY CARD */}
          <div className="forge-dashboard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-bold text-[#15213D]">
                Recent Activity
              </h2>
              <Link
                to="/student/tracker"
                className="text-[12.5px] font-semibold text-[#2161F5] hover:underline flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight size={13} />
              </Link>
            </div>

            <div className="flex flex-col divide-y divide-slate-100">
              {recentActivity.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between py-3 first:pt-1 last:pb-1 group hover:bg-slate-50/50 rounded-xl px-2 -mx-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${act.color} shadow-2xs`}
                    >
                      <act.icon size={16} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#15213D] leading-tight">
                        {act.title}
                      </span>
                      <span className="text-[11.5px] text-[#617594] mt-0.5">
                        {act.course}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 shrink-0">
                    {act.timeAgo}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. EXPLORE NEW OPPORTUNITIES CARD */}
          <Link
            to="/student/catalog"
            className="forge-dashboard-card p-4 sm:p-5 flex items-center justify-between gap-3 group hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50/90 border border-blue-100/70 text-[#2161F5] shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <Sparkles size={18} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[13.5px] font-bold text-[#15213D] leading-tight">
                  Explore New Opportunities
                </h3>
                <p className="text-[11.5px] text-[#617594] mt-0.5">
                  Find new courses, skill up, and get certified.
                </p>
              </div>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full glass-pill-btn text-[#2161F5] group-hover:scale-105 transition-transform shrink-0">
              <ArrowRight size={14} strokeWidth={2.2} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
