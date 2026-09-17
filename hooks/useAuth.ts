"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, loginUser, registerUser } from "@/lib/api/auth.api";
import { useAuthStore } from "@/stores/authStore";
import { LoginRequest, RegisterRequest } from "@/types/api";

export function useAuth() {
  const queryClient = useQueryClient();
  const { token, user, isAuthenticated, setAuth, setUser, logout, isHydrated, hydrate } =
    useAuthStore();

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => registerUser(data),
    onSuccess: (res) => {
      setAuth(res.data.token, res.data.user);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => loginUser(data),
    onSuccess: (res) => {
      setAuth(res.data.token, res.data.user);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await getMe();
      setUser(res.data.user);
      return res.data.user;
    },
    enabled: !!token && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  const handleLogout = () => {
    logout();
    queryClient.clear();
  };

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
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: handleLogout,
    profileQuery,
  };
}

