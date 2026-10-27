import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  AlignLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  CalendarCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  MapPin,
  MessageSquare,
  Plus,
  RefreshCw,
  Share2,
  Sparkles,
  Tag,
  Video,
  X,
} from 'lucide-react';
import { useCalendarEntries } from '../../features/student/hooks';
import type { CalendarEntry, CalendarCategory } from '../../features/student/types';
import { PageLoading } from '../../components/ui/PageLoading';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const CATEGORY_STYLES: Record<
  CalendarCategory,
  {
    pill: string;
    dot: string;
    badge: string;
    label: string;
  }
> = {
  course: {
    pill: 'bg-blue-50/90 text-blue-700 border-blue-200/70 hover:bg-blue-100/90',
    dot: 'bg-[#2161F5]',
    badge: 'bg-blue-50 text-[#2161F5] border-blue-100/80',
    label: 'Course',
  },
  mentorship: {
    pill: 'bg-teal-50/90 text-teal-700 border-teal-200/70 hover:bg-teal-100/90',
    dot: 'bg-[#0D9488]',
    badge: 'bg-teal-50 text-teal-700 border-teal-100/80',
    label: 'Mentorship',
  },
  workshop: {
    pill: 'bg-amber-50/90 text-amber-700 border-amber-200/70 hover:bg-amber-100/90',
    dot: 'bg-[#EA580C]',
    badge: 'bg-amber-50 text-amber-700 border-amber-100/80',
    label: 'Workshop',
  },
  event: {
    pill: 'bg-rose-50/90 text-rose-700 border-rose-200/70 hover:bg-rose-100/90',
    dot: 'bg-[#E11D48]',
    badge: 'bg-rose-50 text-rose-700 border-rose-100/80',
    label: 'Event',
  },
  personal: {
    pill: 'bg-purple-50/90 text-purple-700 border-purple-200/70 hover:bg-purple-100/90',
    dot: 'bg-[#7C3AED]',
    badge: 'bg-purple-50 text-purple-700 border-purple-100/80',
    label: 'Personal',
  },
};

function formatEventCategory(entry: CalendarEntry): CalendarCategory {
  if (entry.category && CATEGORY_STYLES[entry.category]) {
    return entry.category;
  }
  const t = entry.title.toLowerCase();
  if (t.includes('review') || t.includes('course') || t.includes('assignment')) return 'course';
  if (t.includes('mentor') || t.includes('1-on-1')) return 'mentorship';
  if (t.includes('workshop') || t.includes('meetup') || t.includes('design')) return 'workshop';
  if (t.includes('hackathon') || t.includes('ceremony')) return 'event';
  return 'personal';
}

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

interface CalendarCell {
  day: number;
  dateKey: string;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function CalendarPage() {
  const { data: initialEntries, isLoading } = useCalendarEntries();

  // Local state allowing user to add events dynamically
  const [customEntries, setCustomEntries] = useState<CalendarEntry[]>([]);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Seed calendar date anchors to May 2026
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(4); // May (0-indexed)
  const [selectedDate, setSelectedDate] = useState('2026-05-28');

  // Add Event Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDate, setNewDate] = useState('2026-05-28');
  const [newTime, setNewTime] = useState('10:00 AM – 11:30 AM');
  const [newLocation, setNewLocation] = useState('Online');
  const [newCategory, setNewCategory] = useState<CalendarCategory>('course');
  const [newNotes, setNewNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Dropdown toggles
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [syncToast, setSyncToast] = useState(false);

  // Combine fetched entries with client-added events
  const allEntries = useMemo(() => {
    const list = [...(initialEntries ?? []), ...customEntries];
    return list;
  }, [initialEntries, customEntries]);

  // Group entries by date
  const entriesByDate = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    allEntries.forEach((entry) => {
      const existing = map.get(entry.date) ?? [];
      map.set(entry.date, [...existing, entry]);
    });
    return map;
  }, [allEntries]);

  // Upcoming entries for left column list (sorted chronologically)
  const upcomingList = useMemo(() => {
    return [...allEntries].sort((a, b) => a.date.localeCompare(b.date));
  }, [allEntries]);

  // Compute 35 or 42 grid cells with previous & next month dates
  const gridCells = useMemo(() => {
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const firstDayWeekday = new Date(year, month, 1).getDay(); // 0 is Sun
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: CalendarCell[] = [];

    // Previous month filler days
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, day);
      const dateKey = toDateKey(prevDate.getFullYear(), prevDate.getMonth(), day);
      cells.push({
        day,
        dateKey,
        isCurrentMonth: false,
        isToday: dateKey === '2026-05-28',
      });
    }

    // Current month days
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateKey = toDateKey(year, month, day);
      cells.push({
        day,
        dateKey,
        isCurrentMonth: true,
        isToday: dateKey === '2026-05-28',
      });
    }

    // Next month filler days to complete grid (up to 35 or 42)
    const totalCells = cells.length > 35 ? 42 : 35;
    const remaining = totalCells - cells.length;
    for (let day = 1; day <= remaining; day++) {
      const nextDate = new Date(year, month + 1, day);
      const dateKey = toDateKey(nextDate.getFullYear(), nextDate.getMonth(), day);
      cells.push({
        day,
        dateKey,
        isCurrentMonth: false,
        isToday: dateKey === '2026-05-28',
      });
    }

    return cells;
  }, [year, month]);

  function goToMonth(offset: number) {
    const next = new Date(year, month + offset, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  function goToToday() {
    setYear(2026);
    setMonth(4);
    setSelectedDate('2026-05-28');
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setNewTitle('');
    setNewSubtitle('');
    setNewNotes('');
    setFormError(null);
    setSaveSuccess(false);
    setIsCategoryOpen(false);
    setIsTimeOpen(false);
    setIsLocationOpen(false);
  }

  // Close modal on Escape key press
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('Please enter an event title.');
      return;
    }

    setFormError(null);
    setIsSaving(true);

    // Simulate realistic asynchronous save
    await new Promise((resolve) => setTimeout(resolve, 350));

    const newEntry: CalendarEntry = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Custom Session',
      timeLabel: newTime.trim() || '10:00 AM',
      location: newLocation.trim() || 'Online',
      date: newDate,
      category: newCategory,
      categoryLabel: CATEGORY_STYLES[newCategory].label,
      notes: newNotes.trim() || undefined,
    };

    setCustomEntries((prev) => [...prev, newEntry]);
    setSelectedDate(newDate);
    setIsSaving(false);
    setSaveSuccess(true);
  }

  function handleSyncCalendar() {
    setSyncToast(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText('webcal://forge-lms.internal/calendar/feed.ics');
    }
    setTimeout(() => {
      setSyncToast(false);
    }, 3500);
  }

  if (isLoading) {
    return <PageLoading />;
  }

  const selectedEntries = entriesByDate.get(selectedDate) ?? [];
  const selectedDateObj = new Date(`${selectedDate}T00:00:00`);

  return (
    <div className="relative min-h-screen pb-16">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-10 -left-10 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="pointer-events-none absolute top-40 right-0 h-[450px] w-[450px] rounded-full bg-indigo-50/40 blur-3xl" />

      {/* Header Section */}
      <div className="relative mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-[#2161F5] uppercase">
            STAY ORGANISED
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Stay on track with your schedule and events.
          </p>
        </div>

        <div className="hidden sm:block text-right">
          <p className="text-xs sm:text-[13px] font-medium italic text-slate-400">
            &ldquo;A more focused you a brighter tomorrow.&rdquo;
          </p>
        </div>
      </div>

      {/* Main Content Layout: 2 Columns */}
      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Upcoming Schedule Card */}
        <div className="lg:col-span-4 xl:col-span-4">
          <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Upcoming Schedule</h2>
                  <p className="text-[11px] text-slate-400">All scheduled workshops & sessions</p>
                </div>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#2161F5] border border-blue-100">
                  {upcomingList.length}
                </span>
              </div>

              {/* Schedule List */}
              <div className="flex flex-col gap-2.5">
                {upcomingList.map((entry) => {
                  const entryCategory = formatEventCategory(entry);
                  const style = CATEGORY_STYLES[entryCategory];
                  const isSelected = selectedDate === entry.date;
                  const [yStr, mStr, dStr] = entry.date.split('-');
                  const parsedYear = Number(yStr) || 2026;
                  const parsedMonth = (Number(mStr) || 5) - 1;
                  const monthName = (MONTH_LABELS[parsedMonth] ?? 'May').slice(0, 3).toUpperCase();
                  const dayNum = dStr ?? '01';

                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => {
                        setSelectedDate(entry.date);
                        setYear(parsedYear);
                        setMonth(parsedMonth);
                      }}
                      className={`group relative flex w-full items-start gap-3.5 rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-200 bg-blue-50/40 shadow-xs ring-1 ring-blue-400/30'
                          : 'border-slate-100 bg-white/60 hover:border-slate-200 hover:bg-slate-50/70 hover:shadow-xs'
                      }`}
                    >
                      {/* Date Badge */}
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-100/80 border border-slate-200/60 text-slate-700 transition-colors group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-[#2161F5]">
                        <span className="text-[9px] font-bold tracking-wider uppercase leading-none">
                          {monthName}
                        </span>
                        <span className="text-[16px] font-extrabold leading-none mt-1">
                          {dayNum}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5">
                          <h3 className="truncate text-[13.5px] font-semibold text-slate-800 transition-colors group-hover:text-blue-600">
                            {entry.title}
                          </h3>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${style.badge}`}
                          >
                            {entry.categoryLabel || style.label}
                          </span>
                        </div>

                        <p className="truncate text-[11.5px] text-slate-500 mt-0.5">
                          {entry.subtitle}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-slate-400" />
                            {entry.timeLabel}
                          </span>
                          <span className="flex items-center gap-1">
                            {entry.location.toLowerCase().includes('online') ||
                            entry.location.toLowerCase().includes('virtual') ? (
                              <Video size={12} className="text-slate-400" />
                            ) : (
                              <MapPin size={12} className="text-slate-400" />
                            )}
                            {entry.location}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Motivation micro-callout */}
            <div className="mt-5 rounded-2xl bg-gradient-to-br from-blue-50/70 via-slate-50 to-indigo-50/50 p-3.5 border border-blue-100/50 flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <Sparkles size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11.5px] font-semibold text-slate-800">Sprint On Schedule</p>
                <p className="text-[10.5px] text-slate-500 truncate">3 events happening on May 28</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Main Interactive Calendar */}
        <div className="lg:col-span-8 xl:col-span-8">
          <div className="flex flex-col rounded-3xl border border-slate-200/70 bg-white/80 p-5 sm:p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md">
            {/* Top Toolbar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              {/* Month Navigation */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToMonth(-1)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={16} />
                </button>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 px-1 min-w-[140px]">
                  {MONTH_LABELS[month]} {year}
                </h2>

                <button
                  type="button"
                  onClick={() => goToMonth(1)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                  aria-label="Next month"
                >
                  <ChevronRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={goToToday}
                  className="ml-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:border-slate-300"
                >
                  Today
                </button>
              </div>

              {/* View Selector & Add Event Button */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* View Mode Toggle */}
                <div className="flex rounded-xl bg-slate-100/90 p-1 border border-slate-200/60 text-xs font-medium text-slate-600">
                  <button
                    type="button"
                    onClick={() => setViewMode('month')}
                    className={`rounded-lg px-2.5 py-1 transition-all ${
                      viewMode === 'month'
                        ? 'bg-white text-slate-900 font-semibold shadow-xs'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('week')}
                    className={`rounded-lg px-2.5 py-1 transition-all ${
                      viewMode === 'week'
                        ? 'bg-white text-slate-900 font-semibold shadow-xs'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('day')}
                    className={`rounded-lg px-2.5 py-1 transition-all ${
                      viewMode === 'day'
                        ? 'bg-white text-slate-900 font-semibold shadow-xs'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Day
                  </button>
                </div>

                {/* Add Event Button */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#2161F5] px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs shadow-blue-500/25 transition-all duration-200 hover:bg-blue-600 hover:shadow-md hover:shadow-blue-500/20 active:scale-98"
                >
                  <Plus size={15} strokeWidth={2.2} />
                  <span>Add Event</span>
                </button>
              </div>
            </div>

            {/* MONTH VIEW */}
            {viewMode === 'month' && (
              <div>
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-[11.5px] font-semibold text-slate-400">
                  {WEEKDAY_LABELS.map((day) => (
                    <div key={day} className="py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* 7-Column Calendar Grid */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {gridCells.map((cell) => {
                    const dayEntries = entriesByDate.get(cell.dateKey) ?? [];
                    const isSelected = cell.dateKey === selectedDate;
                    const isAnchorDate = cell.dateKey === '2026-05-28';

                    // Special Anchor Card (May 28 in Reference Screenshot)
                    if (isSelected || isAnchorDate) {
                      return (
                        <button
                          key={cell.dateKey}
                          type="button"
                          onClick={() => setSelectedDate(cell.dateKey)}
                          className="group relative flex min-h-[96px] sm:min-h-[110px] flex-col justify-between rounded-2xl bg-[#2161F5] p-2 text-left text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400/40 transition-all duration-200 hover:brightness-105"
                        >
                          {/* Day Number Header */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-bold tracking-tight">
                              {cell.day}
                            </span>
                            <span className="flex h-2 w-2 rounded-full bg-white shadow-xs" />
                          </div>

                          {/* Event pills inside selected cell */}
                          <div className="flex flex-col gap-1 my-auto overflow-hidden">
                            {dayEntries.slice(0, 3).map((entry) => (
                              <div
                                key={entry.id}
                                className="truncate rounded-md bg-white/20 px-1.5 py-0.5 text-[9.5px] sm:text-[10px] font-medium text-white backdrop-blur-xs transition-colors hover:bg-white/30"
                                title={`${entry.title} (${entry.timeLabel})`}
                              >
                                {entry.title}
                              </div>
                            ))}
                            {dayEntries.length > 3 && (
                              <span className="text-[9px] font-semibold text-blue-100">
                                +{dayEntries.length - 3} more
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    }

                    // Standard Calendar Cell
                    return (
                      <button
                        key={cell.dateKey}
                        type="button"
                        onClick={() => setSelectedDate(cell.dateKey)}
                        className={`group relative flex min-h-[96px] sm:min-h-[110px] flex-col justify-between rounded-2xl border p-2 text-left transition-all duration-150 ${
                          cell.isCurrentMonth
                            ? 'border-slate-200/60 bg-white/60 hover:border-blue-200 hover:bg-blue-50/20'
                            : 'border-slate-100 bg-slate-50/40 opacity-40 hover:opacity-75'
                        }`}
                      >
                        {/* Day Number */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-semibold ${
                              cell.isCurrentMonth ? 'text-slate-700' : 'text-slate-400'
                            }`}
                          >
                            {cell.day}
                          </span>
                          {dayEntries.length > 0 && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#2161F5]" />
                          )}
                        </div>

                        {/* Events list inside cell */}
                        <div className="flex flex-col gap-1 my-auto overflow-hidden w-full">
                          {dayEntries.slice(0, 2).map((entry) => {
                            const cat = formatEventCategory(entry);
                            const style = CATEGORY_STYLES[cat];
                            return (
                              <div
                                key={entry.id}
                                className={`truncate rounded-md border px-1.5 py-0.5 text-[9.5px] sm:text-[10px] font-medium transition-all ${style.pill}`}
                                title={`${entry.title} (${entry.timeLabel})`}
                              >
                                {entry.title}
                              </div>
                            );
                          })}
                          {dayEntries.length > 2 && (
                            <span className="text-[9px] font-medium text-slate-400">
                              +{dayEntries.length - 2} more
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WEEK VIEW */}
            {viewMode === 'week' && (
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-200/60 bg-slate-50/50 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                    {gridCells.slice(21, 28).map((cell) => {
                      const dayEntries = entriesByDate.get(cell.dateKey) ?? [];
                      const isSelected = cell.dateKey === selectedDate;
                      return (
                        <div
                          key={cell.dateKey}
                          onClick={() => setSelectedDate(cell.dateKey)}
                          className={`rounded-xl p-3 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-white border border-slate-200/80 text-slate-800 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold">May {cell.day}</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {dayEntries.length} items
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            {dayEntries.map((e) => (
                              <div
                                key={e.id}
                                className={`text-[11px] p-1.5 rounded-lg truncate ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'
                                }`}
                              >
                                <div className="font-semibold truncate">{e.title}</div>
                                <div className="text-[10px] opacity-80">{e.timeLabel}</div>
                              </div>
                            ))}
                            {dayEntries.length === 0 && (
                              <div className="text-[11px] italic opacity-50 py-2">Free Day</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* DAY VIEW */}
            {viewMode === 'day' && (
              <div className="rounded-2xl border border-slate-200/60 bg-slate-50/40 p-4">
                <div className="mb-4 flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedDateObj.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedEntries.length} event{selectedEntries.length === 1 ? '' : 's'} scheduled for today
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#2161F5] hover:underline"
                  >
                    <Plus size={14} /> Add item to this day
                  </button>
                </div>

                <div className="space-y-2.5">
                  {selectedEntries.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-sm">
                      No events scheduled for this day. Click &ldquo;Add Event&rdquo; to plan a session.
                    </div>
                  ) : (
                    selectedEntries.map((entry) => {
                      const cat = formatEventCategory(entry);
                      const style = CATEGORY_STYLES[cat];
                      return (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs transition-all hover:shadow-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-800">{entry.title}</h4>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${style.badge}`}
                                >
                                  {entry.categoryLabel || style.label}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500">{entry.subtitle}</p>
                            </div>
                          </div>
                          <div className="text-right text-xs text-slate-400 flex flex-col items-end gap-0.5">
                            <span className="flex items-center gap-1 font-medium text-slate-600">
                              <Clock size={12} /> {entry.timeLabel}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} /> {entry.location}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Bottom Legend & View All Events Link */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              {/* Category Dot Indicators */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-600">
                {(['course', 'mentorship', 'workshop', 'event', 'personal'] as CalendarCategory[]).map(
                  (catKey) => {
                    const info = CATEGORY_STYLES[catKey];
                    return (
                      <div key={catKey} className="flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 rounded-full ${info.dot}`} />
                        <span className="text-[11.5px] font-medium text-slate-600">{info.label}</span>
                      </div>
                    );
                  }
                )}
              </div>

              {/* View All Events Link */}
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'month' ? 'day' : 'month')}
                className="group flex items-center gap-1 text-xs font-semibold text-[#2161F5] hover:text-blue-700 transition-colors"
              >
                <span>View All Events</span>
                <ChevronRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sync Banner */}
      <div className="relative mt-8 overflow-hidden rounded-3xl border border-blue-100/80 bg-gradient-to-r from-blue-50/70 via-white/80 to-indigo-50/60 p-5 sm:p-6 shadow-xs backdrop-blur-xl">
        {/* Ambient 2D decorative curves */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-full w-72 text-blue-200/40"
          viewBox="0 0 300 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 50 120 C 120 40, 200 100, 300 20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <circle cx="240" cy="40" r="30" stroke="currentColor" strokeWidth="1" />
        </svg>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100/90 text-[#2161F5] shadow-xs">
              <CalendarIcon size={24} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Never miss what matters.
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Sync your learning journey with your goals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncCalendar}
              className="flex items-center gap-2 rounded-2xl border border-blue-200/90 bg-white/90 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#2161F5] shadow-xs backdrop-blur-md transition-all duration-200 hover:bg-blue-50/70 hover:border-blue-300 hover:scale-[1.02] active:scale-98"
            >
              <RefreshCw size={14} className={syncToast ? 'animate-spin' : ''} />
              <span>Sync Calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sync Confirmation Toast */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900/90 px-4 py-3 text-xs font-semibold text-white shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2">
          <Check size={16} className="text-emerald-400" />
          <span>Calendar feed link copied to clipboard (iCal & Google Calendar)</span>
        </div>
      )}

      {/* Interactive Add Event Modal (Glassmorphic Redesign) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0F1E3C]/40 backdrop-blur-[10px] animate-forge-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
          role="presentation"
        >
          {/* Subtle blue ambient glow behind the modal */}
          <div className="pointer-events-none absolute h-[400px] w-[560px] rounded-full bg-blue-500/15 blur-[100px]" />

          <div
            className="relative w-full max-w-[760px] rounded-[24px] border border-white/85 bg-white/95 p-6 sm:p-8 md:p-9 shadow-[0_0_40px_rgba(33,97,245,0.10),0_25px_60px_-15px_rgba(15,28,55,0.22)] backdrop-blur-2xl transition-all overflow-hidden animate-forge-modal max-h-[calc(100vh-32px)] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-modal-title"
            aria-describedby="event-modal-desc"
          >
            {/* 2D Ambient Wave Accent in Top-Right Corner (Matches reference image) */}
            <div className="pointer-events-none absolute top-0 right-0 w-[320px] h-[210px] overflow-hidden rounded-tr-[24px] z-0">
              <svg
                className="w-full h-full text-blue-400/20"
                viewBox="0 0 320 210"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M110 0C170 50 225 105 320 120V0H110Z"
                  fill="url(#modal-event-wave-1)"
                />
                <path
                  d="M50 0C130 80 200 150 320 175V0H50Z"
                  fill="url(#modal-event-wave-2)"
                  opacity="0.6"
                />
                <defs>
                  <linearGradient
                    id="modal-event-wave-1"
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
                    id="modal-event-wave-2"
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
              className="absolute right-5 top-5 sm:right-7 sm:top-7 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-100/70 border border-slate-200/50 text-slate-400 hover:bg-blue-50/80 hover:border-blue-200/70 hover:text-[#2161F5] transition-all duration-200 hover:scale-[1.04] active:scale-[0.96] shadow-2xs cursor-pointer"
              aria-label="Close modal"
            >
              <X size={17} strokeWidth={2.2} />
            </button>

            {saveSuccess ? (
              /* Success Confirmation State */
              <div className="relative z-10 py-8 text-center animate-stagger-header">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/90 shadow-sm shadow-emerald-500/10">
                  <Check size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#15213D]">
                  Event Created
                </h3>
                <p className="text-xs sm:text-sm text-[#617594] mt-2 max-w-sm mx-auto leading-relaxed">
                  Your event has been added to the calendar. You can view and manage it anytime.
                </p>
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="h-12 rounded-xl bg-[#2161F5] px-8 text-sm font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-600 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Add Event Form */
              <div className="relative z-10">
                {/* Header */}
                <div className="mb-6 flex items-center gap-3.5 pr-10 animate-stagger-header">
                  {/* Calendar Icon Badge */}
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF2FF] border border-blue-100/80 text-[#2161F5] shadow-2xs">
                    <CalendarCheck size={22} strokeWidth={2.2} />
                  </div>

                  <div>
                    <h2
                      id="event-modal-title"
                      className="text-[20px] sm:text-[22px] font-bold text-[#15213D] leading-tight"
                    >
                      Add New Event
                    </h2>
                    <p
                      id="event-modal-desc"
                      className="text-xs sm:text-[13px] text-[#617594] mt-0.5"
                    >
                      Plan a session or task on your calendar
                    </p>
                  </div>
                </div>

                <form onSubmit={handleCreateEvent} className="space-y-4">
                  {/* Field 1: Event Title */}
                  <div className="animate-stagger-title">
                    <label
                      htmlFor="event-title-input"
                      className="block text-[13px] font-semibold text-[#15213D] mb-1.5"
                    >
                      Event Title
                    </label>
                    <div className="group relative flex h-12 sm:h-[48px] w-full items-center rounded-xl border border-slate-200/90 bg-white/90 px-3.5 shadow-2xs transition-all duration-200 hover:border-slate-300 focus-within:border-[#2161F5] focus-within:ring-3 focus-within:ring-blue-500/10 focus-within:bg-white">
                      <FileText size={17} className="text-slate-400 shrink-0 transition-colors group-focus-within:text-[#2161F5]" />
                      <input
                        id="event-title-input"
                        type="text"
                        required
                        autoFocus
                        placeholder="e.g. Design Critique & Feedback"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="h-full flex-1 bg-transparent px-2.5 text-[13.5px] text-[#15213D] placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Field 2: Subtitle / Context */}
                  <div className="animate-stagger-context">
                    <label
                      htmlFor="event-subtitle-input"
                      className="block text-[13px] font-semibold text-[#15213D] mb-1.5"
                    >
                      Subtitle / Context
                    </label>
                    <div className="group relative flex h-12 sm:h-[48px] w-full items-center rounded-xl border border-slate-200/90 bg-white/90 px-3.5 shadow-2xs transition-all duration-200 hover:border-slate-300 focus-within:border-[#2161F5] focus-within:ring-3 focus-within:ring-blue-500/10 focus-within:bg-white">
                      <AlignLeft size={17} className="text-slate-400 shrink-0 transition-colors group-focus-within:text-[#2161F5]" />
                      <input
                        id="event-subtitle-input"
                        type="text"
                        placeholder="e.g. Full Stack Web Development"
                        value={newSubtitle}
                        onChange={(e) => setNewSubtitle(e.target.value)}
                        className="h-full flex-1 bg-transparent px-2.5 text-[13.5px] text-[#15213D] placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Row 1: Date & Time in 2-column layout */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-stagger-datetime">
                    {/* Date */}
                    <div>
                      <label
                        htmlFor="event-date-input"
                        className="block text-[13px] font-semibold text-[#15213D] mb-1.5"
                      >
                        Date
                      </label>
                      <div className="group relative flex h-12 sm:h-[48px] w-full items-center rounded-xl border border-slate-200/90 bg-white/90 px-3.5 shadow-2xs transition-all duration-200 hover:border-slate-300 focus-within:border-[#2161F5] focus-within:ring-3 focus-within:ring-blue-500/10 focus-within:bg-white cursor-pointer">
                        <CalendarIcon size={17} className="text-slate-400 shrink-0 transition-colors group-focus-within:text-[#2161F5]" />
                        <input
                          id="event-date-input"
                          type="date"
                          required
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="forge-date-input h-full flex-1 bg-transparent px-2.5 text-[13.5px] text-[#15213D] focus:outline-none cursor-pointer font-normal"
                        />
                      </div>
                    </div>

                    {/* Time */}
                    <div className="relative">
                      <label
                        htmlFor="event-time-input"
                        className="block text-[13px] font-semibold text-[#15213D] mb-1.5"
                      >
                        Time
                      </label>
                      <button
                        type="button"
                        id="event-time-input"
                        onClick={() => {
                          setIsTimeOpen(!isTimeOpen);
                          setIsCategoryOpen(false);
                          setIsLocationOpen(false);
                        }}
                        className="group flex h-12 sm:h-[48px] w-full items-center justify-between rounded-xl border border-slate-200/90 bg-white/90 px-3.5 shadow-2xs transition-all duration-200 hover:border-slate-300 focus:border-[#2161F5] focus:ring-3 focus:ring-blue-500/10 focus:outline-none cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Clock size={17} className="text-slate-400 shrink-0 group-focus:text-[#2161F5]" />
                          <span className="truncate text-[13.5px] text-[#15213D]">{newTime}</span>
                        </div>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isTimeOpen ? 'rotate-180 text-[#2161F5]' : ''}`} />
                      </button>

                      {/* Time Dropdown Menu */}
                      {isTimeOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 z-30 rounded-xl border border-slate-200/90 bg-white/98 p-1.5 shadow-xl backdrop-blur-xl animate-dropdown-enter">
                          {[
                            '09:00 AM – 10:30 AM',
                            '10:00 AM – 11:30 AM',
                            '11:30 AM – 01:00 PM',
                            '02:00 PM – 03:30 PM',
                            '04:00 PM – 05:30 PM',
                          ].map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => {
                                setNewTime(t);
                                setIsTimeOpen(false);
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                                newTime === t ? 'bg-blue-50 text-[#2161F5] font-semibold' : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span>{t}</span>
                              {newTime === t && <Check size={14} className="text-[#2161F5]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Category & Location in 2-column layout */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-stagger-catloc">
                    {/* Category */}
                    <div className="relative">
                      <label
                        htmlFor="event-category-select"
                        className="block text-[13px] font-semibold text-[#15213D] mb-1.5"
                      >
                        Category
                      </label>
                      <button
                        type="button"
                        id="event-category-select"
                        onClick={() => {
                          setIsCategoryOpen(!isCategoryOpen);
                          setIsTimeOpen(false);
                          setIsLocationOpen(false);
                        }}
                        className="group flex h-12 sm:h-[48px] w-full items-center justify-between rounded-xl border border-slate-200/90 bg-white/90 px-3.5 shadow-2xs transition-all duration-200 hover:border-slate-300 focus:border-[#2161F5] focus:ring-3 focus:ring-blue-500/10 focus:outline-none cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Tag size={17} className="text-slate-400 shrink-0 group-focus:text-[#2161F5]" />
                          <span className="truncate text-[13.5px] text-[#15213D] capitalize">
                            {CATEGORY_STYLES[newCategory].label}
                          </span>
                        </div>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isCategoryOpen ? 'rotate-180 text-[#2161F5]' : ''}`} />
                      </button>

                      {/* Category Dropdown Menu */}
                      {isCategoryOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 z-30 rounded-xl border border-slate-200/90 bg-white/98 p-1.5 shadow-xl backdrop-blur-xl animate-dropdown-enter">
                          {(['course', 'mentorship', 'workshop', 'event', 'personal'] as CalendarCategory[]).map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setNewCategory(cat);
                                setIsCategoryOpen(false);
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                                newCategory === cat ? 'bg-blue-50 text-[#2161F5] font-semibold' : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${CATEGORY_STYLES[cat].dot}`} />
                                <span>{CATEGORY_STYLES[cat].label}</span>
                              </div>
                              {newCategory === cat && <Check size={14} className="text-[#2161F5]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Location */}
                    <div className="relative">
                      <label
                        htmlFor="event-location-input"
                        className="block text-[13px] font-semibold text-[#15213D] mb-1.5"
                      >
                        Location
                      </label>
                      <button
                        type="button"
                        id="event-location-input"
                        onClick={() => {
                          setIsLocationOpen(!isLocationOpen);
                          setIsTimeOpen(false);
                          setIsCategoryOpen(false);
                        }}
                        className="group flex h-12 sm:h-[48px] w-full items-center justify-between rounded-xl border border-slate-200/90 bg-white/90 px-3.5 shadow-2xs transition-all duration-200 hover:border-slate-300 focus:border-[#2161F5] focus:ring-3 focus:ring-blue-500/10 focus:outline-none cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <MapPin size={17} className="text-slate-400 shrink-0 group-focus:text-[#2161F5]" />
                          <span className="truncate text-[13.5px] text-[#15213D]">{newLocation}</span>
                        </div>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isLocationOpen ? 'rotate-180 text-[#2161F5]' : ''}`} />
                      </button>

                      {/* Location Dropdown Menu */}
                      {isLocationOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 z-30 rounded-xl border border-slate-200/90 bg-white/98 p-1.5 shadow-xl backdrop-blur-xl animate-dropdown-enter">
                          {[
                            'Online',
                            'Lab 302',
                            'Main Auditorium',
                            'Room 101',
                            'Google Meet',
                          ].map((loc) => (
                            <button
                              key={loc}
                              type="button"
                              onClick={() => {
                                setNewLocation(loc);
                                setIsLocationOpen(false);
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                                newLocation === loc ? 'bg-blue-50 text-[#2161F5] font-semibold' : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span>{loc}</span>
                              {newLocation === loc && <Check size={14} className="text-[#2161F5]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Field 5: Additional Notes (Optional) */}
                  <div className="animate-stagger-notes">
                    <label
                      htmlFor="event-notes-input"
                      className="block text-[13px] font-semibold text-[#15213D] mb-1.5"
                    >
                      Additional Notes (Optional)
                    </label>
                    <div className="group relative rounded-xl border border-slate-200/90 bg-white/90 p-3 shadow-2xs transition-all duration-200 hover:border-slate-300 focus-within:border-[#2161F5] focus-within:ring-3 focus-within:ring-blue-500/10 focus-within:bg-white">
                      <div className="flex items-start gap-2.5">
                        <MessageSquare size={17} className="mt-1 text-slate-400 shrink-0 transition-colors group-focus-within:text-[#2161F5]" />
                        <textarea
                          id="event-notes-input"
                          rows={3}
                          maxLength={300}
                          placeholder="Add any extra details, agenda, or links..."
                          value={newNotes}
                          onChange={(e) => setNewNotes(e.target.value)}
                          className="w-full resize-none bg-transparent text-[13.5px] text-[#15213D] placeholder:text-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>
                    {/* Character Counter */}
                    <p className="mt-1 text-right text-[11.5px] text-slate-400 font-normal">
                      {newNotes.length}/300
                    </p>
                  </div>

                  {/* Validation Error Banner */}
                  {formError && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-rose-200/80 bg-rose-50/90 p-3 text-xs text-rose-700">
                      <AlertCircle size={15} className="shrink-0 text-rose-500" />
                      <span className="flex-1">{formError}</span>
                    </div>
                  )}

                  {/* Bottom Action Area */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 pt-4 mt-5 animate-stagger-footer">
                    {/* Left Branding Motto */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-100/80 text-[#2161F5]">
                        <CalendarCheck size={18} strokeWidth={2.2} />
                      </div>
                      <div className="leading-tight">
                        <p className="text-[11.5px] font-medium text-[#617594]">
                          Organize today.
                        </p>
                        <p className="text-[12px] font-bold text-[#2161F5]">
                          Achieve tomorrow.
                        </p>
                      </div>
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="h-11 sm:h-12 rounded-xl border border-slate-200/90 bg-white px-5 sm:px-6 text-[13.5px] sm:text-[14px] font-semibold text-[#15213D] shadow-2xs transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="group h-11 sm:h-12 flex items-center justify-center gap-2 rounded-xl bg-[#2161F5] px-5 sm:px-6 text-[13.5px] sm:text-[14px] font-semibold text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer"
                      >
                        {isSaving ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <span>Save Event</span>
                            <ArrowRight size={16} strokeWidth={2.2} className="transition-transform duration-200 group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                    </div>
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
