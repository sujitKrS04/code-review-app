export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}
