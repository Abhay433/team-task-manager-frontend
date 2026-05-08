export interface User {
  id: number;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  token?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
