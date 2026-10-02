import React from 'react';
import { CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';

const STEPS = [
  { id: 'extracting_docs', label: 'Extracting document text & page metadata' },
  { id: 'extracting_requirements', label: 'Reading grant guideline & extracting requirements' },
  { id: 'mapping_evidence', label: 'Mapping application & supporting evidence' },
  { id: 'checking_claims', label: 'Checking potential unsupported claims' },
  { id: 'generating_questions', label: 'Generating clarification questions' },
  { id: 'calculating_completeness', label: 'Calculating deterministic completeness score' }
];

export default function ProgressWorkflow({ currentStep = 'idle', error = null }) {
  const getStepStatus = (stepId, index) => {
    if (error) return 'error';
    if (currentStep === 'completed') return 'done';

    const stepOrder = STEPS.map(s => s.id);
    const currentIndex = stepOrder.indexOf(currentStep);

    if (currentIndex === -1) {
      return index === 0 ? 'active' : 'pending';
    }

    if (index < currentIndex) return 'done';
    if (index === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-lg mx-auto">
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
        <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
        <div>
          <h3 className="text-base font-semibold text-slate-900">Analyzing Your Application</h3>
          <p className="text-xs text-slate-500">Executing multi-step completeness evaluation workflow</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Step 0: Always verified document upload */}
        <div className="flex items-center space-x-3 text-sm text-emerald-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-medium">Documents uploaded and validated</span>
        </div>

        {STEPS.map((step, idx) => {
          const status = getStepStatus(step.id, idx);

          return (
            <div key={step.id} className="flex items-center space-x-3 text-sm">
              {status === 'done' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              )}
              {status === 'active' && (
                <Loader2 className="w-5 h-5 text-emerald-600 animate-spin flex-shrink-0" />
              )}
              {status === 'pending' && (
                <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
              )}
              {status === 'error' && (
                <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
              )}

              <span
                className={`font-medium ${
                  status === 'done'
                    ? 'text-slate-700'
                    : status === 'active'
                    ? 'text-emerald-700 font-semibold'
                    : status === 'error'
                    ? 'text-rose-600'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-6 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
          <p className="font-medium">Analysis encountered an issue:</p>
          <p className="mt-0.5">{error}</p>
        </div>
      )}
    </div>
  );
}
