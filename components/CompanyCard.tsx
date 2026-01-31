
import React from 'react';
import { Company } from '../types';
import { Icons } from '../constants';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-2xl transition-all group cursor-pointer h-full flex flex-col relative overflow-hidden">
      {/* Top Section: Identity & Rating */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="w-16 h-16 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 shadow-inner">
            {company.logo}
          </div>
          {/* Rating Badge: Reduced size, compact and creative placement */}
          <div className="shrink-0 flex items-center gap-1.5 bg-amber-50/60 dark:bg-amber-900/10 px-2.5 py-1 rounded-lg border border-amber-100/30 dark:border-amber-800/30 shadow-sm self-start">
            <span className="text-amber-500 shrink-0 scale-[0.7]"><Icons.Star /></span>
            <span className="text-[10px] font-black text-amber-700 dark:text-amber-500 tracking-tighter">{company.rating}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {company.name}
          </h3>
          <div className="flex items-start gap-2">
            <span className="text-slate-400 shrink-0 mt-0.5 scale-90"><Icons.Pin /></span>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-relaxed">
              {company.location}
            </p>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">
        {company.description}
      </p>

      {/* Tags Section */}
      <div className="flex flex-wrap gap-2 mb-10 mt-auto">
        {company.tags.map(tag => (
          <span key={tag} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-black rounded-full border border-slate-100 dark:border-slate-700 uppercase tracking-widest hover:bg-white dark:hover:bg-slate-700 transition-colors">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer Meta */}
      <div className="pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between mt-auto gap-4">
         <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-slate-300 dark:text-slate-600 shrink-0 scale-90"><Icons.Building /></span>
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em]">{company.industry}</span>
         </div>
         <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform inline-flex items-center gap-2 whitespace-nowrap bg-blue-50/50 dark:bg-blue-900/10 px-4 py-2 rounded-xl shrink-0">
           {company.openJobs} Openings <Icons.Navigate />
         </span>
      </div>
    </div>
  );
};

export default CompanyCard;
