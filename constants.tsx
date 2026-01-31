import React from 'react';
import { Job, Company, Salary } from './types';

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechFlow Solutions',
    location: 'Remote',
    type: 'Full-time',
    salary: '$140k - $180k',
    description: 'We are looking for a React expert with deep knowledge of TypeScript, Tailwind, and AI integration. Must have experience building scalable SaaS products and accessibility standards.',
    postedDate: '2 days ago',
    deadline: '2024-06-30',
    percentage_match: 92,
    posted_days_ago: 2,
    skills: ['React', 'TypeScript', 'AI Integration'],
    details: {
      responsibilities: "- Architect scalable frontend systems using React and TypeScript.\n- Collaborate with AI teams to integrate LLM features into the core product.\n- Lead accessibility audits and implement WCAG 2.1 standards.",
      requirements: "- 5+ years of frontend experience.\n- Deep proficiency in Tailwind CSS and modern styling architectures.\n- Experience with high-traffic SaaS products.",
      benefits: "- Remote-first culture.\n- Health, Dental, and Vision coverage.\n- Annual learning stipend ($2k)."
    },
    coordinates: { lat: 37.7749, lng: -122.4194 }
  },
  {
    id: '2',
    title: 'Staff Software Developer',
    company: 'MapleAI Systems',
    location: 'Toronto, ON',
    type: 'Full-time',
    salary: '$165k - $210k CAD',
    description: 'Lead our core platform team in building high-performance AI infrastructure. Deep experience in Go, Rust, or C++ required.',
    postedDate: '2 hours ago',
    deadline: '2024-07-15',
    percentage_match: 78,
    posted_days_ago: 0,
    skills: ['Go', 'Rust', 'AI Infra'],
    details: {
      responsibilities: "- Design high-performance distributed systems.\n- Optimize AI inference engines for production scale.\n- Mentor senior engineers on platform architecture.",
      requirements: "- Proficient in low-level programming (C++/Go/Rust).\n- Strong understanding of kubernetes and cloud-native patterns.",
      benefits: "- Stock options in a high-growth startup.\n- 4 weeks PTO.\n- Office in downtown Toronto."
    },
    coordinates: { lat: 43.6532, lng: -79.3832 }
  },
  {
    id: '3',
    title: 'Cloud Solutions Architect',
    company: 'Northern Cloud Services',
    location: 'Ottawa, ON',
    type: 'Full-time',
    salary: 'Not specified',
    description: 'Architect secure and scalable cloud environments for public sector digital transformation projects.',
    postedDate: '1 day ago',
    deadline: null,
    percentage_match: 85,
    posted_days_ago: 1,
    skills: ['AWS', 'Azure', 'Security'],
    details: {
      responsibilities: "- Develop cloud migration strategies for government clients.\n- Ensure compliance with data sovereignty regulations.\n- Lead technical workshops with public sector stakeholders.",
      requirements: "- Expert level cloud certification (AWS/Azure).\n- Security clearance eligibility.\n- 8+ years in architecture.",
      benefits: "- Public sector pension plan.\n- Flexible working hours.\n- Relocation assistance for Ottawa."
    },
    coordinates: { lat: 45.4215, lng: -75.6972 }
  }
];

export const MOCK_COMPANIES: Company[] = [
  {
    id: 'c1',
    name: 'TechFlow Solutions',
    industry: 'SaaS / Enterprise',
    location: 'San Francisco, CA, USA',
    description: 'Building the next generation of workflow automation tools for enterprise teams worldwide.',
    logo: 'T',
    rating: 4.8,
    openJobs: 12,
    tags: ['React', 'Node.js', 'AI']
  },
  {
    id: 'c2',
    name: 'MapleAI Systems',
    industry: 'Artificial Intelligence',
    location: 'Toronto, Ontario, Canada',
    description: 'A leading Canadian startup focused on democratizing high-performance AI computing for small businesses.',
    logo: 'M',
    rating: 4.9,
    openJobs: 8,
    tags: ['Next.js', 'PyTorch', 'Rust']
  },
  {
    id: 'c3',
    name: 'Pacific Data Science',
    industry: 'Data Analytics',
    location: 'Vancouver, British Columbia, Canada',
    description: 'Harnessing the power of environmental data to help coastal cities plan for a sustainable future.',
    logo: 'P',
    rating: 4.6,
    openJobs: 5,
    tags: ['Python', 'GIS', 'Big Data']
  },
  {
    id: 'c4',
    name: 'Northern Cloud Services',
    industry: 'Cloud Infrastructure',
    location: 'Ottawa, Ontario, Canada',
    description: 'Trusted partner for secure, sovereign cloud solutions for government and public sector entities across North America.',
    logo: 'N',
    rating: 4.4,
    openJobs: 3,
    tags: ['AWS', 'Azure', 'Security']
  },
  {
    id: 'c5',
    name: 'Hopper Tech Solutions',
    industry: 'Travel & FinTech',
    location: 'Montreal, Quebec, Canada',
    description: 'Leveraging big data to help millions of travelers save money and travel better through price prediction.',
    logo: 'H',
    rating: 4.7,
    openJobs: 14,
    tags: ['GCP', 'Data Science', 'Kotlin']
  },
  {
    id: 'c6',
    name: 'Wealthsimple Financial',
    industry: 'FinTech',
    location: 'Toronto, Ontario, Canada',
    description: 'Making financial tools for everyone. Wealthsimple is Canada\'s largest and most popular digital investment service.',
    logo: 'W',
    rating: 4.5,
    openJobs: 22,
    tags: ['Ruby on Rails', 'React', 'Mobile']
  },
  {
    id: 'c7',
    name: 'Shopify Inc.',
    industry: 'E-commerce',
    location: 'Ottawa, Ontario, Canada (Remote)',
    description: 'Global commerce platform providing tools for businesses to sell anywhere—online, in-store, and everywhere in between.',
    logo: 'S',
    rating: 4.4,
    openJobs: 45,
    tags: ['Ruby', 'React', 'Go']
  },
  {
    id: 'c8',
    name: 'OpenText Corporation',
    industry: 'Information Management',
    location: 'Waterloo, Ontario, Canada',
    description: 'Developing information management software for global organizations to scale and secure digital experiences.',
    logo: 'O',
    rating: 4.0,
    openJobs: 15,
    tags: ['Java', 'Cloud', 'Enterprise']
  },
  {
    id: 'c9',
    name: 'Kik Interactive Inc.',
    industry: 'Communications',
    location: 'Waterloo, Ontario, Canada',
    description: 'Pioneering chat technologies and digital currencies through the Kik messenger platform.',
    logo: 'K',
    rating: 3.8,
    openJobs: 4,
    tags: ['Android', 'iOS', 'Scalability']
  },
  {
    id: 'c10',
    name: 'Dapper Labs',
    industry: 'Blockchain / NFT',
    location: 'Vancouver, British Columbia, Canada',
    description: 'Creating original digital experiences on the Flow blockchain, including NBA Top Shot and CryptoKitties.',
    logo: 'DL',
    rating: 4.1,
    openJobs: 9,
    tags: ['Flow', 'Cadence', 'React']
  }
];

export const MOCK_SALARIES: Salary[] = [
  {
    id: 's1',
    role: 'Senior Frontend Engineer',
    location: 'Toronto, Ontario, Canada',
    averageSalary: '$145,000',
    minSalary: '$120k',
    maxSalary: '$195k',
    trend: 'up',
    trendPercentage: 12
  },
  {
    id: 's2',
    role: 'Lead Data Scientist',
    location: 'Vancouver, British Columbia, Canada',
    averageSalary: '$158,000',
    minSalary: '$130k',
    maxSalary: '$210k',
    trend: 'up',
    trendPercentage: 15
  },
  {
    id: 's3',
    role: 'Cloud Architect',
    location: 'Ottawa, Ontario, Canada',
    averageSalary: '$162,000',
    minSalary: '$140k',
    maxSalary: '$225k',
    trend: 'stable',
    trendPercentage: 4
  },
  {
    id: 's4',
    role: 'Cybersecurity Analyst',
    location: 'Montreal, Quebec, Canada',
    averageSalary: '$112,000',
    minSalary: '$95k',
    maxSalary: '$150k',
    trend: 'up',
    trendPercentage: 18
  },
  {
    id: 's5',
    role: 'Full Stack Developer',
    location: 'Calgary, Alberta, Canada',
    averageSalary: '$128,000',
    minSalary: '$105k',
    maxSalary: '$170k',
    trend: 'up',
    trendPercentage: 6
  },
  {
    id: 's6',
    role: 'Staff Systems Engineer',
    location: 'Waterloo, Ontario, Canada',
    averageSalary: '$172,000',
    minSalary: '$145k',
    maxSalary: '$230k',
    trend: 'up',
    trendPercentage: 10
  },
  {
    id: 's7',
    role: 'AI Research Scientist',
    location: 'Montreal, Quebec, Canada',
    averageSalary: '$185,000',
    minSalary: '$150k',
    maxSalary: '$260k',
    trend: 'up',
    trendPercentage: 22
  },
  {
    id: 's8',
    role: 'Product Designer',
    location: 'Toronto, Ontario, Canada',
    averageSalary: '$118,000',
    minSalary: '$95k',
    maxSalary: '$165k',
    trend: 'stable',
    trendPercentage: 2
  },
  {
    id: 's9',
    role: 'Mobile Engineer (React Native)',
    location: 'Kitchener, Ontario, Canada',
    averageSalary: '$135,000',
    minSalary: '$110k',
    maxSalary: '$180k',
    trend: 'up',
    trendPercentage: 8
  }
];

const StrokeWidth = 2;

export const Icons = {
  Logo: () => (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">C</div>
      <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">CareerPulse</span>
    </div>
  ),
  LogoIcon: () => (
    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">C</div>
  ),
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={StrokeWidth} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
  ),
  Sun: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={StrokeWidth} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
  ),
  Moon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={StrokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
  ),
  Upload: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={StrokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
  ),
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  ),
  Cross: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  ),
  TrendUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
  ),
  TrendDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
  ),
  TrendFlat: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  ),
  Timeline: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={StrokeWidth} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
  ),
  Stack: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={StrokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
  ),
  Pin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={StrokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
  ),
  Navigate: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
  ),
  Bookmark: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={StrokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
  ),
  BookmarkFilled: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={StrokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
  ),
  Building: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={StrokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="18"></line><line x1="15" y1="22" x2="15" y2="18"></line><line x1="18" y1="6" x2="6" y2="6"></line><line x1="18" y1="10" x2="6" y2="10"></line><line x1="18" y1="14" x2="6" y2="14"></line></svg>
  ),
  Star: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={StrokeWidth} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
  ),
  Chart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={StrokeWidth} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
  ),
  Zap: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={StrokeWidth} strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={StrokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
  ),
  Activity: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={StrokeWidth} strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
  )
};