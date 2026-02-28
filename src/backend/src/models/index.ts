// User Model
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

// Machine Model
export interface Machine {
  id: string;
  machineCode: string;
  name: string;
  model: string;
  providerId: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  location?: string;
  lastHeartbeat?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Player Model
export interface Player {
  id: string;
  playerCode: string;
  username: string;
  phone?: string;
  email?: string;
  level: number;
  balance: number;
  status: 'active' | 'inactive' | 'banned';
  agentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction Model
export interface Transaction {
  id: string;
  transactionId: string;
  type: 'bet' | 'win' | 'deposit' | 'withdrawal' | 'adjust' | 'settlement';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  machineId?: string;
  playerId: string;
  operatorId?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  remark?: string;
  createdAt: Date;
}

// Provider Model
export interface Provider {
  id: string;
  providerCode: string;
  name: string;
  status: 'active' | 'inactive';
  gameCount: number;
  createdAt: Date;
}

// Agent Model
export interface Agent {
  id: string;
  agentCode: string;
  name: string;
  parentAgentId?: string;
  commissionRate: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: Omit<User, 'passwordHash'>;
}

export interface TokenPayload {
  userId: string;
  username: string;
  role: User['role'];
}
