import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, XCircle, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import Tooltip from './Tooltip';
import { TOOLTIPS } from '../constants/tooltips';

export default function StatusBadge({ status, size = 'md', showTooltip = true }) {
  const s = (status || '').toUpperCase();

  let config = {
    label: s,
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: null,
    tooltip: null
  };

  switch (s) {
    case 'SUPPORTED':
      config = {
        label: 'Supported',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/10',
        icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />,
        tooltip: TOOLTIPS.SUPPORTED
      };
      break;
    case 'WEAK':
      config = {
        label: 'Weak',
        color: 'bg-amber-50 text-amber-800 border-amber-200 ring-1 ring-amber-500/10',
        icon: <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600" />,
        tooltip: TOOLTIPS.WEAK
      };
      break;
    case 'AMBIGUOUS':
      config = {
        label: 'Ambiguous',
        color: 'bg-orange-50 text-orange-800 border-orange-200 ring-1 ring-orange-500/10',
        icon: <HelpCircle className="w-3.5 h-3.5 mr-1 text-orange-600" />,
        tooltip: TOOLTIPS.AMBIGUOUS
      };
      break;
    case 'MISSING':
      config = {
        label: 'Missing',
        color: 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/10',
        icon: <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />,
        tooltip: TOOLTIPS.MISSING
      };
      break;
    case 'MANDATORY':
    case 'REQUIRED':
      config = {
        label: 'REQUIRED',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        icon: null,
        tooltip: TOOLTIPS.MANDATORY
      };
      break;
    case 'RECOMMENDED':
    case 'OPTIONAL':
      config = {
        label: 'RECOMMENDED',
        color: 'bg-slate-100 text-slate-600 border-slate-200',
        icon: null,
        tooltip: TOOLTIPS.RECOMMENDED
      };
      break;
    case 'CURRENT':
      config = {
        label: 'CURRENT',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
        icon: <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />,
        tooltip: TOOLTIPS.CURRENT
      };
      break;
    case 'STALE':
      config = {
        label: 'STALE',
        color: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold',
        icon: <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />,
        tooltip: TOOLTIPS.STALE
      };
      break;
    case 'ANALYZING':
      config = {
        label: 'Analyzing...',
        color: 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse',
        icon: <Clock className="w-3.5 h-3.5 mr-1 text-blue-600 animate-spin" />,
        tooltip: 'AI completeness evaluation is currently executing.'
      };
      break;
    case 'DRAFT':
      config = {
        label: 'Draft',
        color: 'bg-slate-100 text-slate-700 border-slate-200',
        icon: null,
        tooltip: 'Draft assessment before analysis is initiated.'
      };
      break;
    case 'FAILED':
      config = {
        label: 'Failed',
        color: 'bg-rose-100 text-rose-800 border-rose-300',
        icon: <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />,
        tooltip: 'Analysis encountered an error.'
      };
      break;
    default:
      config.label = s;
  }

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : size === 'lg' 
    ? 'px-3 py-1 text-sm' 
    : 'px-2.5 py-0.5 text-xs';

  const badgeContent = (
    <span className={`inline-flex items-center font-medium border rounded-full ${sizeClasses} ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );

  if (showTooltip && config.tooltip) {
    return (
      <Tooltip text={config.tooltip}>
        {badgeContent}
      </Tooltip>
    );
  }

  return badgeContent;
}
