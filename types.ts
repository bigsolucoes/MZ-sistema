
// TokenResponse is no longer needed
// import { TokenResponse } from '@react-oauth/google';

export interface UserProfile {
  email: string;
  name: string;
  picture: string;
  id: string;
}

export interface User extends UserProfile {
  googleId: string; // Kept for mock user structure, not tied to Google login anymore
  accessToken?: string; // Kept for potential other API calls (e.g. Calendar, though PIN won't provide it)
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isConfidentialMode: boolean;
  accessToken: string | null; 
  isLoading: boolean;
  error: string | null;
  // login: (tokenResponse: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>) => Promise<void>; // Removed Google login
  pinLogin: (pin: string) => Promise<boolean>; // New method for PIN login
  logout: () => void;
  toggleConfidentialMode: () => void;
  setAccessToken: (token: string | null) => void;
  isAppForcedIdle: boolean; // For manual idle screen activation
  forceIdle: () => void;
  resetForceIdle: () => void;
}

export enum TaskStatus {
  TODO = 'A Fazer',
  ON_HOLD = 'Em Espera', // Added new status
  IN_PROGRESS = 'Em Andamento',
  DONE = 'Concluído',
}

export enum TaskType {
  PROCESSUAL_DEADLINE = 'Prazo Processual',
  INTERNAL_TASK = 'Tarefa Interna',
}

export interface TaskUpdate {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author?: UserProfile; 
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date;
  type: TaskType;
  assignee?: UserProfile; 
  updates?: TaskUpdate[]; 
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export interface CalendarEvent {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any; 
  description?: string;
}

export interface Contract {
  id: string;
  clientName: string;
  title: string;
  startDate: string;
  value: number;
  status: 'Ativo' | 'Encerrado' | 'Pendente';
  linkedTaskIds?: string[]; 
}

export interface ClientFinancialRecord {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface DebtorAgreement {
  id:string;
  debtorName: string;
  agreementDate: string;
  totalAmount: number;
  installments: number;
  amountPerInstallment: number;
  officeSharePercentage: number;
  clientSharePercentage: number;
  officeReceivable: number;
  clientReceivable: number;
  status: 'Pago' | 'Pendente Parcial' | 'Pendente Total' | 'Repassado';
  lastPaymentDate?: string;
  updates?: TaskUpdate[]; // Added for notes on DebtorAgreements
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

export interface Candidate {
  groundingMetadata?: GroundingMetadata;
}