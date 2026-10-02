import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProgressWorkflow from '../components/ProgressWorkflow';
import api from '../services/api';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, Play, Sparkles, Paperclip, X } from 'lucide-react';

export default function NewAssessmentPage() {
  const [title, setTitle] = useState('Community Action Grant 2026 Review');
  const [guidelineFile, setGuidelineFile] = useState(null);
  const [applicationFile, setApplicationFile] = useState(null);
  const [supportingFiles, setSupportingFiles] = useState([]);
  
  const [assessmentId, setAssessmentId] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState('idle');
  const [error, setError] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const navigate = useNavigate();

  const handleSupportingFiles = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSupportingFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeSupportingFile = (index) => {
    setSupportingFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Helper for quick test sample loads via preset simulated files
  const handleLoadSamplePreset = async (presetType) => {
    setError('');
    try {
      if (presetType === 'community') {
        setTitle('Community Action Grant 2026 - Urban Food Initiative');
      } else if (presetType === 'education') {
        setTitle('State Educational Excellence Fund - Future Leaders Academy');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartAnalysis = async (e) => {
    e.preventDefault();
    if (!guidelineFile || !applicationFile) {
      setError('Please select both a Grant Guideline PDF and a Draft Application PDF before starting analysis.');
      return;
    }

    setError('');
    setAnalyzing(true);
    setCurrentStep('extracting_docs');

    try {
      // 1. Create Assessment Draft
      const createRes = await api.post('/assessments', { title });
      if (!createRes.data.success) throw new Error('Failed to create assessment draft.');
      const newId = createRes.data.assessment._id;
      setAssessmentId(newId);

      // 2. Upload Guideline
      const guidelineFormData = new FormData();
      guidelineFormData.append('file', guidelineFile);
      await api.post(`/assessments/${newId}/guideline`, guidelineFormData, {
        headers: { 'Content-Type': undefined }
      });

      // 3. Upload Draft Application
      const appFormData = new FormData();
      appFormData.append('file', applicationFile);
      await api.post(`/assessments/${newId}/application`, appFormData, {
        headers: { 'Content-Type': undefined }
      });

      // 4. Upload Supporting Documents if present
      if (supportingFiles.length > 0) {
        const supFormData = new FormData();
        supportingFiles.forEach(f => supFormData.append('files', f));
        await api.post(`/assessments/${newId}/supporting-documents`, supFormData, {
          headers: { 'Content-Type': undefined }
        });
      }

      // 5. Trigger Backend Analysis Workflow
      setCurrentStep('extracting_requirements');
      
      const analyzeRes = await api.post(`/assessments/${newId}/analyze`);
      if (analyzeRes.data.success) {
        setCurrentStep('completed');
        setTimeout(() => {
          navigate(`/assessments/${newId}`);
        }, 1200);
      }
    } catch (err) {
      console.error('Analysis error', err);
      setError(err.response?.data?.message || err.message || 'Analysis encountered an error.');
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onMobileToggle={() => setMobileOpen(!mobileOpen)} mobileOpen={mobileOpen} />

      <div className="flex-1 flex w-full">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
          
          {analyzing ? (
            /* Live Progress Step View */
            <div className="py-12">
              <ProgressWorkflow currentStep={currentStep} error={error} />
            </div>
          ) : (
            /* Multi-step Document Upload Form */
            <div className="max-w-3xl mx-auto space-y-8">
              
              {/* Header */}
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  New Grant Completeness Assessment
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Upload your funding guideline, draft proposal, and optional attachments for automated requirement and evidence mapping.
                </p>
              </div>

              {/* Assessment Title */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Assessment Title / Proposal Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="e.g., Community Action Grant 2026 - Urban Food Initiative"
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Upload Grid */}
              <div className="space-y-4">
                
                {/* Step 1: Guideline */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">1</span>
                      <h3 className="text-sm font-bold text-slate-900">Grant Guideline Document</h3>
                      <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Required</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    The official grant/funding guidelines containing eligibility, submission criteria, and evaluation priorities.
                  </p>

                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors bg-slate-50/50">
                    <input
                      type="file"
                      id="guideline-upload"
                      accept=".pdf,application/pdf"
                      onChange={(e) => setGuidelineFile(e.target.files[0])}
                      className="hidden"
                    />
                    <label htmlFor="guideline-upload" className="cursor-pointer space-y-2 block">
                      <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                      <div className="text-xs font-medium text-slate-700">
                        {guidelineFile ? (
                          <span className="text-emerald-700 font-bold flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            {guidelineFile.name} ({(guidelineFile.size / 1024).toFixed(1)} KB)
                          </span>
                        ) : (
                          <span>Click to browse or drop your Guideline PDF here</span>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Step 2: Draft Application */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">2</span>
                      <h3 className="text-sm font-bold text-slate-900">Draft Grant Application</h3>
                      <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Required</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    The proposal text, project narrative, and organizational answers being evaluated for completeness.
                  </p>

                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors bg-slate-50/50">
                    <input
                      type="file"
                      id="application-upload"
                      accept=".pdf,application/pdf"
                      onChange={(e) => setApplicationFile(e.target.files[0])}
                      className="hidden"
                    />
                    <label htmlFor="application-upload" className="cursor-pointer space-y-2 block">
                      <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                      <div className="text-xs font-medium text-slate-700">
                        {applicationFile ? (
                          <span className="text-emerald-700 font-bold flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            {applicationFile.name} ({(applicationFile.size / 1024).toFixed(1)} KB)
                          </span>
                        ) : (
                          <span>Click to browse or drop your Draft Application PDF here</span>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Step 3: Optional Supporting Documents */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">3</span>
                      <h3 className="text-sm font-bold text-slate-900">Supporting Documents</h3>
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Optional</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upload registration certificates, budgets, financial statements, or other proof. <strong className="text-slate-700 font-semibold">Supporting documents should be specifically as mentioned in the guideline.</strong>
                  </p>

                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-emerald-400 transition-colors bg-slate-50/50">
                    <input
                      type="file"
                      id="supporting-upload"
                      accept=".pdf,application/pdf"
                      multiple
                      onChange={handleSupportingFiles}
                      className="hidden"
                    />
                    <label htmlFor="supporting-upload" className="cursor-pointer space-y-1.5 block">
                      <Paperclip className="w-6 h-6 text-slate-400 mx-auto" />
                      <div className="text-xs font-medium text-slate-700">
                        <span>Click to attach one or multiple supporting PDFs</span>
                      </div>
                    </label>
                  </div>

                  {supportingFiles.length > 0 && (
                    <div className="pt-2 space-y-1.5">
                      {supportingFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        >
                          <div className="flex items-center space-x-2 text-slate-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{file.name}</span>
                            <span className="text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSupportingFile(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>


              <div className="pt-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  disabled={!guidelineFile || !applicationFile}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Analyze Application
                </button>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
