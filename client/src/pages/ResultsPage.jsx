import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import RequirementCard from '../components/RequirementCard';
import UnsupportedClaimsCard from '../components/UnsupportedClaimsCard';
import ClarificationQuestionsCard from '../components/ClarificationQuestionsCard';
import MissingDocsCard from '../components/MissingDocsCard';
import StaleWarningBanner from '../components/StaleWarningBanner';
import ReviewedSummaryModal from '../components/ReviewedSummaryModal';
import Tooltip from '../components/Tooltip';
import { TOOLTIPS } from '../constants/tooltips';
import DisclaimerFooter from '../components/DisclaimerFooter';
import api from '../services/api';
import {
  FileCheck,
  Award,
  RefreshCw,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  FileText,
  Upload,
  ArrowLeft
} from 'lucide-react';

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [unsupportedClaims, setUnsupportedClaims] = useState([]);
  const [clarificationQuestions, setClarificationQuestions] = useState([]);
  const [missingSupportingDocs, setMissingSupportingDocs] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingReview, setLoadingReview] = useState(false);
  const [loadingRerun, setLoadingRerun] = useState(false);
  
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [id]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/assessments/${id}/results`);
      if (res.data.success) {
        setAssessment(res.data.assessment);
        setRequirements(res.data.requirements || []);
        setMappings(res.data.mappings || []);
        setUnsupportedClaims(res.data.unsupportedClaims || []);
        setClarificationQuestions(res.data.clarificationQuestions || []);
        setMissingSupportingDocs(res.data.missingSupportingDocuments || []);
      }
    } catch (err) {
      console.error('Failed to load assessment results', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewMapping = async (mappingId, payload) => {
    try {
      setLoadingReview(true);
      const res = await api.patch(`/mappings/${mappingId}`, payload);
      if (res.data.success) {
        // Update mapping in state
        setMappings(prev => prev.map(m => m._id === mappingId ? res.data.mapping : m));
        // Update assessment completeness stats in state
        if (res.data.assessment) {
          setAssessment(res.data.assessment);
        }
      }
    } catch (err) {
      console.error('Failed to update review', err);
      alert('Failed to save review action: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingReview(false);
    }
  };

  const handleRerun = async () => {
    try {
      setLoadingRerun(true);
      const res = await api.post(`/assessments/${id}/rerun`);
      if (res.data.success) {
        await fetchResults();
      }
    } catch (err) {
      console.error('Failed to re-run assessment', err);
      alert('Failed to re-run analysis: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingRerun(false);
    }
  };

  const handleOpenSummary = async () => {
    try {
      const res = await api.get(`/assessments/${id}/summary`);
      if (res.data.success) {
        setSummaryData(res.data.summary);
        setSummaryModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to load summary', err);
    }
  };

  const handleFileUpload = async (event, type) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    if (type === 'supporting-documents') {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    } else {
      formData.append('file', files[0]);
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('grant_assistant_token');
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
      
      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/assessments/${id}/${type}`, {
        method: 'POST',
        headers: authHeader,
        body: formData
      });
      
      if (res.ok) {
        await fetchResults();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed: ' + err.message);
      setLoading(false);
    }
  };

  // Build mapping lookup by requirement ID
  const mappingByReqId = new Map();
  mappings.forEach(m => {
    const key = m.requirementId?._id || m.requirementId || m.reqId;
    mappingByReqId.set(key, m);
    mappingByReqId.set(m.reqId, m);
  });

  // Filter requirements based on selected tab
  const filteredRequirements = requirements.filter(req => {
    const mapping = mappingByReqId.get(req._id) || mappingByReqId.get(req.reqId);
    const status = mapping?.finalStatus || mapping?.aiStatus || 'MISSING';

    if (activeFilter === 'MANDATORY') return req.mandatory;
    if (activeFilter === 'RECOMMENDED') return !req.mandatory;
    if (activeFilter === 'GAPS') return status === 'WEAK' || status === 'AMBIGUOUS' || status === 'MISSING';
    if (activeFilter === 'REVIEWED') return !!mapping?.humanAction;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12 text-slate-500">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium">Loading completeness review...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12 text-slate-500">
          <div className="text-center space-y-3 max-w-sm">
            <h3 className="text-base font-bold text-slate-900">Assessment Not Found</h3>
            <p className="text-xs text-slate-500">The requested assessment ID does not exist or has been removed.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        assessment={assessment}
        onMobileToggle={() => setMobileOpen(!mobileOpen)}
        mobileOpen={mobileOpen}
      />

      <div className="flex-1 flex w-full">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Top Back and Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-700 mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back to Dashboard
              </button>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {assessment.title}
                </h1>
                <StatusBadge status={assessment.status} size="sm" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                disabled={loadingRerun}
                onClick={handleRerun}
                className={`inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg transition-all disabled:opacity-50 ${
                  assessment.status === 'STALE'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-200/50 ring-2 ring-amber-500/50 ring-offset-2'
                    : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-sm'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loadingRerun ? 'animate-spin' : ''} ${assessment.status === 'STALE' ? 'text-amber-100' : 'text-slate-400'}`} />
                {loadingRerun ? 'Re-analyzing...' : assessment.status === 'STALE' ? 'Update Analysis' : 'Force Re-run AI'}
              </button>
              <button
                type="button"
                onClick={handleOpenSummary}
                className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
              >
                <Award className="w-4 h-4 mr-1.5 text-emerald-400" />
                View Final Reviewed Summary
              </button>
            </div>
          </div>

          {/* Stale Warning Banner if applicable */}
          <StaleWarningBanner
            assessment={assessment}
            onRerun={handleRerun}
            loadingRerun={loadingRerun}
          />

          {/* Completeness Score Card & Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* Score Left Column */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Completeness Score
                  </span>
                  <Tooltip text={TOOLTIPS.COMPLETENESS} icon={true} />
                </div>

                <div className="flex items-baseline space-x-3">
                  <div className="text-5xl font-extrabold text-slate-900 tracking-tight">
                    {assessment.completenessScore}%
                  </div>
                  <span className="text-sm font-semibold text-slate-600">
                    {assessment.mandatorySupported} / {assessment.mandatoryTotal} mandatory requirements supported
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Calculated deterministically by the backend based on mandatory requirements and verified human reviews.
                </p>
              </div>

              {/* Status Stat Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <span className="text-xs font-semibold text-emerald-800 block">Supported</span>
                  <span className="text-xl font-extrabold text-emerald-950 mt-0.5 block">
                    {assessment.mandatorySupported}
                  </span>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
                  <span className="text-xs font-semibold text-amber-800 block">Weak</span>
                  <span className="text-xl font-extrabold text-amber-950 mt-0.5 block">
                    {assessment.mandatoryWeak}
                  </span>
                </div>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-center">
                  <span className="text-xs font-semibold text-orange-800 block">Ambiguous</span>
                  <span className="text-xl font-extrabold text-orange-950 mt-0.5 block">
                    {assessment.mandatoryAmbiguous}
                  </span>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center">
                  <span className="text-xs font-semibold text-rose-800 block">Missing</span>
                  <span className="text-xl font-extrabold text-rose-950 mt-0.5 block">
                    {assessment.mandatoryMissing}
                  </span>
                </div>
              </div>

            </div>

            {/* Document Versioning Metadata Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-slate-600">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span>Guideline: <strong>v{assessment.guidelineVersion}</strong> ({assessment.guidelineDocId?.originalFileName || 'guideline.pdf'})</span>
                <span className="hidden sm:inline">•</span>
                <span>Application: <strong>v{assessment.applicationVersion}</strong> ({assessment.applicationDocId?.originalFileName || 'application.pdf'})</span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  Supporting Attachments: <strong>{assessment.supportingDocIds?.length || 0} provided</strong>
                  {assessment.supportingDocIds?.length > 0 && (
                    <Tooltip text={assessment.supportingDocIds.map(d => d.originalFileName).join('\n')} position="bottom" icon={true} />
                  )}
                </span>
              </div>
              
              <div className="flex gap-2">
                <label className="cursor-pointer inline-flex items-center px-2 py-1 text-[10px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors">
                  <Upload className="w-3 h-3 mr-1" />
                  Guideline
                  <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'guideline')} />
                </label>
                <label className="cursor-pointer inline-flex items-center px-2 py-1 text-[10px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors">
                  <Upload className="w-3 h-3 mr-1" />
                  Draft
                  <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'application')} />
                </label>
                <label className="cursor-pointer inline-flex items-center px-2 py-1 text-[10px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors">
                  <Upload className="w-3 h-3 mr-1" />
                  Supporting
                  <input type="file" multiple accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'supporting-documents')} />
                </label>
              </div>
            </div>
          </div>

          {/* Main Grid: Left is Requirements List, Right is Supporting Findings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Requirements & Evidence Mapping */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Filter Tabs Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex flex-wrap items-center gap-2">
                  <Tooltip text="Shows every single requirement extracted from the Grant Guideline, regardless of importance or status." position="bottom">
                    <button
                      onClick={() => setActiveFilter('ALL')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                        activeFilter === 'ALL'
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      All ({requirements.length})
                    </button>
                  </Tooltip>

                  <Tooltip text="Shows only the requirements that the AI determined are strictly required for your grant to be eligible. You should check this tab to make sure you aren't missing hard requirements." position="bottom">
                    <button
                      onClick={() => setActiveFilter('MANDATORY')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                        activeFilter === 'MANDATORY'
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Mandatory ({requirements.filter(r => r.mandatory).length})
                    </button>
                  </Tooltip>

                  <Tooltip text="This is your most important tab. It filters down to show only the mandatory requirements where the AI found Weak, Ambiguous, or completely Missing evidence in your draft application. This tab represents the exact areas of your draft that need rewriting before submission." position="bottom">
                    <button
                      onClick={() => setActiveFilter('GAPS')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                        activeFilter === 'GAPS'
                          ? 'bg-amber-600 text-white'
                          : 'text-amber-800 hover:bg-amber-50'
                      }`}
                    >
                      Gaps & Issues ({assessment.mandatoryWeak + assessment.mandatoryAmbiguous + assessment.mandatoryMissing})
                    </button>
                  </Tooltip>

                  <Tooltip text="Shows optional, 'nice-to-have' requirements. These aren't strictly required to submit, but fulfilling them will strengthen your grant's chances of winning." position="bottom">
                    <button
                      onClick={() => setActiveFilter('RECOMMENDED')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                        activeFilter === 'RECOMMENDED'
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Recommended ({requirements.filter(r => !r.mandatory).length})
                    </button>
                  </Tooltip>

                  <Tooltip text="Shows only the requirements that a human reviewer (like you) has explicitly clicked Confirm, Correct, or Reject on. It acts as an audit log of what you've manually verified." position="bottom">
                    <button
                      onClick={() => setActiveFilter('REVIEWED')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                        activeFilter === 'REVIEWED'
                          ? 'bg-emerald-600 text-white'
                          : 'text-emerald-800 hover:bg-emerald-50'
                      }`}
                    >
                      Reviewed ({mappings.filter(m => m.humanAction).length})
                    </button>
                  </Tooltip>
                </div>
              </div>

              {/* Requirement Cards List */}
              <div className="space-y-3">
                {filteredRequirements.length === 0 ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                    No requirements match the selected filter.
                  </div>
                ) : (
                  filteredRequirements.map(req => {
                    const mapping = mappingByReqId.get(req._id) || mappingByReqId.get(req.reqId);
                    return (
                      <RequirementCard
                        key={req._id}
                        requirement={req}
                        mapping={mapping}
                        onReview={handleReviewMapping}
                        loadingReview={loadingReview}
                      />
                    );
                  })
                )}
              </div>

            </div>

            {/* Right Column: Unsupported Claims, Questions, Missing Attachments */}
            <div className="space-y-5">
              <UnsupportedClaimsCard claims={unsupportedClaims} />
              <ClarificationQuestionsCard questions={clarificationQuestions} />
              <MissingDocsCard missingDocs={missingSupportingDocs} />
            </div>

          </div>

          <DisclaimerFooter />
        </main>
      </div>

      {/* Reviewed Summary Modal */}
      <ReviewedSummaryModal
        isOpen={summaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
        summary={summaryData}
      />
    </div>
  );
}
