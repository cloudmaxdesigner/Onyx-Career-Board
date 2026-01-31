
import React from 'react';
import { PromptLog } from '../types';
import { Icons } from '../constants';

interface HistoryViewProps {
  logs: PromptLog[];
  onSeed: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ logs, onSeed }) => {
  const getActionStyles = (action: PromptLog['action']) => {
    switch (action) {
      case 'analyze': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'practice': return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400';
      case 'summarize': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'chat': return 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 px-4">
        <div>
          <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] mb-3">Audit Trail</p>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">AI History</h2>
        </div>
        {logs.length > 0 && (
          <button 
            onClick={onSeed}
            className="w-fit text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors bg-white dark:bg-slate-900 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            + Seed More History
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-12 md:p-20 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl shadow-inner">📖</div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Your audit trail is empty</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-12 max-w-sm mx-auto leading-relaxed">
            Every AI interaction—from resume analysis to interview practice—is securely logged here for your reference.
          </p>
          <button 
            onClick={onSeed}
            className="px-10 py-5 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            Seed Demo Audit Trail
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {logs.map((log) => (
            <div key={log.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 hover:shadow-xl hover:border-blue-500/30 transition-all group animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div className="flex items-center gap-5 min-w-0">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${getActionStyles(log.action)}`}>
                    <Icons.LogoIcon />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                       <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">{log.action}</h4>
                       <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0 border border-slate-200 dark:border-slate-700">Role: {log.role}</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">{new Date(log.timestamp).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className="shrink-0 text-[10px] font-black px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 border border-slate-100 dark:border-slate-700 uppercase tracking-widest">
                  Ref: {log.id.slice(0, 8)}
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800/50">
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.25em] mb-4">Prompt Context</p>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic break-words">
                    "{log.prompt}"
                  </p>
                </div>
                <div className="p-8 bg-blue-50/20 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100/50 dark:border-blue-900/20 shadow-inner">
                  <p className="text-[9px] font-black text-blue-400 dark:text-blue-500 uppercase tracking-[0.25em] mb-4">System Output</p>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100 leading-relaxed break-words">
                    {log.responsePreview}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <p className="text-center text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.5em] py-20">
            End of Audit Trail
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
