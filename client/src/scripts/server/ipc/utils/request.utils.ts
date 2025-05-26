import { API_URL } from "../../constants";
import { IElectronResponse } from "../../../../types/handlers";

const headers = { "Content-Type": "application/json" };

export const createAuthorizedRequest = async <T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<IElectronResponse<T>> => {
  const authHeaders = {
    ...headers,
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: authHeaders,
  });

  // Handle empty responses
  if (res.status === 204 || res.headers.get('content-length') === '0') {
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

export const createRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<IElectronResponse<T>> => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle empty responses
  if (res.status === 204 || res.headers.get('content-length') === '0') {
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
