import React from 'react';
import { Job } from '../types';
import { Icons } from '../constants';

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  onSelect: (job: Job) => void;
  isSaved?: boolean;
  onToggleSave?: (job: Job) => void;
  distance?: number;
}

const JobCard: React.FC<JobCardProps> = ({ job, isSelected, onSelect, isSaved, onToggleSave, distance }) => {
  return (
    <div
      onClick={() => onSelect(job)}
      className={`group w-full bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border transition-all duration-300 cursor-pointer relative ${
        isSelected 
        ? 'border-blue-600 shadow-2xl ring-1 ring-blue-600 dark:shadow-blue-900/40' 
        : 'border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-xl'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-7">
        <div className="w-16 h-16 bg-slate-900 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-inner">
          {job.company.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="min-w-0 pr-4">
              <h3 className="font-black text-slate-900 dark:text-white text-2xl tracking-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                {job.title}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold">
                <span className="text-slate-700 dark:text-slate-300">{job.company}</span>
                <span className="hidden sm:inline text-slate-200 dark:text-slate-700">•</span>
                <span className="text-slate-500 dark:text-slate-400">{job.type}</span>
                <span className="hidden sm:inline text-slate-200 dark:text-slate-700">•</span>
                <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-tighter">{job.salary}</span>
              </div>
            </div>
            <button 
              className={`p-2 rounded-full transition-all shrink-0 ${
                isSaved 
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-slate-200 dark:text-slate-800 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              onClick={(e) => { 
                e.stopPropagation(); 
                onToggleSave?.(job);
              }}
              aria-label={isSaved ? "Unsave job" : "Save job"}
            >
              {isSaved ? <Icons.BookmarkFilled /> : <Icons.Bookmark />}
            </button>
          </div>
          
          <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
               <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="text-slate-400 dark:text-slate-500"><Icons.Pin /></span>
                  <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{job.location}</span>
               </div>
               {distance !== undefined && (
                 <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                   <Icons.Navigate />
                   <span className="text-xs font-black uppercase tracking-[0.15em]">{distance.toFixed(1)}km</span>
                 </div>
               )}
               <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onToggleSave?.(job);
                }}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${
                  isSaved 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-500'
                }`}
              >
                {isSaved ? <><Icons.BookmarkFilled /> Saved</> : <><Icons.Bookmark /> Save Job</>}
              </button>
            </div>
            <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">{job.postedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;