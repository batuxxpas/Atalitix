/**
 * Uygulama genelinde kullanılacak ortak TypeScript tipleri
 */

// API Response wrapper
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Pagination
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// User
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type UserRole = "admin" | "user" | "moderator";

// Navigation
export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  description?: string;
  disabled?: boolean;
  children?: NavItem[];
}

// Form States
export type FormStatus = "idle" | "loading" | "success" | "error";

export interface FormState {
  status: FormStatus;
  message: string | null;
}

// Theme
export type Theme = "light" | "dark" | "system";

// Search & Filter
export interface SearchParams {
  query?: string;
  sort?: string;
  order?: "asc" | "desc";
  filter?: Record<string, string>;
}
