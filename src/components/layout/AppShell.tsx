import React from 'react';

interface AppShellProps {
  topNav: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  banner?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  topNav,
  sidebar,
  children,
  banner,
}) => {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#070B14] text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Optional Impersonation or System Banner */}
      {banner}

      {/* Sticky/Fixed Top Navigation */}
      {topNav}

      {/* Lower Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Fixed/Sticky Sidebar */}
        {sidebar}

        {/* Independently Scrollable Main Content Area */}
        <main className="flex-1 h-full overflow-y-auto bg-[#070B14] focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};
