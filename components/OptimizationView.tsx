
import React from 'react';
import { OptimizedContent, Job } from '../types';
import { Icons } from '../constants';

interface OptimizationViewProps {
  optimizedContent: OptimizedContent;
  job: Job;
  onApply: () => void;
  onSaveLater: () => void;
  onBack: () => void;
}

const OptimizationView: React.FC<OptimizationViewProps> = ({ optimizedContent, job, onApply, onSaveLater, onBack }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-300 h-full max-h-[85vh] flex flex-col">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <button onClick={onBack} className="text-xs font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white mb-2 flex items-center gap-1">
             ← Back to Analysis
          </button>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Optimization Studio</h2>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
            Tailoring your profile for <span className="font-bold">{job.company}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800">
           <span className="text-blue-500">✨</span>
           <span className="text-xs font-bold text-blue-700 dark:text-blue-300">{optimizedContent.rationale}</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden min-h-0">
        {/* Left: Job Description Context */}
        <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 overflow-y-auto border border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="shrink-0 mb-6">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 sticky top-0 bg-slate-50 dark:bg-slate-950 z-10">
               Optimization Source
             </h3>
             <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-black">
                     {job.company.charAt(0)}
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{job.title}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{job.company}</p>
                   </div>
                </div>
                <div className="flex gap-2">
                   <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded text-[9px] font-bold uppercase tracking-wider text-slate-500">{job.location || 'Remote'}</span>
                   <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded text-[9px] font-bold uppercase tracking-wider text-slate-500">{job.type}</span>
                </div>
             </div>
          </div>

          <div className="flex-1">
             <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-white">
               <span className="text-blue-500"><Icons.Stack /></span>
               <h4 className="font-bold text-sm">Full Job Description</h4>
             </div>
             <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap font-medium p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
               {job.description}
               {job.details && (
                 <>
                   {'\n\n'}
                   <span className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs tracking-wider">Responsibilities</span>
                   {'\n'}
                   {job.details.responsibilities}
                   {'\n\n'}
                   <span className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs tracking-wider">Requirements</span>
                   {'\n'}
                   {job.details.requirements}
                   {'\n\n'}
                   <span className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs tracking-wider">Benefits</span>
                   {'\n'}
                   {job.details.benefits}
                 </>
               )}
             </div>
          </div>
        </div>

        {/* Right: Optimized Content */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 overflow-y-auto border-2 border-blue-500 dark:border-blue-500/50 shadow-xl shadow-blue-500/10 relative">
          <div className="absolute top-4 right-4 animate-pulse">
            <span className="text-xs font-black bg-blue-600 text-white px-2 py-1 rounded-md">AI SUGGESTION</span>
          </div>
          <h3 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6 sticky top-0 bg-white dark:bg-slate-900 py-2 z-10">
            Optimized Content
          </h3>
          
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Icons.Check /> Tailored Summary
              </h4>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl text-sm text-slate-700 dark:text-slate-300 leading-relaxed border border-blue-100 dark:border-blue-800">
                {optimizedContent.summary}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Icons.Stack /> Impact Bullets
              </h4>
              <ul className="space-y-3">
                {optimizedContent.experienceHighlights.map((bullet, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Icons.TrendUp /> Keywords Added
              </h4>
              <div className="flex flex-wrap gap-2">
                {optimizedContent.keySkills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-100 dark:border-emerald-800">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0 gap-4">
        <div className="text-xs font-bold text-slate-400 dark:text-slate-500">
          Review these changes before applying.
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onSaveLater}
            className="px-6 py-4 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Save Draft
          </button>
          <button 
            onClick={onApply}
            className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black shadow-lg hover:transform hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2"
          >
            Submit Application <Icons.Navigate />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptimizationView;
