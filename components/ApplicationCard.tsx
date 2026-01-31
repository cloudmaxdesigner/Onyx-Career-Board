import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ApplicationRecord, ApplicationStatus } from '../types';
import { Icons } from '../constants';

interface ApplicationCardProps {
  record: ApplicationRecord;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onArchive: (id: string) => void;
  onApplyNow?: (record: ApplicationRecord) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = React.memo(({ record, onStatusChange, onArchive, onApplyNow }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const touchStart = useRef<number | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const prevStatus = useRef<ApplicationStatus>(record.status);

  useEffect(() => {
    if (prevStatus.current !== record.status) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 400);
      prevStatus.current = record.status;
      return () => clearTimeout(timer);
    }
  }, [record.status]);

  const cycleStatus = useCallback(() => {
    const statuses: ApplicationStatus[] = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];
    const currentIndex = statuses.indexOf(record.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    onStatusChange(record.id, statuses[nextIndex]);
    if ('vibrate' in navigator) navigator.vibrate(15);
  }, [record.id, record.status, onStatusChange]);

  const handleStart = (clientX: number) => {
    touchStart.current = clientX;
    longPressTimer.current = window.setTimeout(() => {
      setIsLongPressing(true);
      if ('vibrate' in navigator) navigator.vibrate([30, 10, 30]);
    }, 600);
  };

  const handleMove = (clientX: number) => {
    if (touchStart.current === null) return;
    const diff = clientX - touchStart.current;
    if (!isLongPressing) {
      setSwipeOffset(diff);
      if (Math.abs(diff) > 15 && longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    }
  };

  const handleEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (swipeOffset > 100) cycleStatus();
    else if (swipeOffset < -100) onArchive(record.id);
    setSwipeOffset(0);
    touchStart.current = null;
    setIsLongPressing(false);
  };

  const toggleSaved = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (record.status === 'Saved') {
      onArchive(record.id);
    } else {
      onStatusChange(record.id, 'Saved');
    }
  };

  const location = record.job.location || 'Remote';
  const salary = record.job.salary || 'Not specified';
  const deadline = record.job.deadline ? new Date(record.job.deadline).toLocaleDateString() : 'No deadline';
  const match = record.job.percentage_match || 0;
  const postedDaysAgo = record.job.posted_days_ago !== null ? `${record.job.posted_days_ago}d ago` : record.job.postedDate;
  const isCurrentlySaved = record.status === 'Saved';

  const formattedApplyDate = new Date(record.appliedDate).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });

  return (
    <div 
      className={`group relative transition-all duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] ${
        isExpanded ? 'mb-8' : 'mb-4'
      } ${isUpdating ? 'animate-soft-lift' : ''}`}
      style={{ transform: `translateX(${swipeOffset}px) scale(${isLongPressing ? 1.05 : 1})`, zIndex: isLongPressing ? 50 : 1 }}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      <div className="absolute inset-0 flex items-center justify-between px-10 rounded-[2.5rem] -z-10 bg-slate-50 dark:bg-slate-900/50">
        <div className={`flex items-center gap-3 font-black text-[10px] uppercase tracking-widest transition-opacity duration-300 ${swipeOffset > 40 ? 'opacity-100 text-blue-500' : 'opacity-0'}`}>
          <Icons.Check /> {record.status === 'Saved' ? 'Apply' : 'Progress'}
        </div>
        <div className={`flex items-center gap-3 font-black text-[10px] uppercase tracking-widest transition-opacity duration-300 ${swipeOffset < -40 ? 'opacity-100 text-rose-500' : 'opacity-0'}`}>
          {record.status === 'Saved' ? 'Unsave' : 'Archive'} <Icons.Cross />
        </div>
      </div>

      <div 
        className={`bg-white dark:bg-slate-900 border rounded-[2.5rem] transition-all duration-500 cursor-pointer overflow-hidden ${
          isExpanded ? 'border-blue-500 dark:border-blue-400 shadow-2xl translate-y-[-4px]' : 'border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50 shadow-sm'
        }`}
        onClick={() => !isLongPressing && setIsExpanded(!isExpanded)}
      >
        <div className="p-8">
          {record.error && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-xl animate-in fade-in duration-300">
               <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                 <Icons.Cross /> {record.error}
               </p>
            </div>
          )}

          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-3 mb-2">
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white truncate tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                    {record.job.title}
                 </h3>
                 <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${match >= 90 ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'}`}>
                   {match}% match
                 </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold">
                <span className="text-slate-700 dark:text-slate-300">{record.job.company}</span>
                <span className="text-slate-200 dark:text-slate-700">•</span>
                <span className="text-slate-500 dark:text-slate-400">{record.job.type}</span>
                <span className="text-slate-200 dark:text-slate-700">•</span>
                <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-tighter">{salary}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              {isCurrentlySaved ? (
                <>
                  <button 
                    onClick={toggleSaved}
                    className="p-2 rounded-full transition-all text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  >
                    <Icons.BookmarkFilled />
                  </button>
                  <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">{postedDaysAgo}</span>
                </>
              ) : (
                <>
                  <div className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                    Applied
                  </div>
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {formattedApplyDate}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
             <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
                   <span className="text-slate-400 dark:text-slate-500 scale-90"><Icons.Pin /></span>
                   <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{location}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800/30 rounded-full">
                   <span className="text-slate-400 scale-75"><Icons.Timeline /></span>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Until: {deadline}</span>
                </div>
             </div>
             <div className="flex gap-1.5">
               {record.job.skills.slice(0, 3).map((skill, i) => (
                 <span key={i} className="text-[8px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 dark:border-slate-800 px-2 py-0.5 rounded">
                   {skill}
                 </span>
               ))}
             </div>
          </div>

          {isExpanded && (
            <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div 
                className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-sm cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Overview</p>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  {record.job.description}
                </div>
              </div>

              <div 
                className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800/50 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div 
                  className="w-full flex items-center justify-between text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] p-6 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}
                >
                  View Job Details 
                  <span className={`transition-transform duration-300 ${isDescriptionVisible ? 'rotate-180' : ''}`}>▼</span>
                </div>
                {isDescriptionVisible && (
                  <div className="px-6 pb-8 space-y-8 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsibilities</p>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap pl-2 border-l-2 border-slate-100 dark:border-slate-800">
                        {record.job.details?.responsibilities || "No specific details provided."}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requirements</p>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap pl-2 border-l-2 border-slate-100 dark:border-slate-800">
                        {record.job.details?.requirements || "Standard industry requirements apply."}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Benefits</p>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap pl-2 border-l-2 border-slate-100 dark:border-slate-800">
                        {record.job.details?.benefits || "Comprehensive package included."}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-2" onClick={(e) => e.stopPropagation()}>
                {record.status === 'Saved' ? (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onApplyNow?.(record); }}
                    className="flex-1 py-5 bg-blue-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    EVALUATE AND APPLY <Icons.Navigate />
                  </button>
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); cycleStatus(); }}
                    className="flex-1 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
                  >
                    Mark Progress
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default ApplicationCard;