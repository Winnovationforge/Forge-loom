import { useState } from 'react';
import { LogOut, Menu, Search, User as UserIcon } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { ROLE_LABELS } from '../auth/roleHome';
import { NotificationBell } from '../components/NotificationBell';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const userName = user?.email.split('@')[0] ?? 'student1';
  const userInitials = userName.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl px-5 sm:px-8">
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer"
        aria-label="Toggle navigation"
      >
        <Menu size={20} />
      </button>

      {/* Global Search Bar */}
      <div className="flex flex-1 items-center max-w-lg">
        <div className="relative w-full flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search for courses, events, mentors..."
            className="w-full h-10 pl-9 pr-14 rounded-xl bg-white/85 border border-slate-200/80 text-[13.5px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#2161F5] focus:ring-3 focus:ring-[#2161F5]/10 shadow-2xs transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-medium text-slate-400 bg-slate-100/90 border border-slate-200 pointer-events-none">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3.5">
        <div className="relative flex items-center justify-center">
          <NotificationBell />
        </div>

        {/* Profile Avatar */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#1748C7] to-[#2161F5] text-white text-[12px] font-bold shadow-xs hover:brightness-105 transition-all cursor-pointer"
            aria-label="Account menu"
          >
            {user ? userInitials : <UserIcon size={16} />}
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-30 mt-2 w-48 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-md py-1.5 shadow-lg animate-item-fade-up">
              <div className="border-b border-slate-100 px-3.5 py-2 text-xs text-slate-500">
                <div className="font-semibold text-slate-800">{user?.email}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {user ? ROLE_LABELS[user.role] : ''}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void logout();
                }}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <LogOut size={16} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
