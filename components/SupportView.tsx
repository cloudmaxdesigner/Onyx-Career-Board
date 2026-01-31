
import React, { useState } from 'react';
import { Icons } from '../constants';
import { SupportResponse } from '../types';
import { getSupportAdvice } from '../services/geminiService';

const INTERVIEW_SAMPLES = [
  {
    question: "Tell me about a time you faced a significant technical challenge.",
    answer: "Focus on the 'S.T.A.R' method. Describe the Situation (the codebase state), Task (what needed fixing), Action (the specific refactor or debug logic you implemented), and Result (performance gains or resolved uptime). Example: 'I refactored a legacy state management system that reduced re-renders by 40%...'"
  },
  {
    question: "Why are you leaving your current role?",
    answer: "Always lean towards growth rather than dissatisfaction. 'I've learned a tremendous amount about [Skill X] at my current company, but I'm looking for a role where I can apply [Skill Y] at a larger scale, which is exactly what your team is doing with [Project Z].'"
  }
];

const ROLE_SPECIFIC_GUIDE = {
  "Frontend": [
    "Explain the difference between a virtual DOM and the real DOM.",
    "How do you handle cross-browser compatibility issues in modern CSS?",
    "Describe your approach to state management in large-scale React applications."
  ],
  "Backend": [
    "How do you ensure data consistency across distributed microservices?",
    "Explain the trade-offs between SQL and NoSQL databases for a real-time messaging app.",
    "Describe a time you optimized a slow database query."
  ],
  "Product": [
    "How do you prioritize a feature roadmap when stakeholders have conflicting interests?",
    "Describe a time you used data to pivot a product strategy.",
    "How do you define 'success' for a new feature launch?"
  ]
};

const SupportView: React.FC = () => {
  const [roleInput, setRoleInput] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SupportResponse | null>(null);
  const [editableResume, setEditableResume] = useState('');
  const [activeRoleTab, setActiveRoleTab] = useState<keyof typeof ROLE_SPECIFIC_GUIDE>("Frontend");

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await getSupportAdvice(resumeText || null, roleInput || null);
      setResult(response);
      setEditableResume(response.resume_feedback.editable_output);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      <div className="text-center mb-16">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mb-4">CAREER ACCELERATOR</p>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-6">Expert Support</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          Get AI-powered guidance to polish your resume and prepare for high-stakes interviews in minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Setup Guidance</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Role</label>
                <input 
                  type="text" 
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all text-sm font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Resume Content (Text)</label>
                <textarea 
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here..."
                  className="w-full h-48 px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all text-sm font-bold resize-none"
                />
              </div>
              <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Generate Expert Advice <Icons.Navigate /></>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {!result && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center py-20 px-8 bg-slate-50/50 dark:bg-blue-900/5 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center mb-8 text-4xl">🎓</div>
              <h3 className="text-2xl font-black text-slate-400 dark:text-slate-600">Ready to boost your career?</h3>
              <p className="text-sm font-bold text-slate-400 text-center mt-4">Provide your details to unlock expert feedback.</p>
            </div>
          )}

          {isLoading && (
            <div className="h-full flex flex-col items-center justify-center py-20 animate-pulse">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-6" />
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">AI Agent is crafting your strategy...</p>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              {result.errors.length > 0 && (
                <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-3xl p-6">
                  <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Icons.Cross /> Data Gaps Detected
                  </h4>
                  <ul className="space-y-1">
                    {result.errors.map((err, i) => (
                      <li key={i} className="text-xs font-bold text-rose-600 dark:text-rose-400">• {err.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                  <span className="text-blue-500"><Icons.Zap /></span> Resume Guidance
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Critical Suggestions</p>
                    <div className="space-y-4">
                      {result.resume_feedback.suggestions.map((s, i) => (
                        <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700">{s.section}</span>
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                              s.severity === 'high' ? 'bg-rose-500 text-white' : 
                              s.severity === 'medium' ? 'bg-amber-500 text-white' : 
                              'bg-emerald-500 text-white'
                            }`}>{s.severity}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed">{s.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Editable Improvements</p>
                    <textarea 
                      value={editableResume}
                      onChange={(e) => setEditableResume(e.target.value)}
                      className="w-full h-[16.5rem] p-6 bg-blue-50/30 dark:bg-blue-900/5 border border-blue-100 dark:border-blue-900/20 rounded-[2rem] text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed resize-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                  <span className="text-purple-500"><Icons.Timeline /></span> Interview Preparation
                </h3>

                <div className="space-y-10">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">High-Yield Questions</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.interview_preparation.role_specific_questions.map((q, i) => (
                        <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-blue-500 transition-colors">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">{q.topic || 'General'}</span>
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                              q.difficulty === 'hard' ? 'bg-rose-100 text-rose-600' : 
                              q.difficulty === 'medium' ? 'bg-amber-100 text-amber-600' : 
                              'bg-emerald-100 text-emerald-600'
                            }`}>{q.difficulty}</span>
                          </div>
                          <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">"{q.question}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-10 border-t border-slate-50 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Preparation Strategy</p>
                    <div className="grid grid-cols-1 gap-3">
                      {result.interview_preparation.feedback.map((f, i) => (
                        <div key={i} className="flex gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                          <span className={`mt-1 shrink-0 ${f.type === 'role-specific' ? 'text-blue-500' : 'text-slate-400'}`}>
                            {f.type === 'role-specific' ? <Icons.Zap /> : <Icons.Check />}
                          </span>
                          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">{f.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NEW SECTION: Interview Excellence */}
      <div className="pt-12 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-1000 delay-300">
        <div className="mb-12">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mb-4 text-center">CONTINUOUS MASTERY</p>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">Interview Excellence</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Sample Questions with Example Responses */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <span className="text-emerald-500"><Icons.Check /></span> Mastery Samples
            </h3>
            <div className="space-y-8">
              {INTERVIEW_SAMPLES.map((sample, idx) => (
                <div key={idx} className="space-y-3">
                  <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">Q: {sample.question}</p>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                      {sample.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role-Specific Deep Dive */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <span className="text-blue-500"><Icons.Stack /></span> Role-Specific Focus
            </h3>
            
            <div className="flex gap-2 mb-8 bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl border border-slate-100 dark:border-slate-800">
              {(Object.keys(ROLE_SPECIFIC_GUIDE) as Array<keyof typeof ROLE_SPECIFIC_GUIDE>).map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRoleTab(role)}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeRoleTab === role 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {ROLE_SPECIFIC_GUIDE[activeRoleTab].map((q, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100/50 dark:border-slate-800/50 group hover:border-blue-500 transition-colors">
                  <span className="text-blue-500 shrink-0 font-black text-xs">0{idx + 1}</span>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{q}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Post-Interview Feedback Guidance */}
        <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-[3rem] p-12 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-6">THE FEEDBACK LOOP</p>
              <h3 className="text-3xl font-black mb-6 tracking-tight leading-tight">Mastering Post-Interview Etiquette</h3>
              <p className="text-sm text-slate-300 font-medium leading-relaxed mb-8">
                Requesting feedback is not just about getting notes; it's about signaling a growth mindset. Even a "no" is an opportunity to strengthen your narrative for the next "yes".
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                  <p className="text-xs font-bold text-slate-200">Wait 24-48 hours after a rejection before asking for specific feedback.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                  <p className="text-xs font-bold text-slate-200">Frame it positively: "I'm committed to professional growth—could you highlight one area for development?"</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-8">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6 flex items-center gap-2">
                <Icons.Zap /> Interpreting the Signal
              </h4>
              <div className="space-y-6">
                <div className="pb-6 border-b border-white/10">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Signal: "Not the right fit right now"</p>
                  <p className="text-xs font-bold text-white italic">Interpretation: Usually means your technical skills match, but team culture or specific senior/junior balance was the blocker.</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Signal: "Looking for more depth in [X]"</p>
                  <p className="text-xs font-bold text-white italic">Interpretation: This is gold. Focus your next 2 weeks of 'Quiet Growth' practice specifically on that technical domain.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportView;
