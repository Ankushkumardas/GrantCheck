import React from 'react';
import { AlertOctagon, CheckCircle2 } from 'lucide-react';
import Tooltip from './Tooltip';
import { TOOLTIPS } from '../constants/tooltips';

export default function UnsupportedClaimsCard({ claims = [] }) {
  if (!claims || claims.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-sm font-semibold text-slate-800 mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Unsupported Claims Analysis</span>
        </div>
        <p className="text-xs text-slate-500">
          No potential unsupported claims found. All reviewed application claims have corroborating supplied evidence.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <AlertOctagon className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-semibold text-slate-900">
            Potential Unsupported Claims ({claims.length})
          </h3>
        </div>
        <Tooltip text={TOOLTIPS.UNSUPPORTED_CLAIM} icon={true}>
          <span className="text-xs text-slate-500 font-medium">Notice</span>
        </Tooltip>
      </div>

      <div className="space-y-3">
        {claims.map((claim, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-2"
          >
            <div className="flex items-center justify-between text-amber-900 font-medium">
              <span>Potential Unsupported Claim</span>
              {claim.source && (
                <span className="text-amber-800 font-mono">
                  {claim.source.document} (p. {claim.source.page})
                </span>
              )}
            </div>

            <p className="font-serif italic text-slate-800 bg-white p-2.5 rounded border border-amber-200/60 leading-relaxed">
              "{claim.claimText}"
            </p>

            <p className="text-amber-800 leading-relaxed">
              <strong>Finding:</strong> {claim.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
