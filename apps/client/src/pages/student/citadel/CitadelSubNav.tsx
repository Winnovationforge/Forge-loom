import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/student/citadel', label: 'Overview', end: true },
  { to: '/student/citadel/sprints', label: 'Sprint Cycles', end: false },
  { to: '/student/citadel/problem-statement', label: 'Problem Statement', end: false },
  { to: '/student/citadel/progress-report', label: 'Progress Report', end: false },
  { to: '/student/citadel/feedback', label: 'Feedback', end: false },
];

export function CitadelSubNav() {
  return (
    <div className="mb-6 flex gap-1.5 overflow-x-auto rounded-2xl bg-white/75 backdrop-blur-md border border-slate-200/70 p-1.5 shadow-2xs">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `shrink-0 rounded-xl px-4 py-2 text-xs sm:text-sm transition-all duration-200 ${
              isActive
                ? 'bg-[#2161F5] text-white font-semibold shadow-xs shadow-blue-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  );
}
