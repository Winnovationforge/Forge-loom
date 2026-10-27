import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { ROLE_NAV } from './roleNav';
import { useAuth } from '../auth/AuthContext';

export function AppShell() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = user ? ROLE_NAV[user.role] : [];

  return (
    <div className="relative flex min-h-screen dashboard-canvas text-[#15213D] font-sans antialiased overflow-x-hidden">
      {/* Ambient 2D moving gradient blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-24 right-[12%] w-[540px] h-[540px] rounded-full bg-gradient-to-br from-blue-400/12 via-sky-300/8 to-transparent blur-[120px] animate-blob-b z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[40%] -left-36 w-[580px] h-[580px] rounded-full bg-gradient-to-tr from-indigo-300/8 via-blue-200/10 to-transparent blur-[130px] animate-blob-a z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -bottom-28 right-[20%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-blue-300/10 to-transparent blur-[120px] animate-blob-c z-0"
      />

      {/* Ambient low-opacity sweeping SVG curves */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 w-full h-full stroke-blue-400/15 fill-none animate-arc-1 z-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <path d="M 600 0 C 750 200, 1050 350, 1440 420" strokeWidth="1.2" />
        <path d="M 700 0 C 820 220, 1100 370, 1440 460" strokeWidth="0.8" strokeDasharray="5 6" />
      </svg>

      {/* Left Sidebar */}
      <Sidebar items={navItems} open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      {/* Content Area */}
      <div className="relative z-10 flex flex-1 flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen((open) => !open)} />
        <main className="flex-1 p-5 sm:p-7 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
