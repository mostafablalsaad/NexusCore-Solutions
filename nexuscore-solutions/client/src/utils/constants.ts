export const APP_NAME = import.meta.env.VITE_APP_NAME || 'NexusCore Solutions';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const INDUSTRIES = [
  { value: 'renewable', label: 'Renewable Energy', color: 'bg-green-500' },
  { value: 'medical', label: 'Medical', color: 'bg-blue-500' },
  { value: 'submarine', label: 'Submarine', color: 'bg-indigo-500' },
  { value: 'petroleum', label: 'Petroleum', color: 'bg-orange-500' },
  { value: 'automotive', label: 'Automotive', color: 'bg-red-500' },
] as const;

export const ACHIEVEMENT_TYPES = [
  { value: 'award', label: 'Award', icon: '🏆' },
  { value: 'certification', label: 'Certification', icon: '📜' },
  { value: 'partnership', label: 'Partnership', icon: '🤝' },
  { value: 'milestone', label: 'Milestone', icon: '🎯' },
] as const;

export const ROUTES = {
  HOME: '/',
  SERVICES: '/services',
  PROJECTS: '/projects',
  CASE_STUDIES: '/case-studies',
  RESOURCES: '/resources',
  ABOUT: '/about',
  ACHIEVEMENTS: '/achievements',
  CONTACT: '/contact',
  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    SERVICES: '/admin/services',
    PROJECTS: '/admin/projects',
    CASE_STUDIES: '/admin/case-studies',
    WHITEPAPERS: '/admin/whitepapers',
    TEAM: '/admin/team',
    ACHIEVEMENTS: '/admin/achievements',
    MESSAGES: '/admin/messages',
    SUBSCRIBERS: '/admin/subscribers',
  },
} as const;
