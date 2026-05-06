export type Role = 'ADMIN' | 'PI' | 'MEMBER' | 'VIEWER';

export interface User {
  id?: string;
  username?: string;
  fullName?: string;
  role?: Role;
  roles?: Role[];
}

export interface AuthState {
  token?: string | null;
  user?: User | null;
}
