import apiClient from "./client";

// Kullanıcı bilgisi tipi
interface User {
  id: number;
  email: string;
  role: "admin" | "user";
  approved: boolean;
}

// Login yanıt tipi
interface LoginResponse {
  token: string;
  user: User;
}

// Backend: POST /auth/login
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", {
    email,
    password,
  });

  // Token ve kullanıcı bilgisini localStorage'a kaydet
  localStorage.setItem("pt_token", response.data.token);
  localStorage.setItem("pt_user", JSON.stringify(response.data.user));

  return response.data;
}

// Logout - localStorage'dan token ve kullanıcı bilgisini temizle
export function logout(): void {
  localStorage.removeItem("pt_token");
  localStorage.removeItem("pt_user");
}

// Backend: GET /auth/me - Mevcut kullanıcı bilgisini getir
export async function getMe(): Promise<User> {
  const response = await apiClient.get<User>("/auth/me");
  return response.data;
}

// localStorage'dan kullanıcı bilgisini oku
export function getStoredUser(): User | null {
  const userRaw = localStorage.getItem("pt_user");
  if (!userRaw) return null;
  
  try {
    return JSON.parse(userRaw) as User;
  } catch {
    return null;
  }
}

// Token var mı kontrolü
export function isAuthenticated(): boolean {
  return localStorage.getItem("pt_token") !== null;
}
