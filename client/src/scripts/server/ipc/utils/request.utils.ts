import { API_URL } from "../../constants";
import { IElectronResponse } from "../../../../types/handlers";
import AuthService from "../../../client/services/auth.service";

const headers = { "Content-Type": "application/json" };

const makeBaseRequest = async <T>(
  endpoint: string,
  requestHeaders: HeadersInit,
  options: RequestInit = {}
): Promise<IElectronResponse<T>> => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: requestHeaders,
  });

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return {
      data: null as unknown as T,
      state: true,
      status: res.status,
    };
  }

  const data = await res.json();

  if (!res.ok) {
    return {
      data,
      state: false,
      status: res.status,
      message: data.message,
    };
  }

  return {
    data,
    state: true,
    status: res.status,
  };
};

export const createAuthorizedRequest = async <T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<IElectronResponse<T>> => {
  const requestHeaders = {
    ...headers,
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await makeBaseRequest<T>(endpoint, requestHeaders, options);

  if (response.status === 401) {
    const authService = AuthService.getInstance();
    await authService.refreshTokens();
    const newToken = authService.getAccessToken();
    
    if (newToken) {
      const newHeaders = {
        ...headers,
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      };
      return makeBaseRequest<T>(endpoint, newHeaders, options);
    }
  }

  return response;
};

export const createRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<IElectronResponse<T>> => {
  return makeBaseRequest<T>(endpoint, headers, options);
};
