
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Job, ApplicationFiles, AnalysisResult, ApplicationRecord, ApplicationStatus, User, Role, PromptLog, UserStats, Notification } from './types';
import { MOCK_JOBS, MOCK_COMPANIES, MOCK_SALARIES, Icons } from './constants';
import JobCard from './components/JobCard';
import CompanyCard from './components/CompanyCard';
import SalaryCard from './components/SalaryCard';
import FileUpload from './components/FileUpload';
import AnalysisDisplay from './components/AnalysisDisplay';
import TrackView from './components/TrackView';
import PracticeOverlay from './components/PracticeOverlay';
import HistoryView from './components/HistoryView';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import SupportView from './components/SupportView';
import { analyzeResume, generatePracticeQuestion, evaluatePracticeAnswer, summarizeJob } from './services/geminiService';

type ViewState = 'jobs' | 'companies' | 'salaries' | 'history' | 'admin' | 'support';
type JobTab = 'browse' | 'saved' | 'applied';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('jobs');
  const [activeJobTab, setActiveJobTab] = useState<JobTab>('browse');
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('cp_user');
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed && parsed.isLoggedIn) return parsed;
      return { 
        id: 'guest', 
        name: 'Guest User', 
        email: '', 
        role: 'scholar', 
        isPro: false, 
        isLoggedIn: false 
      };
    } catch (e) {
      return { id: 'guest', name: 'Guest User', email: '', role: 'scholar', isPro: false, isLoggedIn: false };
    }
  });
  
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('cp_stats');
    return saved ? JSON.parse(saved) : { promptsToday: 0, maxPrompts: 10, totalPrompts: 0, lastActive: new Date().toISOString() };
  });

  const [promptHistory, setPromptHistory] = useState<PromptLog[]>(() => {
    const saved = localStorage.getItem('cp_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    const saved = localStorage.getItem('cp_applications');
    return saved ? JSON.parse(saved) : [];
  });
  const [files, setFiles] = useState<ApplicationFiles>({
    resume: null,
    coverLetter: null,
    transcript: null,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);

  useEffect(() => {
    localStorage.setItem('cp_applications', JSON.stringify(applications));
    localStorage.setItem('cp_user', JSON.stringify(user));
    localStorage.setItem('cp_stats', JSON.stringify(stats));
    localStorage.setItem('cp_history', JSON.stringify(promptHistory));
  }, [applications, user, stats, promptHistory]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addNotification = (message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const toggleRole = () => {
    const newRole: Role = user.role === 'scholar' ? 'admin' : 'scholar';
    setUser(prev => ({ ...prev, role: newRole }));
    addNotification(`System: Permissions escalated to ${newRole}`, 'info');
  };

  const recordAIInteraction = (action: PromptLog['action'], prompt: string, responsePreview: string) => {
    const newLog: PromptLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      prompt,
      responsePreview,
      role: user.role
    };
    setPromptHistory(prev => [newLog, ...prev]);
    setStats(prev => ({
      ...prev,
      promptsToday: prev.promptsToday + 1,
      totalPrompts: prev.totalPrompts + 1,
      lastActive: new Date().toISOString()
    }));
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setShowAuth(false);
    addNotification(`Auth Success: Welcome back, ${userData.name}.`, 'success');
  };

  const handleLogout = () => {
    setUser({ 
      id: 'guest', 
      name: 'Guest User', 
      email: '', 
      role: 'scholar', 
      isPro: false, 
      isLoggedIn: false 
    });
    setCurrentView('jobs');
    setShowUserMenu(false);
    setShowAuth(true);
    addNotification('Session terminated: Logged out securely.', 'info');
  };

  const handleAccountClick = () => {
    if (user.isLoggedIn) {
      setShowUserMenu(!showUserMenu);
    } else {
      setShowAuth(true);
    }
  };

  const seedHistory = () => {
    const demoLogs: PromptLog[] = [
      { id: 'h1', timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'summarize', prompt: 'Summarize the Senior Frontend Engineer role at TechFlow Solutions.', responsePreview: 'High-growth SaaS role focusing on React, TypeScript, and AI integrations.', role: 'scholar' },
      { id: 'h2', timestamp: new Date(Date.now() - 7200000).toISOString(), action: 'analyze', prompt: 'Analyze resume alignment for Quantum Algorithms Researcher.', responsePreview: 'Score: 82%. Strengths: Deep linear algebra knowledge. Gaps: Specific experience with Qiskit.', role: 'scholar' },
      { id: 'h3', timestamp: new Date(Date.now() - 86400000).toISOString(), action: 'practice', prompt: 'Practice: Explain how you optimize React rendering performance.', responsePreview: 'Feedback Score: 91%. Strengths: Excellent use of memoization examples.', role: 'scholar' }
    ];
    setPromptHistory(prev => [...demoLogs, ...prev]);
    addNotification("Audit trail seeded with 3 entries", "success");
  };

  const checkQuota = () => {
    if (user.role === 'admin') return true;
    if (stats.promptsToday >= stats.maxPrompts) {
      addNotification("AI Rate Limit: Daily quota exceeded.", "error");
      return false;
    }
    return true;
  };

  const handleFileChange = (key: keyof ApplicationFiles) => (file: File | null) => {
    setFiles(prev => ({ ...prev, [key]: file }));
    setAnalysisResult(null);
  };

  const handleStatusChange = (id: string, newStatus: ApplicationStatus) => {
    if (newStatus === 'Archived' && Math.random() < 0.05) {
      setApplications(prev => prev.map(app => app.id === id ? { ...app, error: 'Database timeout. Try again.' } : app));
      return;
    }

    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus, error: null } : app));
    addNotification(`Timeline updated: Role moved to ${newStatus}.`, 'success');
  };

  const handleArchive = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    addNotification('Record archived.', 'info');
  };

  const handleToggleSave = useCallback((job: Job) => {
    const existing = applications.find(app => app.job.id === job.id);
    if (existing) {
      if (existing.status === 'Saved') {
        setApplications(prev => prev.filter(app => app.job.id !== job.id));
        addNotification("Job removed from saved list.", "info");
      } else {
        addNotification("Job already applied. Check your timeline.", "info");
      }
    } else {
      const newSaved: ApplicationRecord = {
        id: Math.random().toString(36).substr(2, 9),
        job: job,
        status: 'Saved',
        appliedDate: new Date().toISOString(),
        relativeDate: 'Saved today',
        resumeVersion: 'Pending',
        aiInsight: "Quietly monitoring this role for future alignment.",
        guidance: "Job saved. Evaluate compatibility when ready."
      };
      setApplications(prev => [newSaved, ...prev]);
      addNotification("Job bookmarked to saved list.", "success");
    }
  }, [applications]);

  const handleApplyNowFromTrack = (record: ApplicationRecord) => {
    setSelectedJob(record.job);
    addNotification("Application sequence initiated.", "info");
  };

  const runAnalysis = async () => {
    if (!selectedJob || !files.resume) return;
    if (!checkQuota()) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const resumeData = await fileToBase64(files.resume);
      const coverLetterData = files.coverLetter ? await fileToBase64(files.coverLetter) : null;
      const result = await analyzeResume(resumeData, coverLetterData, selectedJob.description, selectedJob.company, selectedJob.title);
      setAnalysisResult(result);
      recordAIInteraction('analyze', `Analyzed resume for ${selectedJob.title} at ${selectedJob.company}`, `Score: ${result.score}% - ${result.status}`);
      addNotification("Agent Report Generated: Ready for review.", "success");
    } catch (err: any) {
      addNotification(err.message || 'System fault: Analysis failed.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve({ data: (reader.result as string).split(',')[1], mimeType: file.type });
      reader.onerror = reject;
    });
  };

  const logApplication = useCallback(() => {
    if (!selectedJob) return;
    
    const existingIndex = applications.findIndex(app => app.job.id === selectedJob.id);
    
    const newApp: ApplicationRecord = {
      id: existingIndex !== -1 ? applications[existingIndex].id : Math.random().toString(36).substr(2, 9),
      job: selectedJob,
      status: 'Applied',
      appliedDate: new Date().toISOString(),
      relativeDate: 'Just now',
      resumeVersion: files.resume?.name || 'Standard Resume',
      aiInsight: "Resonance detected: High technical alignment with core stack.",
      guidance: "Submit initiated. Follow-up suggested in 1 week."
    };

    if (existingIndex !== -1) {
      setApplications(prev => {
        const next = [...prev];
        next[existingIndex] = newApp;
        return next;
      });
    } else {
      setApplications(prev => [newApp, ...prev]);
    }

    setSelectedJob(null);
    setAnalysisResult(null);
    // When applying, switch to applied tab in jobs
    setCurrentView('jobs');
    setActiveJobTab('applied');
    addNotification("Event logged: Application added to timeline.", "success");
  }, [selectedJob, files.resume, applications]);

  const handleSummarize = async (job: Job) => {
    if (!checkQuota()) return;
    try {
      const summary = await summarizeJob(job.description);
      recordAIInteraction('summarize', `Summarized ${job.title}`, summary);
      addNotification("Scan Report available in History.", "info");
    } catch (err) {
      addNotification("System fault: Summarization failed.", "error");
    }
  };

  const runStressTest = () => {
    const stressData: ApplicationRecord[] = Array.from({ length: 50 }).map((_, i) => ({
      id: `demo-${i}`,
      job: MOCK_JOBS[i % MOCK_JOBS.length],
      status: i % 10 === 0 ? 'Saved' : 'Applied',
      appliedDate: new Date(Date.now() - (Math.random() * 90 * 86400000)).toISOString(),
      relativeDate: 'Simulated',
      resumeVersion: 'Resume_Archive_01',
      aiInsight: "Historical resonance: High matching patterns detected.",
      guidance: "Data load successful.",
      demo_application: true
    }));
    setApplications(stressData);
    // setCurrentView('track'); // track removed
    setCurrentView('jobs');
    setActiveJobTab('applied');
    addNotification("Debug: 50 demo records injected.", "info");
  };

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !selectedType || job.type === selectedType;
      const matchesLocation = !selectedLocation || (job.location && job.location.includes(selectedLocation));
      return matchesSearch && matchesType && matchesLocation;
    });
  }, [searchTerm, selectedType, selectedLocation]);

  const savedCount = useMemo(() => applications.filter(a => a.status === 'Saved').length, [applications]);
  const appliedCount = useMemo(() => applications.filter(a => a.status !== 'Saved').length, [applications]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
      <div className="fixed top-24 right-8 z-[100] space-y-4 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`pointer-events-auto px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-4 animate-in slide-in-from-right-8 duration-300 ${
            n.type === 'error' ? 'bg-rose-500 border-rose-400 text-white' : 
            n.type === 'success' ? 'bg-emerald-500 border-emerald-400 text-white' : 
            'bg-slate-900 border-slate-800 text-white'
          }`}>
            <span className="text-lg">{n.type === 'error' ? '✕' : n.type === 'success' ? '✓' : 'ℹ'}</span>
            <p className="text-sm font-bold">{n.message}</p>
          </div>
        ))}
      </div>

      <header className="bg-white dark:bg-slate-900 px-8 h-20 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center gap-10">
          <div className="cursor-pointer" onClick={() => setCurrentView('jobs')}><Icons.Logo /></div>
          <nav className="flex gap-8">
            {['jobs', 'companies', 'salaries', 'history', 'support'].map((view) => (
              <button 
                key={view} 
                onClick={() => {
                   setCurrentView(view as ViewState);
                   if (view === 'jobs') setActiveJobTab('browse');
                }} 
                className={`text-sm font-black uppercase tracking-widest transition-all ${currentView === view ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-900'}`}
              >
                {view}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>{user.role}</span>
              <p className="text-sm font-black text-slate-900 dark:text-white">{user.name}</p>
            </div>
            {user.role !== 'admin' && (
              <div className="flex items-center gap-2 mt-1">
                 <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(stats.promptsToday / stats.maxPrompts) * 100}%` }} />
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{stats.promptsToday}/{stats.maxPrompts}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 relative" ref={userMenuRef}>
            <button onClick={toggleTheme} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">{isDarkMode ? <Icons.Sun /> : <Icons.Moon />}</button>
            <button 
              onClick={handleAccountClick}
              className={`w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center font-black text-xs hover:border-blue-500 transition-all overflow-hidden ${user.isLoggedIn ? 'bg-blue-50' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              {user.isLoggedIn ? (
                user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" /> : '👤'
              ) : '🔑'}
            </button>
            {showUserMenu && user.isLoggedIn && (
              <div className="absolute top-14 right-0 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] shadow-2xl py-4 z-[100] animate-in fade-in zoom-in-95 duration-200 origin-top-right backdrop-blur-xl bg-white/95 dark:bg-slate-900/95">
                <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 mb-2">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated as</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-[10px] font-bold text-slate-500 truncate">{user.email}</p>
                </div>
                <div className="px-2">
                  <button className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest">
                    <span>👤</span> View Profile
                  </button>
                  <button className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest">
                    <span>⚙️</span> Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors uppercase tracking-[0.2em]"
                  >
                    <span>🚪</span> Log Out
                  </button>
                </div>
              </div>
            )}
            <button onClick={toggleRole} className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center font-black text-xs hover:border-blue-500 transition-all">
              {user.role === 'admin' ? '🛠️' : '🎓'}
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 pt-20 pb-16 px-8 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300 text-center">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.05] mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
             {currentView === 'jobs' && <>Find your next <span className="text-blue-600 dark:text-blue-400">quiet growth</span> opportunity.</>}
             {currentView === 'companies' && <>Companies that <span className="text-blue-600 dark:text-blue-400">build different.</span></>}
             {currentView === 'salaries' && <>Transparent <span className="text-blue-600 dark:text-blue-400">compensation.</span></>}
             {currentView === 'history' && <>Audit your <span className="text-blue-600 dark:text-blue-400">AI interactions.</span></>}
             {currentView === 'admin' && <>System <span className="text-blue-600 dark:text-blue-400">Health Hub.</span></>}
             {currentView === 'support' && <>Career <span className="text-blue-600 dark:text-blue-400">Acceleration Hub.</span></>}
          </h1>
          
          {currentView === 'jobs' && (
            <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 gap-10">
              
              {/* Jobs Tab Navigation */}
              <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-inner">
                 <button 
                  onClick={() => setActiveJobTab('browse')}
                  className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeJobTab === 'browse' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                 >
                   Browse
                 </button>
                 <button 
                  onClick={() => setActiveJobTab('saved')}
                  className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeJobTab === 'saved' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                 >
                   Saved <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-600 rounded text-[9px]">{savedCount}</span>
                 </button>
                 <button 
                  onClick={() => setActiveJobTab('applied')}
                  className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeJobTab === 'applied' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                 >
                   Applied <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-600 rounded text-[9px]">{appliedCount}</span>
                 </button>
              </div>

              {activeJobTab === 'browse' && (
                <div className="relative group w-full max-w-4xl">
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors scale-125">
                    <Icons.Search />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search roles, skills, or companies..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-[3rem] py-8 pl-20 pr-10 text-xl font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all shadow-xl shadow-slate-200/50 dark:shadow-none"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-8 py-16 transition-colors duration-300">
        {currentView === 'jobs' && (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-5xl space-y-8">
              
              {/* BROWSE TAB */}
              {activeJobTab === 'browse' && (
                filteredJobs.length > 0 ? (
                  filteredJobs.map(job => (
                    <div key={job.id} className="relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <JobCard 
                        job={job} 
                        isSelected={selectedJob?.id === job.id} 
                        onSelect={setSelectedJob} 
                        isSaved={applications.some(app => app.job.id === job.id && app.status === 'Saved')}
                        onToggleSave={handleToggleSave}
                      />
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleSummarize(job); }}
                        className="absolute right-20 top-8 px-5 py-2.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-x-3 z-10 shadow-xl"
                      >
                        ✨ AI Summarize
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-40 text-center bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-inner opacity-50">
                    <p className="text-xl font-black text-slate-400">Zero matches found in current sector.</p>
                  </div>
                )
              )}

              {/* SAVED TAB */}
              {activeJobTab === 'saved' && (
                <TrackView 
                  applications={applications} 
                  onStatusChange={handleStatusChange} 
                  onArchive={handleArchive} 
                  onStressTest={runStressTest} 
                  onPractice={() => setIsPracticing(true)}
                  onApplyNow={handleApplyNowFromTrack}
                  viewMode="saved"
                />
              )}

              {/* APPLIED TAB */}
              {activeJobTab === 'applied' && (
                <TrackView 
                  applications={applications} 
                  onStatusChange={handleStatusChange} 
                  onArchive={handleArchive} 
                  onStressTest={runStressTest} 
                  onPractice={() => setIsPracticing(true)}
                  onApplyNow={handleApplyNowFromTrack}
                  viewMode="applied"
                />
              )}

            </div>
          </div>
        )}
        {currentView === 'companies' && <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{MOCK_COMPANIES.map(company => <CompanyCard key={company.id} company={company} />)}</div>}
        {currentView === 'salaries' && <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{MOCK_SALARIES.map(salary => <SalaryCard key={salary.id} salary={salary} />)}</div>}
        {currentView === 'history' && <HistoryView logs={promptHistory} onSeed={seedHistory} />}
        {currentView === 'admin' && user.role === 'admin' && <AdminDashboard logs={promptHistory} />}
        {currentView === 'support' && <SupportView />}
      </main>

      {isPracticing && <PracticeOverlay onClose={() => setIsPracticing(false)} userContext={applications.length > 0 ? applications[0].job.title : "Software Engineer"} />}
      
      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)} 
          onSuccess={handleAuthSuccess} 
          onRecordAction={(act, pr, resp) => recordAIInteraction(act, pr, resp)} 
        />
      )}

      {selectedJob && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4 md:p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-7xl max-h-[95vh] overflow-hidden rounded-[3rem] shadow-2xl border dark:border-slate-800 relative flex flex-col md:flex-row">
            
            {/* Left Column: Action Area */}
            <div className="w-full md:w-7/12 p-8 md:p-14 overflow-y-auto relative flex flex-col bg-white dark:bg-slate-900 z-10">
                 {/* Mobile Close Button */}
                 <button onClick={() => setSelectedJob(null)} className="md:hidden absolute top-6 right-6 p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-900 transition-colors"><Icons.Cross /></button>

                 <div className="mb-10">
                   <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-slate-900 dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center text-white text-3xl font-black shadow-inner shrink-0">{selectedJob.company.charAt(0)}</div>
                      <div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{selectedJob.title}</h2>
                        <div className="flex items-center gap-3 mt-2">
                           <p className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest text-xs md:text-sm">{selectedJob.company}</p>
                           <span className="text-slate-300 dark:text-slate-600">•</span>
                           <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">{selectedJob.location || 'Remote'}</p>
                        </div>
                      </div>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                    <FileUpload label="Resume" id="resume-up" required selectedFile={files.resume} onChange={handleFileChange('resume')} />
                    <FileUpload label="Cover Letter" id="cover" selectedFile={files.coverLetter} onChange={handleFileChange('coverLetter')} />
                    <div className="sm:col-span-2">
                        <FileUpload label="Transcript" id="trans" selectedFile={files.transcript} onChange={handleFileChange('transcript')} />
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
                   <button 
                     onClick={runAnalysis} 
                     disabled={!files.resume || isAnalyzing} 
                     className={`flex-1 w-full py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 ${
                       files.resume && !isAnalyzing 
                         ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-slate-500/20' 
                         : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                     }`}
                   >
                     {isAnalyzing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Evaluate Compatibility 🚀'}
                   </button>
                   
                   <button 
                     onClick={logApplication} 
                     disabled={isAnalyzing}
                     className="flex-1 w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl shadow-blue-500/40 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                     Apply Now <Icons.Navigate />
                   </button>
                 </div>
                 
                 {analysisResult && (
                   <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                     <AnalysisDisplay result={analysisResult} />
                   </div>
                 )}
            </div>

            {/* Right Column: Job Context */}
            <div className="w-full md:w-5/12 bg-slate-50 dark:bg-slate-950 p-8 md:p-14 overflow-y-auto border-l border-slate-100 dark:border-slate-800 relative hidden md:block">
                 <button onClick={() => setSelectedJob(null)} className="absolute top-8 right-8 p-3 bg-white dark:bg-slate-900 rounded-full text-slate-400 hover:text-slate-900 transition-colors shadow-sm z-20"><Icons.Cross /></button>
                 
                 <div className="pt-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-8">Role Context</p>
                     
                     <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                        <p className="text-base font-medium text-slate-900 dark:text-white leading-relaxed mb-10">
                            {selectedJob.description}
                        </p>

                        {selectedJob.details && (
                            <div className="space-y-10">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Responsibilities
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap pl-5 border-l-2 border-slate-200 dark:border-slate-800">
                                        {selectedJob.details.responsibilities}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Requirements
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap pl-5 border-l-2 border-slate-200 dark:border-slate-800">
                                        {selectedJob.details.requirements}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Benefits
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap pl-5 border-l-2 border-slate-200 dark:border-slate-800">
                                        {selectedJob.details.benefits}
                                    </p>
                                </div>
                            </div>
                        )}
                     </div>
                 </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default App;
