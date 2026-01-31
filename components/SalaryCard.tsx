
import React from 'react';
import { Salary } from '../types';
import { Icons } from '../constants';

interface SalaryCardProps {
  salary: Salary;
}

const SalaryCard: React.FC<SalaryCardProps> = ({ salary }) => {
  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800';
      case 'down': return 'text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800';
      default: return 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <Icons.TrendUp />;
      case 'down': return <Icons.TrendDown />;
      default: return <Icons.TrendFlat />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full">
      <div className="flex justify-between items-start mb-10 gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight leading-tight mb-3">
            {salary.role}
          </h3>
          <div className="flex items-start gap-2 opacity-60">
            <span className="shrink-0 scale-75 mt-0.5"><Icons.Pin /></span>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed">
              {salary.location}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shrink-0 ${getTrendColor(salary.trend)} shadow-sm self-start`}>
          {getTrendIcon(salary.trend)}
          <span>{salary.trendPercentage}%</span>
        </div>
      </div>

      <div className="mb-10 flex-1 flex flex-col justify-center">
        <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] mb-3">Average Compensation</p>
        <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1">
          {salary.averageSalary}
        </p>
        <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 italic">Adjusted for local market data</p>
      </div>

      <div className="mt-auto">
        <div className="w-full bg-slate-50 dark:bg-slate-950 rounded-full h-3 mb-4 relative overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner">
          <div className="absolute left-[15%] right-[25%] bg-blue-500/20 h-full rounded-full blur-[1px]"></div>
          <div className="absolute left-[45%] w-2.5 h-full bg-blue-600 rounded-full shadow-lg shadow-blue-500/40"></div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">MIN</span>
            <span className="text-sm font-black text-slate-900 dark:text-slate-100">{salary.minSalary}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">MAX</span>
            <span className="text-sm font-black text-slate-900 dark:text-slate-100">{salary.maxSalary}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryCard;
