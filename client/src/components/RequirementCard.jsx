import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Edit3, X, FileText, Quote, Sparkles, UserCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';
import CorrectionModal from './CorrectionModal';
import Tooltip from './Tooltip';
import { TOOLTIPS } from '../constants/tooltips';

export default function RequirementCard({
  requirement,
  mapping,
  onReview,
  loadingReview
}) {
  const [expanded, setExpanded] = useState(false);
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState(null); // 'CONFIRM' | 'REJECT'
  const [reviewComment, setReviewComment] = useState('');

  const effectiveStatus = mapping?.finalStatus || mapping?.aiStatus || 'MISSING';
  const hasHumanReview = !!mapping?.humanAction;

  const handleConfirm = () => {
    setReviewAction('CONFIRM');
    setReviewComment(mapping?.humanComment || "Confirmed AI finding");
    setReviewModalOpen(true);
  };

  const handleReject = () => {
    setReviewAction('REJECT');
    setReviewComment(mapping?.humanComment || "Rejected AI finding");
    setReviewModalOpen(true);
  };

  const submitReviewAction = () => {
    if (reviewAction === 'CONFIRM') {
      onReview(mapping._id, { action: 'CONFIRM', comment: reviewComment });
    } else if (reviewAction === 'REJECT') {
      onReview(mapping._id, { action: 'REJECT', newStatus: 'MISSING', comment: reviewComment });
    }
    setReviewModalOpen(false);
  };

  const handleCorrectionSubmit = (payload) => {
    onReview(mapping._id, payload);
    setCorrectionOpen(false);
  };

  return (
    <>
      <div className={`bg-white rounded-xl border transition-all ${
        expanded ? 'border-slate-300 shadow-sm ring-1 ring-slate-200' : 'border-slate-200 hover:border-slate-300'
      }`}>
        
        {/* Header Summary Row */}
        <div 
          onClick={() => setExpanded(!expanded)}
          className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
        >
          <div className="flex items-start space-x-3">
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded mt-0.5">
              {requirement.reqId}
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900 leading-snug">
                {requirement.text}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={requirement.mandatory ? 'REQUIRED' : 'RECOMMENDED'} size="sm" />
                <span className="text-xs text-slate-500 font-medium capitalize">
                  {requirement.category?.toLowerCase().replace('_', ' ')}
                </span>
                {hasHumanReview && (
                  <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <UserCheck className="w-3 h-3 mr-1" />
                    Reviewed ({mapping.humanAction})
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-center">
            <StatusBadge status={effectiveStatus} size="md" />
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 p-1"
              aria-label="Expand requirement details"
            >
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expandable Detail Section */}
        {expanded && (
          <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-5 bg-slate-50/50 rounded-b-xl">
            
            {/* 1. Guideline Source Citation */}
            {requirement.source && (
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center text-slate-700 font-semibold space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Guideline Requirement Source:</span>
                </div>
                <div className="text-slate-600 flex flex-wrap gap-x-4 gap-y-1 font-mono">
                  <span>Doc: <strong>{requirement.source.document || 'guideline.pdf'}</strong></span>
                  <span>Page: <strong>{requirement.source.page}</strong></span>
                  {requirement.source.section && <span>Section: <strong>{requirement.source.section}</strong></span>}
                </div>
                {requirement.source.text && (
                  <p className="italic text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 mt-1">
                    "{requirement.source.text}"
                  </p>
                )}
              </div>
            )}

            {/* 2. Application & Supporting Document Evidence */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center">
                  <Quote className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Supplied Evidence & Citations ({mapping?.aiEvidence?.length || 0})
                </span>
                <StatusBadge status={effectiveStatus} size="sm" />
              </div>

              {(!mapping?.aiEvidence || mapping.aiEvidence.length === 0) ? (
                <div className="bg-white p-4 rounded-lg border border-dashed border-rose-200 text-rose-700 text-xs">
                  No supplied evidence was found in the application or attached documents supporting this requirement.
                </div>
              ) : (
                <div className="space-y-2">
                  {mapping.aiEvidence.map((ev, i) => (
                    <div key={i} className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
                      <div className="flex flex-wrap items-center gap-x-3 text-slate-700 font-medium">
                        <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {ev.document}
                        </span>
                        <span>Page <strong>{ev.page}</strong></span>
                        {ev.section && <span className="text-slate-500">({ev.section})</span>}
                      </div>
                      <p className="italic text-slate-800 bg-slate-50 p-2.5 rounded border border-slate-100 font-serif leading-relaxed">
                        "{ev.text}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. AI Reasoning */}
            {mapping?.aiReason && (
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="flex items-center space-x-1.5 text-slate-700 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <Tooltip text={TOOLTIPS.AI_REASONING}>
                    <span>AI Reasoning:</span>
                  </Tooltip>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {mapping.aiReason}
                </p>
              </div>
            )}

            {/* 4. Human Review Action Record if already performed */}
            {hasHumanReview && (
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between text-emerald-800 font-semibold">
                  <span>Human Review Record ({mapping.humanAction}):</span>
                  <span>{new Date(mapping.reviewedAt).toLocaleDateString()}</span>
                </div>
                <p className="text-emerald-700">
                  Reviewed by: <strong>{mapping.reviewedBy}</strong> | Final Status: <strong>{mapping.finalStatus}</strong>
                </p>
                {mapping.humanComment && (
                  <p className="text-slate-600 italic mt-1 bg-white p-2 rounded border border-emerald-100">
                    "{mapping.humanComment}"
                  </p>
                )}
              </div>
            )}

            {/* 5. Review Action Buttons (Confirm, Correct, Reject) */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Human Review
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={loadingReview}
                  onClick={handleConfirm}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-colors shadow-sm disabled:opacity-50"
                  title="Confirm the AI finding as accurate"
                >
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Confirm
                </button>

                <button
                  type="button"
                  disabled={loadingReview}
                  onClick={() => setCorrectionOpen(true)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors shadow-sm disabled:opacity-50"
                  title="Correct the requirement status"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1 text-amber-600" />
                  {hasHumanReview ? 'Edit Review' : 'Correct'}
                </button>

                <button
                  type="button"
                  disabled={loadingReview}
                  onClick={handleReject}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 transition-colors shadow-sm disabled:opacity-50"
                  title="Reject AI finding and mark as missing"
                >
                  <X className="w-3.5 h-3.5 mr-1 text-rose-600" />
                  Reject
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Correction Modal */}
      <CorrectionModal
        isOpen={correctionOpen}
        onClose={() => setCorrectionOpen(false)}
        mapping={mapping}
        requirement={requirement}
        onSubmit={handleCorrectionSubmit}
        loading={loadingReview}
      />

      {/* Review Confirm/Reject Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">
                {reviewAction === 'CONFIRM' ? 'Confirm AI Finding' : 'Reject AI Finding'}
              </h3>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  Optional Comment
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={reviewAction === 'CONFIRM' ? 'Confirmed AI finding...' : 'Rejected AI finding...'}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReviewAction}
                  disabled={loadingReview}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-colors flex items-center ${
                    reviewAction === 'CONFIRM' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {loadingReview ? 'Saving...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
