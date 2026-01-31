
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { PracticeSession, PracticeFeedback } from '../types';
import { generatePracticeQuestion, evaluatePracticeAnswer } from '../services/geminiService';

interface PracticeOverlayProps {
  onClose: () => void;
  userContext?: string;
}

const PracticeOverlay: React.FC<PracticeOverlayProps> = ({ onClose, userContext }) => {
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [answer, setAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<PracticeFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const q = await generatePracticeQuestion(userContext);
        setSession(q);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestion();
  }, [userContext]);

  const handleSubmit = async () => {
    if (!session || !answer.trim()) return;
    setIsEvaluating(true);
    try {
      const f = await evaluatePracticeAnswer(session.question, answer);
      setFeedback(f);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-10 relative">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <Icons.Cross />
        </button>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-6">
            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Calibrating Question...</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {session?.category || 'Technical'}
                </span>
                <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {session?.difficulty || 'Medium'}
                </span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                {session?.question}
              </h2>
            </div>

            {!feedback ? (
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Response</label>
                  <textarea 
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your structured answer here..."
                    className="w-full h-48 p-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl text-sm font-medium resize-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
                <button 
                  onClick={handleSubmit}
                  disabled={!answer.trim() || isEvaluating}
                  className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isEvaluating ? 'AI Evaluation in progress...' : 'Submit for Feedback'}
                </button>
              </div>
            ) : (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="flex items-center gap-8 bg-blue-50/50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-800/50">
                   <div className="text-center">
                      <div className="text-5xl font-black text-blue-600 dark:text-blue-400 leading-none mb-2">{feedback.score}%</div>
                      <div className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Score</div>
                   </div>
                   <div className="h-12 w-[1px] bg-blue-100 dark:bg-blue-800/50" />
                   <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic">
                     {feedback.score >= 80 ? "Stellar work. This response shows high technical maturity." : "Solid start. Let's refine the depth of your technical explanation."}
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                       <Icons.Check /> Strengths
                    </h3>
                    <ul className="space-y-3">
                      {feedback.strengths.map((s, i) => (
                        <li key={i} className="text-xs font-bold text-slate-600 dark:text-slate-400 flex gap-2">
                          <span className="text-emerald-500">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                       <Icons.Timeline /> Areas to Grow
                    </h3>
                    <ul className="space-y-3">
                      {feedback.improvements.map((im, i) => (
                        <li key={i} className="text-xs font-bold text-slate-600 dark:text-slate-400 flex gap-2">
                          <span className="text-blue-500">•</span> {im}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl space-y-4">
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expert Answer Reference</h3>
                   <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                     {feedback.sampleAnswer}
                   </p>
                </div>

                <button 
                  onClick={onClose}
                  className="w-full py-5 border border-slate-200 dark:border-slate-700 rounded-3xl font-black text-xs uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeOverlay;
