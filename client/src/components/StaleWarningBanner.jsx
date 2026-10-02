import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function StaleWarningBanner({ assessment, onRerun, loadingRerun }) {
  if (!assessment || assessment.status !== 'STALE') return null;

  return (
    <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-700 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-amber-900">
                Stale Assessment Warning
              </h4>
              <StatusBadge status="STALE" size="sm" showTooltip={false} />
            </div>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              {assessment.staleReason || 'This assessment was created using an older document version. New files or revisions have been uploaded.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={loadingRerun}
          onClick={onRerun}
          className="inline-flex items-center justify-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors self-start sm:self-center flex-shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loadingRerun ? 'animate-spin' : ''}`} />
          {loadingRerun ? 'Re-analyzing...' : 'Re-run Assessment'}
        </button>
      </div>

      <div className="bg-white/80 p-3 rounded-lg border border-amber-200 text-xs text-slate-700 flex flex-wrap gap-4">
        <div>
          <span className="text-slate-500 font-medium">Assessment Document Versions:</span>{' '}
          <strong className="text-slate-800">Guideline v{assessment.guidelineVersion}, Application v{assessment.applicationVersion}</strong>
        </div>
      </div>
    </div>
  );
}
