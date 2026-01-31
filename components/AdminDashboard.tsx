
import React from 'react';
import { Icons } from '../constants';
import { PromptLog } from '../types';

interface AdminDashboardProps {
  logs: PromptLog[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ logs }) => {
  const stats = {
    totalCalls: logs.length,
    successRate: '99.4%',
    avgLatency: '1.2s',
    uniqueUsers: 1
  };

  const statConfig = [
    { label: 'Total AI Calls', value: stats.totalCalls, icon: <Icons.Chart />, color: 'bg-blue-600 shadow-blue-500/30' },
    { label: 'Success Rate', value: stats.successRate, icon: <Icons.Check />, color: 'bg-emerald-600 shadow-emerald-500/30' },
    { label: 'Avg Latency', value: stats.avgLatency, icon: <Icons.Zap />, color: 'bg-amber-500 shadow-amber-500/30' },
    { label: 'Active Sessions', value: stats.uniqueUsers, icon: <Icons.Users />, color: 'bg-purple-600 shadow-purple-500/30' }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {statConfig.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
            <div className={`w-14 h-14 ${stat.color} rounded-[1.25rem] flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3.5rem] p-10 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl">
              <Icons.Activity />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">System Audit Log</h3>
              <p className="text-sm font-medium text-slate-400">Real-time prompt and action tracking</p>
            </div>
          </div>
          <button className="px-8 py-3 bg-slate-50 dark:bg-slate-800 rounded-full text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all">
            Export JSON
          </button>
        </div>

        <div className="overflow-x-auto -mx-2">
          <div className="inline-block min-w-full align-middle px-2">
            <table className="min-w-[750px] w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr>
                  <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Timestamp</th>
                  <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Action</th>
                  <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Role</th>
                  <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Prompt Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-24 text-center text-slate-400 font-black uppercase tracking-widest text-xs opacity-50">No activity recorded yet.</td>
                  </tr>
                ) : (
                  logs.slice(0, 15).map((log) => (
                    <tr key={log.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all rounded-3xl">
                      <td className="py-6 px-6 text-xs font-bold text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="py-6 px-6">
                        <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-full whitespace-nowrap border border-blue-100 dark:border-blue-800">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-6 px-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">{log.role}</span>
                      </td>
                      <td className="py-6 px-6">
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate max-w-lg break-words">{log.prompt}</p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
