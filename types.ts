
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string | null;
  type: string;
  salary: string; // formatted currency or 'Not specified'
  description: string;
  postedDate: string;
  deadline: string | null; // ISO 8601
  percentage_match: number; // 0-100
  posted_days_ago: number | null;
  skills: string[]; // up to 3
  details?: {
    responsibilities: string;
    requirements: string;
    benefits: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export type ApplicationStatus = 'Saved' | 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Archived';

export interface ApplicationRecord {
  id: string;
  job: Job;
  status: ApplicationStatus;
  appliedDate: string; // Also serves as Save Time for 'Saved' status
  relativeDate: string;
  resumeVersion: string;
  industry?: string;
  source?: string;
  followUpDue?: string | null;
  guidance?: string;
  notes?: string;
  aiInsight?: string;
  demo_application?: boolean;
  error?: string | null; // For inline UI feedback
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  description: string;
  logo: string;
  rating: number;
  openJobs: number;
  tags: string[];
}

export interface Salary {
  id: string;
  role: string;
  averageSalary: string;
  minSalary: string;
  maxSalary: string;
  location: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface AnalysisResult {
  score: number;
  status: 'READY' | 'NOT_READY';
  checks: {
    pageLength: boolean;
    formatPreserved: boolean;
    companyTargeted: boolean;
  };
  breakdown: {
    skillsMatch: number;
    responsibilityMatch: number;
    keywordMatch: number;
    experienceFit: number;
    targeting: number;
  };
  feedback: {
    missingSkills: string[];
    suggestions: string[];
    atsNotes: string[];
  };
}

export interface OptimizedContent {
  summary: string;
  keySkills: string[];
  experienceHighlights: string[];
  rationale: string;
}

export interface InterviewPrep {
  questions: {
    question: string;
    answer: string;
    type: string;
  }[];
  emailTemplate: string;
  generatedAt: string;
}

export interface ApplicationFiles {
  resume: File | null;
  coverLetter: File | null;
  transcript: File | null;
}

export interface PracticeSession {
  question: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface PracticeFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  sampleAnswer: string;
}

export type Role = 'scholar' | 'admin' | 'editor';

export interface UserProfile {
  headline?: string;
  summary?: string;
  skills?: string[];
  experienceYears?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  isPro?: boolean;
  isLoggedIn: boolean;
  profile?: UserProfile;
}

export interface PromptLog {
  id: string;
  timestamp: string;
  action: 'analyze' | 'optimize' | 'practice' | 'chat' | 'summarize' | 'parse-profile' | 'support';
  prompt: string;
  responsePreview: string;
  role: Role;
}

export interface UserStats {
  promptsToday: number;
  maxPrompts: number;
  totalPrompts: number;
  lastActive: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// New Support Types
export interface SupportResponse {
  resume_feedback: {
    suggestions: Array<{ text: string; section: string; severity: 'low' | 'medium' | 'high' }>;
    editable_output: string;
  };
  interview_preparation: {
    role_specific_questions: Array<{ question: string; topic: string; difficulty: 'easy' | 'medium' | 'hard' }>;
    feedback: Array<{ text: string; type: 'general' | 'role-specific' }>;
  };
  errors: Array<{ message: string }>;
}
