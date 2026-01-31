import React, { useState } from 'react';
import { Icons } from '../constants';
import { parseProfileFromResume } from '../services/geminiService';
import FileUpload from './FileUpload';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (userData: any) => void;
  onRecordAction: (action: any, prompt: string, response: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess, onRecordAction }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot-password'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsAuthenticating(true);

    await new Promise(resolve => setTimeout(resolve, 1200));

    if (password.length < 6) {
      setError("Security requirement: Password must be at least 6 characters.");
      setIsAuthenticating(false);
      return;
    }

    onSuccess({
      id: Math.random().toString(36).substr(2, 9),
      name: name || email.split('@')[0],
      email: email,
      role: email.includes('admin') ? 'admin' : 'scholar',
      isLoggedIn: true,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    });
    setIsAuthenticating(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsAuthenticating(true);

    // Simulate secure email dispatch
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setResetSent(true);
    setIsAuthenticating(false);
  };

  const handleOAuth = async () => {
    setError(null);
    setIsAuthenticating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSuccess({
      id: 'google-user-123',
      name: 'Google Scholar',
      email: 'scholar@gmail.com',
      role: 'scholar',
      isLoggedIn: true,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=google`
    });
    setIsAuthenticating(false);
  };

  const handleResumeUpload = async (file: File | null) => {
    setResume(file);
    if (file) {
      setIsParsing(true);
      setError(null);
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64 = (reader.result as string).split(',')[1];
          try {
            const result = await parseProfileFromResume({ data: base64, mimeType: file.type });
            setName(result.name);
            setEmail(result.email);
            onRecordAction('parse-profile', `Extracted profile from ${file.name}`, `Parsed name: ${result.name}`);
            setMode('signup');
          } catch (err) {
            setError("Could not parse resume. Please enter details manually.");
          } finally {
            setIsParsing(false);
          }
        };
      } catch (err) {
        setError("File system error. Please try again.");
        setIsParsing(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-2xl border dark:border-slate-800 p-10 relative overflow-hidden transition-all duration-500">
        <button 
          onClick={onClose}
          disabled={isAuthenticating}
          className="absolute top-8 right-8 p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all disabled:opacity-30"
        >
          <Icons.Cross />
        </button>

        <div className="flex flex-col items-center text-center mb-10">
          <div className="mb-6"><Icons.Logo /></div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            {mode === 'signin' && 'Welcome back'}
            {mode === 'signup' && 'Create account'}
            {mode === 'forgot-password' && 'Reset Password'}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 px-4">
            {mode === 'signin' && 'Access your saved progress and AI analysis.'}
            {mode === 'signup' && 'Join the next generation of professional talent.'}
            {mode === 'forgot-password' && 'Enter your email to receive a secure recovery link.'}
          </p>
        </div>

        <div className="space-y-6">
          {mode !== 'forgot-password' && (
            <>
              <button 
                onClick={handleOAuth}
                disabled={isAuthenticating}
                className="w-full py-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group disabled:opacity-50"
              >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                  {isAuthenticating ? 'Connecting...' : 'Continue with Google'}
                </span>
              </button>

              <div className="flex items-center gap-4 text-slate-300 dark:text-slate-700">
                <div className="h-px flex-1 bg-current opacity-30"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">or secure email</span>
                <div className="h-px flex-1 bg-current opacity-30"></div>
              </div>
            </>
          )}

          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl animate-in slide-in-from-top-2 duration-300">
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">!</span>
                {error}
              </p>
            </div>
          )}

          {/* Corrected logic: simplified ternary to prevent unintentional type narrowing of 'mode' in form branch */}
          {resetSent ? (
            <div className="text-center p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-800/50 animate-in zoom-in-95 duration-500">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                <Icons.Check />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Check your inbox</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                If an account exists for <span className="font-bold text-slate-900 dark:text-white">{email}</span>, a reset link has been dispatched.
              </p>
              <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-emerald-100/50 dark:border-emerald-800/50 mb-8">
                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                   Link expires in 30 minutes
                </p>
              </div>
              <button 
                onClick={() => {
                  setMode('signin');
                  setResetSent(false);
                }}
                className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={mode === 'forgot-password' ? handleForgotPassword : handleAuth} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    disabled={isAuthenticating}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all text-sm font-bold disabled:opacity-50" 
                    placeholder="Your name" 
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  disabled={isAuthenticating}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all text-sm font-bold disabled:opacity-50" 
                  placeholder="name@company.com" 
                  required
                />
              </div>
              
              {mode !== 'forgot-password' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                    {mode === 'signin' && (
                      <button 
                        type="button"
                        onClick={() => setMode('forgot-password')}
                        className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  {/* Fix: removed redundant mode comparison that was causing a TypeScript overlap error in a narrowed block */}
                  <input 
                    type="password" 
                    value={password}
                    disabled={isAuthenticating}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all text-sm font-bold disabled:opacity-50" 
                    placeholder="••••••••" 
                    required
                  />
                </div>
              )}
              
              <button 
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {isAuthenticating && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {mode === 'signin' && (isAuthenticating ? 'Authenticating...' : 'Secure Sign In')}
                {mode === 'signup' && (isAuthenticating ? 'Registering...' : 'Create Account')}
                {mode === 'forgot-password' && (isAuthenticating ? 'Sending...' : 'Send Reset Link')}
              </button>
            </form>
          )}

          {mode === 'signup' && !resetSent ? (
             <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800/50">
               <div className="mb-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Auto-populate profile (Recommended)</p>
                 <FileUpload 
                  label="Upload Resume" 
                  id="signup-resume" 
                  selectedFile={resume} 
                  onChange={handleResumeUpload} 
                 />
                 {isParsing && (
                   <div className="mt-3 flex items-center justify-center gap-2 text-blue-500">
                     <div className="w-3 h-3 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                     <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Scanning Profile...</span>
                   </div>
                 )}
               </div>
             </div>
          ) : null}

          {!resetSent && (
            <div className="text-center">
              <button 
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setResetSent(false); // Reset status when switching modes
                  setError(null);
                }}
                disabled={isAuthenticating}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors disabled:opacity-50"
              >
                {mode === 'forgot-password' 
                  ? "Back to Sign In" 
                  : (mode === 'signin' ? "Don't have an account? Create one" : "Already have an account? Sign in")}
              </button>
            </div>
          )}
        </div>

        <p className="mt-10 text-[9px] text-slate-400 text-center font-bold uppercase tracking-widest opacity-50">
          CareerPulse Protocol — {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;