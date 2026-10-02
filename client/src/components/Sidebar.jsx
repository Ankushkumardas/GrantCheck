import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, FileText, HelpCircle, ShieldCheck } from 'lucide-react';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/assessments/new', label: 'New Assessment', icon: PlusCircle },
    { to: '/dashboard#all', label: 'Assessments', icon: FileText }
  ];

  const handleNavClick = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky md:top-16 md:h-[calc(100vh-4rem)] inset-y-0 left-0 z-40 w-56 md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          <div className="px-3 pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Workspace
            </span>
          </div>

          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 mr-3 text-slate-500" />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Safety & Disclaimer Card */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Responsible AI</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Provides completeness assistance. Does not make funding eligibility or legal decisions.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
