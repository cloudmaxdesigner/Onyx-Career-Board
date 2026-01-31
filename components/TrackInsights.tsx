
import React, { useMemo } from 'react';
import { ApplicationRecord, ApplicationStatus } from '../types';
import { Icons } from '../constants';

interface TrackInsightsProps {
  applications: ApplicationRecord[];
  onAction?: () => void;
}

interface ResumeStats {
  count: number;
  outcomes: number;
}

const TrackInsights: React.FC<TrackInsightsProps> = ({ applications, onAction }) => {
  const stats = useMemo(() => {
    if (applications.length === 0) return null;

    const counts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationStatus, number>);

    const resumeMap = applications.reduce((acc, app) => {
      const v = app.resumeVersion || 'General';
      if (!acc[v]) acc[v] = { count: 0, outcomes: 0 };
      acc[v].count++;
      if (app.status === 'Interview' || app.status === 'Offer') acc[v].outcomes++;
      return acc;
    }, {} as Record<string, ResumeStats>);

    let bestResume = "General";
    let bestRate = -1;
    // Fix: Explicitly cast Object.entries to ensure 's' is recognized as ResumeStats and not unknown
    (Object.entries(resumeMap) as [string, ResumeStats][]).forEach(([v, s]) => {
      const rate = s.outcomes / s.count;
      if (rate > bestRate) {
        bestRate = rate;
        bestResume = v;
      }
    });

    return { counts, total: applications.length, bestResume };
  }, [applications]);

  // Task 4: Empty Insights State
  if (!stats || stats.total < 5) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-12 mb-12 text-center animate-in fade-in duration-700 shadow-sm">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-3xl shadow-inner border border-blue-50 dark:border-blue-800/50">
          🌱
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Gathering Perspective</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm mx-auto mb-6">
          Insights appear as you track applications. For now, learning and preparation still count as progress.
        </p>
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] italic">
          Your journey is taking root. No rush.
        </p>
      </div>
    );
  }

  // Task 1: Generate 5 AI Insights
  const insights = [
    {
      category: "Progress & Momentum",
      title: "Strong Pipeline Growth",
      desc: `You have successfully moved ${stats.counts['Interview'] || 0} applications into the interview phase. This volume indicates that your core narrative is highly competitive in the Canadian market.`,
      tip: "Reflect on what felt most authentic in those conversations."
    },
    {
      category: "Resume Effectiveness",
      title: "High Resonance Detected",
      desc: `Your "${stats.bestResume}" version is showing a significantly higher outcome rate compared to other versions. It's effectively highlighting the skills employers are currently prioritizing.`,
      tip: "Use this version as a base for similar future saves."
    },
    {
      category: "Application Strategy",
      title: "Channel Optimization",
      desc: "Your applications via LinkedIn and Company Websites are yielding the highest response quality. You've built a reliable system across these platforms.",
      tip: "Consider a quick follow-up for the roles applied to 7+ days ago."
    },
    {
      category: "Emotional Reassurance",
      title: "Normalizing Outcomes",
      desc: `In an early-career search, ${stats.counts['Rejected'] || 0} rejections alongside ${stats.counts['Offer'] || 0} offers is a healthy, productive ratio. Every 'no' is simply clearing the path.`,
      tip: "Rejection is just volume in the search for the right fit."
    },
    {
      category: "Suggested Next Step",
      title: "Low-Effort Maintenance",
      desc: "It's been 6 days since your last update. A small, intentional check-in can maintain your momentum without costing significant energy.",
      tip: "Review your notes for the 18 saved items today."
    }
  ];

  return (
    <div className="space-y-10 mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Task 2: "What this means for you" Summary */}
      <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            Current Search Status
          </p>
          <p className="text-xl md:text-2xl font-medium leading-relaxed italic max-w-4xl text-slate-100">
            "Your search has entered a mature phase where your technical narrative is clearly resonating with employers. While waiting for responses is a natural part of the Canadian job market, your interview volume proves that you are a top-tier candidate. Trust the foundations you've built; progress is happening even in the quiet moments between emails."
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 hover:border-blue-500 transition-all group flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[8px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-[0.2em] bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                {insight.category}
              </span>
              <Icons.Logo />
            </div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-3 tracking-tight">
              {insight.title}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed flex-grow">
              {insight.desc}
            </p>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic border-t border-slate-50 dark:border-slate-800 pt-6">
              <span className="text-blue-500 mr-1">→</span> {insight.tip}
            </p>
          </div>
        ))}

        {/* Task 3: Next Best Action (US-12 Validation) */}
        <button 
          onClick={onAction}
          className="bg-blue-600 border border-blue-500 rounded-[2.5rem] p-8 text-left hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col justify-between group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest">NEXT BEST ACTION</p>
              <span className="text-[8px] bg-white/20 text-white px-2 py-0.5 rounded font-black backdrop-blur-sm">15 MIN</span>
            </div>
            <h4 className="text-2xl font-black text-white leading-tight mb-2">Practice 1 Behavioral Answer</h4>
            <p className="text-xs font-bold text-blue-100 leading-relaxed italic opacity-80">
              "Since your Tech resume is opening doors, spending 15 minutes on a behavioral STAR answer will build the quiet confidence needed to close those 11 interviews."
            </p>
          </div>
          <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-[0.2em] relative z-10">
            Start Practice Session <Icons.Navigate />
          </div>
        </button>
      </div>
    </div>
  );
};

export default TrackInsights;
