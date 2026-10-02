import React from 'react';
import { X, CheckCircle, Award, FileText, AlertCircle, Printer } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ReviewedSummaryModal({ isOpen, onClose, summary }) {
  if (!isOpen || !summary) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Reviewed Completeness Summary</h3>
              <p className="text-xs text-slate-400">{summary.assessmentTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          
          {/* Top Score Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Reviewed Completeness Score
              </span>
              <div className="text-4xl font-extrabold text-emerald-950">
                {summary.completenessScore}%
              </div>
              <p className="text-xs text-emerald-700 font-medium">
                {summary.mandatorySupported} of {summary.mandatoryTotal} mandatory requirements supported
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-600 space-y-1 border-t sm:border-t-0 pt-3 sm:pt-0 border-emerald-200">
              <div>Guideline: <strong>v{summary.guidelineVersion}</strong> ({summary.guidelineFileName})</div>
              <div>Application: <strong>v{summary.applicationVersion}</strong> ({summary.applicationFileName})</div>
              <div>Reviewed: <strong>{new Date(summary.reviewedAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></div>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <span className="text-xs text-slate-500 font-medium block">Total Reviewed</span>
              <span className="text-xl font-bold text-slate-900 mt-0.5 block">{summary.totalReviewed}</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
              <span className="text-xs text-emerald-700 font-medium block">Confirmed</span>
              <span className="text-xl font-bold text-emerald-900 mt-0.5 block">{summary.confirmedCount}</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
              <span className="text-xs text-amber-700 font-medium block">Corrected</span>
              <span className="text-xl font-bold text-amber-900 mt-0.5 block">{summary.correctedCount}</span>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-center">
              <span className="text-xs text-rose-700 font-medium block">Rejected</span>
              <span className="text-xl font-bold text-rose-900 mt-0.5 block">{summary.rejectedCount}</span>
            </div>
          </div>

          {/* Status Breakdown & Remaining Issues */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Audit Breakdown
            </h4>

            <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 text-xs">
              <div className="p-3 flex justify-between items-center">
                <span className="text-slate-600">Supported Mandatory Requirements:</span>
                <span className="font-bold text-emerald-700">{summary.mandatorySupported} / {summary.mandatoryTotal}</span>
              </div>
              
              <div className="p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600">Weak Evidence Items:</span>
                  <span className="font-bold text-amber-700">{summary.mandatoryWeak}</span>
                </div>
                {summary.remainingIssuesList?.filter(i => i.status === 'WEAK').map((item, idx) => (
                  <div key={idx} className="text-slate-500 pl-2 border-l-2 border-amber-300 mt-1">{item.reqId}: {item.text}</div>
                ))}
              </div>

              <div className="p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600">Ambiguous Evidence Items:</span>
                  <span className="font-bold text-orange-700">{summary.mandatoryAmbiguous}</span>
                </div>
                {summary.remainingIssuesList?.filter(i => i.status === 'AMBIGUOUS').map((item, idx) => (
                  <div key={idx} className="text-slate-500 pl-2 border-l-2 border-orange-300 mt-1">{item.reqId}: {item.text}</div>
                ))}
              </div>

              <div className="p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600">Missing Mandatory Evidence:</span>
                  <span className="font-bold text-rose-700">{summary.mandatoryMissing}</span>
                </div>
                {summary.remainingIssuesList?.filter(i => i.status === 'MISSING').map((item, idx) => (
                  <div key={idx} className="text-slate-500 pl-2 border-l-2 border-rose-300 mt-1">{item.reqId}: {item.text}</div>
                ))}
              </div>

              <div className="p-3 flex justify-between items-center">
                <span className="text-slate-600">Recommended Requirements Supported:</span>
                <span className="font-bold text-slate-700">{summary.recommendedSupported} / {summary.recommendedTotal}</span>
              </div>

              <div className="p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600">Potential Unsupported Claims:</span>
                  <span className="font-bold text-amber-700">{summary.unsupportedClaimsCount}</span>
                </div>
                {summary.unsupportedClaimsList?.map((claim, idx) => (
                  <div key={idx} className="text-slate-500 pl-2 border-l-2 border-slate-300 mt-1">"{claim}"</div>
                ))}
              </div>

              <div className="p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600">Clarification Questions:</span>
                  <span className="font-bold text-indigo-700">{summary.clarificationQuestionsCount}</span>
                </div>
                {summary.clarificationQuestionsList?.map((q, idx) => (
                  <div key={idx} className="text-slate-500 pl-2 border-l-2 border-indigo-300 mt-1">[{q.reqId}] {q.question}</div>
                ))}
              </div>

              <div className="p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600">Missing Guideline Attachments:</span>
                  <span className="font-bold text-rose-700">{summary.missingSupportingDocsCount}</span>
                </div>
                {summary.missingSupportingDocsList?.map((doc, idx) => (
                  <div key={idx} className="text-slate-500 pl-2 border-l-2 border-rose-300 mt-1">{doc}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Responsible AI Disclaimer */}
          <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 pt-4 text-center">
            Disclaimer: This completeness summary is an evaluation against supplied guidelines and documents. It does not constitute legal counsel, authoritative approval, or guarantee funding award.
          </p>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 border border-slate-300 rounded-lg hover:bg-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Print Summary
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
