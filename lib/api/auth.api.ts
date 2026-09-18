import { apiFetch } from "./client";
import {
  AuthResponse,
  LoginRequest,
  OrganisationsResponse,
  ProfileResponse,
  RegisterAdminRequest,
  RegisterCustomerRequest,
  RegisterRequest,
  RegisterSupportAgentRequest,
  SupportAgentResponse,
} from "@/types/api";

/**
 * Fetch list of public organisations available for user registration.
 */
export async function getPublicOrganisations(): Promise<OrganisationsResponse> {
  return apiFetch<OrganisationsResponse>("/auth/organisations", {
    method: "GET",
  });
}

/**
 * Unified registration endpoint supporting Admin, Customer, and Support Agent.
 */
export async function registerUser(body: RegisterRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Register Admin and create new organisation.
 */
export async function registerAdmin(
  body: RegisterAdminRequest
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register/admin", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Register Customer for an organisation (Active immediately).
 */
export async function registerCustomer(
  body: RegisterCustomerRequest
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register/customer", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Register Support Agent for an organisation (Status: PENDING_APPROVAL).
 */
export async function registerSupportAgent(
  body: RegisterSupportAgentRequest
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register/support-agent", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Authenticate existing credentials and receive a JWT token.
 */
export async function loginUser(body: LoginRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Fetch authenticated user profile & organisation details.
 */
export async function getMe(): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>("/auth/me", {
    method: "GET",
    requiresAuth: true,
  });
}

/**
 * List support agents for Admin's organisation.
 */
export async function listSupportAgents(
  status?: string
): Promise<SupportAgentResponse> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiFetch<SupportAgentResponse>(
    `/auth/organisation/support-agents${query}`,
    {
      method: "GET",
      requiresAuth: true,
    }
  );
}

/**
 * Approve a pending Support Agent (Admin only).
 */
export async function approveSupportAgent(
  id: string
): Promise<SupportAgentResponse> {
  return apiFetch<SupportAgentResponse>(
    `/auth/organisation/support-agents/${id}/approve`,
    {
      method: "POST",
      requiresAuth: true,
    }
  );
}

/**
 * Reject a pending Support Agent (Admin only).
 */
export async function rejectSupportAgent(
  id: string
): Promise<SupportAgentResponse> {
  return apiFetch<SupportAgentResponse>(
    `/auth/organisation/support-agents/${id}/reject`,
    {
      method: "POST",
      requiresAuth: true,
    }
  );
}

