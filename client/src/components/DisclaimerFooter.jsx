import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function DisclaimerFooter() {
  return (
    <footer className="mt-12 py-6 border-t border-slate-200 text-center text-xs text-slate-500">
      <div className="max-w-4xl mx-auto px-4 space-y-2">
        <div className="flex items-center justify-center space-x-1.5 text-slate-700 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Responsible AI & Completeness Review Disclaimer</span>
        </div>
        <p className="text-slate-500 leading-relaxed text-[11px]">
          GrantCheck provides draft completeness analysis and evidence traceability based solely on supplied documents. It does not make authoritative legal, regulatory, or funding-eligibility decisions. Always verify all findings with appropriate human program officers.
        </p>
        <p className="text-[10px] text-slate-400">
          © 2026 Grant Application Completeness Assistant. Powered by Traceable AI.
        </p>
      </div>
    </footer>
  );
}
