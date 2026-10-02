import React from 'react';
import { HelpCircle, CheckCircle2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ClarificationQuestionsCard({ questions = [] }) {
  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-sm font-semibold text-slate-800 mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Clarification Questions</span>
        </div>
        <p className="text-xs text-slate-500">
          No clarification questions generated. All reviewed requirements have sufficient evidence.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-semibold text-slate-900">
            Suggested Clarification Questions ({questions.length})
          </h3>
        </div>
        <span className="text-xs text-slate-500">Actionable reviewer prompts</span>
      </div>

      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-600">{q.reqId}</span>
              <StatusBadge status={q.statusTrigger} size="sm" />
            </div>

            <p className="text-slate-900 font-semibold text-sm leading-snug">
              "{q.question}"
            </p>

            {q.context && (
              <p className="text-slate-500 italic">
                Context: {q.context}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
