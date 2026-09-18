"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMe,
  getPublicOrganisations,
  loginUser,
  registerAdmin,
  registerCustomer,
  registerSupportAgent,
  registerUser,
} from "@/lib/api/auth.api";
import { useAuthStore } from "@/stores/authStore";
import {
  AuthResponse,
  LoginRequest,
  RegisterAdminRequest,
  RegisterCustomerRequest,
  RegisterRequest,
  RegisterSupportAgentRequest,
  User,
  UserRole,
} from "@/types/api";

export function useOrganisations() {
  return useQuery({
    queryKey: ["organisations"],
    queryFn: getPublicOrganisations,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { token, user, isAuthenticated, setAuth, setUser, logout, isHydrated, hydrate } =
    useAuthStore();

  const handleAuthSuccess = (res: AuthResponse) => {
    const enrichedUser: User = {
      ...res.data.user,
      organisation: res.data.organisation || res.data.user?.organisation,
    };
    if (res.data.token) {
      setAuth(res.data.token, enrichedUser);
    } else {
      setUser(enrichedUser);
    }
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
    queryClient.invalidateQueries({ queryKey: ["profile"] });
  };

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => registerUser(data),
    onSuccess: handleAuthSuccess,
  });

  const registerAdminMutation = useMutation({
    mutationFn: (data: RegisterAdminRequest) => registerAdmin(data),
    onSuccess: handleAuthSuccess,
  });

  const registerCustomerMutation = useMutation({
    mutationFn: (data: RegisterCustomerRequest) => registerCustomer(data),
    onSuccess: handleAuthSuccess,
  });

  const registerSupportAgentMutation = useMutation({
    mutationFn: (data: RegisterSupportAgentRequest) => registerSupportAgent(data),
    onSuccess: handleAuthSuccess,
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => loginUser(data),
    onSuccess: handleAuthSuccess,
  });

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await getMe();
      const enrichedUser: User = {
        ...res.data.user,
        organisation: res.data.user?.organisation,
      };
      setUser(enrichedUser);
      return enrichedUser;
    },
    enabled: !!token && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  /**
   * Dispatches registration to the correct role-specific endpoint as specified in API_DOCUMENTATION.md:
   * - Admin -> POST /auth/register/admin
   * - Support Agent -> POST /auth/register/support-agent
   * - Customer / User -> POST /auth/register/customer
   */
  const registerWithRole = async (
    role: UserRole,
    payload: {
      email: string;
      password: string;
      name?: string;
      organisationName?: string;
      organisationType?: string;
      organisationConfig?: Record<string, unknown>;
      organisationId?: string;
    }
  ): Promise<AuthResponse> => {
    if (role === "Admin") {
      return registerAdminMutation.mutateAsync({
        email: payload.email,
        password: payload.password,
        name: payload.name,
        organisationName: payload.organisationName || "My Organisation",
        organisationType: payload.organisationType,
        organisationConfig: payload.organisationConfig,
      });
    }

    if (role === "Support Agent") {
      return registerSupportAgentMutation.mutateAsync({
        email: payload.email,
        password: payload.password,
        name: payload.name,
        organisationId: payload.organisationId,
        organisationName: payload.organisationName,
      });
    }

    // Default: Customer
    return registerCustomerMutation.mutateAsync({
      email: payload.email,
      password: payload.password,
      name: payload.name,
      organisationId: payload.organisationId,
      organisationName: payload.organisationName,
    });
  };

  const handleLogout = () => {
    logout();
    queryClient.clear();
  };

  const isRegistering =
    registerMutation.isPending ||
    registerAdminMutation.isPending ||
    registerCustomerMutation.isPending ||
    registerSupportAgentMutation.isPending;

  const registerError =
    registerAdminMutation.error ||
    registerCustomerMutation.error ||
    registerSupportAgentMutation.error ||
    registerMutation.error;

  return {
    token,
    user,
    isAuthenticated,
    isHydrated,
    hydrate,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    registerAdmin: registerAdminMutation.mutateAsync,
    registerCustomer: registerCustomerMutation.mutateAsync,
    registerSupportAgent: registerSupportAgentMutation.mutateAsync,
    registerWithRole,
    isRegistering,
    registerError,
    logout: handleLogout,
    profileQuery,
  };
}

