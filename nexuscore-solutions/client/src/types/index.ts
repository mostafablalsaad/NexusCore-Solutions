export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  industryTags: Industry[];
  icon?: string;
  imageUpdated?: string;
  order: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  industry: Industry;
  thumbnail: string;
  gallery: string[];
  featured: boolean;
  technologies: string[];
  completionDate?: string;
  clientName?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStudy {
  _id: string;
  title: string;
  client: string;
  industry?: Industry;
  challenge: string;
  solution: string;
  results: string;
  metrics: Metric[];
  pdfUrl?: string;
  relatedProject?: Project | string;
  thumbnail?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Metric {
  label: string;
  value: string;
}

export interface Whitepaper {
  _id: string;
  title: string;
  excerpt: string;
  pdfUrl: string;
  publishDate: string;
  industryTags: Industry[];
  downloadCount: number;
  thumbnail?: string;
  author?: string;
  featured: boolean;
  createdAt: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  linkedin?: string;
  email?: string;
  order: number;
  active: boolean;
  createdAt: string;
}

export interface Achievement {
  _id: string;
  title: string;
  description?: string;
  date: string;
  type: 'award' | 'certification' | 'partnership' | 'milestone';
  logo?: string;
  order: number;
  featured: boolean;
  createdAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  read: boolean;
  responded: boolean;
  responseNote?: string;
  createdAt: string;
}

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  confirmed: boolean;
  confirmedAt?: string;
  unsubscribed: boolean;
  unsubscribedAt?: string;
  createdAt: string;
}

export type Industry = 'renewable' | 'medical' | 'submarine' | 'petroleum' | 'automotive';

export interface DashboardStats {
  counts: {
    projects: number;
    caseStudies: number;
    whitepapers: number;
    messages: number;
    unreadMessages: number;
    subscribers: number;
  };
  recentMessages: ContactMessage[];
  recentSubscribers: NewsletterSubscriber[];
  charts: {
    monthlyMessages: any[];
    monthlySubscribers: any[];
    projectsByIndustry: any[];
  };
  topWhitepapers: Whitepaper[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  message?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}
