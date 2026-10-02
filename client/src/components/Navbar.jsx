import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FileCheck, LogOut, User, Menu, X, ArrowLeft } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function Navbar({ assessment, onMobileToggle, mobileOpen }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Left: Brand / Assessment Context */}
          <div className="flex items-center space-x-4">
            {onMobileToggle && (
              <button
                onClick={onMobileToggle}
                className="p-1.5 text-slate-500 hover:text-slate-700 md:hidden focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}

            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">GrantCheck</span>
            </Link>

            {assessment && (
              <div className="hidden sm:flex items-center space-x-3 pl-4 border-l border-slate-200">
                <span className="text-sm font-medium text-slate-700 truncate max-w-xs">
                  {assessment.title}
                </span>
                <StatusBadge status={assessment.status} size="sm" />
              </div>
            )}
          </div>

          {/* Right: User & Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex items-center text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  <User className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  <span className="font-medium text-slate-700">{user?.email || 'Demo Reviewer'}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4 mr-1.5 text-slate-500" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5"
                >
                  Sign in
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
