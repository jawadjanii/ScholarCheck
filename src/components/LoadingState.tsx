import React from 'react';
import { Loader2, Search, Cpu, FileSearch } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-indigo-100 rounded-full animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
      </div>
      
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Analyzing Manuscript</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Our AI is currently reviewing your paper against Elsevier's editorial standards, 
          checking methodology, and identifying the best journal fit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {[
          { icon: Search, label: "Scanning Content" },
          { icon: Cpu, label: "Evaluating Rigor" },
          { icon: FileSearch, label: "Matching Journals" }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <item.icon className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-slate-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
