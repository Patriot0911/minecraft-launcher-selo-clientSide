export interface LoginCredentials {
  login: string;
  password: string;
};

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
};

export interface AuthResponse {
  id: string;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  status: number;
  message?: string;
  details?: string[];
};
