import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DisclaimerFooter from '../components/DisclaimerFooter';
import { FileCheck, ArrowRight, Shield, Layers, HelpCircle, CheckCircle, Search, GitBranch } from 'lucide-react';

export default function LandingPage() {
  const steps = [
    {
      num: '01',
      title: 'Upload Documents',
      desc: 'Provide your grant guideline PDF, draft application PDF, and optional supporting documents.',
      icon: Layers
    },
    {
      num: '02',
      title: 'Extract Requirements',
      desc: 'AI dynamically parses mandatory requirements from recommendations with exact guideline citations.',
      icon: Search
    },
    {
      num: '03',
      title: 'Map Evidence',
      desc: 'Trace application paragraphs against each requirement with SUPPORTED, WEAK, AMBIGUOUS, or MISSING states.',
      icon: FileCheck
    },
    {
      num: '04',
      title: 'Review AI Findings',
      desc: 'Confirm, correct, or reject AI mappings with full audit trail logging and deterministic score recalculation.',
      icon: CheckCircle
    },
    {
      num: '05',
      title: 'Reviewed Summary',
      desc: 'Export a rigorous completeness report highlighting unsupported claims, clarification questions, and missing attachments.',
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Traceable AI Completeness Review System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Review grant applications <br className="hidden sm:inline" />
            <span className="text-emerald-600">with absolute confidence.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            Compare your draft application against any grant guideline, identify missing or weak evidence, verify unsupported claims, and maintain human verification every step of the way.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all group"
            >
              <span>Start Review</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition-all"
            >
              <span>View Demo</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block">Scoring</span>
              <span className="text-sm font-bold text-slate-800">100% Deterministic</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block">Traceability</span>
              <span className="text-sm font-bold text-slate-800">Page & Quote Citations</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block">Governance</span>
              <span className="text-sm font-bold text-slate-800">Human-In-The-Loop</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block">Versioning</span>
              <span className="text-sm font-bold text-slate-800">Stale State Detection</span>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How GrantCheck Works
            </h2>
            <p className="text-sm text-slate-600">
              A structured multi-step evaluation workflow engineered for precision and evidence traceability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                        {step.num}
                      </span>
                      <Icon className="w-4 h-4 text-slate-400" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Responsible AI Callout */}
      <section className="py-16 max-w-4xl mx-auto px-4 text-center">
        <div className="bg-emerald-950 text-white rounded-2xl p-8 sm:p-10 shadow-xl space-y-4 text-left sm:text-center">
          <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Ethical AI Principles</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold">
            Controlled AI Workflow, Not an Autonomous Black Box
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200 max-w-2xl mx-auto leading-relaxed">
            The AI analyzes documents and extracts quotes; the deterministic backend calculates the completeness score; and human reviewers retain full authority to confirm, correct, or reject any finding.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-lg transition-colors"
            >
              Start Exploring
            </Link>
          </div>
        </div>
      </section>

      <DisclaimerFooter />
    </div>
  );
}
