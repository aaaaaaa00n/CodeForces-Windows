import React from 'react';
import { Tab } from '../types';

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  handle: string | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, handle, onLogout }) => {
  const navItems = [
    { id: Tab.DASHBOARD, label: 'Dashboard' },
    { id: Tab.CONTESTS, label: 'Contests' },
    { id: Tab.PROBLEMS, label: 'Problemset' },
    { id: Tab.STUDY_PLAN, label: 'AI Coach' },
  ];

  return (
    <nav className="bg-[#1f2335] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => onTabChange(Tab.DASHBOARD)}>
               <div className="flex items-center gap-2">
                 <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                 </svg>
                 <span className="font-bold text-xl tracking-tight">Codeforces<span className="text-blue-400">Lite</span></span>
               </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      activeTab === item.id
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {handle ? (
              <>
                <span className="text-sm text-gray-300">Logged as <span className="font-bold text-white">{handle}</span></span>
                <button
                  onClick={onLogout}
                  className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <span className="text-sm text-yellow-400">Guest Mode</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};