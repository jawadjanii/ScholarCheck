import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  BookOpen, 
  Target,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

interface ReportViewProps {
  result: AnalysisResult;
}

export const ReportView: React.FC<ReportViewProps> = ({ result }) => {
  const getProbabilityColor = (prob: number) => {
    if (prob >= 70) return 'text-emerald-600';
    if (prob >= 40) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
      {/* Executive Summary */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Analysis Report</h2>
            <p className="text-slate-500">Elsevier Journal Submission Advisory</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Acceptance Prob.</p>
              <p className={cn("text-3xl font-black", getProbabilityColor(result.acceptanceProbability))}>
                {result.acceptanceProbability}%
              </p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <TrendingUp className={cn("w-8 h-8", getProbabilityColor(result.acceptanceProbability))} />
          </div>
        </div>
        <div className="p-8 bg-slate-50/50">
          <div className="flex gap-4">
            <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Editorial Verdict</h3>
              <p className="text-slate-600 leading-relaxed italic">"{result.overallVerdict}"</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strengths & Weaknesses */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-6">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Key Strengths
            </h3>
            <ul className="space-y-4">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-6">
              <XCircle className="w-5 h-5 text-rose-500" />
              Critical Weaknesses
            </h3>
            <ul className="space-y-4">
              {result.weaknesses.map((w, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Technical Checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-fit">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-6">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            Technical Compliance
          </h3>
          <div className="space-y-4">
            {result.technicalChecklist.map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-900">{item.item}</span>
                  {item.passed ? (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Pass</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded uppercase">Fail</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{item.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Improvement Suggestions */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-8">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          Improvement Roadmap
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.improvementSuggestions.map((s, i) => (
            <div key={i} className="relative p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-indigo-200 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">{s.section}</span>
                <span className={cn("px-2 py-1 rounded-md text-[10px] font-bold border", getPriorityColor(s.priority))}>
                  {s.priority} Priority
                </span>
              </div>
              <div className="text-sm text-slate-700 prose prose-slate prose-sm max-w-none">
                <ReactMarkdown>{s.suggestion}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Journal Fit */}
      <section className="bg-indigo-900 rounded-2xl p-8 text-white shadow-xl">
        <h3 className="flex items-center gap-2 text-xl font-bold mb-8">
          <Target className="w-6 h-6 text-indigo-300" />
          Recommended Elsevier Journals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {result.journalFit.map((j, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-indigo-100">{j.journalName}</h4>
                  <span className="text-2xl font-black text-white">{j.fitScore}%</span>
                </div>
                <p className="text-sm text-indigo-200/80 leading-relaxed mb-6">
                  {j.reasoning}
                </p>
              </div>
              <button className="flex items-center justify-center gap-2 w-full py-3 bg-white text-indigo-900 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors">
                View Guide <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
