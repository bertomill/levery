export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ONBOARDING: '/auth/onboarding',
  DASHBOARD: '/dashboard',
  RESEARCH: {
    ARTICLES: '/research/articles',
    NOTES: '/research/notes',
  },
  CONTENT: {
    IDEAS: '/content/ideas',
    EDITOR: '/content/editor',
    PUBLISHED: '/content/published',
  },
  SETTINGS: '/settings',
} as const 