import React from 'react';
import { X, CheckCircle, Award, FileText, AlertCircle, Printer, Download } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ReviewedSummaryModal({ isOpen, onClose, summary }) {
  if (!isOpen || !summary) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    const reportData = {
      assessmentTitle: summary.assessmentTitle,
      status: summary.status,
      reviewedCompletenessScore: `${summary.completenessScore}%`,
      reviewedAt: summary.reviewedAt,
      guidelineDocument: {
        file: summary.guidelineFileName,
        version: summary.guidelineVersion
      },
      applicationDocument: {
        file: summary.applicationFileName,
        version: summary.applicationVersion
      },
      reviewCounters: {
        totalReviewed: summary.totalReviewed,
        confirmed: summary.confirmedCount,
        corrected: summary.correctedCount,
        rejected: summary.rejectedCount
      },
      mandatoryRequirements: {
        total: summary.mandatoryTotal,
        supported: summary.mandatorySupported,
        weak: summary.mandatoryWeak,
        ambiguous: summary.mandatoryAmbiguous,
        missing: summary.mandatoryMissing
      },
      recommendedRequirements: {
        total: summary.recommendedTotal,
        supported: summary.recommendedSupported
      },
      remainingIssues: summary.remainingIssuesList || [],
      potentialUnsupportedClaims: summary.unsupportedClaimsList || [],
      clarificationQuestions: summary.clarificationQuestionsList || [],
      missingGuidelineAttachments: summary.missingSupportingDocsList || []
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${summary.assessmentTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_completeness_report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="print-container-wrapper" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] printable-summary print:max-h-none print:rounded-none print:border-none print:shadow-none">
        
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between print:bg-white print:text-slate-900 print:border-b-2 print:border-slate-900 print:px-0 print:py-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold print:hidden">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight print:text-lg">Reviewed Completeness Summary</h3>
              <p className="text-xs text-slate-400 print:text-slate-600 font-medium">{summary.assessmentTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors no-print"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-4 overflow-y-auto print:overflow-visible print:p-0 print:pt-3 print:space-y-3">
          
          {/* Top Score Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:p-3 print:rounded-lg">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Reviewed Completeness Score
              </span>
              <div className="text-3xl font-extrabold text-emerald-950">
                {summary.completenessScore}%
              </div>
              <p className="text-xs text-emerald-700 font-medium">
                {summary.mandatorySupported} of {summary.mandatoryTotal} mandatory requirements supported
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-200 print:text-[11px]">
              <div>Guideline: <strong>v{summary.guidelineVersion}</strong> ({summary.guidelineFileName})</div>
              <div>Application: <strong>v{summary.applicationVersion}</strong> ({summary.applicationFileName})</div>
              <div>Reviewed: <strong>{new Date(summary.reviewedAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></div>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 print:gap-2">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center print:p-2">
              <span className="text-[10px] text-slate-500 font-medium block">Total Reviewed</span>
              <span className="text-lg font-bold text-slate-900 block">{summary.totalReviewed}</span>
            </div>
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-center print:p-2">
              <span className="text-[10px] text-emerald-700 font-medium block">Confirmed</span>
              <span className="text-lg font-bold text-emerald-900 block">{summary.confirmedCount}</span>
            </div>
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-center print:p-2">
              <span className="text-[10px] text-amber-700 font-medium block">Corrected</span>
              <span className="text-lg font-bold text-amber-900 block">{summary.correctedCount}</span>
            </div>
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-center print:p-2">
              <span className="text-[10px] text-rose-700 font-medium block">Rejected</span>
              <span className="text-lg font-bold text-rose-900 block">{summary.rejectedCount}</span>
            </div>
          </div>

          {/* Status Breakdown & Remaining Issues */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Audit Breakdown
            </h4>

            <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 text-xs print:text-[11px]">
              <div className="p-2.5 flex justify-between items-center print:py-1.5">
                <span className="text-slate-600">Supported Mandatory Requirements:</span>
                <span className="font-bold text-emerald-700">{summary.mandatorySupported} / {summary.mandatoryTotal}</span>
              </div>
              
              <div className="p-2.5 print:py-1.5">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-slate-600">Weak Evidence Items:</span>
                  <span className="font-bold text-amber-700">{summary.mandatoryWeak}</span>
                </div>
                {summary.remainingIssuesList?.filter(i => i.status === 'WEAK').map((item, idx) => (
                  <div key={idx} className="text-slate-600 pl-2 border-l-2 border-amber-400 mt-1 flex items-start space-x-1.5">
                    <span className="font-mono font-bold text-amber-800 shrink-0">{item.reqId}:</span>
                    <span className="leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="p-2.5 print:py-1.5">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-slate-600">Ambiguous Evidence Items:</span>
                  <span className="font-bold text-orange-700">{summary.mandatoryAmbiguous}</span>
                </div>
                {summary.remainingIssuesList?.filter(i => i.status === 'AMBIGUOUS').map((item, idx) => (
                  <div key={idx} className="text-slate-600 pl-2 border-l-2 border-orange-400 mt-1 flex items-start space-x-1.5">
                    <span className="font-mono font-bold text-orange-800 shrink-0">{item.reqId}:</span>
                    <span className="leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="p-2.5 print:py-1.5">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-slate-600">Missing Mandatory Evidence:</span>
                  <span className="font-bold text-rose-700">{summary.mandatoryMissing}</span>
                </div>
                {summary.remainingIssuesList?.filter(i => i.status === 'MISSING').map((item, idx) => (
                  <div key={idx} className="text-slate-600 pl-2 border-l-2 border-rose-400 mt-1 flex items-start space-x-1.5">
                    <span className="font-mono font-bold text-rose-800 shrink-0">{item.reqId}:</span>
                    <span className="leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="p-2.5 flex justify-between items-center print:py-1.5">
                <span className="text-slate-600">Recommended Requirements Supported:</span>
                <span className="font-bold text-slate-700">{summary.recommendedSupported} / {summary.recommendedTotal}</span>
              </div>

              <div className="p-2.5 print:py-1.5">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-slate-600">Potential Unsupported Claims:</span>
                  <span className="font-bold text-amber-700">{summary.unsupportedClaimsCount}</span>
                </div>
                {summary.unsupportedClaimsList?.map((claim, idx) => (
                  <div key={idx} className="text-slate-600 pl-2 border-l-2 border-slate-300 mt-1 italic">
                    "{claim}"
                  </div>
                ))}
              </div>

              <div className="p-2.5 print:py-1.5">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-slate-600">Clarification Questions:</span>
                  <span className="font-bold text-indigo-700">{summary.clarificationQuestionsCount}</span>
                </div>
                {summary.clarificationQuestionsList?.map((q, idx) => (
                  <div key={idx} className="text-slate-600 pl-2 border-l-2 border-indigo-400 mt-1 flex items-start space-x-2">
                    <span className="px-1.5 py-0.2 rounded bg-indigo-50 border border-indigo-200 text-indigo-800 font-mono text-[10px] font-bold shrink-0">
                      {q.reqId}
                    </span>
                    <span className="leading-snug">{q.question}</span>
                  </div>
                ))}
              </div>

              <div className="p-2.5 print:py-1.5">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-slate-600">Missing Guideline Attachments:</span>
                  <span className="font-bold text-rose-700">{summary.missingSupportingDocsCount}</span>
                </div>
                {summary.missingSupportingDocsList?.map((doc, idx) => (
                  <div key={idx} className="text-slate-600 pl-2 border-l-2 border-rose-400 mt-0.5">
                    {doc}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Responsible AI Disclaimer */}
          <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 pt-2 text-center print:text-slate-500">
            Disclaimer: This completeness summary is an evaluation against supplied guidelines and documents. It does not constitute legal counsel, authoritative approval, or guarantee funding award.
          </p>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Print Summary
            </button>

            <button
              type="button"
              onClick={handleDownloadReport}
              className="inline-flex items-center text-xs font-semibold text-emerald-800 hover:text-emerald-950 px-3 py-2 border border-emerald-300 rounded-lg bg-emerald-50 hover:bg-emerald-100 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Download JSON Audit Report
            </button>
          </div>

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
