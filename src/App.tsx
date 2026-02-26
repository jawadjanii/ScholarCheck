import React, { useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { ReportView } from './components/ReportView';
import { LoadingState } from './components/LoadingState';
import { analyzePaper } from './services/geminiService';
import { AnalysisResult } from './types';
import { BookOpen, GraduationCap, Github, Info, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        try {
          const analysisResult = await analyzePaper(base64, file.type);
          setResult(analysisResult);
        } catch (err: any) {
          setError(err.message || "An error occurred during analysis.");
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError("Failed to read file.");
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">ScholarCheck</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Journals</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Guidelines</a>
              <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {!result && !isAnalyzing && (
          <div className="max-w-3xl mx-auto text-center space-y-8 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-4 duration-700">
              <Info className="w-3 h-3" /> Powered by Gemini 3.1 Pro
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-top-6 duration-700 delay-100">
              Get Your Paper <span className="text-indigo-600">Elsevier-Ready</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-top-8 duration-700 delay-200">
              Upload your manuscript and receive instant feedback on acceptance probability, 
              rigorous improvement suggestions, and targeted journal recommendations.
            </p>
            
            <div className="pt-8 animate-in fade-in slide-in-from-top-10 duration-700 delay-300">
              <FileUploader onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 animate-in fade-in duration-1000 delay-500">
              {[
                { title: "Peer Review Simulation", desc: "Simulates high-tier editorial review processes." },
                { title: "Journal Matching", desc: "Finds the perfect home for your research." },
                { title: "Improvement Roadmap", desc: "Step-by-step guide to boost your impact factor." }
              ].map((feature, i) => (
                <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl text-left shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isAnalyzing && <LoadingState />}

        {error && (
          <div className="max-w-2xl mx-auto p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4 animate-in zoom-in-95">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
            <div className="space-y-2">
              <h3 className="font-bold text-rose-900">Analysis Failed</h3>
              <p className="text-sm text-rose-700">{error}</p>
              <button 
                onClick={reset}
                className="flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-800"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            </div>
          </div>
        )}

        {result && !isAnalyzing && (
          <div className="space-y-6">
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              <button 
                onClick={reset}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Analyze Another Paper
              </button>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  Export PDF
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                  Share Report
                </button>
              </div>
            </div>
            <ReportView result={result} />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-indigo-600 w-6 h-6" />
            <span className="text-lg font-bold text-slate-900">ScholarCheck</span>
          </div>
          <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">API</a>
            <a href="#" className="hover:text-indigo-600">Contact</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} ScholarCheck. Not affiliated with Elsevier B.V. For advisory purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
