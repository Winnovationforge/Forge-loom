import { NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ChevronRight } from 'lucide-react';
import type { NavItem } from './roleNav';
import { useAuth } from '../auth/AuthContext';

interface SidebarProps {
  items: NavItem[];
  open: boolean;
  onNavigate: () => void;
}

export function Sidebar({ items, open, onNavigate }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const isCalendar = location.pathname.includes('/calendar');
  const isTracker = location.pathname.includes('/tracker');
  const isCitadel = location.pathname.includes('/citadel');
  const userName = user?.email.split('@')[0] ?? 'student1';
  const userInitials = userName.slice(0, 2).toUpperCase();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-xs lg:hidden"
          onClick={onNavigate}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 sm:w-64 flex-col justify-between border-r border-slate-200/70 bg-white/85 backdrop-blur-xl p-5 transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Logo */}
          <div className="mb-7 flex items-center gap-1.5 px-2">
            <span className="text-xl font-extrabold tracking-tight text-[#2161F5]">
              FORGE
            </span>
            <span className="text-xs font-semibold tracking-wider text-[#8A9BB7]">
              LMS
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end ?? (item.path === '/student' || item.label === 'Home')}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3.5 glass-nav-item px-3.5 py-2.5 text-[13.5px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'glass-nav-item-active font-semibold'
                      : 'glass-nav-item-inactive'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Glass Indicator Pill */}
                    {isActive && (
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-4 w-1 rounded-full bg-[#2161F5] shadow-xs" />
                    )}
                    <item.icon
                      size={18}
                      className={`shrink-0 transition-transform duration-200 ${
                        isActive ? 'text-[#2161F5] scale-105' : 'text-[#617594] group-hover:text-[#15213D]'
                      }`}
                      strokeWidth={1.8}
                    />
                    <span className={isActive ? 'text-[#2161F5]' : ''}>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 pt-4">
          {/* Motivation Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EAF2FF] via-[#F1F6FF] to-[#DDE9FF] p-4 border border-blue-100/70 shadow-xs">
            {/* Background 2D abstract waves */}
            <svg
              aria-hidden="true"
              className="absolute -right-2 -bottom-2 w-28 h-28 pointer-events-none opacity-40 text-blue-400"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="80" cy="80" r="45" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
              <path d="M 30 100 C 50 70, 70 80, 100 60" stroke="currentColor" strokeWidth="1.5" />
            </svg>

            <div className="relative z-10 flex items-end justify-between">
              {isCitadel ? (
                <div className="flex flex-col">
                  <span className="text-[11.5px] font-medium text-slate-500">Build</span>
                  <span className="text-[15px] font-bold text-slate-800 leading-tight">Skills</span>
                  <span className="text-[11.5px] font-medium text-slate-500 mt-0.5">Create Impact</span>
                </div>
              ) : isTracker ? (
                <div className="flex flex-col">
                  <span className="text-[11.5px] font-medium text-slate-500">Track</span>
                  <span className="text-[15px] font-bold text-slate-800 leading-tight">Learn</span>
                  <span className="text-[11.5px] font-medium text-slate-500 mt-0.5">Improve</span>
                </div>
              ) : isCalendar ? (
                <div className="flex flex-col">
                  <span className="text-[11.5px] font-medium text-slate-500">Plan</span>
                  <span className="text-[15px] font-bold text-slate-800 leading-tight">Learn</span>
                  <span className="text-[11.5px] font-medium text-slate-500 mt-0.5">Achieve</span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="text-[11.5px] font-medium text-slate-500">Keep</span>
                  <span className="text-[15px] font-bold text-slate-800 leading-tight">Learning</span>
                  <span className="text-[11.5px] font-medium text-slate-500 mt-0.5">Keep Growing</span>
                </div>
              )}

              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2161F5] text-white shadow-sm transition-transform duration-200 hover:scale-105 cursor-pointer">
                {isCitadel || isTracker || isCalendar ? (
                  <ArrowRight size={15} strokeWidth={2.2} />
                ) : (
                  <ArrowUpRight size={15} strokeWidth={2.2} />
                )}
              </div>
            </div>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center justify-between rounded-xl px-1.5 py-1 text-left transition-colors hover:bg-slate-50/80 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-[12px] font-bold text-[#2161F5] border border-blue-100">
                {userInitials}
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-slate-800 leading-tight">
                  {userName}
                </span>
                <span className="text-[11px] text-slate-400">View Profile</span>
              </div>
            </div>
            <ChevronRight size={15} className="text-slate-400" />
          </div>
        </div>
      </aside>
    </>
  );
}
