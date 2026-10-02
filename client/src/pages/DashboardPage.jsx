import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import api from '../services/api';
import { PlusCircle, FileText, ArrowRight, ShieldCheck, AlertTriangle, Layers, Clock, Trash2 } from 'lucide-react';

export default function DashboardPage() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/assessments');
      if (res.data.success) {
        setAssessments(res.data.assessments || []);
      }
    } catch (err) {
      console.error('Failed to fetch assessments', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async (e, id) => {
    e.stopPropagation();
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    
    try {
      setIsDeleting(true);
      const res = await api.delete(`/assessments/${deleteTargetId}`);
      if (res.data.success) {
        // Remove only this deleted item from state immediately without whole-page loader
        setAssessments(prev => prev.filter(a => a._id !== deleteTargetId));
        setDeleteModalOpen(false);
        setDeleteTargetId(null);
      }
    } catch (err) {
      console.error('Failed to delete assessment', err);
      alert('Failed to delete: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsDeleting(false);
    }
  };

  const currentCount = assessments.filter(a => a.status === 'CURRENT').length;
  const staleCount = assessments.filter(a => a.status === 'STALE').length;

  const totalMandatory = assessments.reduce((acc, a) => acc + (a.mandatoryTotal || 0), 0);
  const totalMissing = assessments.reduce((acc, a) => acc + (a.mandatoryMissing || 0), 0);
  const avgCompleteness = assessments.length > 0
    ? Math.round(assessments.reduce((acc, a) => acc + (a.completenessScore || 0), 0) / assessments.length)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onMobileToggle={() => setMobileOpen(!mobileOpen)} mobileOpen={mobileOpen} />

      <div className="flex-1 flex w-full">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Top Welcome & Actions Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Review Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage your grant completeness evaluations and human verification records
              </p>
            </div>

            <Link
              to="/assessments/new"
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm shadow-emerald-600/20 transition-all self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              New Assessment
            </Link>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Assessments
              </span>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-extrabold text-slate-900">{assessments.length}</div>
                <div className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{currentCount} Current</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Avg Completeness
              </span>
              <div className="text-2xl font-extrabold text-indigo-700">{avgCompleteness}%</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Mandatory Checked
              </span>
              <div className="text-2xl font-extrabold text-slate-700">{totalMandatory}</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                Critical Gaps (Missing)
              </span>
              <div className="text-2xl font-extrabold text-rose-700">{totalMissing}</div>
            </div>
          </div>

          {/* Recent Assessments Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-visible">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recent Assessments
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {assessments.length} total recorded
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs">Loading assessments...</p>
              </div>
            ) : assessments.length === 0 ? (
              /* Empty State */
              <div className="p-12 text-center space-y-4 max-w-sm mx-auto">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto border border-emerald-100">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">No assessments yet</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Create your first grant application completeness review to start mapping evidence and verifying requirements.
                  </p>
                </div>
                <div>
                  <Link
                    to="/assessments/new"
                    className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                    Create Assessment
                  </Link>
                </div>
              </div>
            ) : (
              /* Assessments List */
              <div className="divide-y divide-slate-100">
                {assessments.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/assessments/${item._id}`)}
                    className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1.5 max-w-md">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                          {item.title}
                        </h3>
                        <StatusBadge status={item.status} size="sm" />
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                        <span>Guideline: <strong>v{item.guidelineVersion}</strong></span>
                        <span>•</span>
                        <span>Application: <strong>v{item.applicationVersion}</strong></span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-lg font-extrabold text-slate-900">
                          {item.completenessScore}%
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {item.mandatorySupported || 0} / {item.mandatoryTotal || 0} supported
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => confirmDelete(e, item._id)}
                          className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors focus:outline-none"
                          title="Delete Assessment"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <div className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white transition-colors">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-6">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-3 bg-rose-50 rounded-full">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Delete Assessment</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Are you absolutely sure you want to delete this assessment? This action cannot be undone and will permanently remove all associated documents and human reviews.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => { setDeleteModalOpen(false); setDeleteTargetId(null); }}
                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors flex items-center space-x-2"
                disabled={isDeleting}
              >
                {isDeleting && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
