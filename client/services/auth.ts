import apiClient from "@/lib/apiClient";
import { User } from "@/types";

type AuthCredentials = {
  email: string;
  password: string;
};

export async function signup(credentials: AuthCredentials) {
  const res = await apiClient.post<{ status: string; data: User }>(
    "/auth/signup",
    credentials
  );
  return res.data;
}

export async function login(credentials: AuthCredentials) {
  const res = await apiClient.post<{ status: string; data: User }>(
    "/auth/login",
    credentials
  );
  return res.data;
}

export async function logout() {
  const res = await apiClient.post<{ status: string; message: string }>(
    "/auth/logout"
  );
  return res.data;
}

export async function getCurrentUser() {
  const res = await apiClient.get<{ status: string; data: User }>("/auth/me");
  return res.data;
}
