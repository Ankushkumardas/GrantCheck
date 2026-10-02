import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function CorrectionModal({ isOpen, onClose, mapping, requirement, onSubmit, loading }) {
  const [selectedStatus, setSelectedStatus] = useState('SUPPORTED');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (isOpen && mapping) {
      setSelectedStatus(mapping.finalStatus || mapping.aiStatus || 'SUPPORTED');
      setComment(mapping.humanComment || '');
    }
  }, [isOpen, mapping]);

  if (!isOpen || !mapping) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      action: 'CORRECT',
      newStatus: selectedStatus,
      comment
    });
  };

  const statuses = ['SUPPORTED', 'WEAK', 'AMBIGUOUS', 'MISSING'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">
            Correct Requirement Status
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Requirement</span>
            <p className="text-sm font-medium text-slate-800 mt-1">
              {requirement?.text || mapping.reqId}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Current AI Status
            </span>
            <StatusBadge status={mapping.aiStatus} />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
              Select Corrected Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statuses.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                    selectedStatus === st
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <StatusBadge status={st} showTooltip={false} size="sm" />
                  {selectedStatus === st && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
              Reviewer Notes / Reason
            </label>
            <textarea
              id="comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Explain why this status is being corrected (e.g., 'Found additional evidence on page 3')..."
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center"
            >
              {loading ? 'Saving...' : 'Save Correction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
