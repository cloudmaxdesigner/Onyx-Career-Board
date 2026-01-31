
import React from 'react';
import { InterviewPrep } from '../types';
import { Icons } from '../constants';

interface InterviewPrepProps {
  data: InterviewPrep;
  companyName: string;
  onClose: () => void;
}

const InterviewPrep: React.FC<InterviewPrepProps> = ({ data, companyName, onClose }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-2xl h-full max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-500">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-[10px] font-black uppercase tracking-widest rounded-full">
              AI Coach
            </span>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Generated {new Date(data.generatedAt).toLocaleDateString()}</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Interview Guide</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">
            Prep strategy for <span className="font-bold text-slate-900 dark:text-white">{companyName}</span>
          </p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
          <Icons.Cross />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md flex items-center justify-center text-xs">?</span> 
              Likely Questions
            </h3>
            <div className="space-y-6">
              {data.questions.map((q, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{q.type}</span>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white mb-4 text-lg">"{q.question}"</p>
                  <div className="relative pl-4 border-l-2 border-slate-300 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Suggested STAR Answer</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                      {q.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="sticky top-0">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Icons.Timeline /> Follow-up Strategy
            </h3>
            
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 relative group hover:border-blue-500 transition-colors">
               <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Copy</button>
               </div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Email Template</p>
               <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                 {data.emailTemplate}
               </pre>
            </div>

            <div className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
               <h4 className="text-emerald-700 dark:text-emerald-400 font-bold mb-2">Next Steps</h4>
               <ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-300">
                 <li className="flex gap-2"><span>1.</span> Review the technical questions above.</li>
                 <li className="flex gap-2"><span>2.</span> Customize the STAR answers with specific metrics.</li>
                 <li className="flex gap-2"><span>3.</span> Send the follow-up email within 24 hours of the interview.</li>
               </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
