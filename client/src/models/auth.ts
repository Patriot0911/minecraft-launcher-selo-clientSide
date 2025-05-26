import { User } from "../store/slices/authSlice";

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
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: User;
};
