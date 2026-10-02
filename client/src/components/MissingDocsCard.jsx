import React from 'react';
import { Paperclip, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function MissingDocsCard({ missingDocs = [] }) {
  if (!missingDocs || missingDocs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-sm font-semibold text-slate-800 mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Supporting Documents Tracking</span>
        </div>
        <p className="text-xs text-slate-500">
          No mandatory supporting documents were required or all requested attachments were provided.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Paperclip className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-900">
            Supporting Documents Status ({missingDocs.length})
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">Guideline Required Attachments</span>
      </div>

      <div className="space-y-2.5">
        {missingDocs.map((doc, idx) => {
          const isProvided = doc.status === 'PROVIDED';
          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                isProvided
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/60 border-rose-200 text-rose-900'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm">{doc.documentName}</span>
                  {doc.requiredByReqId && (
                    <span className="font-mono text-[10px] bg-white/80 px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                      {doc.requiredByReqId}
                    </span>
                  )}
                </div>
                {doc.description && (
                  <p className="text-slate-600 text-xs">{doc.description}</p>
                )}
              </div>

              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full font-semibold text-xs border ${
                  isProvided
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300'
                }`}
              >
                {isProvided ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                    Provided
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-700" />
                    Missing
                  </>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
