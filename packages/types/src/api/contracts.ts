// ============================================================
// Na Quadra — Shared Types: API Contracts
// ============================================================

// Standard API response wrapper
export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Standard query params
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// API Error
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  details?: Record<string, string[]>;
}
