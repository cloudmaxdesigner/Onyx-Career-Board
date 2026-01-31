
import React from 'react';
import { AnalysisResult } from '../types';
import { Icons } from '../constants';

interface AnalysisDisplayProps {
  result: AnalysisResult;
  onOptimize?: () => void;
  isOptimizing?: boolean;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, onOptimize, isOptimizing }) => {
  const isPass = result.score >= 70;

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">AI Agent Report</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Expert evaluation of your resume alignment</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="text-right">
            <div className={`text-5xl font-black leading-none ${isPass ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
              {result.score}%
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-2">Overall Alignment</p>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPass ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400'}`}>
            {isPass ? <Icons.Check /> : <Icons.Cross />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-4">Core Checks</h3>
          {[
            { label: 'Page length (≤ 1 page)', value: result.checks.pageLength },
            { label: 'Original formatting preserved', value: result.checks.formatPreserved },
            { label: 'Targeted to specific company', value: result.checks.companyTargeted }
          ].map((check, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{check.label}</span>
              {check.value ? <Icons.Check /> : <Icons.Cross />}
            </div>
          ))}

          <div className={`mt-8 p-6 rounded-3xl border-2 text-center transition-all ${isPass ? 'bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-100 dark:shadow-none' : 'bg-rose-500 border-rose-400 text-white shadow-xl shadow-rose-100 dark:shadow-none'}`}>
            <p className="text-2xl font-black mb-1">{isPass ? 'JOB READY' : 'NOT JOB READY'}</p>
            <p className="text-sm font-medium opacity-90 mb-4">{isPass ? 'Proceed with your application.' : 'Address the issues below to increase your score.'}</p>
            {onOptimize && (
              <button 
                onClick={onOptimize}
                disabled={isOptimizing}
                className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isOptimizing ? 'Optimizing...' : '✨ Auto-Optimize Resume'}
              </button>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
          <div>
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-4">Critical Skill Gaps</h3>
            <div className="flex flex-wrap gap-2">
              {result.feedback.missingSkills.map((skill, i) => (
                <span key={i} className="px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-black rounded-full border border-rose-100 dark:border-rose-800">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-4">Improvement Roadmap</h3>
            <ul className="space-y-4">
              {result.feedback.suggestions.map((s, i) => (
                <li key={i} className="text-sm text-slate-600 dark:text-slate-400 font-medium flex gap-3">
                  <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full mt-1.5 shrink-0"></span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-4">ATS Optimization</h3>
            <div className="grid grid-cols-1 gap-2">
              {result.feedback.atsNotes.map((note, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                  # {note}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
