import { apiFetch } from "./client";
import {
  AuthResponse,
  LoginRequest,
  ProfileResponse,
  RegisterRequest,
} from "@/types/api";

export async function registerUser(body: RegisterRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function loginUser(body: LoginRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getMe(): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>("/auth/me", {
    method: "GET",
    requiresAuth: true,
  });
}

