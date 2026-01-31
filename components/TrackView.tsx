
import React, { useMemo, useState } from 'react';
import { ApplicationRecord, ApplicationStatus } from '../types';
import ApplicationCard from './ApplicationCard';
import TrackInsights from './TrackInsights';
import { Icons } from '../constants';

interface TrackViewProps {
  applications: ApplicationRecord[];
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onArchive: (id: string) => void;
  onStressTest?: () => void;
  onPractice?: () => void;
  onApplyNow?: (record: ApplicationRecord) => void;
  viewMode?: 'saved' | 'applied';
}

const TrackView: React.FC<TrackViewProps> = ({ 
  applications, 
  onStatusChange, 
  onArchive, 
  onStressTest, 
  onPractice, 
  onApplyNow,
  viewMode 
}) => {
  const [internalToggle, setInternalToggle] = useState<'saved' | 'applied'>('saved');
  const [savedSearch, setSavedSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const activeToggle = viewMode || internalToggle;

  const sectionTotals = useMemo(() => ({
    saved: applications.filter(app => app.status === 'Saved').length,
    applied: applications.filter(app => app.status !== 'Saved').length
  }), [applications]);

  const filteredJobs = useMemo(() => {
    const term = activeToggle === 'saved' ? savedSearch.toLowerCase() : appliedSearch.toLowerCase();
    
    let baseList = activeToggle === 'saved' 
      ? applications.filter(app => app.status === 'Saved')
      : applications.filter(app => app.status !== 'Saved');

    if (term) {
      baseList = baseList.filter(app => 
        app.job.title.toLowerCase().includes(term) || 
        app.job.company.toLowerCase().includes(term)
      );
    }

    return baseList.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
  }, [applications, activeToggle, savedSearch, appliedSearch]);

  const stats = useMemo(() => ({
    saved: sectionTotals.saved,
    applied: sectionTotals.applied
  }), [sectionTotals]);

  const emptyMessage = activeToggle === 'saved' ? "No saved jobs yet." : "No applied jobs yet.";
  const showSearch = activeToggle === 'saved' ? sectionTotals.saved > 0 : sectionTotals.applied > 0;

  return (
    <div className="max-w-[67rem] mx-auto animate-in fade-in duration-700">
      {!viewMode && (
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 px-4 md:px-0 md:pl-12">
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mb-3">CURRENT ACTIVITY</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Job Tracker</h2>
          </div>

          <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[2rem] flex items-center relative border border-slate-200 dark:border-slate-800 shadow-inner">
            <div 
              className={`absolute h-[calc(100%-12px)] w-[calc(50%-6px)] bg-blue-600 rounded-full shadow-lg shadow-blue-500/30 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                activeToggle === 'applied' ? 'left-[calc(50%+3px)]' : 'left-[6px]'
              }`}
            />
            <button 
              onClick={() => setInternalToggle('saved')}
              className={`relative z-10 px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 flex items-center gap-2 ${
                activeToggle === 'saved' ? 'text-white' : 'text-slate-400'
              }`}
            >
              Saved <span className={`text-[8px] ${activeToggle === 'saved' ? 'text-blue-100' : 'opacity-50'}`}>({stats.saved})</span>
            </button>
            <button 
              onClick={() => setInternalToggle('applied')}
              className={`relative z-10 px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 flex items-center gap-2 ${
                activeToggle === 'applied' ? 'text-white' : 'text-slate-400'
              }`}
            >
              Applied <span className={`text-[8px] ${activeToggle === 'applied' ? 'text-blue-100' : 'opacity-50'}`}>({stats.applied})</span>
            </button>
          </div>
        </div>
      )}

      <div className={!viewMode ? "md:pl-12" : ""}>
        {activeToggle === 'applied' && applications.length >= 5 && (
          <div className="mb-12">
            <TrackInsights applications={applications} onAction={onPractice} />
          </div>
        )}
      </div>

      {showSearch && (
        <div className={`mb-12 animate-in fade-in slide-in-from-top-4 duration-500 flex flex-col items-center px-4 ${!viewMode ? 'md:pl-12 md:pr-0' : ''}`}>
          <div className="relative group w-full max-w-2xl">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors scale-110">
              <Icons.Search />
            </div>
            <input 
              type="text" 
              placeholder={activeToggle === 'saved' ? "Filter your saved jobs..." : "Search through your applications..."}
              value={activeToggle === 'saved' ? savedSearch : appliedSearch}
              onChange={(e) => activeToggle === 'saved' ? setSavedSearch(e.target.value) : setAppliedSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] py-5 pl-16 pr-8 text-lg font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all shadow-lg shadow-slate-200/40 dark:shadow-none"
            />
          </div>
          {(activeToggle === 'saved' ? savedSearch : appliedSearch) && (
            <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Found {filteredJobs.length} {filteredJobs.length === 1 ? 'match' : 'matches'}
            </p>
          )}
        </div>
      )}

      {filteredJobs.length === 0 ? (
        <div className={`w-full py-16 md:py-24 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 ${!viewMode ? 'md:pl-12' : ''}`}>
          <div className="w-[20rem] h-[20rem] sm:w-[32rem] sm:h-[32rem] bg-blue-50/50 dark:bg-blue-900/10 rounded-full flex flex-col items-center justify-center border border-blue-100/50 dark:border-blue-800/20 p-8 sm:p-12 shadow-inner">
            <div className="text-5xl sm:text-6xl mb-6 sm:mb-8 animate-bounce">
              {activeToggle === 'saved' ? '🔖' : '⏳'}
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight text-center">
              {showSearch ? 'No matches' : (activeToggle === 'saved' ? 'Nothing bookmarked' : 'Wait Mode')}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-xs sm:max-w-md mx-auto text-sm sm:text-lg text-center">
              {showSearch 
                ? `No ${activeToggle} jobs match "${activeToggle === 'saved' ? savedSearch : appliedSearch}".`
                : `${emptyMessage} ${activeToggle === 'saved' ? 'Jobs you save will appear here for easy access.' : 'Tracking begins when you are ready to apply.'}`
              }
            </p>
          </div>
          
          {activeToggle === 'applied' && applications.length === 0 && (
            <div className="mt-12 flex flex-col gap-4 max-w-xs mx-auto w-full">
              <button 
                onClick={onStressTest}
                className="w-full p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl hover:border-blue-500 transition-all text-[11px] font-black uppercase tracking-widest text-slate-600 shadow-sm"
              >
                Load 100 Demo Records
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full relative space-y-6 before:content-[''] before:absolute before:left-[1.25rem] before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
          {filteredJobs.map((app, index) => (
            <div 
              key={app.id} 
              className="relative pl-12 animate-in slide-in-from-bottom-8 duration-700" 
              style={{ animationDelay: index < 10 ? `${index * 50}ms` : '0ms' }}
            >
              <div className={`absolute left-[-2px] top-11 w-4 h-4 rounded-full border-[3px] border-white dark:border-slate-950 z-10 transition-all duration-700 ${
                app.status === 'Offer' ? 'bg-emerald-500' : 
                app.status === 'Interview' ? 'bg-amber-500' : 
                app.status === 'Applied' ? 'bg-blue-500' : 
                app.status === 'Rejected' ? 'bg-slate-200 dark:bg-slate-800' : 
                app.status === 'Saved' ? 'bg-slate-400' : 'bg-slate-300'
              }`} />
              <ApplicationCard 
                record={app} 
                onStatusChange={onStatusChange} 
                onArchive={onArchive} 
                onApplyNow={onApplyNow}
              />
            </div>
          ))}
        </div>
      )}
      
      {applications.length > 0 && (
        <div className={`mt-24 pt-16 border-t border-slate-50 dark:border-slate-800 text-center ${!viewMode ? 'md:pl-12' : ''}`}>
          <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] mb-8">QUIET GROWTH</p>
          <div className="flex flex-col gap-4 max-w-xs mx-auto">
            <button onClick={onPractice} className="px-10 py-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full text-[10px] font-black text-slate-600 dark:text-slate-300 hover:border-blue-500 transition-all active:scale-95 uppercase tracking-widest">
              Solve 1 technical question
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackView;
