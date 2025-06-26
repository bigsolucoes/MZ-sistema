
import { TaskStatus } from '@/types';

export const APP_NAME = "Advocacia MZ ERP";
export const IDLE_TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutes

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  AGENDA: '/agenda',
  TAREFAS: '/tarefas',
  CONTRATOS: '/contratos',
  FINANCEIRO_CLIENTES: '/financeiro/clientes',
  FINANCEIRO_REPASSES: '/financeiro/repasses',
  SETTINGS: '/settings',
};

// Mock API endpoints (replace with actual if backend exists)
export const API_ENDPOINTS = {
  USER_PROFILE: '/api/user/profile', // Example
  GOOGLE_CALENDAR_EVENTS: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
};

export const KANBAN_COLUMNS_PRAZOS = {
  [TaskStatus.TODO]: 'A Fazer',
  [TaskStatus.ON_HOLD]: 'Em Espera',
  [TaskStatus.IN_PROGRESS]: 'Em Andamento',
  [TaskStatus.DONE]: 'Concluído',
};

export const KANBAN_COLUMNS_TAREFAS = {
  [TaskStatus.TODO]: 'A Fazer',
  [TaskStatus.ON_HOLD]: 'Em Espera',
  [TaskStatus.IN_PROGRESS]: 'Em Andamento',
  [TaskStatus.DONE]: 'Concluído',
};

// export const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE"; // Removed

export const FOOTER_TEXT = "Desenvolvido por Big Soluções";

export const MOCK_USER_PROFILE = {
  id: '1',
  name: 'Usuário Mock',
  email: 'mock@example.com',
  picture: 'https://picsum.photos/seed/mockuser/100/100'
};