import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DisclaimerFooter from '../components/DisclaimerFooter';
import { FileCheck, ArrowRight, Shield, Layers, CheckCircle, Search, GitBranch, Sparkles, Cpu, Lock, Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 sm:pt-28 sm:pb-28 border-b border-slate-200/70 bg-gradient-to-b from-white via-slate-50/50 to-[#fafbfc]">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-[0.4] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 text-slate-100 text-xs font-medium shadow-sm hover:bg-slate-800 transition-colors cursor-pointer">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wide">Grant Application Verification Engine 2.0</span>
            <span className="text-slate-400 font-normal">|</span>
            <span className="text-emerald-400 font-medium">Deterministic Scoring</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-slate-950 leading-[1.1] max-w-4xl mx-auto">
            Audit grant applications <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600">
              with traceable confidence.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Eliminate non-compliance rejections before submission. Automatically match draft proposals against complex funding guidelines with verifiable page citations, gap detection, and human verification.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-slate-950 hover:bg-slate-800 rounded-lg shadow-sm hover:shadow transition-all group"
            >
              <span>Launch Assessment</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300/80 rounded-lg shadow-sm transition-all"
            >
              <span>Explore Live Demo</span>
            </Link>
          </div>

          {/* Clean Metric Cards */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase block">Mathematical Audit</span>
              <span className="text-sm font-semibold text-slate-900 mt-1 block">100% Deterministic</span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase block">Traceability</span>
              <span className="text-sm font-semibold text-slate-900 mt-1 block">Page & Quote Level</span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase block">Governance</span>
              <span className="text-sm font-semibold text-slate-900 mt-1 block">Human Verification Required</span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase block">State Integrity</span>
              <span className="text-sm font-semibold text-slate-900 mt-1 block">Stale Detection & Hash</span>
            </div>
          </div>

        </div>
      </section>

      {/* Modern Horizontal Workflow Canvas Section (Enterprise Pipeline Aesthetic) */}
      <section className="py-24 bg-white border-b border-slate-200/80 relative overflow-hidden">
        {/* Subtle Canvas Dot Grid */}
        <div 
          className="absolute inset-0 opacity-[0.45] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
              <Cpu className="w-3.5 h-3.5 text-slate-600" />
              <span>Pipeline Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950">
              Deterministic Multi-Stage Execution
            </h2>
            <p className="text-sm text-slate-500">
              Each document flows through structured ingestion, semantic parsing, deterministic validation, and human review before generating final completeness scores.
            </p>
          </div>

          {/* Horizontal Interactive Flow Canvas */}
          <div className="w-full overflow-x-auto pb-6 pt-2 custom-scrollbar">
            <div className="min-w-[1040px] max-w-6xl mx-auto p-4 sm:p-6 relative">
              
              {/* Main Horizontal Flow Row */}
              <div className="flex items-center justify-between relative z-10 pt-2">
                
                {/* Node 1: Ingestion Trigger */}
                <div className="flex flex-col items-center">
                  <div className="w-48 bg-white rounded-xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all relative">
                    {/* Top Type Indicator */}
                    <div className="flex items-center justify-between mb-3 text-slate-400">
                      <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                        <Layers className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Source Input</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-xs font-semibold text-slate-900">Document Ingestion</div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-snug">Guideline PDF + Draft Application + Addendums</div>
                    
                    {/* Right Connection Port */}
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-400 shadow-sm flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono mt-3">Stage 01: Ingestion</span>
                </div>

                {/* Connecting Line 1 -> 2 */}
                <div className="flex-1 px-4 flex items-center justify-center -mt-6">
                  <div className="w-full h-[2px] bg-slate-300 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-slate-400 rotate-45" />
                  </div>
                </div>

                {/* Node 2: AI Parsing Agent */}
                <div className="flex flex-col items-center">
                  <div className="w-56 bg-white rounded-xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all relative">
                    {/* Left Port */}
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-400 shadow-sm flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    </div>
                    {/* Right Port */}
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-400 shadow-sm flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    </div>
                    {/* Bottom Port */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-400 shadow-sm flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Semantic Engine</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">LLM</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900">Requirement Extractor</div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-snug">Classifies Mandatory vs Recommended criteria</div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono mt-3">Stage 02: Classification</span>
                </div>

                {/* Connecting Line 2 -> 3 */}
                <div className="flex-1 px-4 flex items-center justify-center -mt-6">
                  <div className="w-full h-[2px] bg-slate-300 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-slate-400 rotate-45" />
                  </div>
                </div>

                {/* Node 3: Decision Evaluator */}
                <div className="flex flex-col items-center">
                  <div className="w-48 bg-white rounded-xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all relative">
                    {/* Left Port */}
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-400 shadow-sm flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    </div>
                    {/* Dual Output Ports */}
                    <div className="absolute -right-2 top-5 w-4 h-4 rounded-full bg-white border-2 border-emerald-500 shadow-sm flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="absolute -right-2 bottom-5 w-4 h-4 rounded-full bg-white border-2 border-rose-500 shadow-sm flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                        <GitBranch className="w-3.5 h-3.5 text-slate-600" />
                        <span>Audit Rule</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Rule</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900">Evidence Validator</div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-snug">Verifies exact verbatim citations in application</div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono mt-3">Stage 03: Verification</span>
                </div>

                {/* Connecting Curved Output Branches */}
                <div className="w-24 h-32 relative -mt-6">
                  <svg className="w-full h-full" viewBox="0 0 100 120" fill="none">
                    <path
                      d="M 0 35 C 50 35, 50 15, 96 15"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                    <polygon points="94,12 99,15 94,18" fill="#10b981" />
                    <text x="25" y="16" fill="#047857" fontSize="9" fontWeight="600" fontFamily="monospace">supported</text>
                    
                    <path
                      d="M 0 85 C 50 85, 50 105, 96 105"
                      stroke="#f43f5e"
                      strokeWidth="2"
                    />
                    <polygon points="94,102 99,105 94,108" fill="#f43f5e" />
                    <text x="32" y="115" fill="#be123c" fontSize="9" fontWeight="600" fontFamily="monospace">missing</text>
                  </svg>
                </div>

                {/* Output Dual Nodes: Results & Review */}
                <div className="flex flex-col space-y-4">
                  
                  {/* Supported Outcome */}
                  <div className="w-52 bg-white rounded-xl border border-emerald-200 p-3.5 shadow-sm hover:shadow transition-all relative flex items-center space-x-3">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-500" />
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Deterministic Score</div>
                      <div className="text-[10px] text-emerald-600 font-medium">Mathematical Index</div>
                    </div>
                  </div>

                  {/* Review / Flagged Outcome */}
                  <div className="w-52 bg-white rounded-xl border border-rose-200 p-3.5 shadow-sm hover:shadow transition-all relative flex items-center space-x-3">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-rose-500" />
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Human Verification</div>
                      <div className="text-[10px] text-rose-600 font-medium">Reviewer Override</div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Sub-connections radiating downward from AI Agent (Integrations & Dependencies) */}
              <div className="mt-8 flex justify-center">
                <div className="w-full max-w-lg flex flex-col items-center">
                  
                  {/* Branching down line */}
                  <div className="h-6 w-64 border-b border-l border-r border-slate-300 rounded-b-xl relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-slate-300" />
                    <div className="absolute -bottom-1.5 left-0 w-3 h-3 rounded-full bg-white border border-slate-400" />
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border border-slate-400" />
                    <div className="absolute -bottom-1.5 right-0 w-3 h-3 rounded-full bg-white border border-slate-400" />
                  </div>

                  {/* Dependent Modules */}
                  <div className="flex items-center justify-between w-full pt-3 px-1 text-center">
                    
                    <div className="flex flex-col items-center space-y-1">
                      <div className="px-2.5 py-1 rounded bg-white border border-slate-200 text-[11px] font-mono font-medium text-slate-700 shadow-sm">
                        Gemini 2.5 / Ollama
                      </div>
                      <span className="text-[10px] text-slate-400">Inference Core</span>
                    </div>

                    <div className="flex flex-col items-center space-y-1">
                      <div className="px-2.5 py-1 rounded bg-white border border-slate-200 text-[11px] font-mono font-medium text-slate-700 shadow-sm">
                        PDF Chunk Index
                      </div>
                      <span className="text-[10px] text-slate-400">Positional Citations</span>
                    </div>

                    <div className="flex flex-col items-center space-y-1">
                      <div className="px-2.5 py-1 rounded bg-white border border-slate-200 text-[11px] font-mono font-medium text-slate-700 shadow-sm">
                        Audit Trail Log
                      </div>
                      <span className="text-[10px] text-slate-400">Immutable History</span>
                    </div>

                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Enterprise Principles Grid */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Built for High-Stakes Funding Applications
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Engineered around verification and transparency rather than ungrounded AI summaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">Verifiable Page Quotes</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every flagged weakness or verified requirement links directly to exact page numbers and verbatim text chunks in the uploaded PDF.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">Deterministic Calculations</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The AI never guesses scores. Completeness calculations are purely mathematical formulas based on verified evidence criteria.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">Reviewer Accountability</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reviewers have final authority to confirm or override any AI suggestion, automatically recording an immutable timestamped audit trail.
            </p>
          </div>
        </div>
      </section>

      <DisclaimerFooter />
    </div>
  );
}

